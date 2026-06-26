import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth/session';
import { getConsultationById, completeConsultation, markTooShort } from '@/lib/db/consultations';
import { getTranscriptByConsultationId } from '@/lib/db/transcripts';
import { evaluateConsultation } from '@/lib/gemini/evaluator';

export const runtime = 'nodejs';

const ADMIN_MOBILES = new Set(['7880320915', '9871531279', '9873696654', '8439197965', '8393005909', '9034002226', '9997506778', '9045321000', '9889083993']);

export async function POST(req: NextRequest) {
  const token = req.cookies.get('rm_session')?.value;
  if (!token) return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });

  const user = await validateSession(token);
  if (!user) return NextResponse.json({ error: 'Session expired' }, { status: 401 });

  const { consultation_id } = (await req.json()) as { consultation_id?: string };
  if (!consultation_id) return NextResponse.json({ error: 'Missing consultation_id' }, { status: 400 });

  const consultation = await getConsultationById(consultation_id);
  if (!consultation) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const isOwner = consultation.mobile_number === user.mobile_number;
  const isAdmin = ADMIN_MOBILES.has(user.mobile_number);
  if (!isOwner && !isAdmin) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });

  if (consultation.status === 'completed') {
    return NextResponse.json({ success: true, already_complete: true });
  }

  if ((consultation.duration_seconds ?? 0) < 30) {
    await markTooShort(consultation_id, consultation.duration_seconds ?? 0);
    return NextResponse.json({ success: false, too_short: true });
  }

  const saved = await getTranscriptByConsultationId(consultation_id);
  const transcript = saved?.full_transcript ?? [];

  let reportCard;
  try {
    reportCard = await evaluateConsultation({
      transcript,
      customer_name: consultation.customer_name ?? 'Customer',
      module: consultation.module_attempted,
    });
  } catch (err) {
    console.error('[RetryReport] Evaluation failed:', err);
    return NextResponse.json({ success: false, error: 'Still busy — please try again in a few minutes.' }, { status: 200 });
  }

  await completeConsultation({
    id: consultation_id,
    duration_seconds: consultation.duration_seconds ?? 0,
    overall_score: reportCard.overall_score,
    introduction_score: reportCard.sections.introduction?.score ?? null,
    technical_score: reportCard.sections.technical?.score ?? null,
    budget_score: reportCard.sections.budget_discovery?.score ?? null,
    discovery_score: reportCard.sections.discovery_confidence?.score ?? null,
    report_card_json: reportCard,
  });

  return NextResponse.json({ success: true });
}
