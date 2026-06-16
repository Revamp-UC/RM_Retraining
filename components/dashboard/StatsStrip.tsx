import { Trophy, Target, Flame } from 'lucide-react';
import type { ModuleStats } from '@/types/consultation';
import { formatScore } from '@/lib/utils/formatters';
import { normaliseScore, NORMALISED_MAX } from '@/lib/config/modules';

interface StatsStripProps {
  name: string;
  stats: Record<string, ModuleStats>;
}

// Best across tasks, normalised to /50 so a perfect 10/10 isn't beaten by a 40/50.
function getNormalisedBest(stats: Record<string, ModuleStats>): number | null {
  let best: number | null = null;
  for (const [moduleKey, s] of Object.entries(stats)) {
    if (s.best_score === null) continue;
    const norm = normaliseScore(s.best_score, moduleKey);
    if (best === null || norm > best) best = norm;
  }
  return best === null ? null : Math.round(best);
}

export function StatsStrip({ name, stats }: StatsStripProps) {
  const totalAttempts = Object.values(stats).reduce((sum, s) => sum + s.attempt_count, 0);
  const best = getNormalisedBest(stats);
  // Session-weighted average, each session normalised to /50 before averaging
  // (tasks have different max marks, so raw scores can't be averaged directly).
  let normSum = 0;
  let scoredSessions = 0;
  for (const [moduleKey, s] of Object.entries(stats)) {
    if (s.avg_score === null) continue;
    normSum += normaliseScore(s.avg_score, moduleKey) * s.attempt_count;
    scoredSessions += s.attempt_count;
  }
  const avgScore = scoredSessions > 0 ? Math.round((normSum / scoredSessions) * 10) / 10 : null;

  return (
    <div className="grid grid-cols-3 gap-3 mb-8">
      <div className="rounded-xl border border-[#2a2a38] bg-[#13131a] p-4 text-center">
        <div className="flex justify-center mb-2">
          <Flame className="h-5 w-5 text-orange-400" />
        </div>
        <p className="text-2xl font-bold text-[#f1f1f5]">{totalAttempts}</p>
        <p className="text-xs text-[#60607a] mt-0.5">Total Sessions</p>
      </div>
      <div className="rounded-xl border border-[#2a2a38] bg-[#13131a] p-4 text-center">
        <div className="flex justify-center mb-2">
          <Trophy className="h-5 w-5 text-amber-400" />
        </div>
        <p className="text-2xl font-bold text-[#f1f1f5]">
          {best !== null ? (
            <>
              {formatScore(best)}
              <span className="text-sm font-normal text-[#60607a]">/{NORMALISED_MAX}</span>
            </>
          ) : '—'}
        </p>
        <p className="text-xs text-[#60607a] mt-0.5">Best Score <span className="text-[#4a4a5e]">· normalised to 50</span></p>
      </div>
      <div className="rounded-xl border border-[#2a2a38] bg-[#13131a] p-4 text-center">
        <div className="flex justify-center mb-2">
          <Target className="h-5 w-5 text-indigo-400" />
        </div>
        <p className="text-2xl font-bold text-[#f1f1f5]">
          {avgScore !== null ? (
            <>
              {formatScore(avgScore)}
              <span className="text-sm font-normal text-[#60607a]">/{NORMALISED_MAX}</span>
            </>
          ) : '—'}
        </p>
        <p className="text-xs text-[#60607a] mt-0.5">Avg Score <span className="text-[#4a4a5e]">· normalised to 50</span></p>
      </div>
    </div>
  );
}
