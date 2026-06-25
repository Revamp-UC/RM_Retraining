'use client';

import { useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { Activity, ExternalLink, Users, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type { AttemptMatrix, MatrixColumn, MatrixGroup, MatrixRMRow } from '@/lib/db/admin';

const REFRESH_MS = 15_000;
const STICKY = 'sticky left-0 z-10 bg-[#13131a]';
const HEAD   = 'px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-[#60607a]';

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

// ── Shared table header (2 rows: module groups + task labels) ─────────────
function MatrixHead({
  columns, groups,
  extraCols,       // e.g. ['Done', 'Pending', 'Last'] or ['Done', 'Last']
}: {
  columns: MatrixColumn[];
  groups: MatrixGroup[];
  extraCols: string[];
}) {
  return (
    <thead>
      <tr className="border-b border-[#1a1a24]">
        <th className={`${HEAD} ${STICKY} text-left`} rowSpan={2}>Name</th>
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
        {extraCols.map((col, i) => (
          <th
            key={col}
            className={`${HEAD} text-center ${i === 0 ? 'border-l border-[#1a1a24]' : ''}`}
            rowSpan={2}
          >
            {col}
          </th>
        ))}
      </tr>
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
  );
}

// ── Shared data rows ───────────────────────────────────────────────────────
function RMBodyRows({
  rms, columns, showPending, emptyLabel,
}: {
  rms: MatrixRMRow[];
  columns: MatrixColumn[];
  showPending?: boolean;
  emptyLabel?: string;
}) {
  if (rms.length === 0) {
    return (
      <tr>
        <td
          colSpan={columns.length + (showPending ? 4 : 3)}
          className="px-5 py-10 text-center text-sm text-[#60607a]"
        >
          {emptyLabel ?? 'No data.'}
        </td>
      </tr>
    );
  }
  return (
    <>
      {rms.map(rm => (
        <tr key={rm.name} className="border-b border-[#1a1a24] hover:bg-[#16161f] transition-colors group">
          <td className={`px-3 py-2.5 whitespace-nowrap ${STICKY} group-hover:bg-[#16161f]`}>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#f1f1f5]">{rm.name}</span>
              <Link
                href={`/admin/rm/${rm.mobile_number}`}
                className="flex items-center gap-1 text-[10px] font-semibold text-indigo-400 bg-indigo-500/15 border border-indigo-500/30 rounded px-1.5 py-0.5 hover:bg-indigo-500/25 hover:border-indigo-500/50 hover:text-indigo-300 transition-all shrink-0"
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
          {showPending && (
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
          )}
          <td className="px-3 py-2.5 text-center text-xs text-[#60607a] whitespace-nowrap">
            {lastAttemptLabel(rm.lastAttempt)}
          </td>
        </tr>
      ))}
    </>
  );
}

// ── Standalone card for Other RMs / Admins ────────────────────────────────
function SubMatrix({
  label, icon, accentDot,
  rms, columns, groups,
}: {
  label: string;
  icon: ReactNode;
  accentDot: string;
  rms: MatrixRMRow[];
  columns: MatrixColumn[];
  groups: MatrixGroup[];
}) {
  if (rms.length === 0) return null;
  const total = rms.reduce((sum, rm) => sum + rm.total, 0);

  return (
    <div className="rounded-xl border border-[#1e1e28] bg-[#13131a] overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#1e1e28]">
        {icon}
        <h2 className="text-sm font-bold text-[#f1f1f5]">{label}</h2>
        <span className="ml-1 text-xs text-[#60607a]">
          ({rms.length} · at least one session attempted)
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <MatrixHead columns={columns} groups={groups} extraCols={['Done', 'Last']} />
          <tbody>
            <RMBodyRows rms={rms} columns={columns} />
          </tbody>
          <tfoot>
            <tr className="border-t border-[#1e1e28] bg-[#0f0f16]">
              <td className={`px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#60607a] ${STICKY} bg-[#0f0f16]`}>
                Total
              </td>
              {columns.map((c, i) => {
                const firstOfGroup = i === 0 || columns[i - 1].moduleNum !== c.moduleNum;
                return (
                  <td
                    key={c.key}
                    className={`px-2 py-2.5 text-center text-[11px] text-[#3a3a48] ${firstOfGroup ? 'border-l border-[#1a1a24]' : ''}`}
                  >
                    —
                  </td>
                );
              })}
              <td className="px-3 py-2.5 text-center text-[11px] font-bold text-[#9090a8] border-l border-[#1a1a24]">
                {total}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────
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

  const { columns, groups, rms, otherRMs, adminRMs, cohortSize } = matrix;
  const totalAllAttempts = rms.reduce((sum, rm) => sum + rm.total, 0);

  const doneByTask: Record<string, number> = {};
  for (const col of columns) {
    doneByTask[col.key] = rms.reduce((n, r) => n + ((r.counts[col.key] ?? 0) > 0 ? 1 : 0), 0);
  }

  return (
    <div className="space-y-4">

      {/* ── 26-RM Cohort ── */}
      <div className="rounded-xl border border-[#1e1e28] bg-[#13131a] overflow-hidden">
        <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#1e1e28]">
          <Activity className="h-4 w-4 text-emerald-400" />
          <h2 className="text-sm font-bold text-[#f1f1f5]">Practice Tracking — Cohort</h2>
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
            <MatrixHead columns={columns} groups={groups} extraCols={['Done', 'Pending', 'Last']} />
            <tbody>
              <RMBodyRows
                rms={rms}
                columns={columns}
                showPending
                emptyLabel="No cohort RMs found."
              />
            </tbody>
            {rms.length > 0 && (
              <tfoot>
                <tr className="border-t border-[#1e1e28] bg-[#0f0f16]">
                  <td className={`px-3 py-2.5 text-[10px] font-bold uppercase tracking-wider text-[#60607a] ${STICKY} bg-[#0f0f16]`}>
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

      {/* ── Other RMs (non-cohort, non-admin, ≥1 attempt) ── */}
      <SubMatrix
        label="Other RMs"
        icon={<Users className="h-4 w-4 text-sky-400" />}
        accentDot="bg-sky-400"
        rms={otherRMs}
        columns={columns}
        groups={groups}
      />

      {/* ── Admins (≥1 attempt) ── */}
      <SubMatrix
        label="Admins"
        icon={<ShieldCheck className="h-4 w-4 text-violet-400" />}
        accentDot="bg-violet-400"
        rms={adminRMs}
        columns={columns}
        groups={groups}
      />

    </div>
  );
}
