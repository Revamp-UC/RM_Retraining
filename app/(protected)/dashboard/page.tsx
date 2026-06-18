import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { validateSession } from '@/lib/auth/session';
import { getModuleStats, getConsultationHistory } from '@/lib/db/consultations';
import { ModuleCard } from '@/components/dashboard/ModuleCard';
import { StatsStrip } from '@/components/dashboard/StatsStrip';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
import { BarChart3 } from 'lucide-react';
import { MySessions } from '@/components/dashboard/MySessions';

const ADMIN_MOBILES = new Set(['7880320915', '9871531279', '9873696654', '8439197965']);

const MODULES = [
  {
    id: 'module_1',
    number: 1,
    task: 'Know the budget of your customer',
    isActive: true,
  },
  {
    id: 'module_2',
    number: 2,
    task: 'Design Finalisation — Objection Handling',
    isActive: true,
  },
  { id: 'module_3', number: 3, task: 'Levers Used', isActive: true, adminOnly: true },
  { id: 'module_4', number: 4, task: 'Market Comparison', isActive: true, adminOnly: true },
  { id: 'module_5', number: 5, task: 'NIO Premium Panels', isActive: true, adminOnly: true },
  { id: 'module_6', number: 6, name: 'Complete Room Makeover', isActive: false },
];

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('rm_session')?.value;
  if (!token) redirect('/login');

  const user = await validateSession(token);
  if (!user) redirect('/login');

  const isAdmin = ADMIN_MOBILES.has(user.mobile_number);

  const [task1Stats, task2Stats, task3Stats, m2task1Stats, m2task2Stats, m3task1Stats, m3task2Stats, m3task3Stats, m4task1Stats, m5task1Stats, m5task2Stats, history] = await Promise.all([
    getModuleStats(user.mobile_number, 'module_1_seepage'),
    getModuleStats(user.mobile_number, 'module_1_task2'),
    getModuleStats(user.mobile_number, 'module_1_task3'),
    getModuleStats(user.mobile_number, 'module_2_task1'),
    getModuleStats(user.mobile_number, 'module_2_task2'),
    // Module 3, 4, 5 are admin-only — only fetch their stats for admins
    isAdmin ? getModuleStats(user.mobile_number, 'module_3_task1') : Promise.resolve(null),
    isAdmin ? getModuleStats(user.mobile_number, 'module_3_task2') : Promise.resolve(null),
    isAdmin ? getModuleStats(user.mobile_number, 'module_3_task3') : Promise.resolve(null),
    isAdmin ? getModuleStats(user.mobile_number, 'module_4_task1') : Promise.resolve(null),
    isAdmin ? getModuleStats(user.mobile_number, 'module_5_task1') : Promise.resolve(null),
    isAdmin ? getModuleStats(user.mobile_number, 'module_5_task2') : Promise.resolve(null),
    getConsultationHistory(user.mobile_number),
  ]);

  // Full map — StatsStrip aggregates over all values, so all tasks must be included
  const statsMap = {
    module_1_seepage: task1Stats,
    module_1_task2: task2Stats,
    module_1_task3: task3Stats,
    module_2_task1: m2task1Stats,
    module_2_task2: m2task2Stats,
    ...(m3task1Stats ? { module_3_task1: m3task1Stats } : {}),
    ...(m3task2Stats ? { module_3_task2: m3task2Stats } : {}),
    ...(m3task3Stats ? { module_3_task3: m3task3Stats } : {}),
    ...(m4task1Stats ? { module_4_task1: m4task1Stats } : {}),
    ...(m5task1Stats ? { module_5_task1: m5task1Stats } : {}),
    ...(m5task2Stats ? { module_5_task2: m5task2Stats } : {}),
  };

  // Combined per-module for the module card (attempt count across all tasks).
  // Latest task drives last_score/date; best task drives best_score.
  function aggregateTasks(tasks: typeof task1Stats[]): typeof task1Stats {
    const latest = tasks
      .filter(t => t.last_attempt_date !== null)
      .sort((a, b) => (b.last_attempt_date! > a.last_attempt_date! ? 1 : -1))[0] ?? null;
    const best = tasks
      .filter(t => t.best_score !== null)
      .sort((a, b) => b.best_score! - a.best_score!)[0] ?? null;
    return {
      attempt_count: tasks.reduce((s, t) => s + t.attempt_count, 0),
      last_score: latest?.last_score ?? null,
      last_max_score: latest?.last_max_score ?? null,
      last_attempt_date: latest?.last_attempt_date ?? null,
      best_score: best?.best_score ?? null,
      best_max_score: best?.best_max_score ?? null,
      avg_score: null,
    };
  }

  const moduleCardStatsMap: Record<string, typeof task1Stats> = {
    module_1: aggregateTasks([task1Stats, task2Stats, task3Stats]),
    module_2: aggregateTasks([m2task1Stats, m2task2Stats]),
    ...(m3task1Stats && m3task2Stats && m3task3Stats ? { module_3: aggregateTasks([m3task1Stats, m3task2Stats, m3task3Stats]) } : {}),
    ...(m4task1Stats ? { module_4: aggregateTasks([m4task1Stats]) } : {}),
    ...(m5task1Stats || m5task2Stats ? { module_5: aggregateTasks(([m5task1Stats, m5task2Stats] as (typeof task1Stats | null)[]).filter((s): s is typeof task1Stats => s !== null)) } : {}),
  };

  const completedHistory = history.filter(
    h => h.status === 'completed' || h.status === 'evaluation_pending'
  ).slice(0, 15);

  // An admin-only module is active only for admins
  const moduleIsActive = (mod: (typeof MODULES)[number]) =>
    mod.isActive && (!('adminOnly' in mod && mod.adminOnly) || isAdmin);
  const activeCount = MODULES.filter(moduleIsActive).length;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Background gradient */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-60 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-indigo-900/10 blur-3xl" />
      </div>

      <div className="relative max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">Urban Company</p>
            <h1 className="text-2xl font-bold text-[#f1f1f5] leading-tight">RM Retraining</h1>
            <p className="text-[#9090a8] text-sm mt-1">Welcome back, <span className="text-[#f1f1f5] font-medium">{user.name}</span></p>
          </div>
          <div className="flex items-center gap-2">
            {isAdmin && (
              <Link
                href="/admin"
                className="flex items-center gap-1.5 rounded-lg border border-indigo-500/30 bg-indigo-600/10 px-3 py-2 text-xs font-semibold text-indigo-400 hover:bg-indigo-600/20 hover:border-indigo-500/50 transition-all"
              >
                <BarChart3 className="h-3.5 w-3.5" />
                Admin
              </Link>
            )}
            <LogoutButton />
          </div>
        </div>

        {/* Stats strip */}
        <StatsStrip name={user.name} stats={statsMap} />

        {/* My Sessions */}
        <MySessions sessions={completedHistory} />

        {/* Modules section */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#9090a8] uppercase tracking-widest">Training Modules</h2>
          <span className="text-xs text-[#60607a]">{activeCount} of 6 active</span>
        </div>

        <div className="space-y-3">
          {MODULES.map((mod, index) => {
            const active = moduleIsActive(mod);
            return (
              <ModuleCard
                key={mod.id}
                id={mod.id}
                number={mod.number}
                name={'name' in mod ? mod.name : undefined}
                task={active && 'task' in mod ? mod.task : undefined}
                isActive={active}
                stats={active ? moduleCardStatsMap[mod.id] : undefined}
                index={index}
              />
            );
          })}
        </div>

        <p className="text-center text-xs text-[#60607a] mt-8">
          Urban Company · RM Training Platform · v1.0
        </p>
      </div>
    </div>
  );
}
