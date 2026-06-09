import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { validateSession } from '@/lib/auth/session';
import { getModuleStats } from '@/lib/db/consultations';
import { ModuleCard } from '@/components/dashboard/ModuleCard';
import { StatsStrip } from '@/components/dashboard/StatsStrip';
import { LogoutButton } from '@/components/dashboard/LogoutButton';
import { BarChart3 } from 'lucide-react';

const ADMIN_MOBILES = new Set(['7880320915', '9871531279', '9873696654']);

const MODULES = [
  {
    id: 'module_1',
    number: 1,
    task: 'Know the budget of your customer',
    isActive: true,
  },
  { id: 'module_2', number: 2, name: 'Lighting Solutions', isActive: false },
  { id: 'module_3', number: 3, name: 'Ceiling Design', isActive: false },
  { id: 'module_4', number: 4, name: 'Readymade Woodwork', isActive: false },
  { id: 'module_5', number: 5, name: 'Mouldings & Trim', isActive: false },
  { id: 'module_6', number: 6, name: 'Complete Room Makeover', isActive: false },
];

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('rm_session')?.value;
  if (!token) redirect('/login');

  const user = await validateSession(token);
  if (!user) redirect('/login');

  const [task1Stats, task2Stats, task3Stats] = await Promise.all([
    getModuleStats(user.mobile_number, 'module_1_seepage'),
    getModuleStats(user.mobile_number, 'module_1_task2'),
    getModuleStats(user.mobile_number, 'module_1_task3'),
  ]);

  // Full map — StatsStrip aggregates over all values, so all tasks must be included
  const statsMap = {
    module_1_seepage: task1Stats,
    module_1_task2: task2Stats,
    module_1_task3: task3Stats,
  };

  // Combined per-module for the module card (attempt count across all tasks)
  // Pick whichever task had the most recent session (for last_score + last_max)
  const allTasks = [task1Stats, task2Stats, task3Stats];
  const latestTask = allTasks
    .filter(t => t.last_attempt_date !== null)
    .sort((a, b) => (b.last_attempt_date! > a.last_attempt_date! ? 1 : -1))[0] ?? null;

  // Pick whichever task had the best score (for best_score + best_max)
  const bestTask = allTasks
    .filter(t => t.best_score !== null)
    .sort((a, b) => b.best_score! - a.best_score!)[0] ?? null;

  const moduleCardStatsMap: Record<string, typeof task1Stats> = {
    module_1: {
      attempt_count: allTasks.reduce((s, t) => s + t.attempt_count, 0),
      last_score: latestTask?.last_score ?? null,
      last_max_score: latestTask?.last_max_score ?? null,
      last_attempt_date: latestTask?.last_attempt_date ?? null,
      best_score: bestTask?.best_score ?? null,
      best_max_score: bestTask?.best_max_score ?? null,
      avg_score: null,
    },
  };

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
            {ADMIN_MOBILES.has(user.mobile_number) && (
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

        {/* Modules section */}
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#9090a8] uppercase tracking-widest">Training Modules</h2>
          <span className="text-xs text-[#60607a]">1 of 6 active</span>
        </div>

        <div className="space-y-3">
          {MODULES.map((mod, index) => (
            <ModuleCard
              key={mod.id}
              id={mod.id}
              number={mod.number}
              name={mod.name}
              task={'task' in mod ? mod.task : undefined}
              isActive={mod.isActive}
              stats={mod.isActive ? moduleCardStatsMap[mod.id] : undefined}
              index={index}
            />
          ))}
        </div>

        <p className="text-center text-xs text-[#60607a] mt-8">
          Urban Company · RM Training Platform · v1.0
        </p>
      </div>
    </div>
  );
}
