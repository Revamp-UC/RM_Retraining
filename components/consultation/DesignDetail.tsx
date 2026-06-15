'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Ruler, X, Expand, Tag, Layers } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface DetailConfig {
  label: string;
  src: string;
  dim: string;
  price: string;
  materials: string[];
}

const TASK_CONFIG: Record<string, DetailConfig> = {
  task_1: {
    label: 'Task 1 · Module 3',
    src: '/images/module3-task1-wall.png',
    dim: '9.5 ft × 8 ft',
    price: '₹33,499',
    materials: ['9952', 'Q0002', 'S0G29', 'W5249'],
  },
  task_2: {
    label: 'Task 2 · Module 3',
    src: '/images/module3-task2-wall.png',
    dim: '9.5 ft × 8 ft',
    price: '₹57,499',
    materials: ['X921', 'M0703', 'Console', 'Shelves'],
  },
};

interface DesignDetailProps {
  className?: string;
  taskId?: string;
}

export function DesignDetail({ className = '', taskId = 'task_1' }: DesignDetailProps) {
  const [expanded, setExpanded] = useState(false);
  const cfg = TASK_CONFIG[taskId] ?? TASK_CONFIG['task_1']!;

  return (
    <div className={`relative w-full h-full ${className}`}>

      {/* Design image panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.0, ease: 'easeOut' }}
        className="absolute inset-0 bottom-[128px] rounded-xl overflow-hidden border border-[#2a2a38] bg-[#13131a] cursor-pointer"
        onClick={() => setExpanded(true)}
      >
        <Image
          src={cfg.src}
          alt={`Finalised design — ${cfg.label}`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/50 via-transparent to-[#0a0a0f]/20 pointer-events-none" />

        {/* Click to zoom hint */}
        <div className="absolute bottom-3 right-3 z-10">
          <div className="flex items-center gap-1 rounded-md bg-[#0a0a0f]/80 backdrop-blur-sm border border-[#2a2a38] px-2 py-1">
            <Expand className="h-3 w-3 text-[#9090a8]" />
            <span className="text-[9px] font-medium text-[#9090a8]">Click to zoom</span>
          </div>
        </div>

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

      {/* Info panel — dimension, price, materials */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 1.3, ease: 'easeOut' }}
        className="absolute bottom-0 left-0 right-0 h-[116px] flex flex-col justify-center gap-2.5 rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-600/15 via-[#13131a] to-[#13131a] px-5 shadow-lg shadow-indigo-900/10"
      >
        {/* Dimension + price row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Ruler className="h-5 w-5 text-indigo-400 shrink-0" />
            <span className="text-base font-bold text-[#f1f1f5] tracking-wide">{cfg.dim}</span>
          </div>
          <div className="flex items-center gap-2">
            <Tag className="h-4 w-4 text-amber-400 shrink-0" />
            <span className="text-base font-bold text-amber-400 tracking-wide">{cfg.price}</span>
          </div>
        </div>

        {/* Materials row */}
        <div className="flex items-center gap-2.5">
          <Layers className="h-4 w-4 text-[#60607a] shrink-0" />
          <span className="text-[10px] font-bold text-[#60607a] uppercase tracking-widest shrink-0">Materials</span>
          <div className="flex flex-wrap gap-1.5">
            {cfg.materials.map((m) => (
              <span
                key={m}
                className="text-[11px] font-semibold text-[#c0c0d8] bg-[#1c1c26] border border-[#2a2a38] rounded-md px-2 py-0.5"
              >
                {m}
              </span>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Fullscreen lightbox */}
      <AnimatePresence>
        {expanded && (
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
                src={cfg.src}
                alt={`Finalised design — ${cfg.label}`}
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
                <span className="text-lg font-bold text-[#f1f1f5]">{cfg.dim}</span>
              </div>
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-amber-400" />
                <span className="text-lg font-bold text-amber-400">{cfg.price}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
