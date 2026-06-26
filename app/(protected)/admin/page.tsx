import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { validateSession } from '@/lib/auth/session';
import { getAllRMPerformance, getModuleSkillGaps, getAttemptMatrix } from '@/lib/db/admin';
import { ArrowLeft, BarChart3 } from 'lucide-react';
import type { ModuleSkillGaps } from '@/lib/db/admin';
import { BroadcastControl } from '@/components/admin/BroadcastControl';
import { TopPerformers } from '@/components/admin/TopPerformers';
import { ModuleGrid } from '@/components/admin/ModuleGrid';
import { RMTrackingMatrix } from '@/components/admin/RMTrackingMatrix';

export const dynamic = 'force-dynamic';

const ADMIN_MOBILES = new Set(['7880320915', '9871531279', '9873696654', '8439197965', '8393005909', '9034002226', '9997506778', '9045321000', '9889083993']);

function StatCard({
  label,
  value,
  sub,
  accent,
  highlight,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border px-5 py-4 ${
        highlight
          ? 'border-indigo-500/50 bg-indigo-600/10 ring-1 ring-indigo-500/20'
          : 'border-[#1e1e28] bg-[#13131a]'
      }`}
    >
      <p className="text-xs font-semibold text-[#60607a] uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent ?? (highlight ? 'text-indigo-300' : 'text-[#f1f1f5]')}`}>{value}</p>
      {sub && <p className="text-xs text-[#60607a] mt-0.5">{sub}</p>}
    </div>
  );
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('rm_session')?.value;
  const user = token ? await validateSession(token) : null;

  if (!user || !ADMIN_MOBILES.has(user.mobile_number)) {
    redirect('/dashboard');
  }

  const [allRM, m1Gaps, m2Gaps, m3Gaps, m4Gaps, m5Gaps, attemptMatrix] = await Promise.all([
    getAllRMPerformance(),
    getModuleSkillGaps('module-1'),
    getModuleSkillGaps('module-2'),
    getModuleSkillGaps('module-3'),
    getModuleSkillGaps('module-4'),
    getModuleSkillGaps('module-5'),
    getAttemptMatrix(),
  ]);

  // Distinct real RMs needing practice in a module (union across its columns) — drives each tile badge.
  const distinctNeedingPractice = (g: ModuleSkillGaps | null) =>
    g
      ? new Set(
          g.columns
            .flatMap(c => c.rms)
            .filter(rm => !ADMIN_MOBILES.has(rm.mobile_number))
            .map(rm => rm.mobile_number),
        ).size
      : 0;
  const moduleCounts: Record<number, number> = {
    1: distinctNeedingPractice(m1Gaps),
    2: distinctNeedingPractice(m2Gaps),
    3: distinctNeedingPractice(m3Gaps),
    4: distinctNeedingPractice(m4Gaps),
    5: distinctNeedingPractice(m5Gaps),
  };

  const attempted = allRM
    .filter(rm => rm.attempt_count > 0)
    .sort((a, b) => (b.avg_score ?? -1) - (a.avg_score ?? -1));

  const notAttempted = allRM.filter(rm => rm.attempt_count === 0);
  // Exclude admins from top performers
  const topPerformers = attempted
    .filter(rm => !ADMIN_MOBILES.has(rm.mobile_number))
    .slice(0, 10);

  // Split sessions into RM-only vs admin-only
  const rmSessions = allRM
    .filter(rm => !ADMIN_MOBILES.has(rm.mobile_number))
    .reduce((sum, rm) => sum + rm.attempt_count, 0);
  const adminSessions = allRM
    .filter(rm => ADMIN_MOBILES.has(rm.mobile_number))
    .reduce((sum, rm) => sum + rm.attempt_count, 0);
  const totalSessions = rmSessions + adminSessions;

  // Overall average is RM-only (admin test runs excluded)
  const avgScores = attempted
    .filter(rm => !ADMIN_MOBILES.has(rm.mobile_number))
    .map(rm => rm.avg_score)
    .filter((s): s is number => s !== null);
  const overallAvg =
    avgScores.length > 0
      ? Math.round(avgScores.reduce((a, b) => a + b, 0) / avgScores.length)
      : null;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">

      {/* ── Header ── */}
      <div className="border-b border-[#1e1e28] bg-[#0a0a0f]/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-5 w-5 text-indigo-400" />
            <span className="text-sm font-bold text-[#f1f1f5]">Admin Dashboard</span>
            <span className="text-xs text-[#60607a] border border-[#2a2a38] rounded-full px-2 py-0.5">
              {user.name}
            </span>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 rounded-lg border border-indigo-500/50 bg-indigo-600/15 hover:border-indigo-500/80 hover:bg-indigo-600/25 px-3.5 py-2 text-sm font-semibold text-indigo-300 hover:text-indigo-200 transition-all"
          >
            <ArrowLeft className="h-4 w-4" />
            My Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* ── Stats strip ── */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <StatCard
            label="Sessions by RM"
            value={rmSessions}
            sub="real RM attempts"
            highlight
          />
          <StatCard label="Total RMs" value={allRM.length} sub="in the programme" />
          <StatCard
            label="Attempted"
            value={attempted.length}
            sub={`${notAttempted.length} not started`}
            accent="text-indigo-400"
          />
          <StatCard
            label="Total Sessions"
            value={totalSessions}
            sub={`incl. ${adminSessions} admin`}
          />
          <StatCard
            label="Overall Avg"
            value={overallAvg !== null ? `${overallAvg}/50` : '—'}
            sub="normalised to 50 · admins excluded"
            accent={
              overallAvg === null
                ? 'text-[#f1f1f5]'
                : overallAvg >= 36
                  ? 'text-green-400'
                  : overallAvg >= 27
                    ? 'text-amber-400'
                    : 'text-red-400'
            }
          />
        </div>

        {/* ── Broadcast ── */}
        <BroadcastControl />

        {/* ── Top Performers ── */}
        <TopPerformers performers={topPerformers} />

        {/* ── These RMs Need Practice — module grid (click a module → detail page) ── */}
        <ModuleGrid counts={moduleCounts} />


        {/* ── Practice tracking matrix (26-RM cohort, auto-refreshing) ── */}
        <RMTrackingMatrix initial={attemptMatrix} />

      </div>

      {/* Floating back button — always visible regardless of scroll */}
      <Link
        href="/dashboard"
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full border border-[#2a2a38] bg-[#13131a]/90 backdrop-blur px-4 py-2.5 text-xs font-semibold text-[#9090a8] shadow-lg hover:border-indigo-500/40 hover:text-indigo-400 transition-all"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        My Dashboard
      </Link>
    </div>
  );
}
