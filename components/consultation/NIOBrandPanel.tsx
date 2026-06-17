'use client';

import { motion } from 'framer-motion';
import { Gem, ShieldCheck, Clock, Zap } from 'lucide-react';

const DIFFERENTIATORS = [
  { icon: ShieldCheck, title: 'Hexagonal Structure', desc: '5× stronger than standard PVC — built to last' },
  { icon: Clock,       title: '10+ Year Durability', desc: 'UV resistant, scratch proof, zero maintenance' },
  { icon: Zap,         title: '55% vs Premium WPC',  desc: 'Same luxury finish at nearly half the price' },
  { icon: Gem,         title: 'UC Exclusive · 35 Designs', desc: 'Not available anywhere else in India' },
];

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

      <div className="relative flex flex-col h-full p-7">

        {/* ── Brand ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8"
        >
          {/* Wordmark */}
          <p
            className="font-black leading-none tracking-[-0.04em] select-none mb-4"
            style={{ fontSize: 64, color: 'rgba(255,255,255,0.07)' }}
          >
            nio
          </p>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">
            Urban Company Exclusive
          </span>

          <p className="text-[17px] font-semibold text-[#b8b8cc] leading-snug">
            The quality you always wanted<br />
            <span className="text-[#f1f1f5] font-bold">at a price you never expected</span>
          </p>
        </motion.div>

        {/* Divider */}
        <div className="h-px mb-7" style={{ background: 'linear-gradient(90deg, rgba(52,211,153,0.3) 0%, rgba(52,211,153,0.05) 60%, transparent 100%)' }} />

        {/* ── Key differentiators ── */}
        <div className="flex-1 flex flex-col justify-center gap-4">
          {DIFFERENTIATORS.map(({ icon: Icon, title, desc }, i) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15 + i * 0.08, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-start gap-3.5"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center shrink-0">
                <Icon className="h-4 w-4 text-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-semibold text-[#e8e8f4] leading-tight">{title}</p>
                <p className="text-xs text-[#60607a] mt-0.5 leading-relaxed">{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom tag ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-7 pt-5 border-t border-[#1a1a24]"
        >
          <p className="text-[10px] text-[#3a3a4a] uppercase tracking-widest text-center">
            Premium Structured Wall Panel · India&apos;s First
          </p>
        </motion.div>
      </div>
    </div>
  );
}
