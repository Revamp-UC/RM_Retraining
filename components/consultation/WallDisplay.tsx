'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Ruler, X, Expand } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WallDisplayProps {
  className?: string;
  taskId?: string;
}

const TASK_CONFIG: Record<string, {
  label: string;
  image: string | null;
  dimPrimary: string;
  dimSub: string;
  sqft: string | null;
}> = {
  task_1: {
    label: 'Task 1 · Module 1',
    image: '/images/module1-task1-wall.png',
    dimPrimary: '8 Ft × 8.5 Ft',
    dimSub: '68 sq ft',
    sqft: '68 sq ft',
  },
  task_2: {
    label: 'Task 2 · Module 1',
    image: null, // photo to be added later
    dimPrimary: '9 Ft × 9 Ft',
    dimSub: '8 Ft × 9 Ft',
    sqft: null,
  },
};

export function WallDisplay({ className = '', taskId = 'task_1' }: WallDisplayProps) {
  const [expanded, setExpanded] = useState(false);
  const cfg = TASK_CONFIG[taskId] ?? TASK_CONFIG['task_1'];

  return (
    <div className={`relative w-full h-full ${className}`}>

      {/* Wall photo panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.0, ease: 'easeOut' }}
        className="absolute inset-0 bottom-[72px] rounded-xl overflow-hidden border border-[#2a2a38] bg-[#13131a] cursor-pointer"
        onClick={() => cfg.image ? setExpanded(true) : undefined}
      >
        {cfg.image ? (
          <>
            <Image
              src={cfg.image}
              alt={`Wall — ${cfg.label}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/50 via-transparent to-[#0a0a0f]/20 pointer-events-none" />
            {/* Tap to expand hint — mobile only */}
            <div className="absolute bottom-3 right-3 z-10 lg:hidden">
              <div className="flex items-center gap-1 rounded-md bg-[#0a0a0f]/80 backdrop-blur-sm border border-[#2a2a38] px-2 py-1">
                <Expand className="h-3 w-3 text-[#9090a8]" />
                <span className="text-[9px] font-medium text-[#9090a8]">Tap to expand</span>
              </div>
            </div>
          </>
        ) : (
          /* Placeholder for tasks without a photo yet */
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-[#1c1c26] border border-[#2a2a38] flex items-center justify-center">
              <span className="text-2xl">📸</span>
            </div>
            <p className="text-xs font-semibold text-[#60607a] uppercase tracking-widest">Photo Coming Soon</p>
          </div>
        )}

        {/* Live Scenario badge — top right */}
        <div className="absolute top-3 right-3 z-10">
          <div className="rounded-md bg-[#0a0a0f]/75 backdrop-blur-sm border border-amber-500/40 px-2.5 py-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Live Scenario</span>
          </div>
        </div>

        {/* Task label — top left */}
        <div className="absolute top-3 left-3 z-10">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#0a0a0f]/75 backdrop-blur-sm border border-[#2a2a38] px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-[#f1f1f5]">{cfg.label}</span>
          </div>
        </div>
      </motion.div>

      {/* Dimension bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 1.3, ease: 'easeOut' }}
        className="absolute bottom-0 left-0 right-0 h-[64px] flex items-center justify-between rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-600/15 via-[#13131a] to-[#13131a] px-5 shadow-lg shadow-indigo-900/10"
      >
        <div className="flex items-center gap-2.5">
          <Ruler className="h-5 w-5 text-indigo-400 shrink-0" />
          <span className="text-sm font-semibold text-[#9090a8] uppercase tracking-wider">Wall Dimensions</span>
        </div>

        <div className="flex items-center gap-3">
          {cfg.sqft ? (
            <>
              <span className="text-xl font-bold text-[#f1f1f5] tracking-wide">{cfg.dimPrimary}</span>
              <span className="text-xs font-semibold text-indigo-300 bg-indigo-600/15 border border-indigo-500/25 rounded-lg px-2.5 py-1">
                {cfg.sqft}
              </span>
            </>
          ) : (
            <div className="text-right">
              <span className="text-base font-bold text-[#f1f1f5] tracking-wide">{cfg.dimPrimary}</span>
              <span className="text-[#60607a] mx-2 text-sm">/</span>
              <span className="text-base font-bold text-[#f1f1f5] tracking-wide">{cfg.dimSub}</span>
            </div>
          )}
        </div>
      </motion.div>

      {/* Fullscreen lightbox — only for tasks with a photo */}
      <AnimatePresence>
        {expanded && cfg.image && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col"
            onClick={() => setExpanded(false)}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-sm font-semibold text-[#f1f1f5]">{cfg.label}</span>
              </div>
              <button
                className="rounded-full bg-white/10 p-2 active:bg-white/20"
                onClick={() => setExpanded(false)}
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="relative flex-1 min-h-0">
              <Image
                src={cfg.image}
                alt={`Wall — ${cfg.label}`}
                fill
                className="object-contain"
                priority
              />
            </div>

            <div
              className="flex items-center justify-between px-5 py-4 border-t border-white/10 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-indigo-400" />
                <span className="text-sm font-semibold text-[#9090a8] uppercase tracking-wider">Wall Dimensions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#f1f1f5]">{cfg.dimPrimary}</span>
                {cfg.sqft && (
                  <span className="text-xs font-semibold text-indigo-300 bg-indigo-600/15 border border-indigo-500/25 rounded-lg px-2 py-0.5">
                    {cfg.sqft}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
