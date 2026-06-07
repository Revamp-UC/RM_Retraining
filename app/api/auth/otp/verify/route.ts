import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { verifyOtpSession } from '@/lib/db/otp';
import { createSession } from '@/lib/auth/session';

export const runtime = 'nodejs';

const schema = z.object({
  mobile_number: z.string().trim().regex(/^\d{10}$/, 'Must be 10 digits'),
  otp_code: z.string().trim().regex(/^\d{6}$/, 'OTP must be 6 digits'),
});

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Validation failed' }, { status: 400 });
  }

  const { mobile_number, otp_code } = parsed.data;

  let verification: { valid: boolean; name?: string };
  try {
    verification = await verifyOtpSession(mobile_number, otp_code);
  } catch (err) {
    console.error('[OTP Verify] DB error:', err);
    return NextResponse.json({ error: 'Verification failed. Please try again.' }, { status: 500 });
  }

  if (!verification.valid) {
    return NextResponse.json({ error: 'Invalid or expired OTP.' }, { status: 401 });
  }

  const token = await createSession(mobile_number, verification.name);
  const expiryHours = parseInt(process.env.SESSION_EXPIRY_HOURS ?? '8', 10);

  const response = NextResponse.json({
    success: true,
    user: { mobile_number, name: verification.name },
  });

  response.cookies.set('rm_session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: expiryHours * 60 * 60,
    path: '/',
  });

  return response;
}
