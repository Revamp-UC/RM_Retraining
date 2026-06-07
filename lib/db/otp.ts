import { randomInt } from 'crypto';
import { db } from './client';

export function generateOtp(): string {
  return String(randomInt(100000, 999999));
}

export async function createOtpSession(
  mobile_number: string,
): Promise<{ otp: string; email: string; name: string } | null> {
  const { data: user, error: userError } = await db
    .from('users')
    .select('email, name, is_active')
    .eq('mobile_number', mobile_number)
    .eq('is_active', true)
    .single();

  if (userError || !user) return null;

  const otp = generateOtp();
  const expires_at = new Date(Date.now() + 10 * 60 * 1000).toISOString();

  // Invalidate all existing unused OTPs for this number
  await db
    .from('otp_sessions')
    .update({ used: true })
    .eq('mobile_number', mobile_number)
    .eq('used', false);

  const { error } = await db.from('otp_sessions').insert({
    mobile_number,
    otp_code: otp,
    expires_at,
  });

  if (error) throw new Error(error.message);

  return { otp, email: user.email, name: user.name };
}

export async function verifyOtpSession(
  mobile_number: string,
  otp_code: string,
): Promise<{ valid: boolean; name?: string }> {
  const { data, error } = await db
    .from('otp_sessions')
    .select('id, otp_code')
    .eq('mobile_number', mobile_number)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return { valid: false };
  if (data.otp_code !== otp_code) return { valid: false };

  await db.from('otp_sessions').update({ used: true }).eq('id', data.id);

  const { data: user } = await db
    .from('users')
    .select('name')
    .eq('mobile_number', mobile_number)
    .single();

  return { valid: true, name: user?.name };
}
