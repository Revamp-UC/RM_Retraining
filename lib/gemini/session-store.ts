import type { TranscriptEntry } from '@/types/transcript';

export interface ActiveSession {
  consultation_id: string;
  mobile_number: string;
  customer_name: string;
  customer_gender: string;
  module_id: string;
  start_time: Date;
  transcript: TranscriptEntry[];
  gemini_session: GeminiLiveSession | null;
  last_heartbeat: Date;
}

// We store a reference to the live session object from @google/genai
export interface GeminiLiveSession {
  send: (params: unknown) => void;
  close: () => void;
}

// Use globalThis so this Map is shared across server.ts (CommonJS) and
// Next.js webpack bundles (API routes) — they are separate module instances
// in the same Node.js process but globalThis is truly global.
declare global {
  // eslint-disable-next-line no-var
  var __activeSessions: Map<string, ActiveSession> | undefined;
}
globalThis.__activeSessions ??= new Map<string, ActiveSession>();
const sessions = globalThis.__activeSessions;
const TIMEOUT_MS = 45 * 60 * 1000; // 45 minutes

export function createSession(params: Omit<ActiveSession, 'transcript' | 'gemini_session' | 'last_heartbeat'>): void {
  sessions.set(params.consultation_id, {
    ...params,
    transcript: [],
    gemini_session: null,
    last_heartbeat: new Date(),
  });
}

export function getSession(consultation_id: string): ActiveSession | undefined {
  return sessions.get(consultation_id);
}

export function setGeminiSession(consultation_id: string, session: GeminiLiveSession): void {
  const s = sessions.get(consultation_id);
  if (s) s.gemini_session = session;
}

export function appendTranscript(consultation_id: string, entry: TranscriptEntry): void {
  const s = sessions.get(consultation_id);
  if (s) s.transcript.push(entry);
}

export function updateHeartbeat(consultation_id: string): void {
  const s = sessions.get(consultation_id);
  if (s) s.last_heartbeat = new Date();
}

export function destroySession(consultation_id: string): ActiveSession | undefined {
  const s = sessions.get(consultation_id);
  if (s?.gemini_session) {
    try { s.gemini_session.close(); } catch {}
  }
  sessions.delete(consultation_id);
  return s;
}

// Clean up stale sessions
export function cleanStaleSessions(): void {
  const now = Date.now();
  for (const [id, session] of sessions.entries()) {
    if (now - session.last_heartbeat.getTime() > TIMEOUT_MS) {
      destroySession(id);
    }
  }
}

// Run cleanup every 10 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanStaleSessions, 10 * 60 * 1000);
}
