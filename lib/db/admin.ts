import { db } from './client';
import type { ReportCard } from '@/types/consultation';

export interface RMPerformance {
  mobile_number: string;
  name: string;
  attempt_count: number;
  best_score: number | null;
  avg_score: number | null;
  last_attempt_date: string | null;
  last_score: number | null;
  last_module_attempted: string | null;
}

export interface AdminConsultation {
  id: string;
  mobile_number: string;
  module_attempted: string;
  customer_name: string | null;
  customer_gender: string | null;
  attempt_date: string;
  attempt_time: string;
  status: string;
  overall_score: number | null;
  introduction_score: number | null;
  technical_score: number | null;
  budget_score: number | null;
  discovery_score: number | null;
  duration_seconds: number | null;
  report_card_json: ReportCard | null;
  created_at: string;
}

export async function getAllRMPerformance(): Promise<RMPerformance[]> {
  const [usersRes, consultsRes] = await Promise.all([
    db.from('users').select('mobile_number, name').eq('is_active', true).order('name'),
    db
      .from('consultation_history')
      .select('mobile_number, overall_score, attempt_date, created_at, module_attempted')
      .eq('status', 'completed')
      .order('created_at', { ascending: false }),
  ]);

  const users = usersRes.data ?? [];
  const consultations = consultsRes.data ?? [];

  return users.map(user => {
    const userConsults = consultations.filter(c => c.mobile_number === user.mobile_number);
    const scores = userConsults
      .map(c => c.overall_score as number | null)
      .filter((s): s is number => s !== null);

    return {
      mobile_number: user.mobile_number,
      name: user.name,
      attempt_count: userConsults.length,
      best_score: scores.length > 0 ? Math.max(...scores) : null,
      avg_score:
        scores.length > 0
          ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length)
          : null,
      last_attempt_date: userConsults[0]?.attempt_date ?? null,
      last_score: scores[0] ?? null,
      last_module_attempted: (userConsults[0] as { module_attempted?: string } | undefined)?.module_attempted ?? null,
    };
  });
}

export async function getRMConsultations(mobile_number: string): Promise<AdminConsultation[]> {
  const { data, error } = await db
    .from('consultation_history')
    .select(
      'id, mobile_number, module_attempted, customer_name, customer_gender, attempt_date, attempt_time, status, overall_score, introduction_score, technical_score, budget_score, discovery_score, duration_seconds, report_card_json, created_at',
    )
    .eq('mobile_number', mobile_number)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data as AdminConsultation[];
}

export async function getRMName(mobile_number: string): Promise<string> {
  const { data } = await db
    .from('users')
    .select('name')
    .eq('mobile_number', mobile_number)
    .single();
  return (data as { name: string } | null)?.name ?? mobile_number;
}
