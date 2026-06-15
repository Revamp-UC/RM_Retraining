'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Palette, ShieldCheck, Flame } from 'lucide-react';

interface ScenarioModalProps {
  onAcknowledge: () => void;
  moduleId: string;
  taskId: string;
}

type Accent = 'violet' | 'indigo' | 'amber';

const ACCENT: Record<Accent, {
  text: string;
  iconBg: string;
  dot: string;
  stateBox: string;
  btn: string;
}> = {
  violet: {
    text: 'text-violet-400',
    iconBg: 'bg-violet-500/15 border border-violet-500/25',
    dot: 'bg-violet-400',
    stateBox: 'border border-violet-500/20 bg-violet-500/5',
    btn: 'bg-violet-600 hover:bg-violet-500',
  },
  indigo: {
    text: 'text-indigo-400',
    iconBg: 'bg-indigo-500/15 border border-indigo-500/25',
    dot: 'bg-indigo-400',
    stateBox: 'border border-indigo-500/20 bg-indigo-500/5',
    btn: 'bg-indigo-600 hover:bg-indigo-500',
  },
  amber: {
    text: 'text-amber-400',
    iconBg: 'bg-amber-500/15 border border-amber-500/25',
    dot: 'bg-amber-400',
    stateBox: 'border border-amber-500/20 bg-amber-500/5',
    btn: 'bg-amber-600 hover:bg-amber-500',
  },
};

const CONTENT: Record<string, {
  icon: React.ReactNode;
  accent: Accent;
  title: string;
  intro: string;
  knowItems: string[];
  stateText: string;
}> = {
  // Module 2
  module_2_task_1: {
    icon: <Palette className="h-4 w-4 text-violet-400" />,
    accent: 'violet',
    title: 'Design Finalisation',
    intro: 'The introduction is done. You have seen the customer\'s wall and understood their requirements.',
    knowItems: [
      'Wall: 10 ft wide × 9 ft height',
      'Budget is not an issue — customer wants the best look',
      '3 designs have already been shown to the customer',
    ],
    stateText: 'The customer has seen all three designs and is confused — they like all of them. Your job is to guide them to one design without putting pressure.',
  },
  module_2_task_2: {
    icon: <ShieldCheck className="h-4 w-4 text-indigo-400" />,
    accent: 'indigo',
    title: 'Commitment Confidence',
    intro: 'The design is finalised and the price is not a blocker. One thing is still holding the customer back.',
    knowItems: [
      'Wall: 9 ft × 9 ft',
      'Design: already selected and agreed upon',
      'Price: acceptable to the customer',
    ],
    stateText: 'The customer is not confident about how the final installed wall will actually look. They are anxious and confused — worried the real result may not match the design showed. Your job is to build genuine confidence.',
  },
  // Module 3
  module_3_task_1: {
    icon: <Flame className="h-4 w-4 text-amber-400" />,
    accent: 'amber',
    title: 'Levers Used',
    intro: 'Introduction, rapport building and budget discovery are all done. The customer loves the design — only the booking decision is pending.',
    knowItems: [
      'Wall: 9.5 ft × 8 ft · ₹33,499',
      'Design: finalised and genuinely loved by the customer',
      'Budget: slightly high but manageable — not a blocker',
    ],
    stateText: 'The customer keeps postponing the booking, saying they need to discuss with family. Your job is to convert them using the right urgency lever — without any pressure.',
  },
};

export function ScenarioModal({ onAcknowledge, moduleId, taskId }: ScenarioModalProps) {
  const [visible, setVisible] = useState(true);
  const content = CONTENT[`${moduleId}_${taskId}`] ?? CONTENT['module_2_task_1']!;
  const a = ACCENT[content.accent];

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
              <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${a.iconBg}`}>
                {content.icon}
              </div>
              <div>
                <p className={`text-xs font-semibold uppercase tracking-widest ${a.text}`}>Scenario Brief</p>
                <h2 className="text-base font-bold text-[#f1f1f5] leading-tight">{content.title}</h2>
              </div>
            </div>

            <div className="border-t border-[#1e1e28] mb-4" />

            <div className="space-y-3 mb-5">
              <p className="text-sm text-[#9090a8] leading-relaxed">
                {content.intro}
              </p>

              <div className="rounded-xl border border-[#1e1e28] bg-[#0f0f17] p-3.5 space-y-2">
                <p className="text-[10px] font-bold text-[#60607a] uppercase tracking-widest">What you know</p>
                <ul className="space-y-1.5">
                  {content.knowItems.map((line, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className={`mt-1.5 h-1 w-1 rounded-full shrink-0 ${a.dot}`} />
                      <span className="text-xs text-[#c0c0d8]">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className={`rounded-xl p-3.5 ${a.stateBox}`}>
                <p className={`text-[10px] font-bold uppercase tracking-widest mb-1.5 ${a.text}`}>Customer&apos;s State</p>
                <p className="text-xs text-[#c0c0d8] leading-relaxed">
                  {content.stateText}
                </p>
              </div>
            </div>

            <button
              onClick={handleAck}
              className={`w-full flex items-center justify-center gap-2 rounded-xl active:scale-[0.98] transition-all text-white font-semibold text-sm py-3 ${a.btn}`}
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
