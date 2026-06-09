export type ConsultationStatus = 'in_progress' | 'completed' | 'abandoned';
export type CustomerGender = 'male' | 'female';

export interface ConsultationRecord {
  id: string;
  mobile_number: string;
  module_attempted: string;
  customer_name: string | null;
  customer_gender: CustomerGender | null;
  attempt_date: string;
  attempt_time: string;
  duration_seconds: number | null;
  overall_score: number | null;
  introduction_score: number | null;
  technical_score: number | null;
  budget_score: number | null;
  discovery_score: number | null;
  report_card_json: ReportCard | null;
  status: ConsultationStatus;
  created_at: string;
}

export interface StartConsultationRequest {
  module_id: string;
}

export interface StartConsultationResponse {
  consultation_id: string;
  customer_name: string;
  customer_gender: CustomerGender;
  ws_token: string;
}

export interface ConsultationHistoryItem {
  id: string;
  module_attempted: string;
  customer_name: string | null;
  attempt_date: string;
  attempt_time: string;
  overall_score: number | null;
  status: ConsultationStatus;
  duration_seconds: number | null;
}

export interface ModuleStats {
  attempt_count: number;
  last_score: number | null;
  last_max_score: number | null;
  last_attempt_date: string | null;
  best_score: number | null;
  best_max_score: number | null;
  avg_score: number | null;
}

export interface ReportCard {
  overall_score: number;
  sections: {
    introduction: SectionResult;
    technical: SectionResult;
    budget_discovery: SectionResult;
    discovery_confidence: SectionResult;
    market_comparison?: SectionResult; // Task 2+
  };
  critical_mistakes: string[];
  coaching_feedback: string;
  performance_tier: 'Excellent' | 'Good' | 'Average' | 'Needs Improvement';
}

export interface SectionResult {
  score: number;
  max_score: number;
  label: string;
  strengths: string[];
  missed_opportunities: string[];
  feedback: string;
}
