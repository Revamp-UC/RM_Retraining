'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, MessageSquare } from 'lucide-react';

interface CriticalMistakesProps {
  mistakes: string[];
  coachingFeedback: string;
}

export function CriticalMistakes({ mistakes, coachingFeedback }: CriticalMistakesProps) {
  return (
    <div className="space-y-4">
      {mistakes.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="rounded-xl border border-red-500/20 bg-red-500/5 p-5"
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wide">Critical Mistakes</h3>
          </div>
          <ul className="space-y-2">
            {mistakes.map((m, i) => (
              <li key={i} className="flex items-start gap-2.5 text-base text-[#f1f1f5]">
                <span className="text-red-500 font-bold shrink-0 mt-0.5">{i + 1}.</span>
                <span className="text-[#9090a8]">{m}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5"
      >
        <div className="flex items-center gap-2 mb-3">
          <MessageSquare className="h-4 w-4 text-indigo-400" />
          <h3 className="text-sm font-semibold text-indigo-400 uppercase tracking-wide">Coach&apos;s Feedback</h3>
        </div>
        <p className="text-base text-[#9090a8] leading-relaxed">{coachingFeedback}</p>
      </motion.div>
    </div>
  );
}
