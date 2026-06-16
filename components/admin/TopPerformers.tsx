'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Trophy, ChevronRight, ChevronDown, ChevronUp } from 'lucide-react';

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
  module_2_task1:   'M2 · T1',
  module_3_task1:   'M3 · T1',
  module_3_task2:   'M3 · T2',
  module_3_task3:   'M3 · T3',
  module_4_task1:   'M4 · T1',
};

function toTaskLabel(m: string | null) {
  if (!m) return '';
  return MODULE_TASK_LABEL[m] ?? m;
}

const RANK_CONFIG = [
  {
    bg: 'bg-gradient-to-r from-amber-500/15 via-amber-500/8 to-transparent',
    border: 'border-amber-500/25',
    rankColor: 'text-amber-400',
    rankBg: 'bg-amber-500/15 border-amber-400/30',
    emoji: '🥇',
    scoreColor: 'text-amber-400',
    scoreBg: 'bg-amber-500/15 border-amber-400/30',
  },
  {
    bg: 'bg-gradient-to-r from-slate-400/10 via-slate-400/5 to-transparent',
    border: 'border-slate-400/20',
    rankColor: 'text-slate-300',
    rankBg: 'bg-slate-400/10 border-slate-400/25',
    emoji: '🥈',
    scoreColor: 'text-slate-300',
    scoreBg: 'bg-slate-400/10 border-slate-400/25',
  },
  {
    bg: 'bg-gradient-to-r from-orange-600/12 via-orange-600/6 to-transparent',
    border: 'border-orange-500/20',
    rankColor: 'text-orange-400',
    rankBg: 'bg-orange-500/12 border-orange-500/25',
    emoji: '🥉',
    scoreColor: 'text-orange-400',
    scoreBg: 'bg-orange-500/12 border-orange-500/25',
  },
];

function scoreColor(score: number | null) {
  if (score === null) return 'text-[#60607a]';
  if (score >= 36) return 'text-green-400';
  if (score >= 27) return 'text-amber-400';
  return 'text-red-400';
}

function scoreBg(score: number | null) {
  if (score === null) return '';
  if (score >= 36) return 'bg-green-500/10 border-green-500/25';
  if (score >= 27) return 'bg-amber-500/10 border-amber-500/25';
  return 'bg-red-500/10 border-red-500/25';
}

export function TopPerformers({ performers }: { performers: RM[] }) {
  const [expanded, setExpanded] = useState(false);

  const first5 = performers.slice(0, 5);
  const next5 = performers.slice(5, 10);
  const hasMore = next5.length > 0;

  return (
    <div className="rounded-xl border border-[#1e1e28] bg-[#13131a] overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#1e1e28] bg-gradient-to-r from-amber-500/5 to-transparent">
        <Trophy className="h-4 w-4 text-amber-400" />
        <h2 className="text-sm font-bold text-[#f1f1f5]">Top Performers</h2>
        <span className="text-[10px] font-semibold text-[#60607a] bg-[#1c1c26] border border-[#2a2a38] rounded-full px-2 py-0.5">
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
            {first5.map((rm, i) => {
              const cfg = RANK_CONFIG[i];
              const isTop3 = i < 3;

              return (
                <li key={rm.mobile_number}>
                  <Link
                    href={`/admin/rm/${rm.mobile_number}`}
                    className={`flex items-center gap-3.5 px-5 py-3.5 transition-all group ${
                      isTop3 ? `${cfg.bg} hover:brightness-110` : 'hover:bg-[#16161f]'
                    }`}
                  >
                    {/* Rank badge */}
                    {isTop3 ? (
                      <div className={`w-8 h-8 rounded-lg border flex items-center justify-center text-base shrink-0 ${cfg.rankBg}`}>
                        {cfg.emoji}
                      </div>
                    ) : (
                      <div className="w-8 h-8 rounded-lg border border-[#2a2a38] bg-[#1c1c26] flex items-center justify-center shrink-0">
                        <span className="text-[11px] font-bold text-[#60607a]">#{i + 1}</span>
                      </div>
                    )}

                    {/* Name + meta */}
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-bold truncate ${isTop3 ? 'text-[#f1f1f5]' : 'text-[#d4d4e8]'}`}>
                        {rm.name}
                      </p>
                      <p className="text-xs text-[#60607a] mt-0.5">
                        {rm.attempt_count} attempt{rm.attempt_count !== 1 ? 's' : ''}
                        {rm.avg_score !== null ? <span className="text-[#9090a8]"> · avg <span className={scoreColor(rm.avg_score)}>{rm.avg_score}</span></span> : ''}
                        {rm.last_module_attempted ? ` · ${toTaskLabel(rm.last_module_attempted)}` : ''}
                      </p>
                    </div>

                    {/* Score */}
                    {rm.best_score !== null && (
                      <div className={`rounded-xl border px-3 py-1 shrink-0 ${
                        isTop3 ? `${cfg.scoreBg}` : scoreBg(rm.best_score)
                      }`}>
                        <span className={`text-base font-bold ${isTop3 ? cfg.scoreColor : scoreColor(rm.best_score)}`}>
                          {rm.best_score}
                        </span>
                      </div>
                    )}

                    <ChevronRight className="h-3.5 w-3.5 text-[#2a2a38] group-hover:text-[#60607a] transition-colors shrink-0" />
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Next 5 */}
          {hasMore && (
            <>
              {expanded && (
                <ul className="divide-y divide-[#1a1a24] border-t border-[#1a1a24]">
                  {next5.map((rm, i) => (
                    <li key={rm.mobile_number}>
                      <Link
                        href={`/admin/rm/${rm.mobile_number}`}
                        className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-[#16161f] transition-colors group"
                      >
                        <div className="w-8 h-8 rounded-lg border border-[#2a2a38] bg-[#1c1c26] flex items-center justify-center shrink-0">
                          <span className="text-[11px] font-bold text-[#60607a]">#{i + 6}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-[#d4d4e8] truncate">{rm.name}</p>
                          <p className="text-xs text-[#60607a] mt-0.5">
                            {rm.attempt_count} attempt{rm.attempt_count !== 1 ? 's' : ''}
                            {rm.avg_score !== null ? ` · avg ${rm.avg_score}` : ''}
                            {rm.last_module_attempted ? ` · ${toTaskLabel(rm.last_module_attempted)}` : ''}
                          </p>
                        </div>
                        {rm.best_score !== null && (
                          <div className={`rounded-xl border px-3 py-1 shrink-0 ${scoreBg(rm.best_score)}`}>
                            <span className={`text-base font-bold ${scoreColor(rm.best_score)}`}>{rm.best_score}</span>
                          </div>
                        )}
                        <ChevronRight className="h-3.5 w-3.5 text-[#2a2a38] group-hover:text-[#60607a] transition-colors shrink-0" />
                      </Link>
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => setExpanded(o => !o)}
                className="w-full flex items-center justify-center gap-1.5 py-3 text-xs font-semibold text-[#60607a] hover:text-indigo-400 border-t border-[#1a1a24] transition-colors"
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
