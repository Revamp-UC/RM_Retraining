import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth/session';
import { saveQuizAttempt } from '@/lib/db/consultations';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('rm_session')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const user = await validateSession(token);
  if (!user) return NextResponse.json({ error: 'Session expired' }, { status: 401 });

  let body: { module_attempted?: string; score?: number };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  if (!body.module_attempted || typeof body.score !== 'number') {
    return NextResponse.json({ error: 'Invalid params' }, { status: 400 });
  }

  await saveQuizAttempt({
    mobile_number: user.mobile_number,
    module_attempted: body.module_attempted,
    score: body.score,
  });

  return NextResponse.json({ ok: true });
}
