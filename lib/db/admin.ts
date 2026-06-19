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
// An RM is flagged when their *cumulative* mastery of a sub-skill group across
// all their completed sessions in a module falls below this percentage.
export const SKILL_GAP_THRESHOLD = 60;

export interface SkillGapRM {
  mobile_number: string;
  name: string;
  module_sessions: number; // sessions that contributed marks to this column
  score: number;           // cumulative score earned in the column
  max: number;             // cumulative max possible in the column
  percentage: number;      // round(score / max * 100)
}

export interface SkillGapColumn {
  key: string;
  title: string;
  rms: SkillGapRM[];
}

export interface ModuleSkillGaps {
  num: number;
  title: string;
  columns: SkillGapColumn[];
}

// Each module's "needs practice" view = one or more columns. A column sums one or
// more rubric sections, which may span several tasks of the module.
interface ColumnDef { key: string; title: string; sections: string[] }
interface ModuleGroupDef { num: number; title: string; tasks: string[]; columns: ColumnDef[] }

const MODULE_SKILL_GROUPS: Record<string, ModuleGroupDef> = {
  'module-1': {
    num: 1,
    title: 'Know the Budget of Your Customer',
    tasks: ['module_1_seepage', 'module_1_task2', 'module_1_task3'],
    columns: [
      { key: 'introduction', title: 'Introduction', sections: ['introduction'] },
      { key: 'budget_discovery', title: 'Budget Discovery', sections: ['budget_discovery'] },
    ],
  },
  'module-2': {
    num: 2,
    title: 'Design Finalisation — Objection Handling',
    tasks: ['module_2_task1', 'module_2_task2'],
    columns: [
      // reinforcement_tools (M2-T1) + reinforcement_proof (M2-T2)
      { key: 'reinforcement', title: 'Reinforcement using Proof', sections: ['reinforcement_tools', 'reinforcement_proof'] },
      // discovery + expert recommendation + confidence building (all M2-T1)
      { key: 'design_finalisation', title: 'Design Finalisation', sections: ['discovery_leaning', 'expert_recommendation', 'confidence_building'] },
    ],
  },
};

// Module keys that have a skill-gap view (e.g. ['module-1', 'module-2']).
export function getSkillGapModuleKeys(): string[] {
  return Object.keys(MODULE_SKILL_GROUPS);
}

export async function getModuleSkillGaps(moduleKey: string): Promise<ModuleSkillGaps | null> {
  const cfg = MODULE_SKILL_GROUPS[moduleKey];
  if (!cfg) return null;

  const [usersRes, consultsRes] = await Promise.all([
    db.from('users').select('mobile_number, name').eq('is_active', true),
    db
      .from('consultation_history')
      .select('mobile_number, report_card_json')
      .in('module_attempted', cfg.tasks)
      .eq('status', 'completed'),
  ]);

  const nameByMobile = new Map<string, string>(
    (usersRes.data ?? []).map(
      (u: { mobile_number: string; name: string }) => [u.mobile_number, u.name] as [string, string],
    ),
  );
  const rows = (consultsRes.data ?? []) as { mobile_number: string; report_card_json: ReportCard | null }[];

  // byRM -> per-column { score, max, sessions }
  type ColAcc = { score: number; max: number; sessions: number };
  const byRM = new Map<string, Record<string, ColAcc>>();

  for (const row of rows) {
    const sections = row.report_card_json?.sections;
    if (!sections) continue;
    let acc = byRM.get(row.mobile_number);
    if (!acc) {
      acc = {};
      for (const col of cfg.columns) acc[col.key] = { score: 0, max: 0, sessions: 0 };
      byRM.set(row.mobile_number, acc);
    }
    for (const col of cfg.columns) {
      let s = 0, m = 0, present = false;
      for (const secKey of col.sections) {
        const sec = sections[secKey];
        if (sec && typeof sec.score === 'number' && typeof sec.max_score === 'number' && sec.max_score > 0) {
          s += sec.score; m += sec.max_score; present = true;
        }
      }
      if (present) {
        acc[col.key].score += s;
        acc[col.key].max += m;
        acc[col.key].sessions += 1;
      }
    }
  }

  const worstFirst = (a: SkillGapRM, b: SkillGapRM) => a.percentage - b.percentage || a.name.localeCompare(b.name);

  const columns: SkillGapColumn[] = cfg.columns.map(col => {
    const rms: SkillGapRM[] = [];
    for (const [mobile, acc] of byRM) {
      const c = acc[col.key];
      if (c.max > 0) {
        const percentage = Math.round((c.score / c.max) * 100);
        if (percentage < SKILL_GAP_THRESHOLD) {
          rms.push({
            mobile_number: mobile,
            name: nameByMobile.get(mobile) ?? mobile,
            module_sessions: c.sessions,
            score: c.score,
            max: c.max,
            percentage,
          });
        }
      }
    }
    rms.sort(worstFirst);
    return { key: col.key, title: col.title, rms };
  });

  return { num: cfg.num, title: cfg.title, columns };
}
