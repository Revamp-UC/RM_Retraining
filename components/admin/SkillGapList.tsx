import Link from 'next/link';
import { AlertTriangle, ChevronRight } from 'lucide-react';

interface SkillGapRM {
  mobile_number: string;
  name: string;
  module_sessions: number;
  score: number;
  max: number;
  percentage: number;
}

// Every listed RM is below 60% — split the colour by severity so the worst stand out.
function pctClasses(p: number) {
  return p < 40
    ? 'bg-red-500/15 border-red-500/35 text-red-400'
    : 'bg-amber-500/15 border-amber-500/35 text-amber-400';
}

export function SkillGapList({ title, rms, moduleLabel = 'M1' }: { title: string; rms: SkillGapRM[]; moduleLabel?: string }) {
  return (
    <div className="rounded-xl border border-[#1e1e28] bg-[#13131a] overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-4 border-b border-[#1e1e28] bg-gradient-to-r from-red-500/5 to-transparent">
        <AlertTriangle className="h-4 w-4 text-red-400 shrink-0" />
        <h2 className="text-sm font-bold text-[#f1f1f5]">{title}</h2>
        <span className="ml-auto text-[10px] font-semibold text-[#60607a]">&lt; 60%</span>
        <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/25 rounded-full px-2 py-0.5">
          {rms.length}
        </span>
      </div>

      {rms.length === 0 ? (
        <div className="px-5 py-12 text-center text-sm text-[#60607a]">
          No RMs below 60% here. 🎉
        </div>
      ) : (
        <ul className="divide-y divide-[#1a1a24]">
          {rms.map((rm, i) => (
            <li key={rm.mobile_number}>
              <Link
                href={`/admin/rm/${rm.mobile_number}`}
                className="flex items-center gap-3.5 px-5 py-3.5 hover:bg-[#16161f] transition-colors group"
              >
                <div className="w-7 h-7 rounded-lg border border-[#2a2a38] bg-[#1c1c26] flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-bold text-[#60607a]">{i + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  {/* highlighted name */}
                  <p className="text-sm font-bold text-[#f1f1f5] truncate group-hover:text-white">{rm.name}</p>
                  <p className="text-[11px] text-[#60607a] mt-0.5">
                    {rm.module_sessions} session{rm.module_sessions !== 1 ? 's' : ''} · {moduleLabel}
                    <span className="text-[#3a3a4a]"> · {rm.score}/{rm.max} marks</span>
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
