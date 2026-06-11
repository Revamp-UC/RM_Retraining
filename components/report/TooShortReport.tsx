'use client';

import Link from 'next/link';
import { RotateCcw, LayoutDashboard, Timer } from 'lucide-react';

interface TooShortReportProps {
  retryHref: string;
  isOwn: boolean;
}

export function TooShortReport({ retryHref, isOwn }: TooShortReportProps) {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-[#1c1c26] border border-[#2a2a38] p-5">
            <Timer className="h-8 w-8 text-[#60607a]" />
          </div>
        </div>

        <div>
          <h1 className="text-xl font-bold text-[#f1f1f5] mb-2">Session too short to evaluate</h1>
          <p className="text-sm text-[#9090a8] leading-relaxed">
            The conversation was too brief to judge performance. Please have a full consultation and try again.
          </p>
        </div>

        {isOwn && (
          <div className="flex flex-col gap-3">
            <Link
              href={retryHref}
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all text-white font-semibold text-sm py-3.5"
            >
              <RotateCcw className="h-4 w-4" />
              Try Again
            </Link>
            <Link
              href="/dashboard"
              className="flex items-center justify-center gap-2 text-sm text-[#60607a] hover:text-[#9090a8] transition-colors"
            >
              <LayoutDashboard className="h-4 w-4" />
              Back to Dashboard
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
