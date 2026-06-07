'use client';

import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils/cn';
import type { SectionResult } from '@/types/consultation';

interface SectionScoreProps {
  title: string;
  result: SectionResult;
  index: number;
  icon: React.ReactNode;
}

function getLabelColor(label: string): string {
  switch (label) {
    case 'Excellent': return 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
    case 'Good': return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
    case 'Average': return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
    case 'Poor': return 'text-red-400 bg-red-500/10 border-red-500/20';
    default: return 'text-[#9090a8] bg-[#1c1c26] border-[#2a2a38]';
  }
}

function getProgressColor(pct: number): string {
  if (pct >= 80) return 'bg-emerald-500';
  if (pct >= 60) return 'bg-blue-500';
  if (pct >= 40) return 'bg-amber-500';
  return 'bg-red-500';
}

export function SectionScore({ title, result, index, icon }: SectionScoreProps) {
  const pct = Math.round((result.score / result.max_score) * 100);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-xl border border-[#2a2a38] bg-[#13131a] p-5"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-[#1c1c26] border border-[#2a2a38] flex items-center justify-center text-[#9090a8]">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-[#f1f1f5] text-sm">{title}</h3>
            <p className="text-xs text-[#60607a]">Max {result.max_score} points</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xl font-bold text-[#f1f1f5]">{result.score.toFixed(0)}</span>
          <span className="text-xs text-[#60607a]">/{result.max_score}</span>
        </div>
      </div>

      {/* Progress bar */}
      <Progress
        value={pct}
        className="mb-3 h-1.5"
        indicatorClassName={getProgressColor(pct)}
      />

      {/* Label badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className={cn('inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium', getLabelColor(result.label))}>
          {result.label}
        </span>
        <span className="text-xs text-[#60607a]">{pct}%</span>
      </div>

      {/* Strengths */}
      {result.strengths.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1.5">What you did well</p>
          <ul className="space-y-1">
            {result.strengths.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[#9090a8]">
                <span className="text-emerald-500 mt-0.5">✓</span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Missed opportunities */}
      {result.missed_opportunities.length > 0 && (
        <div className="mb-3">
          <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1.5">Missed Opportunities</p>
          <ul className="space-y-1">
            {result.missed_opportunities.map((m, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-[#9090a8]">
                <span className="text-amber-500 mt-0.5">○</span>
                <span>{m}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Coaching feedback */}
      {result.feedback && (
        <div className="rounded-lg bg-[#1c1c26] border border-[#2a2a38] px-3 py-2.5">
          <p className="text-xs text-[#9090a8] leading-relaxed italic">"{result.feedback}"</p>
        </div>
      )}
    </motion.div>
  );
}
