import { db } from './client';
import type { ReportCard } from '@/types/consultation';
import { normaliseScore } from '@/lib/config/modules';

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
      .select('mobile_number, overall_score, attempt_date, created_at, module_attempted, status, duration_seconds')
      .in('status', ['completed', 'evaluation_pending'])
      .order('created_at', { ascending: false }),
  ]);

  const users = usersRes.data ?? [];
  const consultations = consultsRes.data ?? [];

  return users.map(user => {
    const userConsults = consultations.filter(c => c.mobile_number === user.mobile_number);
    // Normalise every session to /50 before aggregating — tasks have different max marks
    const normScores = userConsults
      .filter(c => c.overall_score !== null)
      .map(c => normaliseScore(c.overall_score as number, c.module_attempted as string));
    // Most recent scored session, also normalised to /50
    const latestScored = userConsults.find(c => c.overall_score !== null);
    const lastNorm = latestScored
      ? Math.round(normaliseScore(latestScored.overall_score as number, latestScored.module_attempted as string))
      : null;

    return {
      mobile_number: user.mobile_number,
      name: user.name,
      attempt_count: userConsults.length,
      best_score: normScores.length > 0 ? Math.round(Math.max(...normScores)) : null,
      avg_score:
        normScores.length > 0
          ? Math.round(normScores.reduce((a, b) => a + b, 0) / normScores.length)
          : null,
      last_attempt_date: userConsults[0]?.attempt_date ?? null,
      last_score: lastNorm,
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

// ── Module-wise sub-skill gap analysis ──────────────────────────────
// An RM is flagged when their *cumulative* mastery of a sub-skill across all
// their completed sessions in a module falls below this percentage.
export const SKILL_GAP_THRESHOLD = 60;

const MODULE_1_TASKS = ['module_1_seepage', 'module_1_task2', 'module_1_task3'];

export interface SkillGapRM {
  mobile_number: string;
  name: string;
  module_sessions: number; // sessions in the module that scored this sub-skill
  score: number;           // cumulative score earned in the sub-skill
  max: number;             // cumulative max possible in the sub-skill
  percentage: number;      // round(score / max * 100)
}

export interface Module1SkillGaps {
  introduction: SkillGapRM[];
  budget_discovery: SkillGapRM[];
}

type GapRow = {
  mobile_number: string;
  report_card_json: ReportCard | null;
  introduction_score: number | null;
  budget_score: number | null;
};

// Pull a section's {score, max} from the report card, falling back to the flat
// column (every Module 1 task scores introduction & budget_discovery out of 15).
function sectionScore(row: GapRow, key: 'introduction' | 'budget_discovery'): { score: number; max: number } | null {
  const sec = row.report_card_json?.sections?.[key];
  if (sec && typeof sec.score === 'number' && typeof sec.max_score === 'number' && sec.max_score > 0) {
    return { score: sec.score, max: sec.max_score };
  }
  const col = key === 'introduction' ? row.introduction_score : row.budget_score;
  if (typeof col === 'number') return { score: col, max: 15 };
  return null;
}

export async function getModule1SkillGaps(): Promise<Module1SkillGaps> {
  const [usersRes, consultsRes] = await Promise.all([
    db.from('users').select('mobile_number, name').eq('is_active', true),
    db
      .from('consultation_history')
      .select('mobile_number, report_card_json, introduction_score, budget_score')
      .in('module_attempted', MODULE_1_TASKS)
      .eq('status', 'completed'),
  ]);

  const nameByMobile = new Map<string, string>(
    (usersRes.data ?? []).map(
      (u: { mobile_number: string; name: string }) => [u.mobile_number, u.name] as [string, string],
    ),
  );
  const rows = (consultsRes.data ?? []) as GapRow[];

  interface Acc {
    intro: { score: number; max: number; sessions: number };
    budget: { score: number; max: number; sessions: number };
  }
  const byRM = new Map<string, Acc>();

  for (const row of rows) {
    let acc = byRM.get(row.mobile_number);
    if (!acc) {
      acc = { intro: { score: 0, max: 0, sessions: 0 }, budget: { score: 0, max: 0, sessions: 0 } };
      byRM.set(row.mobile_number, acc);
    }
    const intro = sectionScore(row, 'introduction');
    if (intro) { acc.intro.score += intro.score; acc.intro.max += intro.max; acc.intro.sessions += 1; }
    const budget = sectionScore(row, 'budget_discovery');
    if (budget) { acc.budget.score += budget.score; acc.budget.max += budget.max; acc.budget.sessions += 1; }
  }

  const introduction: SkillGapRM[] = [];
  const budget_discovery: SkillGapRM[] = [];

  for (const [mobile, acc] of byRM) {
    const name = nameByMobile.get(mobile) ?? mobile;
    if (acc.intro.max > 0) {
      const percentage = Math.round((acc.intro.score / acc.intro.max) * 100);
      if (percentage < SKILL_GAP_THRESHOLD) {
        introduction.push({ mobile_number: mobile, name, module_sessions: acc.intro.sessions, score: acc.intro.score, max: acc.intro.max, percentage });
      }
    }
    if (acc.budget.max > 0) {
      const percentage = Math.round((acc.budget.score / acc.budget.max) * 100);
      if (percentage < SKILL_GAP_THRESHOLD) {
        budget_discovery.push({ mobile_number: mobile, name, module_sessions: acc.budget.sessions, score: acc.budget.score, max: acc.budget.max, percentage });
      }
    }
  }

  const worstFirst = (a: SkillGapRM, b: SkillGapRM) => a.percentage - b.percentage || a.name.localeCompare(b.name);
  introduction.sort(worstFirst);
  budget_discovery.sort(worstFirst);

  return { introduction, budget_discovery };
}
