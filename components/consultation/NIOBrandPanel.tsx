'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export function NIOBrandPanel({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative flex flex-col rounded-xl overflow-hidden border border-[#1e1e28] ${className}`}
      style={{ background: 'linear-gradient(160deg, #0d1a14 0%, #0c0c12 50%, #0a0a0f 100%)' }}
    >
      {/* Top glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 40% at 30% 0%, rgba(52,211,153,0.10) 0%, transparent 60%)' }}
      />

      <div className="relative flex flex-col h-full p-6 lg:p-7">

        {/* ── Brand mark (unchanged) ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-5"
        >
          <p
            className="font-black leading-none tracking-[-0.04em] select-none mb-4"
            style={{ fontSize: 64, color: 'rgba(255,255,255,0.07)' }}
          >
            nio
          </p>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">
            Urban Company Exclusive
          </span>

          <p className="text-[16px] font-semibold text-[#b8b8cc] leading-snug">
            The quality you always wanted<br />
            <span className="text-[#f1f1f5] font-bold">at a price you never expected</span>
          </p>
        </motion.div>

        {/* Divider */}
        <div
          className="h-px mb-5"
          style={{ background: 'linear-gradient(90deg, rgba(52,211,153,0.3) 0%, rgba(52,211,153,0.05) 60%, transparent 100%)' }}
        />

        {/* ── Room image ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="flex-1 relative rounded-xl overflow-hidden min-h-0"
        >
          <Image
            src="/images/nio-rooms.jpg"
            alt="NIO Panel Designs"
            fill
            className="object-cover"
            style={{ objectPosition: 'center 15%' }}
            sizes="380px"
          />
          {/* Gradient — top to let brand mark breathe, bottom for label */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/40" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <span className="text-[9px] font-bold text-white/60 uppercase tracking-[0.15em]">
              35 Curated Designs
            </span>
            <span className="text-[9px] font-bold text-white/40 uppercase tracking-[0.12em]">
              Urban Company
            </span>
          </div>
        </motion.div>

        {/* ── Bottom tag ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 pt-4 border-t border-[#1a1a24]"
        >
          <p className="text-[10px] text-[#3a3a4a] uppercase tracking-widest text-center">
            Premium Structured Wall Panel · India&apos;s First
          </p>
        </motion.div>
      </div>
    </div>
  );
}
