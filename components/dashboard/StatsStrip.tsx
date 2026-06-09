import { Trophy, Target, Flame } from 'lucide-react';
import type { ModuleStats } from '@/types/consultation';
import { formatScore } from '@/lib/utils/formatters';

interface StatsStripProps {
  name: string;
  stats: Record<string, ModuleStats>;
}

function getBestWithMax(stats: Record<string, ModuleStats>): { score: number; max: number | null } | null {
  let best: { score: number; max: number | null } | null = null;
  for (const s of Object.values(stats)) {
    if (s.best_score !== null && (best === null || s.best_score > best.score)) {
      best = { score: s.best_score, max: s.best_max_score };
    }
  }
  return best;
}

export function StatsStrip({ name, stats }: StatsStripProps) {
  const totalAttempts = Object.values(stats).reduce((sum, s) => sum + s.attempt_count, 0);
  const best = getBestWithMax(stats);
  const avgScore = Object.values(stats).reduce((avg, s) => {
    if (s.avg_score === null) return avg;
    return avg === null ? s.avg_score : Math.round(((avg + s.avg_score) / 2) * 10) / 10;
  }, null as number | null);

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
              {formatScore(best.score)}
              {best.max !== null && (
                <span className="text-sm font-normal text-[#60607a]">/{best.max}</span>
              )}
            </>
          ) : '—'}
        </p>
        <p className="text-xs text-[#60607a] mt-0.5">Best Score</p>
      </div>
      <div className="rounded-xl border border-[#2a2a38] bg-[#13131a] p-4 text-center">
        <div className="flex justify-center mb-2">
          <Target className="h-5 w-5 text-indigo-400" />
        </div>
        <p className="text-2xl font-bold text-[#f1f1f5]">
          {avgScore !== null ? `${formatScore(avgScore)}` : '—'}
        </p>
        <p className="text-xs text-[#60607a] mt-0.5">Avg Score</p>
      </div>
    </div>
  );
}
