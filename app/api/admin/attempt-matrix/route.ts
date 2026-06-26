import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateSession } from '@/lib/auth/session';
import { getAttemptMatrix } from '@/lib/db/admin';

export const dynamic = 'force-dynamic';

const ADMIN_MOBILES = new Set(['7880320915', '9871531279', '9873696654', '8439197965', '8393005909', '9034002226', '9997506778', '9045321000', '9889083993']);

// Polled by the admin tracking matrix for near-real-time updates.
export async function GET() {
  const cookieStore = await cookies();
  const token = cookieStore.get('rm_session')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await validateSession(token);
  if (!user || !ADMIN_MOBILES.has(user.mobile_number)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const matrix = await getAttemptMatrix();
  return NextResponse.json(matrix);
}
