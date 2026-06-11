'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Palette } from 'lucide-react';

interface ScenarioModalProps {
  onAcknowledge: () => void;
}

export function ScenarioModal({ onAcknowledge }: ScenarioModalProps) {
  const [visible, setVisible] = useState(true);

  function handleAck() {
    setVisible(false);
    onAcknowledge();
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[50] flex items-center justify-center bg-[#0a0a0f]/80 backdrop-blur-sm px-5"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm rounded-2xl border border-[#2a2a38] bg-[#13131a] shadow-2xl shadow-black/60 p-6"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-violet-500/15 border border-violet-500/25 flex items-center justify-center shrink-0">
                <Palette className="h-4 w-4 text-violet-400" />
              </div>
              <div>
                <p className="text-xs font-semibold text-violet-400 uppercase tracking-widest">Scenario Brief</p>
                <h2 className="text-base font-bold text-[#f1f1f5] leading-tight">Design Finalisation</h2>
              </div>
            </div>

            <div className="border-t border-[#1e1e28] mb-4" />

            <div className="space-y-3 mb-5">
              <p className="text-sm text-[#9090a8] leading-relaxed">
                The introduction is done. You have seen the customer&apos;s wall and understood their requirements.
              </p>

              <div className="rounded-xl border border-[#1e1e28] bg-[#0f0f17] p-3.5 space-y-2">
                <p className="text-[10px] font-bold text-[#60607a] uppercase tracking-widest">What you know</p>
                <ul className="space-y-1.5">
                  {[
                    'Wall: 10 ft wide × 9 ft height',
                    'Budget is not an issue — customer wants the best look',
                    '3 designs have already been shown to the customer',
                  ].map((line, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1.5 h-1 w-1 rounded-full bg-violet-400 shrink-0" />
                      <span className="text-xs text-[#c0c0d8]">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-3.5">
                <p className="text-[10px] font-bold text-violet-400 uppercase tracking-widest mb-1.5">Customer&apos;s State</p>
                <p className="text-xs text-[#c0c0d8] leading-relaxed">
                  The customer has seen all three designs and is confused — they like all of them. Your job is to guide them to one design without putting pressure.
                </p>
              </div>
            </div>

            <button
              onClick={handleAck}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-[0.98] transition-all text-white font-semibold text-sm py-3"
            >
              Got it, start consultation
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
