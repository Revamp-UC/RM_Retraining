'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface PreStartModalProps {
  rmName: string;
  moduleId?: string;
}

export function PreStartModal({ rmName, moduleId }: PreStartModalProps) {
  const [visible, setVisible] = useState(true);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-[#0a0a0f]/80 backdrop-blur-sm px-5"
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 16 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-sm rounded-2xl border border-[#2a2a38] bg-[#13131a] shadow-2xl shadow-black/60 p-6"
          >
            {/* Heading */}
            <div className="mb-4">
              <p className={`text-xs font-semibold uppercase tracking-widest mb-1 ${moduleId === 'module_5' ? 'text-emerald-400' : moduleId === 'module_6' ? 'text-violet-400' : 'text-indigo-400'}`}>Before you begin</p>
              <h2 className="text-xl font-bold text-[#f1f1f5]">
                All the best, {rmName}! 🎯
              </h2>
            </div>

            {/* Divider */}
            <div className="border-t border-[#1e1e28] mb-4" />

            {/* Body */}
            <p className="text-sm text-[#9090a8] mb-3">
              Treat this like a real home visit — not a test.
            </p>
            <ul className="space-y-2 mb-6">
              {moduleId === 'module_6' ? (
              <>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full shrink-0 bg-violet-400" />
                  <span className="text-sm text-[#c0c0d8] leading-snug">
                    AI trainer will ask you questions — just <span className="font-semibold text-violet-300">answer briefly.</span>
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full shrink-0 bg-violet-400" />
                  <span className="text-sm text-[#c0c0d8] leading-snug">
                    If you don&apos;t know, just say <span className="font-semibold text-violet-300">&ldquo;pata nahi&rdquo;</span> — AI trainer will move to the next question.
                  </span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full shrink-0 bg-amber-400" />
                  <span className="text-sm text-[#c0c0d8] leading-snug">
                    <span className="font-semibold text-amber-300">Try your best in this attempt only</span> — you won&apos;t get another chance.
                  </span>
                </li>
              </>
            ) : (
              (moduleId === 'module_5'
                ? ['The customer already knows PVC panels — your job is to make them understand why NIO is worth the price.']
                : [
                    'Study the wall photo carefully before you speak',
                    'Note the dimensions',
                    "Read the customer's context from the sidebar",
                    'The AI customer behaves like a real homeowner. Make it count.',
                  ]
              ).map((line, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className={`mt-1 h-1.5 w-1.5 rounded-full shrink-0 ${moduleId === 'module_5' ? 'bg-emerald-400' : 'bg-indigo-400'}`} />
                  <span className="text-sm text-[#c0c0d8] leading-snug">{line}</span>
                </li>
              ))
            )}
            </ul>

            {/* CTA */}
            <button
              onClick={() => setVisible(false)}
              className={`w-full flex items-center justify-center gap-2 rounded-xl active:scale-[0.98] transition-all text-white font-semibold text-sm py-3 ${moduleId === 'module_5' ? 'bg-emerald-600 hover:bg-emerald-500' : moduleId === 'module_6' ? 'bg-violet-600 hover:bg-violet-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}
            >
              Got it, let&apos;s go
              <ArrowRight className="h-4 w-4" />
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
