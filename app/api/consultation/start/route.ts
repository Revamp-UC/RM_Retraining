import { NextRequest, NextResponse } from 'next/server';
import { validateSession, createWsToken } from '@/lib/auth/session';
import { createConsultation } from '@/lib/db/consultations';
import { generateCustomer } from '@/lib/utils/name-generator';
import { startConsultationSchema } from '@/lib/utils/validators';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const token = req.cookies.get('rm_session')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const user = await validateSession(token);
  if (!user) {
    return NextResponse.json({ error: 'Session expired' }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const result = startConsultationSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid module_id' }, { status: 400 });
  }

  const { module_id } = result.data;

  // Map module_id to internal module name
  const moduleMap: Record<string, string> = {
    module_1: 'module_1_seepage',
  };
  const module_attempted = moduleMap[module_id] ?? module_id;

  const { name: customer_name, gender: customer_gender } = generateCustomer();

  const consultation = await createConsultation({
    mobile_number: user.mobile_number,
    module_attempted,
    customer_name,
    customer_gender,
  });

  const ws_token = createWsToken({
    mobile_number: user.mobile_number,
    consultation_id: consultation.id,
    customer_name,
    customer_gender,
    module_attempted,
  });

  return NextResponse.json({
    consultation_id: consultation.id,
    customer_name,
    customer_gender,
    ws_token,
  });
}
