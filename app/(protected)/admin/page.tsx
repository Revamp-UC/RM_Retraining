import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { validateSession } from '@/lib/auth/session';
import { getAllRMPerformance } from '@/lib/db/admin';
import { LayoutDashboard, Trophy, AlertTriangle, Users, BarChart3, ChevronRight, Medal } from 'lucide-react';
import type { RMPerformance } from '@/lib/db/admin';

export const dynamic = 'force-dynamic';

const ADMIN_MOBILES = new Set(['7880320915', '9871531279', '9873696654']);

function ScoreChip({ score }: { score: number | null }) {
  if (score === null)
    return <span className="text-xs font-medium text-[#60607a]">—</span>;
  const cls =
    score >= 36
      ? 'bg-green-500/12 border-green-500/30 text-green-400'
      : score >= 27
        ? 'bg-amber-500/12 border-amber-500/30 text-amber-400'
        : 'bg-red-500/12 border-red-500/30 text-red-400';
  return (
    <span className={`inline-block rounded-lg border px-2 py-0.5 text-xs font-bold ${cls}`}>
      {score}
    </span>
  );
}

function StatCard({
  label,
  value,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="rounded-xl border border-[#1e1e28] bg-[#13131a] px-5 py-4">
      <p className="text-xs font-semibold text-[#60607a] uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-2xl font-bold ${accent ?? 'text-[#f1f1f5]'}`}>{value}</p>
      {sub && <p className="text-xs text-[#60607a] mt-0.5">{sub}</p>}
    </div>
  );
}

