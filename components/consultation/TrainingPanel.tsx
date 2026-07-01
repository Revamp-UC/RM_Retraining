'use client';

import { useState } from 'react';
import Image from 'next/image';
import { BookOpen, X, Expand, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskMeta {
  label: string;
  section: string;
  questions: string;
  image: string;
}

const TASK_CONFIG: Record<string, TaskMeta> = {
  task_1: {
    label: 'Product Fundamentals',
    section: 'Section 1 of 3',
    questions: '16 Questions',
    image: '/images/module6-task1-quiz.png',
  },
  task_2: {
    label: 'Technical & Application',
    section: 'Section 2 of 3',
    questions: '17 Questions',
    image: '/images/module6-task2-quiz.png',
  },
  task_3: {
    label: 'Pricing & Quotation',
    section: 'Section 3 of 3',
    questions: '13 Questions',
    image: '/images/module6-task3-quiz.png',
  },
};

interface TrainingPanelProps {
  className?: string;
  taskId?: string;
}

export function TrainingPanel({ className = '', taskId = 'task_1' }: TrainingPanelProps) {
  const [expanded, setExpanded] = useState(false);
  const cfg = TASK_CONFIG[taskId] ?? TASK_CONFIG['task_1']!;

  return (
    <div className={`relative w-full h-full ${className}`}>

      {/* Image panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.0, ease: 'easeOut' }}
        className="absolute inset-0 bottom-[72px] rounded-xl overflow-hidden border border-[#2a2a38] bg-[#13131a] cursor-pointer"
        onClick={() => setExpanded(true)}
      >
        <Image
          src={cfg.image}
          alt={`Training — ${cfg.label}`}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/50 via-transparent to-[#0a0a0f]/20 pointer-events-none" />

        {/* Training Quiz badge */}
        <div className="absolute top-3 right-3 z-10">
          <div className="rounded-md bg-[#0a0a0f]/75 backdrop-blur-sm border border-violet-500/40 px-2.5 py-1">
            <span className="text-[10px] font-bold text-violet-400 uppercase tracking-widest">Training Quiz</span>
          </div>
        </div>

        {/* Task label */}
        <div className="absolute top-3 left-3 z-10">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#0a0a0f]/75 backdrop-blur-sm border border-[#2a2a38] px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-[#f1f1f5]">{cfg.label}</span>
          </div>
        </div>

        {/* Zoom hint */}
        <div className="absolute bottom-3 right-3 z-10">
          <div className="flex items-center gap-1 rounded-md bg-[#0a0a0f]/80 backdrop-blur-sm border border-[#2a2a38] px-2 py-1">
            <Expand className="h-3 w-3 text-[#9090a8]" />
            <span className="text-[9px] font-medium text-[#9090a8]">Click to zoom</span>
          </div>
        </div>
      </motion.div>

      {/* Info bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 1.3, ease: 'easeOut' }}
        className="absolute bottom-0 left-0 right-0 h-[64px] flex items-center justify-between rounded-xl border border-violet-500/30 bg-gradient-to-r from-violet-600/15 via-[#13131a] to-[#13131a] px-5 shadow-lg shadow-violet-900/10"
      >
        <div className="flex items-center gap-2.5">
          <BookOpen className="h-5 w-5 text-violet-400 shrink-0" />
          <span className="text-sm font-semibold text-[#9090a8] uppercase tracking-wider">
            Quiz Session
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-violet-300 bg-violet-600/15 border border-violet-500/25 rounded-lg px-2.5 py-1">
            {cfg.section}
          </span>
          <span className="text-sm font-bold text-[#f1f1f5] tracking-wide">{cfg.questions}</span>
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
                <GraduationCap className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-semibold text-[#f1f1f5]">
                  Technical Training · {cfg.label}
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
                src={cfg.image}
                alt={`Training — ${cfg.label}`}
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
                <BookOpen className="h-4 w-4 text-violet-400" />
                <span className="text-sm font-semibold text-[#9090a8] uppercase tracking-wider">
                  {cfg.section}
                </span>
              </div>
              <span className="text-sm font-bold text-[#f1f1f5]">{cfg.questions}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
