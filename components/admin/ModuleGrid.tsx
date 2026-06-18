import Link from 'next/link';
import { ChevronRight, Lock, TrendingDown } from 'lucide-react';

const MODULES: { num: number; title: string; live: boolean; href?: string }[] = [
  { num: 1, title: 'Know the Budget of Your Customer', live: true, href: '/admin/skill-gaps/module-1' },
  { num: 2, title: 'Design Finalisation — Objection Handling', live: false },
  { num: 3, title: 'Levers Used', live: false },
  { num: 4, title: 'Market Comparison', live: false },
  { num: 5, title: 'NIO Premium Panels', live: false },
  { num: 6, title: 'Coming Soon', live: false },
];

export function ModuleGrid({ m1Count }: { m1Count: number }) {
  return (
    <div className="rounded-xl border border-[#1e1e28] bg-[#13131a] overflow-hidden">
      {/* Section header */}
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#1e1e28] bg-gradient-to-r from-red-500/5 to-transparent">
        <TrendingDown className="h-4 w-4 text-red-400 shrink-0" />
        <h2 className="text-sm font-bold text-[#f1f1f5]">These RMs Need Practice</h2>
        <span className="ml-auto text-[10px] font-semibold text-[#9090a8] bg-[#1c1c26] border border-[#2a2a38] rounded-full px-2 py-0.5 whitespace-nowrap">
          open a module
        </span>
      </div>

      {/* 3 × 2 module grid */}
      <div className="p-4 sm:p-5 grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {MODULES.map(mod => {
          const inner = (
            <>
              <div className="flex items-start justify-between">
                <div
                  className={`w-11 h-11 rounded-xl border flex items-center justify-center font-extrabold text-base ${
                    mod.live
                      ? 'border-indigo-500/40 bg-indigo-600/15 text-indigo-300'
                      : 'border-[#2a2a38] bg-[#1c1c26] text-[#3a3a4a]'
                  }`}
                >
                  M{mod.num}
                </div>
                {mod.live ? (
                  <ChevronRight className="h-4 w-4 text-[#60607a] group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all" />
                ) : (
                  <Lock className="h-3.5 w-3.5 text-[#3a3a4a]" />
                )}
              </div>

              <div className="mt-3">
                <p className={`text-sm font-bold ${mod.live ? 'text-[#f1f1f5]' : 'text-[#4a4a5a]'}`}>
                  Module {mod.num}
                </p>
                <p className={`text-[11px] mt-0.5 line-clamp-2 ${mod.live ? 'text-[#60607a]' : 'text-[#3a3a4a]'}`}>
                  {mod.live ? mod.title : 'Data will be visible soon'}
                </p>
              </div>

              <div className="mt-auto pt-3">
                {mod.live ? (
                  m1Count > 0 ? (
                    <span className="inline-block text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/25 rounded-full px-2 py-0.5">
                      {m1Count} need practice
                    </span>
                  ) : (
                    <span className="inline-block text-[10px] font-bold text-green-400 bg-green-500/10 border border-green-500/25 rounded-full px-2 py-0.5">
                      all on track
                    </span>
                  )
                ) : (
                  <span className="inline-block text-[10px] font-semibold text-[#3a3a4a]">Soon</span>
                )}
              </div>
            </>
          );

          const tileClasses = `group flex flex-col min-h-[150px] rounded-xl border p-4 transition-all ${
            mod.live
              ? 'border-[#2a2a38] bg-[#0f0f16] hover:border-indigo-500/40 hover:bg-[#16161f] hover:-translate-y-0.5 cursor-pointer'
              : 'border-[#1a1a24] bg-[#0d0d13] cursor-not-allowed'
          }`;

          return mod.live && mod.href ? (
            <Link key={mod.num} href={mod.href} className={tileClasses}>
              {inner}
            </Link>
          ) : (
            <div key={mod.num} className={tileClasses} aria-disabled>
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
