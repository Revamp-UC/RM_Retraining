import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth/session';
import { db } from '@/lib/db/client';

export const runtime = 'nodejs';

const ADMIN_MOBILES = new Set(['7880320915', '9871531279', '9873696654', '8439197965', '8393005909', '9034002226', '9997506778', '9045321000', '9889083993']);

async function getAdmin(req: NextRequest) {
  const token = req.cookies.get('rm_session')?.value;
  if (!token) return null;
  const user = await validateSession(token);
  if (!user || !ADMIN_MOBILES.has(user.mobile_number)) return null;
  return user;
}

export async function POST(req: NextRequest) {
  if (!(await getAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const { message } = (await req.json()) as { message?: string };
  const value = (message ?? '').trim();
  await db
    .from('app_config')
    .upsert({ key: 'broadcast_message', value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req: NextRequest) {
  if (!(await getAdmin(req))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  await db
    .from('app_config')
    .upsert({ key: 'broadcast_message', value: '', updated_at: new Date().toISOString() }, { onConflict: 'key' });
  return NextResponse.json({ ok: true });
}
