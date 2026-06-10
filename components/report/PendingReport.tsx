'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Clock, RefreshCw, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

interface PendingReportProps {
  consultationId: string;
  moduleId: string;
  isOwn: boolean;
}

export function PendingReport({ consultationId, moduleId, isOwn }: PendingReportProps) {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  async function retry() {
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await fetch('/api/consultation/retry-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consultation_id: consultationId }),
      });
      const data = await res.json() as { success?: boolean; error?: string };
      if (data.success) {
        router.refresh();
      } else {
        setErrorMsg(data.error ?? 'Still busy — please try again in a few minutes.');
        setStatus('error');
      }
    } catch {
      setErrorMsg('Could not connect — please check your internet and try again.');
      setStatus('error');
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col items-center justify-center px-5">
      <div className="w-full max-w-sm text-center space-y-6">
        <div className="flex justify-center">
          <div className="rounded-full bg-amber-500/10 border border-amber-500/20 p-5">
            <Clock className="h-8 w-8 text-amber-400" />
          </div>
        </div>

        <div>
          <h1 className="text-xl font-bold text-[#f1f1f5] mb-2">Report is being prepared</h1>
          <p className="text-sm text-[#9090a8] leading-relaxed">
            The AI service was busy when your session ended. Your consultation data is safely saved — click below to generate your report now.
          </p>
        </div>

        {errorMsg && (
          <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-3">
            {errorMsg}
          </p>
        )}

        <button
          onClick={retry}
          disabled={status === 'loading'}
          className="w-full flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] transition-all text-white font-semibold text-sm py-3.5 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`h-4 w-4 ${status === 'loading' ? 'animate-spin' : ''}`} />
          {status === 'loading' ? 'Generating report…' : 'Generate My Report'}
        </button>

        {isOwn && (
          <Link
            href="/dashboard"
            className="flex items-center justify-center gap-2 text-sm text-[#60607a] hover:text-[#9090a8] transition-colors"
          >
            <LayoutDashboard className="h-4 w-4" />
            Back to Dashboard
          </Link>
        )}
      </div>
    </div>
  );
}
