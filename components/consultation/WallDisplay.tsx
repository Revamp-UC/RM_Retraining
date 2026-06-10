'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Ruler, X, Expand, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WallImage {
  src: string;
  dim: string;
  sqft?: string;
  wallLabel?: string;
}

interface TaskConfig {
  label: string;
  walls: WallImage[] | null;
}

const TASK_CONFIG: Record<string, TaskConfig> = {
  task_1: {
    label: 'Task 1 · Module 1',
    walls: [{ src: '/images/module1-task1-wall.png', dim: '8 Ft × 8.5 Ft', sqft: '68 sq ft' }],
  },
  task_2: {
    label: 'Task 2 · Module 1',
    walls: [
      { src: '/images/module1-task2-wall1.png', dim: '9 Ft × 9 Ft', wallLabel: 'Wall 1' },
      { src: '/images/module1-task2-wall2.png', dim: '8 Ft × 9 Ft', wallLabel: 'Wall 2' },
    ],
  },
  task_3: {
    label: 'Task 3 · Module 1',
    walls: [{ src: '/images/module1-task3-wall.png', dim: '9 Ft × 11 Ft', sqft: '99 sq ft' }],
  },
};

interface WallDisplayProps {
  className?: string;
  taskId?: string;
}

export function WallDisplay({ className = '', taskId = 'task_1' }: WallDisplayProps) {
  const [expanded, setExpanded] = useState(false);
  const [wallIndex, setWallIndex] = useState(0);
  const [slideDir, setSlideDir] = useState(1);

  const cfg = TASK_CONFIG[taskId] ?? TASK_CONFIG['task_1'];
  const walls = cfg.walls;
  const isMultiWall = !!(walls && walls.length > 1);

  const currentWall = walls?.[wallIndex] ?? null;

  function goNext() {
    setSlideDir(1);
    setWallIndex(i => i + 1);
  }

  function goPrev() {
    setSlideDir(-1);
    setWallIndex(i => i - 1);
  }

  function goTo(i: number) {
    setSlideDir(i > wallIndex ? 1 : -1);
    setWallIndex(i);
  }

  return (
    <div className={`relative w-full h-full ${className}`}>

      {/* Wall photo panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.0, ease: 'easeOut' }}
        className={`absolute inset-0 bottom-[72px] rounded-xl overflow-hidden border border-[#2a2a38] bg-[#13131a] ${walls ? 'cursor-pointer' : ''}`}
        onClick={() => walls ? setExpanded(true) : undefined}
      >
        {walls ? (
          <>
            {/* All wall images always in DOM — slides via position, no unmount */}
            {walls!.map((wall, i) => {
              const isActive = i === wallIndex;
              const offset = (i - wallIndex) * 100;
              return (
                <motion.div
                  key={wall.src}
                  animate={{ x: `${offset}%`, opacity: isActive ? 1 : 0 }}
                  transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute inset-0"
                >
                  <Image
                    src={wall.src}
                    alt={`Wall — ${cfg.label}${wall.wallLabel ? ' · ' + wall.wallLabel : ''}`}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/50 via-transparent to-[#0a0a0f]/20 pointer-events-none" />
                </motion.div>
              );
            })}

            {/* Next arrow — animated bounce to draw attention */}
            {isMultiWall && wallIndex < walls!.length - 1 && (
              <button
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20"
                onClick={(e) => { e.stopPropagation(); goNext(); }}
              >
                <motion.div
                  animate={{ x: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.3, ease: 'easeInOut' }}
                  className="flex items-center gap-1.5 rounded-xl bg-indigo-600/90 backdrop-blur-sm border border-indigo-400/50 px-3 py-2 shadow-xl shadow-indigo-900/50"
                >
                  <span className="text-xs font-bold text-white">Wall 2</span>
                  <ChevronRight className="h-4 w-4 text-white" />
                </motion.div>
              </button>
            )}

            {/* Prev arrow */}
            {isMultiWall && wallIndex > 0 && (
              <button
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20"
                onClick={(e) => { e.stopPropagation(); goPrev(); }}
              >
                <div className="flex items-center gap-1.5 rounded-xl bg-[#1a1a2a]/85 backdrop-blur-sm border border-[#2a2a38] px-3 py-2">
                  <ChevronLeft className="h-4 w-4 text-[#9090a8]" />
                  <span className="text-xs font-medium text-[#9090a8]">Wall 1</span>
                </div>
              </button>
            )}

            {/* Slide dots */}
            {isMultiWall && (
              <div
                className="absolute bottom-3 right-3 z-10 flex gap-1.5 items-center"
                onClick={(e) => e.stopPropagation()}
              >
                {walls!.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => goTo(i)}
                    className="rounded-full transition-all duration-300"
                    style={{ width: i === wallIndex ? 18 : 6, height: 6, background: i === wallIndex ? '#fff' : 'rgba(255,255,255,0.3)' }}
                  />
                ))}
              </div>
            )}

            {/* Click to zoom hint — always visible, left for multi-wall to avoid dot overlap */}
            <div className={`absolute bottom-3 z-10 ${isMultiWall ? 'left-3' : 'right-3'}`}>
              <div className="flex items-center gap-1 rounded-md bg-[#0a0a0f]/80 backdrop-blur-sm border border-[#2a2a38] px-2 py-1">
                <Expand className="h-3 w-3 text-[#9090a8]" />
                <span className="text-[9px] font-medium text-[#9090a8]">Click to zoom</span>
              </div>
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <div className="w-14 h-14 rounded-xl bg-[#1c1c26] border border-[#2a2a38] flex items-center justify-center">
              <span className="text-2xl">📸</span>
            </div>
            <p className="text-xs font-semibold text-[#60607a] uppercase tracking-widest">Photo Coming Soon</p>
          </div>
        )}

        {/* Live Scenario badge */}
        <div className="absolute top-3 right-3 z-10">
          <div className="rounded-md bg-[#0a0a0f]/75 backdrop-blur-sm border border-amber-500/40 px-2.5 py-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Live Scenario</span>
          </div>
        </div>

        {/* Task label */}
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
          <span className="text-sm font-semibold text-[#9090a8] uppercase tracking-wider">
            Wall Dimensions
          </span>
        </div>

        <div className="flex items-center gap-3">
          {isMultiWall && walls ? (
            <div className="text-right space-y-0.5">
              {walls.map((w, i) => (
                <div key={i} className="flex items-center justify-end gap-2">
                  <span className={`text-[10px] font-semibold uppercase tracking-wider transition-colors ${i === wallIndex ? 'text-indigo-300' : 'text-[#60607a]'}`}>
                    {w.wallLabel}
                  </span>
                  <span className={`text-sm font-bold tracking-wide transition-colors ${i === wallIndex ? 'text-[#f1f1f5]' : 'text-[#60607a]'}`}>
                    {w.dim}
                  </span>
                  <span className={`h-1.5 w-1.5 rounded-full transition-colors ${i === wallIndex ? 'bg-indigo-400' : 'bg-transparent'}`} />
                </div>
              ))}
            </div>
          ) : currentWall?.sqft ? (
            <>
              <span className="text-xl font-bold text-[#f1f1f5] tracking-wide">{currentWall.dim}</span>
              <span className="text-xs font-semibold text-indigo-300 bg-indigo-600/15 border border-indigo-500/25 rounded-lg px-2.5 py-1">
                {currentWall.sqft}
              </span>
            </>
          ) : currentWall ? (
            <p className="text-sm font-bold text-[#f1f1f5] tracking-wide">{currentWall.dim}</p>
          ) : null}
        </div>
      </motion.div>

      {/* Fullscreen lightbox */}
      <AnimatePresence>
        {expanded && currentWall && (
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
                <span className="text-sm font-semibold text-[#f1f1f5]">
                  {cfg.label}{currentWall.wallLabel ? ` · ${currentWall.wallLabel}` : ''}
                </span>
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
                src={currentWall.src}
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
                <span className="text-sm font-semibold text-[#9090a8] uppercase tracking-wider">
                  {isMultiWall ? `${currentWall.wallLabel} Dimensions` : 'Wall Dimensions'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#f1f1f5]">{currentWall.dim}</span>
                {currentWall.sqft && (
                  <span className="text-xs font-semibold text-indigo-300 bg-indigo-600/15 border border-indigo-500/25 rounded-lg px-2 py-0.5">
                    {currentWall.sqft}
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
