'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, ChevronRight, Medal, ChevronDown, ChevronUp } from 'lucide-react';

interface RM {
  mobile_number: string;
  name: string;
  attempt_count: number;
  best_score: number | null;
  avg_score: number | null;
  last_module_attempted: string | null;
}

const MODULE_TASK_LABEL: Record<string, string> = {
  module_1_seepage: 'M1 · T1',
  module_1_task2:   'M1 · T2',
  module_1_task3:   'M1 · T3',
};

function toTaskLabel(m: string | null) {
  if (!m) return '';
  return MODULE_TASK_LABEL[m] ?? m;
}

function ScoreChip({ score }: { score: number | null }) {
  if (score === null) return <span className="text-xs font-medium text-[#60607a]">—</span>;
  const cls = score >= 36
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

const medalColors = ['text-amber-400', 'text-[#b0b0c8]', 'text-amber-600'];

export function TopPerformers({ performers }: { performers: RM[] }) {
  const [expanded, setExpanded] = useState(false);

  const first5 = performers.slice(0, 5);
  const next5 = performers.slice(5, 10);
  const hasMore = next5.length > 0;

  return (
    <div className="rounded-xl border border-[#1e1e28] bg-[#13131a] overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#1e1e28]">
        <Trophy className="h-4 w-4 text-amber-400" />
        <h2 className="text-sm font-bold text-[#f1f1f5]">Top Performers</h2>
        <span className="text-[10px] font-medium text-[#60607a] bg-[#1c1c26] border border-[#2a2a38] rounded-full px-2 py-0.5">
          Only RMs
        </span>
        {performers.length > 0 && (
          <span className="ml-auto text-xs text-[#60607a]">by best score</span>
        )}
      </div>

      {performers.length === 0 ? (
        <div className="px-5 py-8 text-center text-xs text-[#60607a]">
          No consultations completed yet.
        </div>
      ) : (
        <>
          <ul className="divide-y divide-[#1a1a24]">
            {first5.map((rm, i) => (
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
                      {rm.last_module_attempted ? ` · ${toTaskLabel(rm.last_module_attempted)}` : ''}
                    </p>
                  </div>
                  <ScoreChip score={rm.best_score} />
                  <ChevronRight className="h-3.5 w-3.5 text-[#2a2a38] group-hover:text-[#60607a] transition-colors" />
                </Link>
              </li>
            ))}
          </ul>

          {/* Next 5 — collapsible */}
          {hasMore && (
            <>
              {expanded && (
                <ul className="divide-y divide-[#1a1a24] border-t border-[#1a1a24]">
                  {next5.map((rm, i) => (
                    <li key={rm.mobile_number}>
                      <Link
                        href={`/admin/rm/${rm.mobile_number}`}
                        className="flex items-center gap-3 px-5 py-3.5 hover:bg-[#16161f] transition-colors group"
                      >
                        <span className="w-5 text-sm font-bold text-[#60607a]">
                          #{i + 6}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#f1f1f5] truncate">{rm.name}</p>
                          <p className="text-xs text-[#60607a]">
                            {rm.attempt_count} attempt{rm.attempt_count !== 1 ? 's' : ''}
                            {rm.avg_score !== null ? ` · avg ${rm.avg_score}` : ''}
                            {rm.last_module_attempted ? ` · ${toTaskLabel(rm.last_module_attempted)}` : ''}
                          </p>
                        </div>
                        <ScoreChip score={rm.best_score} />
                        <ChevronRight className="h-3.5 w-3.5 text-[#2a2a38] group-hover:text-[#60607a] transition-colors" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => setExpanded(o => !o)}
                className="w-full flex items-center justify-center gap-1.5 py-3 text-xs font-medium text-[#60607a] hover:text-indigo-400 border-t border-[#1a1a24] transition-colors"
              >
                {expanded ? (
                  <><ChevronUp className="h-3.5 w-3.5" /> Show less</>
                ) : (
                  <><ChevronDown className="h-3.5 w-3.5" /> Show {next5.length} more</>
                )}
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
}
