'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingDown, ChevronDown, ChevronRight, Lock, AlertTriangle } from 'lucide-react';

interface SkillGapRM {
  mobile_number: string;
  name: string;
  module_sessions: number;
  score: number;
  max: number;
  percentage: number;
}

interface ModuleSkillGapsProps {
  introduction: SkillGapRM[];
  budget_discovery: SkillGapRM[];
}

const MODULES = [
  { num: 1, title: 'Know the Budget of Your Customer', live: true },
  { num: 2, title: 'Design Finalisation — Objection Handling', live: false },
  { num: 3, title: 'Levers Used', live: false },
  { num: 4, title: 'Market Comparison', live: false },
  { num: 5, title: 'NIO Premium Panels', live: false },
  { num: 6, title: 'Coming Soon', live: false },
];

// All listed RMs are below 60% — split the colour by severity so the worst stand out.
function pctClasses(p: number) {
  return p < 40
    ? 'bg-red-500/15 border-red-500/35 text-red-400'
    : 'bg-amber-500/15 border-amber-500/35 text-amber-400';
}

function SubSkillBlock({ title, rms }: { title: string; rms: SkillGapRM[] }) {
  return (
    <div className="rounded-lg border border-[#1e1e28] bg-[#0f0f16] overflow-hidden">
      <div className="flex items-center gap-2 px-4 py-3 border-b border-[#1e1e28]">
        <AlertTriangle className="h-3.5 w-3.5 text-red-400/80 shrink-0" />
        <h4 className="text-xs font-bold text-[#e4e4ef] uppercase tracking-wide truncate">{title}</h4>
        <span className="ml-auto text-[10px] font-semibold text-[#60607a] shrink-0">&lt; 60%</span>
        <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/25 rounded-full px-2 py-0.5 shrink-0">
          {rms.length}
        </span>
      </div>
      {rms.length === 0 ? (
        <div className="px-4 py-7 text-center text-xs text-[#60607a]">
          No RMs below 60% here. 🎉
        </div>
      ) : (
        <ul className="divide-y divide-[#16161f]">
          {rms.map((rm, i) => (
            <li key={rm.mobile_number}>
              <Link
                href={`/admin/rm/${rm.mobile_number}`}
                className="flex items-center gap-3 px-4 py-3 hover:bg-[#16161f] transition-colors group"
              >
                <span className="text-[10px] font-bold text-[#3a3a4a] w-4 text-right shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  {/* highlighted name */}
                  <p className="text-sm font-bold text-[#f1f1f5] truncate group-hover:text-white">{rm.name}</p>
                  <p className="text-[11px] text-[#60607a] mt-0.5">
                    {rm.module_sessions} session{rm.module_sessions !== 1 ? 's' : ''} · M1
                    <span className="text-[#3a3a4a]"> · {rm.score}/{rm.max}</span>
                  </p>
                </div>
                {/* highlighted percentage */}
                <span className={`inline-block rounded-lg border px-2.5 py-1 text-sm font-extrabold tabular-nums shrink-0 ${pctClasses(rm.percentage)}`}>
                  {rm.percentage}%
                </span>
                <ChevronRight className="h-3.5 w-3.5 text-[#2a2a38] group-hover:text-[#60607a] transition-colors shrink-0" />
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function ModuleSkillGaps({ introduction, budget_discovery }: ModuleSkillGapsProps) {
  const [openModule, setOpenModule] = useState<number | null>(1);

  // distinct RMs needing practice in Module 1 (union across both sub-skills)
  const m1Count = new Set([
    ...introduction.map(r => r.mobile_number),
    ...budget_discovery.map(r => r.mobile_number),
  ]).size;

  return (
    <div className="rounded-xl border border-[#1e1e28] bg-[#13131a] overflow-hidden">
      {/* Section header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#1e1e28] bg-gradient-to-r from-red-500/5 to-transparent">
        <TrendingDown className="h-4 w-4 text-red-400 shrink-0" />
        <h2 className="text-sm font-bold text-[#f1f1f5]">These RMs Need Practice</h2>
        <span className="ml-auto text-[10px] font-semibold text-[#9090a8] bg-[#1c1c26] border border-[#2a2a38] rounded-full px-2 py-0.5 whitespace-nowrap">
          by module · sub-skill &lt; 60%
        </span>
      </div>

      {/* Module list */}
      <div className="p-3.5 sm:p-4 space-y-2.5">
        {MODULES.map(mod => {
          const isOpen = openModule === mod.num && mod.live;
          return (
            <div
              key={mod.num}
              className={`rounded-lg border overflow-hidden transition-colors ${
                mod.live
                  ? `border-[#2a2a38] bg-[#0f0f16] ${isOpen ? 'ring-1 ring-indigo-500/20 border-indigo-500/30' : ''}`
                  : 'border-[#1a1a24] bg-[#0d0d13]'
              }`}
            >
              <button
                type="button"
                disabled={!mod.live}
                onClick={() => setOpenModule(o => (o === mod.num ? null : mod.num))}
                aria-expanded={isOpen}
                className={`w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
                  mod.live ? 'hover:bg-[#16161f] cursor-pointer' : 'cursor-not-allowed'
                }`}
              >
                {/* Module number badge */}
                <div
                  className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 font-bold text-sm ${
                    mod.live
                      ? 'border-indigo-500/40 bg-indigo-600/15 text-indigo-300'
                      : 'border-[#2a2a38] bg-[#1c1c26] text-[#3a3a4a]'
                  }`}
                >
                  M{mod.num}
                </div>

                {/* Title */}
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-bold truncate ${mod.live ? 'text-[#f1f1f5]' : 'text-[#4a4a5a]'}`}>
                    Module {mod.num}
                  </p>
                  <p className={`text-[11px] truncate mt-0.5 ${mod.live ? 'text-[#60607a]' : 'text-[#3a3a4a]'}`}>
                    {mod.live ? mod.title : 'Data will be visible soon'}
                  </p>
                </div>

                {/* Right side */}
                {mod.live ? (
                  <div className="flex items-center gap-2.5 shrink-0">
                    {m1Count > 0 && (
                      <span className="hidden sm:inline-block text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/25 rounded-full px-2 py-0.5 whitespace-nowrap">
                        {m1Count} need practice
                      </span>
                    )}
                    <ChevronDown
                      className={`h-4 w-4 text-[#60607a] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                    />
                  </div>
                ) : (
                  <div className="flex items-center gap-1.5 text-[10px] font-semibold text-[#3a3a4a] shrink-0">
                    <Lock className="h-3 w-3" />
                    <span className="hidden sm:inline">Soon</span>
                  </div>
                )}
              </button>

              {/* Expanded content — two sub-skill blocks */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="overflow-hidden"
                  >
                    <div className="border-t border-[#1e1e28] p-3 grid md:grid-cols-2 gap-3 bg-[#0a0a0f]/40">
                      <SubSkillBlock title="Introduction" rms={introduction} />
                      <SubSkillBlock title="Budget Discovery" rms={budget_discovery} />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
