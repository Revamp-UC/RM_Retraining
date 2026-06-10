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
    // Check if transcript already exists — update it rather than inserting a duplicate
    const { data: existing } = await db
      .from('transcripts')
      .select('id')
      .eq('consultation_id', params.consultation_id)
      .limit(1)
      .maybeSingle();

    if (existing?.id) {
      await db
        .from('transcripts')
        .update({ full_transcript: params.full_transcript })
        .eq('id', existing.id);
    } else {
      const { error } = await db.from('transcripts').insert({
        consultation_id: params.consultation_id,
        mobile_number: params.mobile_number,
        module_attempted: params.module_attempted,
        customer_name: params.customer_name,
        full_transcript: params.full_transcript,
      });
      if (error) throw error;
    }
  } catch { /* DB not configured — skip */ }
}

export async function getTranscriptByConsultationId(consultation_id: string): Promise<TranscriptRecord | null> {
  // Use limit(1) + order so duplicate rows (from retried saves) don't cause .single() to error
  const { data, error } = await db
    .from('transcripts')
    .select('*')
    .eq('consultation_id', consultation_id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error || !data) return null;
  return data as TranscriptRecord;
}
