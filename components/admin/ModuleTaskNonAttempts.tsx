import { UserX } from 'lucide-react';

interface NonAttemptTask {
  task: string;
  label: string;
  rms: { mobile_number: string; name: string }[];
}

// Always-visible section (no collapse) so it's obviously part of the page.
export function ModuleTaskNonAttempts({ tasks }: { tasks: NonAttemptTask[] }) {
  const colsClass = tasks.length >= 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2';

  return (
    <div className="rounded-xl border border-amber-500/25 bg-[#13131a] overflow-hidden">
      {/* Section header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-[#1e1e28] bg-gradient-to-r from-amber-500/10 to-transparent">
        <div className="w-8 h-8 rounded-lg border border-amber-500/30 bg-amber-500/10 flex items-center justify-center shrink-0">
          <UserX className="h-4 w-4 text-amber-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-bold text-[#f1f1f5]">RMs Who Haven&apos;t Attempted</h2>
          <p className="text-[11px] text-[#60607a] mt-0.5">From the tracked cohort — who still hasn&apos;t done each task of this module</p>
        </div>
      </div>

      {/* One column per task — always shown */}
      <div className={`p-3 sm:p-4 grid grid-cols-1 ${colsClass} gap-3`}>
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
              <ul className="divide-y divide-[#16161f] max-h-80 overflow-y-auto">
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
    </div>
  );
}
