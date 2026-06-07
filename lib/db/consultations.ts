import { randomUUID } from 'crypto';
import { db } from './client';
import type {
  ConsultationRecord,
  ConsultationHistoryItem,
  ModuleStats,
  ReportCard,
  ConsultationStatus,
  CustomerGender,
} from '@/types/consultation';

// Use globalThis so the Map is shared across Next.js RSC and Route Handler
// module instances (they may be bundled separately by webpack).
declare global {
  // eslint-disable-next-line no-var
  var __devConsultations: Map<string, ConsultationRecord> | undefined;
}
globalThis.__devConsultations ??= new Map<string, ConsultationRecord>();
const devConsultations = globalThis.__devConsultations;

export async function createConsultation(params: {
  mobile_number: string;
  module_attempted: string;
  customer_name: string;
  customer_gender: CustomerGender;
}): Promise<ConsultationRecord> {
  const now = new Date();
  const attempt_date = now.toISOString().split('T')[0];
  const attempt_time = now.toTimeString().split(' ')[0];

  try {
    const { data, error } = await db
      .from('consultation_history')
      .insert({
        mobile_number: params.mobile_number,
        module_attempted: params.module_attempted,
        customer_name: params.customer_name,
        customer_gender: params.customer_gender,
        attempt_date,
        attempt_time,
        status: 'in_progress' as ConsultationStatus,
      })
      .select()
      .single();

    if (error || !data) throw new Error(error?.message);
    return data as ConsultationRecord;
  } catch {
    // DB not configured — use in-memory
    const record: ConsultationRecord = {
      id: randomUUID(),
      mobile_number: params.mobile_number,
      module_attempted: params.module_attempted,
      customer_name: params.customer_name,
      customer_gender: params.customer_gender,
      attempt_date,
      attempt_time,
      status: 'in_progress',
      created_at: now.toISOString(),
      overall_score: null,
      introduction_score: null,
      technical_score: null,
      budget_score: null,
      discovery_score: null,
      duration_seconds: null,
      report_card_json: null,
    };
    devConsultations.set(record.id, record);
    return record;
  }
}

export async function getConsultationById(id: string): Promise<ConsultationRecord | null> {
  // Check in-memory first
  const dev = devConsultations.get(id);
  if (dev) return dev;

  try {
    const { data, error } = await db
      .from('consultation_history')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) return null;
    return data as ConsultationRecord;
  } catch { return null; }
}

export async function completeConsultation(params: {
  id: string;
  duration_seconds: number;
  overall_score: number;
  introduction_score: number;
  technical_score: number;
  budget_score: number;
  discovery_score: number;
  report_card_json: ReportCard;
}): Promise<void> {
  // Update in-memory record if it exists
  const dev = devConsultations.get(params.id);
  if (dev) {
    Object.assign(dev, {
      status: 'completed',
      duration_seconds: params.duration_seconds,
      overall_score: params.overall_score,
      introduction_score: params.introduction_score,
      technical_score: params.technical_score,
      budget_score: params.budget_score,
      discovery_score: params.discovery_score,
      report_card_json: params.report_card_json,
    });
  }

  try {
    const { error } = await db
      .from('consultation_history')
      .update({
        status: 'completed',
        duration_seconds: params.duration_seconds,
        overall_score: params.overall_score,
        introduction_score: params.introduction_score,
        technical_score: params.technical_score,
        budget_score: params.budget_score,
        discovery_score: params.discovery_score,
        report_card_json: params.report_card_json,
      })
      .eq('id', params.id);

    if (error) throw new Error(error.message);
  } catch { /* DB not configured */ }
}

export async function abandonConsultation(id: string): Promise<void> {
  const dev = devConsultations.get(id);
  if (dev) dev.status = 'abandoned';

  try {
    await db.from('consultation_history').update({ status: 'abandoned' }).eq('id', id);
  } catch { /* DB not configured */ }
}

export async function getConsultationHistory(mobile_number: string): Promise<ConsultationHistoryItem[]> {
  try {
    const { data, error } = await db
      .from('consultation_history')
      .select('id, module_attempted, customer_name, attempt_date, attempt_time, overall_score, status, duration_seconds')
      .eq('mobile_number', mobile_number)
      .order('created_at', { ascending: false })
      .limit(50);

    if (error || !data) return [];
    return data as ConsultationHistoryItem[];
  } catch { return []; }
}

export async function getModuleStats(mobile_number: string, module_attempted: string): Promise<ModuleStats> {
  try {
    const { data, error } = await db
      .from('consultation_history')
      .select('overall_score, attempt_date, status')
      .eq('mobile_number', mobile_number)
      .eq('module_attempted', module_attempted)
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return { attempt_count: 0, last_score: null, last_attempt_date: null, best_score: null, avg_score: null };
    }

    const scores = data.map((r: { overall_score: number | null }) => r.overall_score).filter((s): s is number => s !== null);
    const avg = scores.length > 0 ? Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10 : null;

    return {
      attempt_count: data.length,
      last_score: scores[0] ?? null,
      last_attempt_date: data[0]?.attempt_date ?? null,
      best_score: scores.length > 0 ? Math.max(...scores) : null,
      avg_score: avg,
    };
  } catch {
    return { attempt_count: 0, last_score: null, last_attempt_date: null, best_score: null, avg_score: null };
  }
}
