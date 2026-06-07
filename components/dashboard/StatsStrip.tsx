import { Trophy, Target, Flame } from 'lucide-react';
import type { ModuleStats } from '@/types/consultation';
import { formatScore } from '@/lib/utils/formatters';

interface StatsStripProps {
  name: string;
  stats: Record<string, ModuleStats>;
}

export function StatsStrip({ name, stats }: StatsStripProps) {
  const totalAttempts = Object.values(stats).reduce((sum, s) => sum + s.attempt_count, 0);
  const allScores = Object.values(stats).flatMap((s) =>
    s.last_score !== null ? [s.last_score] : [],
  );
  const bestScore = allScores.length > 0 ? Math.max(...allScores) : null;
  const avgScore =
    allScores.length > 0 ? allScores.reduce((a, b) => a + b, 0) / allScores.length : null;

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
          {bestScore !== null ? `${formatScore(bestScore)}` : '—'}
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
