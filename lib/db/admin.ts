import { db } from './client';
import type { ReportCard } from '@/types/consultation';
import { normaliseScore, MODULE_CONFIG } from '@/lib/config/modules';

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
  threshold: number; // % below which an RM is flagged for this column
  rms: SkillGapRM[];
}

export interface ModuleSkillGaps {
  num: number;
  title: string;
  columns: SkillGapColumn[];
}

// Each module's "needs practice" view = one or more columns. A column sums one or
// more rubric sections, which may span several tasks of the module.
interface ColumnDef { key: string; title: string; sections: string[]; threshold?: number }
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
      // reinforcement_tools (M2-T1) + reinforcement_proof (M2-T2) — flagged below 80%
      { key: 'reinforcement', title: 'Reinforcement using Proof', sections: ['reinforcement_tools', 'reinforcement_proof'], threshold: 80 },
      // discovery + expert recommendation + confidence building (all M2-T1)
      { key: 'design_finalisation', title: 'Design Finalisation', sections: ['discovery_leaning', 'expert_recommendation', 'confidence_building'] },
    ],
  },
  'module-3': {
    num: 3,
    title: 'Levers Used',
    tasks: ['module_3_task1', 'module_3_task2', 'module_3_task3'],
    columns: [
      // lever_used (M3-T1, M3-T2) + discount_lever (M3-T3) — all sum into one "Levers" column
      // threshold 70%: RM flagged only if their cumulative lever score is below 70%
      { key: 'levers_used', title: 'Levers Used (Discount & Urgency)', sections: ['lever_used', 'discount_lever'], threshold: 70 },
    ],
  },
  'module-4': {
    num: 4,
    title: 'Market Comparison',
    tasks: ['module_4_task1'],
    columns: [
      // value_justification (M4-T1, max 21) — flagged below 60%
      { key: 'value_justification', title: 'Value Justification', sections: ['value_justification'], threshold: 60 },
    ],
  },
  'module-5': {
    num: 5,
    title: 'NIO Premium Panels',
    tasks: ['module_5_task1'],
    columns: [
      // all 6 sections of M5-T1 roleplay (total max 20) — flagged below 60%
      {
        key: 'nio_overall',
        title: 'NIO Premium Panels — Overall',
        sections: ['personalisation_rapport', 'value_anchoring', 'tailored_differentiation', 'objection_handling', 'curated_design_value', 'conviction_no_discount'],
        threshold: 60,
      },
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
    const threshold = col.threshold ?? SKILL_GAP_THRESHOLD;
    const rms: SkillGapRM[] = [];
    for (const [mobile, acc] of byRM) {
      const c = acc[col.key];
      if (c.max > 0) {
        const percentage = Math.round((c.score / c.max) * 100);
        if (percentage < threshold) {
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
    return { key: col.key, title: col.title, threshold, rms };
  });

  return { num: cfg.num, title: cfg.title, columns };
}

export interface TaskNonAttempt {
  task: string;   // module_attempted value
  label: string;  // "Task 1", "Task 2", ...
  rms: { mobile_number: string; name: string }[];
}

// Admin mobile numbers — used to separate admins from RMs in the matrix.
const ADMIN_MOBILE_SET = new Set([
  '7880320915', '9871531279', '9873696654', '8439197965', '8393005909', '9034002226', '9997506778', '9045321000', '9889083993',
]);

// The "haven't attempted" view is restricted to this fixed cohort of RMs.
// Matched to users by (case-insensitive, whitespace-normalised) name, since the
// users table has no external RM id.
const NON_ATTEMPT_RM_NAMES = [
  'HARSH Kumar', 'Murtaza Jiwaaliwala', 'Akash Ashokbhai Patel', 'Rakesh Das', 'Abhyuday Kshatriya',
  'Anany Shukla', 'Harsh Dubey', 'Shikhar Srivastava', 'Junaid Hussain', 'SUMAN KUMAR', 'Akash Ray',
  'PANKAJ', 'Lovenesh Garg', 'Syed Khaibar Ali', 'Akshat Krishna Silakari', 'ADARSH YADAV',
  'Abhishek Bamniya', 'Sonu Baghel', 'Abhrajit Halder', 'Anshuman Gupta', 'Aadarsh Thakur',
  'Pankaj Chander Bachkheti', 'Ashish Kumar', 'Amaan Nawaz', 'Rajat Singh', 'Shubham Dhingra',
];
const normName = (s: string) => s.trim().toLowerCase().replace(/\s+/g, ' ');
const NON_ATTEMPT_RM_SET = new Set(NON_ATTEMPT_RM_NAMES.map(normName));

// Per task of a module, the cohort RMs who have no valid (completed / pending)
// attempt for that task. Grouped by name so a person with duplicate accounts
// appears once (and counts as "attempted" if any of their accounts did it).
export async function getModuleTaskNonAttempts(moduleKey: string): Promise<TaskNonAttempt[] | null> {
  const cfg = MODULE_SKILL_GROUPS[moduleKey];
  if (!cfg) return null;

  const [usersRes, consultsRes] = await Promise.all([
    db.from('users').select('mobile_number, name').eq('is_active', true).order('name'),
    db
      .from('consultation_history')
      .select('mobile_number, module_attempted')
      .in('module_attempted', cfg.tasks)
      .in('status', ['completed', 'evaluation_pending']),
  ]);

  const users = ((usersRes.data ?? []) as { mobile_number: string; name: string }[])
    .filter(u => NON_ATTEMPT_RM_SET.has(normName(u.name)));
  const consults = (consultsRes.data ?? []) as { mobile_number: string; module_attempted: string }[];

  const attempted = new Set(consults.map(c => `${c.mobile_number}|${c.module_attempted}`));

  // Group cohort users by name to collapse duplicate accounts.
  const byName = new Map<string, { name: string; mobiles: string[] }>();
  for (const u of users) {
    const k = normName(u.name);
    if (!byName.has(k)) byName.set(k, { name: u.name, mobiles: [] });
    byName.get(k)!.mobiles.push(u.mobile_number);
  }
  const people = [...byName.values()];

  return cfg.tasks.map((task, i) => ({
    task,
    label: `Task ${i + 1}`,
    rms: people
      .filter(p => !p.mobiles.some(m => attempted.has(`${m}|${task}`)))
      .map(p => ({ mobile_number: p.mobiles[0], name: p.name })),
  }));
}

// ── Per-RM × per-task attempt tracking matrix (fixed 26-RM cohort) ──────
// Rows = the NON_ATTEMPT cohort (grouped by name to collapse duplicate accounts).
// Columns = every live, trackable task across all modules, in module order.
// Each cell = how many times that RM attempted that task (0 ⇒ still pending).

export interface MatrixColumn {
  key: string;       // module_attempted value, e.g. 'module_3_task2'
  moduleNum: number; // 1..5
  label: string;     // 'T1', 'T2', 'Quiz' …
  title: string;     // full task title, for the cell tooltip
}

export interface MatrixGroup {
  num: number;     // module number
  title: string;   // module title
  colKeys: string[];
}

export interface MatrixRMRow {
  name: string;
  mobile_number: string;          // first mobile for this person (used for /admin/rm/ link)
  counts: Record<string, number>; // module_attempted -> attempt count
  total: number;                  // total attempts across tracked tasks
  pending: number;                // tracked tasks not yet attempted
  lastAttempt: string | null;     // ISO timestamp of latest tracked attempt
}

export interface AttemptMatrix {
  columns: MatrixColumn[];
  groups: MatrixGroup[];
  rms: MatrixRMRow[];       // 26-RM fixed cohort
  otherRMs: MatrixRMRow[];  // non-cohort, non-admin; only those with ≥1 attempt
  adminRMs: MatrixRMRow[];  // admins; only those with ≥1 attempt
  cohortSize: number;
  generatedAt: string;
}

// Derive the ordered task columns from the single source of truth (MODULE_CONFIG).
// A task is tracked only if it is active and writes a module_attempted value
// (the NIO playbook has none, so it is excluded). Quiz tasks are labelled 'Quiz';
// every other task is 'T{n}' by its position among that module's trackable tasks.
function buildMatrixColumns(): { columns: MatrixColumn[]; groups: MatrixGroup[] } {
  const columns: MatrixColumn[] = [];
  const groups: MatrixGroup[] = [];

  const modulesInOrder = Object.values(MODULE_CONFIG)
    .map(m => ({ m, num: Number(m.id.replace('module_', '')) }))
    .filter(({ num }) => Number.isFinite(num))
    .sort((a, b) => a.num - b.num);

  for (const { m, num } of modulesInOrder) {
    const colKeys: string[] = [];
    let taskIndex = 0;
    for (const task of m.tasks) {
      if (task.status !== 'active' || !task.moduleAttempted) continue;
      const label = task.type === 'quiz' ? 'Quiz' : `T${++taskIndex}`;
      columns.push({ key: task.moduleAttempted, moduleNum: num, label, title: task.title });
      colKeys.push(task.moduleAttempted);
    }
    if (colKeys.length) groups.push({ num, title: m.title, colKeys });
  }

  return { columns, groups };
}

export async function getAttemptMatrix(): Promise<AttemptMatrix> {
  const { columns, groups } = buildMatrixColumns();
  const taskKeys = columns.map(c => c.key);

  const [usersRes, consultsRes] = await Promise.all([
    db.from('users').select('mobile_number, name').eq('is_active', true).order('name'),
    db
      .from('consultation_history')
      .select('mobile_number, module_attempted, created_at')
      .in('module_attempted', taskKeys)
      .in('status', ['completed', 'evaluation_pending']),
  ]);

  const allUsers = (usersRes.data ?? []) as { mobile_number: string; name: string }[];
  const consults = (consultsRes.data ?? []) as {
    mobile_number: string;
    module_attempted: string;
    created_at: string;
  }[];

  // Split users into three mutually exclusive groups.
  // Admin check takes precedence so an admin whose name matches the cohort list
  // is always placed in the admin group.
  const cohortUsers = allUsers.filter(u => !ADMIN_MOBILE_SET.has(u.mobile_number) && NON_ATTEMPT_RM_SET.has(normName(u.name)));
  const adminUsers  = allUsers.filter(u => ADMIN_MOBILE_SET.has(u.mobile_number));
  const otherUsers  = allUsers.filter(u => !ADMIN_MOBILE_SET.has(u.mobile_number) && !NON_ATTEMPT_RM_SET.has(normName(u.name)));

  // Build a row-map for a list of users (dedup by normalised name).
  function buildRowMap(users: typeof allUsers): { mobileToKey: Map<string, string>; rowByKey: Map<string, MatrixRMRow> } {
    const mobileToKey = new Map<string, string>();
    const rowByKey    = new Map<string, MatrixRMRow>();
    for (const u of users) {
      const k = normName(u.name);
      mobileToKey.set(u.mobile_number, k);
      if (!rowByKey.has(k)) {
        rowByKey.set(k, { name: u.name, mobile_number: u.mobile_number, counts: {}, total: 0, pending: 0, lastAttempt: null });
      }
    }
    return { mobileToKey, rowByKey };
  }

  const cohortMap = buildRowMap(cohortUsers);
  const adminMap  = buildRowMap(adminUsers);
  const otherMap  = buildRowMap(otherUsers);

  // One combined mobile → row lookup so each consult hits the right group in O(1).
  const mobileToRow = new Map<string, MatrixRMRow>();
  for (const { mobileToKey, rowByKey } of [cohortMap, adminMap, otherMap]) {
    for (const [mobile, key] of mobileToKey) {
      mobileToRow.set(mobile, rowByKey.get(key)!);
    }
  }

  for (const c of consults) {
    const row = mobileToRow.get(c.mobile_number);
    if (!row) continue;
    row.counts[c.module_attempted] = (row.counts[c.module_attempted] ?? 0) + 1;
    row.total += 1;
    if (!row.lastAttempt || c.created_at > row.lastAttempt) row.lastAttempt = c.created_at;
  }

  function finaliseRows(rowByKey: Map<string, MatrixRMRow>, requireAttempts = false): MatrixRMRow[] {
    const rows = [...rowByKey.values()];
    for (const row of rows) {
      row.pending = taskKeys.reduce((n, key) => n + ((row.counts[key] ?? 0) === 0 ? 1 : 0), 0);
    }
    return (requireAttempts ? rows.filter(r => r.total > 0) : rows)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  const rms      = finaliseRows(cohortMap.rowByKey);              // cohort: all 26 shown
  const otherRMs = finaliseRows(otherMap.rowByKey,  true);        // others: ≥1 attempt only
  const adminRMs = finaliseRows(adminMap.rowByKey,  true);        // admins: ≥1 attempt only

  return {
    columns,
    groups,
    rms,
    otherRMs,
    adminRMs,
    cohortSize: rms.length,
    generatedAt: new Date().toISOString(),
  };
}
