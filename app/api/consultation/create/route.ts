import { NextRequest, NextResponse } from 'next/server';
import { validateSession, createWsToken } from '@/lib/auth/session';
import { createConsultation } from '@/lib/db/consultations';
import type { CustomerGender } from '@/types/consultation';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('rm_session')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const user = await validateSession(token);
  if (!user) return NextResponse.json({ error: 'Session expired' }, { status: 401 });

  let body: unknown;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: 'Invalid body' }, { status: 400 });
  }

  const { moduleAttempted, customerName, customerGender } = body as {
    moduleAttempted: string;
    customerName: string;
    customerGender: CustomerGender;
  };

  if (!moduleAttempted || !customerName || !customerGender) {
    return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
  }

  const consultation = await createConsultation({
    mobile_number: user.mobile_number,
    module_attempted: moduleAttempted,
    customer_name: customerName,
    customer_gender: customerGender,
  });

  const wsToken = createWsToken({
    mobile_number: user.mobile_number,
    consultation_id: consultation.id,
    customer_name: customerName,
    customer_gender: customerGender,
    module_attempted: moduleAttempted,
  });

  return NextResponse.json({ consultationId: consultation.id, wsToken });
}
