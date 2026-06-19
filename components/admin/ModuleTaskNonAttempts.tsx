'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, UserX } from 'lucide-react';

interface NonAttemptTask {
  task: string;
  label: string;
  rms: { mobile_number: string; name: string }[];
}

export function ModuleTaskNonAttempts({ tasks }: { tasks: NonAttemptTask[] }) {
  const [open, setOpen] = useState(false);
  const colsClass = tasks.length >= 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2';

  return (
    <div className="rounded-xl border border-[#1e1e28] bg-[#13131a] overflow-hidden">
      {/* Dropdown header */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        className="w-full flex items-center gap-2.5 px-5 py-4 hover:bg-[#16161f] transition-colors text-left"
      >
        <UserX className="h-4 w-4 text-amber-400 shrink-0" />
        <h2 className="text-sm font-bold text-[#f1f1f5]">RMs Who Haven&apos;t Attempted</h2>
        <span className="text-[10px] font-semibold text-[#9090a8] bg-[#1c1c26] border border-[#2a2a38] rounded-full px-2 py-0.5 whitespace-nowrap">
          by task
        </span>
        <ChevronDown
          className={`ml-auto h-4 w-4 text-[#60607a] transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <div className={`border-t border-[#1e1e28] p-3 grid grid-cols-1 ${colsClass} gap-3 bg-[#0a0a0f]/40`}>
              {tasks.map(t => (
                <div key={t.task} className="rounded-lg border border-[#1e1e28] bg-[#0f0f16] overflow-hidden">
                  <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1e1e28]">
                    <h4 className="text-xs font-bold text-[#e4e4ef] uppercase tracking-wide">{t.label}</h4>
                    <span className="ml-auto text-[10px] font-bold text-amber-400 bg-amber-500/10 border border-amber-500/25 rounded-full px-2 py-0.5">
                      {t.rms.length} pending
                    </span>
                  </div>
                  {t.rms.length === 0 ? (
                    <div className="px-4 py-7 text-center text-xs text-[#60607a]">Everyone attempted this task. 🎉</div>
                  ) : (
                    <ul className="divide-y divide-[#16161f] max-h-72 overflow-y-auto">
                      {t.rms.map((rm, i) => (
                        <li key={rm.mobile_number} className="flex items-center gap-3 px-4 py-2.5">
                          <span className="text-[10px] font-bold text-[#3a3a4a] w-5 text-right shrink-0">{i + 1}</span>
                          <span className="text-sm font-semibold text-[#d4d4e8] truncate">{rm.name}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
