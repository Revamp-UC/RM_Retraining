export type Speaker = 'rm' | 'customer';

export interface TranscriptEntry {
  speaker: Speaker;
  text: string;
  timestamp_ms: number;
  absolute_time: string;
}

export interface TranscriptRecord {
  id: string;
  consultation_id: string;
  mobile_number: string;
  module_attempted: string;
  customer_name: string | null;
  full_transcript: TranscriptEntry[];
  created_at: string;
}
