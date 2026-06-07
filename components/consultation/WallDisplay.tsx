'use client';

import Image from 'next/image';
import { Ruler } from 'lucide-react';
import { motion } from 'framer-motion';

interface WallDisplayProps {
  className?: string;
}

export function WallDisplay({ className = '' }: WallDisplayProps) {
  return (
    <div className={`relative w-full h-full ${className}`}>

      {/* Wall photo — fades in + scales up after 1 second */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.0, ease: 'easeOut' }}
        className="absolute inset-0 bottom-[72px] rounded-xl overflow-hidden border border-[#2a2a38] bg-[#13131a]"
      >
        <Image
          src="/images/module-1-wall.png"
          alt="Seepage wall — Module 1"
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
            <span className="text-[11px] font-semibold text-[#f1f1f5]">Module 1 — Seepage Wall</span>
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

    </div>
  );
}
