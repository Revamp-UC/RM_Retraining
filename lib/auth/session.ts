import { randomBytes, createHmac, timingSafeEqual } from 'crypto';
import { db } from '@/lib/db/client';
import type { AuthenticatedUser } from '@/types/auth';
import type { CustomerGender } from '@/types/consultation';

const SESSION_EXPIRY_HOURS = parseInt(process.env.SESSION_EXPIRY_HOURS ?? '8', 10);
const WS_TOKEN_EXPIRY_MINUTES = 30;

// Read secret lazily at call time (not module load time) so server.ts dotenv loading order doesn't matter
function getWsSecret(): string {
  return process.env.SESSION_SECRET ?? 'dev-ws-secret-fallback-32chars!!';
}

// In-memory session store — shared within the same process context
declare global {
  // eslint-disable-next-line no-var
  var __devSessions: Map<string, { mobile_number: string; name: string; expires: number }> | undefined;
}
globalThis.__devSessions ??= new Map();
const devSessions = globalThis.__devSessions;

export function generateToken(): string {
  return randomBytes(48).toString('hex');
}

export async function createSession(mobile_number: string, name?: string): Promise<string> {
  const token = generateToken();
  const expires = Date.now() + SESSION_EXPIRY_HOURS * 60 * 60 * 1000;

  const resolvedName = name ?? mobile_number;
  devSessions.set(token, { mobile_number, name: resolvedName, expires });

  try {
    await db.from('sessions').insert({ mobile_number, token, expires_at: new Date(expires).toISOString() });
  } catch { /* DB not configured */ }

  return token;
}

export async function validateSession(token: string): Promise<AuthenticatedUser | null> {
  if (!token || token.length < 10) return null;

  const dev = devSessions.get(token);
  if (dev && Date.now() < dev.expires) {
    return { mobile_number: dev.mobile_number, name: dev.name };
  }

  try {
    const { data, error } = await db
      .from('sessions')
      .select('mobile_number, expires_at, users(name, is_active)')
      .eq('token', token)
      .gt('expires_at', new Date().toISOString())
      .single();

    if (error || !data) return null;

    const user = data.users as unknown as { name: string; is_active: boolean } | null;
    if (!user?.is_active) return null;

    return { mobile_number: data.mobile_number, name: user.name };
  } catch { return null; }
}

export async function destroySession(token: string): Promise<void> {
  devSessions.delete(token);
  try { await db.from('sessions').delete().eq('token', token); } catch { /* DB not configured */ }
}

export async function cleanExpiredSessions(): Promise<void> {
  const now = Date.now();
  for (const [token, s] of devSessions) {
    if (now > s.expires) devSessions.delete(token);
  }
  try { await db.from('sessions').delete().lt('expires_at', new Date().toISOString()); } catch { /* DB not configured */ }
}

// ─── WebSocket tokens ─────────────────────────────────────────────────────────
// Self-contained HMAC-signed tokens — all consultation data embedded inside.
// No shared memory or DB needed. Works across the Next.js sandbox ↔ server.ts boundary.

export interface WsTokenData {
  mobile_number: string;
  consultation_id: string;
  customer_name: string;
  customer_gender: CustomerGender;
  module_attempted: string;
}

interface WsTokenPayload extends WsTokenData {
  expires: number;
}

export function createWsToken(data: WsTokenData): string {
  const payload: WsTokenPayload = {
    ...data,
    expires: Date.now() + WS_TOKEN_EXPIRY_MINUTES * 60 * 1000,
  };
  const json = JSON.stringify(payload);
  const sig = createHmac('sha256', getWsSecret()).update(json).digest('hex');
  return Buffer.from(`${json}|${sig}`).toString('base64url');
}

export function validateWsToken(rawToken: string): WsTokenData | null {
  try {
    const decoded = Buffer.from(rawToken, 'base64url').toString('utf-8');
    const sepIdx = decoded.lastIndexOf('|');
    if (sepIdx === -1) return null;

    const json = decoded.slice(0, sepIdx);
    const sig = decoded.slice(sepIdx + 1);
    const expectedSig = createHmac('sha256', getWsSecret()).update(json).digest('hex');

    const sigBuf = Buffer.from(sig, 'hex');
    const expBuf = Buffer.from(expectedSig, 'hex');
    if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return null;

    const payload = JSON.parse(json) as WsTokenPayload;
    if (!payload.expires || Date.now() > payload.expires) return null;
    if (!payload.mobile_number || !payload.consultation_id) return null;

    return {
      mobile_number: payload.mobile_number,
      consultation_id: payload.consultation_id,
      customer_name: payload.customer_name ?? 'Customer',
      customer_gender: payload.customer_gender === 'female' ? 'female' : 'male',
      module_attempted: payload.module_attempted ?? 'module_1_seepage',
    };
  } catch {
    return null;
  }
}
