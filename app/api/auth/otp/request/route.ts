import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createOtpSession } from '@/lib/db/otp';
import { sendOtpEmail } from '@/lib/email/send-otp';

export const runtime = 'nodejs';

const schema = z.object({
  mobile_number: z.string().trim().regex(/^\d{10}$/, 'Must be 10 digits'),
});

// Rate limit: 3 requests per 5 minutes per number
const attempts = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(mobile: string): boolean {
  const now = Date.now();
  const window = 5 * 60 * 1000;
  const rec = attempts.get(mobile);
  if (!rec || now > rec.resetAt) {
    attempts.set(mobile, { count: 1, resetAt: now + window });
    return true;
  }
  if (rec.count >= 3) return false;
  rec.count++;
  return true;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!local || !domain) return '****';
  return `${local[0]}****@${domain}`;
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
  }

  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.issues[0]?.message ?? 'Validation failed' }, { status: 400 });
  }

  const { mobile_number } = parsed.data;

  if (!checkRateLimit(mobile_number)) {
    return NextResponse.json(
      { error: 'Too many OTP requests. Please wait 5 minutes.' },
      { status: 429 },
    );
  }

  let result: { otp: string; email: string; name: string } | null;
  try {
    result = await createOtpSession(mobile_number);
  } catch (err) {
    console.error('[OTP Request] DB error:', err);
    return NextResponse.json({ error: 'Failed to generate OTP. Please try again.' }, { status: 500 });
  }

  if (!result) {
    // Don't reveal whether number exists — generic message
    return NextResponse.json(
      { error: 'Mobile number not registered. Please contact your manager.' },
      { status: 404 },
    );
  }

  try {
    await sendOtpEmail(result.email, result.name, result.otp);
  } catch (err) {
    console.error('[OTP Request] Email send error:', err);
    return NextResponse.json({ error: 'Failed to send OTP email. Please try again.' }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    masked_email: maskEmail(result.email),
  });
}
