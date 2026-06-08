'use client';

import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { Lock, ChevronRight, Trophy, Calendar, RotateCcw, Target } from 'lucide-react';
import { formatScore, formatDate } from '@/lib/utils/formatters';
import type { ModuleStats } from '@/types/consultation';

interface ModuleCardProps {
  id: string;
  number: number;
  name?: string;
  task?: string;
  isActive: boolean;
  stats?: ModuleStats;
  index: number;
}

export function ModuleCard({ id, number, task, isActive, stats, index }: ModuleCardProps) {
  const router = useRouter();

  function handleClick() {
    if (isActive) router.push(`/module/${id}`);
  }

  /* ── Coming Soon card ── */
  if (!isActive) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.06, duration: 0.35, ease: 'easeOut' }}
        className="relative rounded-xl border border-[#1e1e28] bg-[#0f0f16] px-6 py-5 flex items-center gap-4 opacity-50"
      >
        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#1c1c26] shrink-0">
          <Lock className="h-4 w-4 text-[#60607a]" />
        </div>
        <h3 className="flex-1 text-base font-bold text-[#9090a8]">Module {number}</h3>
        <span className="shrink-0 text-[11px] font-semibold text-[#60607a] bg-[#1c1c26] border border-[#2a2a38] rounded-full px-3 py-1">
          Coming Soon
        </span>
      </motion.div>
    );
  }

  /* ── Active card ── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: 'easeOut' }}
      onClick={handleClick}
      className="relative rounded-2xl border border-indigo-500/40 bg-gradient-to-br from-[#13131a] to-[#1a1a28] cursor-pointer hover:border-indigo-500/70 hover:shadow-xl hover:shadow-indigo-900/25 active:scale-[0.99] transition-all duration-200 overflow-hidden p-6"
    >
      <div aria-hidden className="absolute inset-0 bg-gradient-to-br from-indigo-600/5 to-purple-600/5 pointer-events-none" />

      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold text-xl shadow-lg shadow-indigo-900/40 shrink-0">
              {number}
            </div>
            <h3 className="text-xl font-bold text-[#f1f1f5]">Module {number}</h3>
          </div>
          <ChevronRight className="h-5 w-5 text-[#60607a] shrink-0" />
        </div>

        {/* Task badge */}
        {task && (
          <div className="flex items-start gap-2.5 bg-indigo-600/10 border border-indigo-500/20 rounded-xl px-4 py-3 mb-5">
            <Target className="h-4 w-4 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-0.5">Task</p>
              <p className="text-sm font-medium text-[#f1f1f5]">{task}</p>
            </div>
          </div>
        )}

        {/* Stats */}
        {stats && stats.attempt_count > 0 ? (
          <div className="pt-4 border-t border-[#2a2a38] flex items-center gap-5 flex-wrap">
            <div className="flex items-center gap-1.5">
              <RotateCcw className="h-3.5 w-3.5 text-[#9090a8]" />
              <span className="text-xs text-[#9090a8]">
                <span className="text-[#f1f1f5] font-semibold">{stats.attempt_count}</span> attempt{stats.attempt_count !== 1 ? 's' : ''}
              </span>
            </div>
            {stats.last_score !== null && (
              <div className="flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-amber-400" />
                <span className="text-xs text-[#9090a8]">
                  Last: <span className="text-amber-400 font-semibold">{formatScore(stats.last_score)}</span>
                </span>
              </div>
            )}
            {stats.last_attempt_date && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 text-[#9090a8]" />
                <span className="text-xs text-[#9090a8]">{formatDate(stats.last_attempt_date)}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="pt-4 border-t border-[#2a2a38]">
            <p className="text-xs text-[#60607a]">No attempts yet — tap to start your first session</p>
          </div>
        )}
      </div>
    </motion.div>
  );
}
