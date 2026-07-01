import { ArrowLeft, FileBarChart, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

interface SessionLimitReachedProps {
  moduleId: string;
  taskTitle: string;
  latestId: string | null;
}

export function SessionLimitReached({ moduleId, taskTitle, latestId }: SessionLimitReachedProps) {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-sm rounded-2xl border border-[#2a2a38] bg-[#13131a] p-8 text-center shadow-2xl shadow-black/40">

        <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center mx-auto mb-5">
          <ShieldAlert className="h-7 w-7 text-amber-400" />
        </div>

        <h2 className="text-lg font-bold text-[#f1f1f5] mb-2">Session Limit Reached</h2>

        <p className="text-sm text-[#9090a8] mb-1">
          You&apos;ve already attempted
        </p>
        <p className="text-sm font-semibold text-[#c8c8e0] mb-5">
          {taskTitle}
        </p>

        <div className="rounded-xl border border-amber-500/20 bg-amber-500/[0.06] px-4 py-3 mb-6">
          <p className="text-xs text-amber-300/80 leading-relaxed">
            Max limit reached for this session — try other tasks, or contact your admin to unlock a retry.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {latestId && (
            <Link
              href={`/module/${moduleId}/report/${latestId}`}
              className="flex items-center justify-center gap-2 rounded-xl bg-violet-600 hover:bg-violet-500 active:scale-[0.98] transition-all text-white font-semibold text-sm py-3"
            >
              <FileBarChart className="h-4 w-4" />
              View Your Report
            </Link>
          )}
          <Link
            href={`/module/${moduleId}`}
            className="flex items-center justify-center gap-2 rounded-xl border border-[#2a2a38] bg-[#1c1c26] hover:bg-[#22222e] active:scale-[0.98] transition-all text-[#9090a8] font-semibold text-sm py-3"
          >
            <ArrowLeft className="h-4 w-4" />
            Try Other Tasks
          </Link>
        </div>
      </div>
    </div>
  );
}
