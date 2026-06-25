'use client';

import { useEffect, useRef, useState } from 'react';
import { Activity, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import type { AttemptMatrix } from '@/lib/db/admin';

const REFRESH_MS = 15_000;

function relativeTime(fromMs: number, nowMs: number): string {
  const s = Math.max(0, Math.round((nowMs - fromMs) / 1000));
  if (s < 5) return 'just now';
  if (s < 60) return `${s}s ago`;
  const m = Math.round(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  return `${h}h ago`;
}

function lastAttemptLabel(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

export function RMTrackingMatrix({ initial }: { initial: AttemptMatrix }) {
  const [matrix, setMatrix] = useState<AttemptMatrix>(initial);
  const [updatedAt, setUpdatedAt] = useState<number>(() => Date.now());
  const [now, setNow] = useState<number>(() => Date.now());
  const [stale, setStale] = useState(false);
  const fetching = useRef(false);

  useEffect(() => {
    async function refresh() {
      if (fetching.current) return;
      fetching.current = true;
      try {
        const res = await fetch('/api/admin/attempt-matrix', { cache: 'no-store' });
        if (!res.ok) throw new Error(String(res.status));
        const data: AttemptMatrix = await res.json();
        setMatrix(data);
        setUpdatedAt(Date.now());
        setStale(false);
      } catch {
        setStale(true);
      } finally {
        fetching.current = false;
      }
    }

    const poll = setInterval(refresh, REFRESH_MS);
    const tick = setInterval(() => setNow(Date.now()), 1_000);
    const onVisible = () => { if (document.visibilityState === 'visible') refresh(); };
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      clearInterval(poll);
      clearInterval(tick);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, []);

  const { columns, groups, rms, cohortSize } = matrix;
  const totalAllAttempts = rms.reduce((sum, rm) => sum + rm.total, 0);
  // How many of the cohort have attempted each task at least once (for the footer).
  const doneByTask: Record<string, number> = {};
  for (const col of columns) {
    doneByTask[col.key] = rms.reduce((n, r) => n + ((r.counts[col.key] ?? 0) > 0 ? 1 : 0), 0);
  }

  const headCell = 'px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#60607a]';
  const stickyName = 'sticky left-0 z-10 bg-[#13131a]';

  return (
    <div className="rounded-xl border border-[#1e1e28] bg-[#13131a] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#1e1e28]">
        <Activity className="h-4 w-4 text-emerald-400" />
        <h2 className="text-sm font-bold text-[#f1f1f5]">Practice Tracking</h2>
        <span className="ml-1 text-xs text-[#60607a]">
          ({cohortSize} RMs · attempts per task · auto-refreshing)
        </span>
        <span className="ml-auto flex items-center gap-1.5 text-[11px] text-[#60607a]">
          <span className="relative flex h-2 w-2">
            {!stale && (
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70" />
            )}
            <span className={`relative inline-flex h-2 w-2 rounded-full ${stale ? 'bg-amber-400' : 'bg-emerald-400'}`} />
          </span>
          {stale ? 'reconnecting…' : `Live · updated ${relativeTime(updatedAt, now)}`}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {/* Module group row */}
            <tr className="border-b border-[#1a1a24]">
              <th className={`${headCell} ${stickyName} text-left`} rowSpan={2}>Name</th>
              {groups.map(g => (
                <th
                  key={g.num}
                  colSpan={g.colKeys.length}
                  className="px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#9090a8] text-center border-l border-[#1a1a24]"
                  title={g.title}
                >
                  M{g.num}
                </th>
              ))}
              <th className={`${headCell} text-center border-l border-[#1a1a24]`} rowSpan={2}>Done</th>
              <th className={`${headCell} text-center`} rowSpan={2}>Pending</th>
              <th className={`${headCell} text-center`} rowSpan={2}>Last</th>
            </tr>
            {/* Task label row */}
            <tr className="border-b border-[#1a1a24]">
              {columns.map((c, i) => {
                const firstOfGroup = i === 0 || columns[i - 1].moduleNum !== c.moduleNum;
                return (
                  <th
                    key={c.key}
                    className={`px-2 py-1.5 text-[10px] font-semibold text-[#60607a] text-center ${firstOfGroup ? 'border-l border-[#1a1a24]' : ''}`}
                    title={c.title}
                  >
                    {c.label}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {rms.map(rm => (
              <tr key={rm.name} className="border-b border-[#1a1a24] hover:bg-[#16161f] transition-colors group">
                <td className={`px-3 py-2.5 whitespace-nowrap ${stickyName} group-hover:bg-[#16161f]`}>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#f1f1f5]">{rm.name}</span>
                    <Link
                      href={`/admin/rm/${rm.mobile_number}`}
                      className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 rounded px-1.5 py-0.5 hover:bg-indigo-500/20 shrink-0"
                      title={`View all reports for ${rm.name}`}
                    >
                      <ExternalLink className="h-2.5 w-2.5" />
                      View
                    </Link>
                  </div>
                </td>
                {columns.map((c, i) => {
                  const firstOfGroup = i === 0 || columns[i - 1].moduleNum !== c.moduleNum;
                  const n = rm.counts[c.key] ?? 0;
                  return (
                    <td
                      key={c.key}
                      className={`px-2 py-2.5 text-center ${firstOfGroup ? 'border-l border-[#1a1a24]' : ''}`}
                      title={`${c.title} — ${n} attempt${n === 1 ? '' : 's'}`}
                    >
                      {n > 0 ? (
                        <span className="inline-flex min-w-[20px] items-center justify-center rounded-md bg-emerald-500/12 px-1.5 py-0.5 text-xs font-bold text-emerald-300">
                          {n}
                        </span>
                      ) : (
                        <span className="text-sm text-[#3a3a48]">·</span>
                      )}
                    </td>
                  );
                })}
                <td className="px-3 py-2.5 text-center text-sm font-bold text-[#9090a8] border-l border-[#1a1a24]">
                  {rm.total}
                </td>
                <td className="px-3 py-2.5 text-center">
                  {rm.pending > 0 ? (
                    <span className="inline-flex min-w-[20px] items-center justify-center rounded-md bg-amber-500/12 px-1.5 py-0.5 text-xs font-bold text-amber-400">
                      {rm.pending}
                    </span>
                  ) : (
                    <span className="inline-flex items-center justify-center rounded-md bg-emerald-500/12 px-1.5 py-0.5 text-[10px] font-bold text-emerald-300">
                      ALL
                    </span>
                  )}
                </td>
                <td className="px-3 py-2.5 text-center text-xs text-[#60607a] whitespace-nowrap">
                  {lastAttemptLabel(rm.lastAttempt)}
                </td>
              </tr>
            ))}
            {rms.length === 0 && (
              <tr>
                <td colSpan={columns.length + 4} className="px-5 py-10 text-center text-sm text-[#60607a]">
                  No cohort RMs found.
                </td>
              </tr>
            )}
          </tbody>

          {rms.length > 0 && (
            <tfoot>
              <tr className="border-t border-[#1e1e28] bg-[#0f0f16]">
                <td className={`px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#60607a] ${stickyName} bg-[#0f0f16]`}>
                  Attempted
                </td>
                {columns.map((c, i) => {
                  const firstOfGroup = i === 0 || columns[i - 1].moduleNum !== c.moduleNum;
                  const done = doneByTask[c.key];
                  return (
                    <td
                      key={c.key}
                      className={`px-2 py-2.5 text-center text-[11px] font-semibold ${done === 0 ? 'text-[#60607a]' : 'text-[#9090a8]'} ${firstOfGroup ? 'border-l border-[#1a1a24]' : ''}`}
                    >
                      {done}/{cohortSize}
                    </td>
                  );
                })}
                <td className="px-3 py-2.5 text-center text-[11px] font-bold text-[#9090a8] border-l border-[#1a1a24]">
                  {totalAllAttempts}
                </td>
                <td />
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}