function RMTableRow({ rm, rank }: { rm: RMPerformance; rank: number }) {
  const mobile = rm.mobile_number;
  const maskedMobile = mobile.slice(0, 5) + 'XXXXX';
  const formattedDate = rm.last_attempt_date
    ? new Date(rm.last_attempt_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
    : '—';

  return (
    <tr className="border-b border-[#1a1a24] hover:bg-[#13131a]/80 transition-colors group">
      <td className="px-4 py-3 text-sm text-[#60607a] font-medium">{rank}</td>
      <td className="px-4 py-3">
        <p className="text-sm font-semibold text-[#f1f1f5] leading-tight">{rm.name}</p>
        <p className="text-xs text-[#60607a]">{maskedMobile}</p>
      </td>
      <td className="px-4 py-3 text-sm text-[#9090a8]">{rm.attempt_count}</td>
      <td className="px-4 py-3">
        <ScoreChip score={rm.best_score} />
      </td>
      <td className="px-4 py-3">
        <ScoreChip score={rm.avg_score} />
      </td>
      <td className="px-4 py-3 text-xs text-[#60607a]">{formattedDate}</td>
      <td className="px-4 py-3">
        {rm.attempt_count > 0 && (
          <Link
            href={`/admin/rm/${mobile}`}
            className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors opacity-0 group-hover:opacity-100"
          >
            View <ChevronRight className="h-3 w-3" />
          </Link>
        )}
      </td>
    </tr>
  );
}

export default async function AdminPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('rm_session')?.value;
  const user = token ? await validateSession(token) : null;

  if (!user || !ADMIN_MOBILES.has(user.mobile_number)) {
    redirect('/dashboard');
  }

  const allRM = await getAllRMPerformance();

  const attempted = allRM
    .filter(rm => rm.attempt_count > 0)
    .sort((a, b) => (b.best_score ?? -1) - (a.best_score ?? -1));

  const notAttempted = allRM.filter(rm => rm.attempt_count === 0);
  const topPerformers = attempted.slice(0, 5);
  const needsAttention = attempted.filter(rm => (rm.best_score ?? 100) < 27);

  const totalAttempts = allRM.reduce((sum, rm) => sum + rm.attempt_count, 0);
  const avgScores = attempted
    .map(rm => rm.avg_score)
    .filter((s): s is number => s !== null);
  const overallAvg =
    avgScores.length > 0
      ? Math.round(avgScores.reduce((a, b) => a + b, 0) / avgScores.length)
      : null;

  const allSorted = [...allRM].sort((a, b) => (b.best_score ?? -1) - (a.best_score ?? -1));

  const medalColors = ['text-amber-400', 'text-[#b0b0c8]', 'text-amber-600'];

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
            className="flex items-center gap-1.5 text-xs text-[#60607a] hover:text-[#9090a8] transition-colors"
          >
            <LayoutDashboard className="h-3.5 w-3.5" />
            Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-8">

        {/* ── Stats strip ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard label="Total RMs" value={allRM.length} sub="in the programme" />
          <StatCard
            label="Attempted"
            value={attempted.length}
            sub={`${notAttempted.length} not started`}
            accent="text-indigo-400"
          />
          <StatCard
            label="Total Sessions"
            value={totalAttempts}
            sub="completed consultations"
          />
          <StatCard
            label="Overall Avg"
            value={overallAvg !== null ? overallAvg : '—'}
            sub="across all RMs"
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

        {/* ── Top Performers + Needs Attention ── */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* Top Performers */}
          <div className="rounded-xl border border-[#1e1e28] bg-[#13131a] overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#1e1e28]">
              <Trophy className="h-4 w-4 text-amber-400" />
              <h2 className="text-sm font-bold text-[#f1f1f5]">Top Performers</h2>
              {topPerformers.length > 0 && (
                <span className="ml-auto text-xs text-[#60607a]">by best score</span>
              )}
            </div>
            {topPerformers.length === 0 ? (
              <div className="px-5 py-8 text-center text-xs text-[#60607a]">
                No consultations completed yet.
              </div>
            ) : (
              <ul className="divide-y divide-[#1a1a24]">
                {topPerformers.map((rm, i) => (
                  <li key={rm.mobile_number}>
                    <Link
                      href={`/admin/rm/${rm.mobile_number}`}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#16161f] transition-colors group"
                    >
                      <span className={`w-5 text-sm font-bold ${medalColors[i] ?? 'text-[#60607a]'}`}>
                        {i < 3 ? <Medal className="h-4 w-4" /> : `#${i + 1}`}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#f1f1f5] truncate">{rm.name}</p>
                        <p className="text-xs text-[#60607a]">
                          {rm.attempt_count} attempt{rm.attempt_count !== 1 ? 's' : ''}
                          {rm.avg_score !== null ? ` · avg ${rm.avg_score}` : ''}
                        </p>
                      </div>
                      <ScoreChip score={rm.best_score} />
                      <ChevronRight className="h-3.5 w-3.5 text-[#2a2a38] group-hover:text-[#60607a] transition-colors" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Needs Attention */}
          <div className="rounded-xl border border-[#1e1e28] bg-[#13131a] overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#1e1e28]">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <h2 className="text-sm font-bold text-[#f1f1f5]">Needs Practice</h2>
              {needsAttention.length > 0 && (
                <span className="ml-auto text-xs text-red-400/60">best score &lt; 27</span>
              )}
            </div>
            {needsAttention.length === 0 ? (
              <div className="px-5 py-8 text-center text-xs text-[#60607a]">
                {attempted.length === 0
                  ? 'No consultations yet.'
                  : 'No RMs below threshold. Great work!'}
              </div>
            ) : (
              <ul className="divide-y divide-[#1a1a24]">
                {needsAttention.map(rm => (
                  <li key={rm.mobile_number}>
                    <Link
                      href={`/admin/rm/${rm.mobile_number}`}
                      className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#16161f] transition-colors group"
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#f1f1f5] truncate">{rm.name}</p>
                        <p className="text-xs text-[#60607a]">
                          {rm.attempt_count} attempt{rm.attempt_count !== 1 ? 's' : ''}
                        </p>
                      </div>
                      <ScoreChip score={rm.best_score} />
                      <ChevronRight className="h-3.5 w-3.5 text-[#2a2a38] group-hover:text-[#60607a] transition-colors" />
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* ── Not Started ── */}
        {notAttempted.length > 0 && (
          <div className="rounded-xl border border-[#1e1e28] bg-[#13131a] overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#1e1e28]">
              <Users className="h-4 w-4 text-[#60607a]" />
              <h2 className="text-sm font-bold text-[#f1f1f5]">Not Started</h2>
              <span className="ml-1 text-xs text-[#60607a]">({notAttempted.length} RMs)</span>
            </div>
            <div className="px-5 py-4 flex flex-wrap gap-2">
              {notAttempted.map(rm => (
                <span
                  key={rm.mobile_number}
                  className="rounded-lg bg-[#0f0f16] border border-[#1e1e28] px-3 py-1.5 text-xs text-[#60607a]"
                >
                  {rm.name}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ── All RMs table ── */}
        <div className="rounded-xl border border-[#1e1e28] bg-[#13131a] overflow-hidden">
          <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#1e1e28]">
            <BarChart3 className="h-4 w-4 text-indigo-400" />
            <h2 className="text-sm font-bold text-[#f1f1f5]">All RMs</h2>
            <span className="ml-1 text-xs text-[#60607a]">({allRM.length} total · sorted by best score)</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-[#1a1a24]">
                  {['#', 'Name', 'Attempts', 'Best', 'Avg', 'Last Session', ''].map(h => (
                    <th
                      key={h}
                      className="px-4 py-3 text-[10px] font-bold text-[#60607a] uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {allSorted.map((rm, i) => (
                  <RMTableRow key={rm.mobile_number} rm={rm} rank={i + 1} />
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>

      {/* Floating back button — always visible regardless of scroll */}
      <Link
        href="/dashboard"
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full border border-[#2a2a38] bg-[#13131a]/90 backdrop-blur px-4 py-2.5 text-xs font-semibold text-[#9090a8] shadow-lg hover:border-indigo-500/40 hover:text-indigo-400 transition-all"
      >
        <LayoutDashboard className="h-3.5 w-3.5" />
        Dashboard
      </Link>
    </div>
  );
}
