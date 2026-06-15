'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Clock, ChevronDown, History } from 'lucide-react';

interface Session {
  id: string;
  module_attempted: string;
  attempt_date: string;
  customer_name: string | null;
  overall_score: number | null;
  status: string;
}

const MODULE_TASK_LABEL: Record<string, string> = {
  module_1_seepage: 'M1 · T1',
  module_1_task2:   'M1 · T2',
  module_1_task3:   'M1 · T3',
  module_2_task1:   'M2 · T1',
  module_3_task1:   'M3 · T1',
  module_3_task2:   'M3 · T2',
};

export function MySessions({ sessions }: { sessions: Session[] }) {
  const [open, setOpen] = useState(false);

  if (sessions.length === 0) return null;

  return (
    <div className="mb-8">
      <button
        onClick={() => setOpen(o => !o)}
        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all duration-200
          ${open
            ? 'border-indigo-500/30 bg-indigo-600/8 rounded-b-none border-b-0'
            : 'border-[#2a2a38] bg-[#13131a] hover:bg-[#16161f] hover:border-[#3a3a50]'
          }`}
      >
        <div className="flex items-center gap-2.5">
          <History className="h-4 w-4 text-indigo-400 shrink-0" />
          <span className="text-sm font-semibold text-[#f1f1f5]">My Sessions</span>
          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/15 border border-indigo-500/25 rounded-full px-2 py-0.5">
            {sessions.length}
          </span>
        </div>
        <ChevronDown
          className={`h-4 w-4 text-[#60607a] transition-transform duration-200 ${open ? 'rotate-180 text-indigo-400' : ''}`}
        />
      </button>

      {open && (
        <div className="rounded-b-xl border border-t-0 border-indigo-500/20 bg-[#0e0e16] overflow-hidden">
          <ul className="divide-y divide-[#1a1a24]">
            {sessions.map((session) => {
              const label = MODULE_TASK_LABEL[session.module_attempted] ?? session.module_attempted;
              const date = new Date(session.attempt_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
              const isPending = session.status === 'evaluation_pending';
              const score = session.overall_score;
              const scoreColor = score === null
                ? ''
                : score >= 36
                  ? 'bg-green-500/10 border-green-500/30 text-green-400'
                  : score >= 27
                    ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                    : 'bg-red-500/10 border-red-500/30 text-red-400';

              return (
                <li key={session.id}>
                  <Link
                    href={`/module/module_1/report/${session.id}`}
                    className="flex items-center gap-3 px-4 py-3.5 hover:bg-[#13131a] transition-colors group/row"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded px-1.5 py-0.5 shrink-0">{label}</span>
                        <span className="text-xs text-[#60607a] shrink-0">{date}</span>
                        {session.customer_name && (
                          <span className="text-xs text-[#9090a8] truncate">· {session.customer_name}</span>
                        )}
                      </div>
                    </div>
                    {isPending ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/25 rounded-full px-2 py-0.5 shrink-0">
                        <Clock className="h-3 w-3" /> Pending
                      </span>
                    ) : score !== null ? (
                      <span className={`inline-block rounded-lg border px-2.5 py-0.5 text-xs font-bold shrink-0 ${scoreColor}`}>{score}</span>
                    ) : null}
                    <ChevronRight className="h-3.5 w-3.5 text-[#2a2a38] group-hover/row:text-indigo-400 transition-colors shrink-0" />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
