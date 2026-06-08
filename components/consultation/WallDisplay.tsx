'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Ruler, X, Expand } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface WallDisplayProps {
  className?: string;
}

export function WallDisplay({ className = '' }: WallDisplayProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`relative w-full h-full ${className}`}>

      {/* Wall photo — fades in + scales up after 1 second */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.0, ease: 'easeOut' }}
        className="absolute inset-0 bottom-[72px] rounded-xl overflow-hidden border border-[#2a2a38] bg-[#13131a] cursor-pointer"
        onClick={() => setExpanded(true)}
      >
        <Image
          src="/images/module1-task1-wall.png"
          alt="Wall — Task 1 Module 1"
          fill
          className="object-cover"
          priority
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/50 via-transparent to-[#0a0a0f]/20 pointer-events-none" />

        {/* Live Scenario badge — top right */}
        <div className="absolute top-3 right-3 z-10">
          <div className="rounded-md bg-[#0a0a0f]/75 backdrop-blur-sm border border-amber-500/40 px-2.5 py-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Live Scenario</span>
          </div>
        </div>

        {/* Module label — top left */}
        <div className="absolute top-3 left-3 z-10">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#0a0a0f]/75 backdrop-blur-sm border border-[#2a2a38] px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-[#f1f1f5]">Task 1 · Module 1</span>
          </div>
        </div>

        {/* Tap to expand hint — mobile only */}
        <div className="absolute bottom-3 right-3 z-10 lg:hidden">
          <div className="flex items-center gap-1 rounded-md bg-[#0a0a0f]/80 backdrop-blur-sm border border-[#2a2a38] px-2 py-1">
            <Expand className="h-3 w-3 text-[#9090a8]" />
            <span className="text-[9px] font-medium text-[#9090a8]">Tap to expand</span>
          </div>
        </div>
      </motion.div>

      {/* Dimension bar — fades in + slides up after 1.3 seconds */}
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
          <span className="text-xl font-bold text-[#f1f1f5] tracking-wide">8 Ft × 8.5 Ft</span>
          <span className="text-xs font-semibold text-indigo-300 bg-indigo-600/15 border border-indigo-500/25 rounded-lg px-2.5 py-1">
            68 sq ft
          </span>
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
            {/* Header */}
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-sm font-semibold text-[#f1f1f5]">Task 1 · Module 1</span>
              </div>
              <button
                className="rounded-full bg-white/10 p-2 active:bg-white/20"
                onClick={() => setExpanded(false)}
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Image */}
            <div className="relative flex-1 min-h-0">
              <Image
                src="/images/module1-task1-wall.png"
                alt="Wall — Task 1 Module 1"
                fill
                className="object-contain"
                priority
              />
            </div>

            {/* Footer with dimensions */}
            <div
              className="flex items-center justify-between px-5 py-4 border-t border-white/10 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-indigo-400" />
                <span className="text-sm font-semibold text-[#9090a8] uppercase tracking-wider">Wall Dimensions</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-[#f1f1f5]">8 Ft × 8.5 Ft</span>
                <span className="text-xs font-semibold text-indigo-300 bg-indigo-600/15 border border-indigo-500/25 rounded-lg px-2 py-0.5">
                  68 sq ft
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
