import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth/session';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('rm_session')?.value;

  if (token) {
    await destroySession(token);
  }

  const response = NextResponse.json({ success: true });
  response.cookies.set('rm_session', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  });

  return response;
}
