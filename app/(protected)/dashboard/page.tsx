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
    name: 'Seepage Wall Consultation',
    task: 'Know the budget of your customer',
    isActive: true,
    moduleKey: 'module_1_seepage',
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

  const module1Stats = await getModuleStats(user.mobile_number, 'module_1_seepage');
  const statsMap = { module_1_seepage: module1Stats };

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
              stats={mod.isActive ? (statsMap as Record<string, typeof module1Stats>)[(mod as { moduleKey?: string }).moduleKey ?? ''] : undefined}
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
