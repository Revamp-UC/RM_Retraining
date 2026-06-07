import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyUserPassword } from '@/lib/db/users';
import { createSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

const schema = z.object({
  mobile_number: z.string().trim().regex(/^\d{10}$/, 'Enter a valid 10-digit mobile number'),
  password: z.string().trim().regex(/^\d{4}$/, 'Password must be exactly 4 digits'),
});

const attempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(mobile: string): boolean {
  const now = Date.now();
  const window = 15 * 60 * 1000;
  const rec = attempts.get(mobile);
  if (!rec || now > rec.resetAt) {
    attempts.set(mobile, { count: 1, resetAt: now + window });
    return true;
  }
  if (rec.count >= 10) return false;
  rec.count++;
  return true;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? 'Validation failed' },
      { status: 400 },
    );
  }

  const { mobile_number, password } = parsed.data;

  if (!checkRateLimit(mobile_number)) {
    return NextResponse.json(
      { error: 'Too many attempts. Please try again in 15 minutes.' },
      { status: 429 },
    );
  }

  const result = await verifyUserPassword(mobile_number, password);

  if (result.status === 'not_found') {
    return NextResponse.json({ error: 'You are not an authorised user.' }, { status: 401 });
  }
  if (result.status === 'wrong_password') {
    return NextResponse.json({ error: 'Invalid password.' }, { status: 401 });
  }

  const token = await createSession(mobile_number, result.user.name);
  const expiryHours = parseInt(process.env.SESSION_EXPIRY_HOURS ?? '8', 10);

  const response = NextResponse.json({ success: true, user: { mobile_number, name: result.user.name } });
  response.cookies.set('rm_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: expiryHours * 60 * 60,
    path: '/',
  });
  return response;
}
