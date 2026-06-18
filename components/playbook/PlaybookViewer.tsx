'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Sparkles, ArrowRight, Layers, Zap, Trophy, ArrowLeft, Download, ExternalLink } from 'lucide-react';

const PDF_PATH = '/playbook/nio-premium-playbook.pdf?v=2';

const HIGHLIGHTS = [
  { Icon: Layers, label: '8 Sales Stages', desc: 'Frame to close' },
  { Icon: Zap, label: '5 Emotional Levers', desc: 'Psychology that wins' },
  { Icon: Trophy, label: 'World-class Scripts', desc: 'Real Hinglish results' },
];

export function PlaybookViewer() {
  const [phase, setPhase] = useState<'gateway' | 'viewer'>('gateway');

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <AnimatePresence mode="wait">
        {phase === 'gateway' ? (
          <motion.div
            key="gateway"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.2 }}
            className="flex-1 flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ opacity: 0, y: 28 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
              className="w-full max-w-sm"
            >
              <div className="rounded-2xl border border-[#2a2a38] bg-[#13131a] shadow-2xl shadow-black/60 overflow-hidden">

                {/* Hero band */}
                <div className="relative px-6 pt-8 pb-6 text-center bg-gradient-to-b from-emerald-950/50 to-[#13131a]">
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />
                  </div>

                  {/* Icon */}
                  <div className="relative flex justify-center mb-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500/25 to-emerald-700/10 border border-emerald-500/30 flex items-center justify-center shadow-lg shadow-emerald-900/30">
                      <BookOpen className="h-7 w-7 text-emerald-400" />
                    </div>
                  </div>

                  <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 mb-2">
                    Module 5 · Playbook
                  </p>
                  <h1 className="text-xl font-bold text-[#f1f1f5] leading-snug">NIO Premium Panels</h1>
                  <p className="text-sm text-[#9090a8] mt-0.5">RM Sales Playbook</p>
                </div>

                <div className="px-6 pb-6 space-y-4">
                  <p className="text-xs text-[#70708a] leading-relaxed text-center">
                    Learn how to pitch NIO panels like a world-class RM — customer psychology, ideal Hinglish responses, emotional levers, and the complete winning path.
                  </p>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-2">
                    {HIGHLIGHTS.map(({ Icon, label, desc }) => (
                      <div
                        key={label}
                        className="rounded-xl border border-[#1e1e28] bg-[#0f0f17] p-3 text-center"
                      >
                        <Icon className="h-4 w-4 text-emerald-400 mx-auto mb-1.5" />
                        <p className="text-[10px] font-bold text-[#d0d0e8] leading-tight">{label}</p>
                        <p className="text-[9px] text-[#60607a] mt-0.5">{desc}</p>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <motion.button
                    whileTap={{ scale: 0.97 }}
                    onClick={() => setPhase('viewer')}
                    className="w-full flex items-center justify-center gap-2.5 bg-emerald-600 hover:bg-emerald-500 transition-colors text-white font-semibold text-sm py-3 rounded-xl"
                  >
                    <Sparkles className="h-4 w-4" />
                    Let&apos;s Learn
                    <ArrowRight className="h-4 w-4" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <motion.div
            key="viewer"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex-1 flex flex-col min-h-0"
          >
            {/* Viewer toolbar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#1e1e28] bg-[#0f0f17] shrink-0">
              <button
                onClick={() => setPhase('gateway')}
                className="flex items-center gap-1.5 text-xs text-[#9090a8] hover:text-[#f1f1f5] transition-colors"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                <span>Back</span>
              </button>
              <div className="flex items-center gap-1.5">
                <BookOpen className="h-3 w-3 text-emerald-400" />
                <span className="text-[11px] font-medium text-[#c0c0d8]">NIO Premium Panels — RM Playbook</span>
              </div>
              <a
                href={PDF_PATH}
                download="NIO_Premium_Selling_RM_Playbook.pdf"
                className="flex items-center gap-1.5 text-xs text-[#9090a8] hover:text-emerald-400 transition-colors"
                title="Download PDF"
              >
                <Download className="h-3.5 w-3.5" />
              </a>
            </div>

            {/* PDF — iframe on desktop, open-link on mobile */}
            <div className="flex-1 min-h-0 relative">
              {/* Mobile: open in new tab */}
              <div className="lg:hidden flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                  <BookOpen className="h-7 w-7 text-emerald-400/70" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#c0c0d8] mb-1">Open on your device</p>
                  <p className="text-xs text-[#70708a]">The playbook opens in your browser&apos;s PDF viewer</p>
                </div>
                <a
                  href={PDF_PATH}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-6 py-2.5 rounded-xl transition-colors"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Playbook
                </a>
              </div>

              {/* Desktop: embedded iframe */}
              <iframe
                src={PDF_PATH}
                className="hidden lg:block w-full h-full"
                title="NIO Premium Panels RM Playbook"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
