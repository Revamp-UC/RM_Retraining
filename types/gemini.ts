export type ConnectionStatus = 'idle' | 'connecting' | 'connected' | 'ending' | 'error' | 'completed';

export type WSMessageType =
  | 'session_ready'
  | 'audio_chunk'
  | 'transcript_rm'
  | 'transcript_customer'
  | 'heartbeat'
  | 'heartbeat_ack'
  | 'end_consultation'
  | 'evaluation_complete'
  | 'error'
  | 'session_ended';

export interface WSMessage {
  type: WSMessageType;
  data?: unknown;
  error?: string;
  consultation_id?: string;
}

export interface AudioChunkMessage {
  type: 'audio_chunk';
  audio: string; // base64 encoded PCM
}

export interface SessionReadyMessage {
  type: 'session_ready';
  customer_name: string;
}

export interface GeminiSessionInfo {
  consultation_id: string;
  mobile_number: string;
  customer_name: string;
  customer_gender: string;
  module_id: string;
  start_time: Date;
  ws_token: string;
}
