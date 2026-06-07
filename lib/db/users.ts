import { db } from './client';
import type { User } from '@/types/auth';

export type VerifyResult =
  | { status: 'ok'; user: User }
  | { status: 'not_found' }
  | { status: 'wrong_password' };

export async function verifyUserPassword(
  mobile_number: string,
  password: string,
): Promise<VerifyResult> {
  const { data, error } = await db
    .from('users')
    .select('mobile_number, name, is_active, created_at, password')
    .eq('mobile_number', mobile_number)
    .eq('is_active', true)
    .single();

  if (error || !data) return { status: 'not_found' };
  if ((data as { password: string }).password !== password) return { status: 'wrong_password' };

  return {
    status: 'ok',
    user: {
      mobile_number: data.mobile_number,
      name: data.name,
      is_active: data.is_active,
      created_at: data.created_at,
    } as User,
  };
}
