'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronRight, Clock, ChevronDown } from 'lucide-react';

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
};

export function MySessions({ sessions }: { sessions: Session[] }) {
  const [open, setOpen] = useState(false);

  if (sessions.length === 0) return null;

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen(o => !o)}
        className="flex items-center justify-between w-full mb-2 group"
      >
        <h2 className="text-sm font-semibold text-[#9090a8] uppercase tracking-widest">
          My Sessions
          <span className="ml-2 text-[10px] font-medium text-[#60607a] normal-case tracking-normal">
            ({sessions.length})
          </span>
        </h2>
        <ChevronDown
          className={`h-4 w-4 text-[#60607a] group-hover:text-[#9090a8] transition-all duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="rounded-xl border border-[#1e1e28] bg-[#13131a] overflow-hidden">
          <ul className="divide-y divide-[#1a1a24]">
            {sessions.map((session) => {
              const label = MODULE_TASK_LABEL[session.module_attempted] ?? session.module_attempted;
              const date = new Date(session.attempt_date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
              const isPending = session.status === 'evaluation_pending';
              const score = session.overall_score;
              const scoreColor = score === null ? '' : score >= 36 ? 'bg-green-500/12 border-green-500/30 text-green-400' : score >= 27 ? 'bg-amber-500/12 border-amber-500/30 text-amber-400' : 'bg-red-500/12 border-red-500/30 text-red-400';

              return (
                <li key={session.id}>
                  <Link
                    href={`/module/module_1/report/${session.id}`}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-[#16161f] transition-colors group/row"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-semibold text-[#9090a8] bg-[#1c1c26] border border-[#2a2a38] rounded px-1.5 py-0.5">{label}</span>
                        <span className="text-xs text-[#60607a]">{date}</span>
                        {session.customer_name && (
                          <span className="text-xs text-[#60607a] truncate">· {session.customer_name}</span>
                        )}
                      </div>
                    </div>
                    {isPending ? (
                      <span className="flex items-center gap-1 text-[10px] font-semibold text-amber-400 border border-amber-500/30 rounded px-1.5 py-0.5">
                        <Clock className="h-3 w-3" /> Pending
                      </span>
                    ) : score !== null ? (
                      <span className={`inline-block rounded-lg border px-2 py-0.5 text-xs font-bold ${scoreColor}`}>{score}</span>
                    ) : null}
                    <ChevronRight className="h-3.5 w-3.5 text-[#2a2a38] group-hover/row:text-[#60607a] transition-colors shrink-0" />
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
