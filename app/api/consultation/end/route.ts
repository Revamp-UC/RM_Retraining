import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth/session';
import { completeConsultation, getConsultationById, markEvaluationPending } from '@/lib/db/consultations';
import { saveTranscript, getTranscriptByConsultationId } from '@/lib/db/transcripts';
import { evaluateConsultation } from '@/lib/gemini/evaluator';
import { destroySession, getSession } from '@/lib/gemini/session-store';
import { endConsultationSchema } from '@/lib/utils/validators';

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

  const result = endConsultationSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json({ error: 'Invalid consultation_id' }, { status: 400 });
  }

  const { consultation_id } = result.data;

  // Verify ownership
  const consultation = await getConsultationById(consultation_id);
  if (!consultation || consultation.mobile_number !== user.mobile_number) {
    return NextResponse.json({ error: 'Consultation not found' }, { status: 404 });
  }

  // Grab transcript from memory store
  const session = getSession(consultation_id);
  let transcript = session?.transcript ?? [];
  const start_time = session?.start_time ?? new Date();
  const duration_seconds = Math.floor((Date.now() - start_time.getTime()) / 1000);

  // Destroy the session (closes Gemini Live connection)
  destroySession(consultation_id);

  // If session is gone (retry after prior failure), fetch saved transcript from DB
  if (transcript.length === 0) {
    const saved = await getTranscriptByConsultationId(consultation_id);
    transcript = saved?.full_transcript ?? [];
  }

  // Persist transcript (silently skips on retry if already saved)
  await saveTranscript({
    consultation_id,
    mobile_number: user.mobile_number,
    module_attempted: consultation.module_attempted,
    customer_name: consultation.customer_name ?? 'Customer',
    full_transcript: transcript,
  });

  // Run evaluation with fallback model — if all retries fail, mark pending for later retry
  let reportCard;
  try {
    reportCard = await evaluateConsultation({
      transcript,
      customer_name: consultation.customer_name ?? 'Customer',
      module: consultation.module_attempted,
    });
  } catch (err) {
    console.error('[Evaluate] Error:', err);
    await markEvaluationPending(consultation_id, duration_seconds);
    return NextResponse.json({ success: false, pending: true, consultation_id }, { status: 200 });
  }

  // Persist scores — sub-score columns are null for modules that don't use them
  await completeConsultation({
    id: consultation_id,
    duration_seconds,
    overall_score: reportCard.overall_score,
    introduction_score: reportCard.sections.introduction?.score ?? null,
    technical_score: reportCard.sections.technical?.score ?? null,
    budget_score: reportCard.sections.budget_discovery?.score ?? null,
    discovery_score: reportCard.sections.discovery_confidence?.score ?? null,
    report_card_json: reportCard,
  });

  return NextResponse.json({ success: true, consultation_id, report_available: true });
}
