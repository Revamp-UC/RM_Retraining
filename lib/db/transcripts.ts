import { db } from './client';
import type { TranscriptEntry, TranscriptRecord } from '@/types/transcript';

export async function saveTranscript(params: {
  consultation_id: string;
  mobile_number: string;
  module_attempted: string;
  customer_name: string;
  full_transcript: TranscriptEntry[];
}): Promise<void> {
  try {
    const { error } = await db
      .from('transcripts')
      .insert({
        consultation_id: params.consultation_id,
        mobile_number: params.mobile_number,
        module_attempted: params.module_attempted,
        customer_name: params.customer_name,
        full_transcript: params.full_transcript,
      });
    if (error) throw error;
  } catch { /* DB not configured — skip */ }
}

export async function getTranscriptByConsultationId(consultation_id: string): Promise<TranscriptRecord | null> {
  const { data, error } = await db
    .from('transcripts')
    .select('*')
    .eq('consultation_id', consultation_id)
    .single();

  if (error || !data) return null;
  return data as TranscriptRecord;
}
