import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { validateSession } from '@/lib/auth/session';
import { getConsultationById } from '@/lib/db/consultations';

const ADMIN_MOBILES = new Set(['7880320915', '9871531279', '9873696654']);
import { OverallScore } from '@/components/report/OverallScore';
import { SectionScore } from '@/components/report/SectionScore';
import { CriticalMistakes } from '@/components/report/CriticalMistakes';
import { ArrowLeft, RotateCcw, LayoutDashboard, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import type { ReportCard } from '@/types/consultation';
import { resolveTaskPath } from '@/lib/config/modules';

interface ReportPageProps {
  params: Promise<{ moduleId: string; consultationId: string }>;
}

const SECTION_ICONS: Record<string, React.ReactNode> = {
  introduction: <span className="text-sm">👋</span>,
  technical: <span className="text-sm">🔧</span>,
  budget_discovery: <span className="text-sm">💰</span>,
  discovery_confidence: <span className="text-sm">🎯</span>,
};

const SECTION_TITLES: Record<string, string> = {
  introduction: 'Introduction & Rapport',
  technical: 'Technical Knowledge',
  budget_discovery: 'Budget Discovery',
  discovery_confidence: 'Discovery & Confidence',
};

export default async function ReportPage({ params }: ReportPageProps) {
  const { moduleId, consultationId } = await params;

  const cookieStore = await cookies();
  const token = cookieStore.get('rm_session')?.value;
  if (!token) redirect('/login');

  const user = await validateSession(token);
  if (!user) redirect('/login');

  const isAdmin = ADMIN_MOBILES.has(user.mobile_number);

  const consultation = await getConsultationById(consultationId);
  if (!consultation || (!isAdmin && consultation.mobile_number !== user.mobile_number)) {
    notFound();
  }

  const isOwnReport = consultation.mobile_number === user.mobile_number;

  if (consultation.status !== 'completed' || !consultation.report_card_json) {
    redirect(isOwnReport ? `/module/${moduleId}` : '/admin');
  }

  const report = consultation.report_card_json as ReportCard;

  // Resolve the task-level URL for "Try Again" — falls back to module list if not found
  const taskRef = resolveTaskPath(consultation.module_attempted ?? '');
  const tryAgainHref = taskRef
    ? `/module/${taskRef.moduleId}/${taskRef.taskId}`
    : `/module/${moduleId}`;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Background */}
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 h-96 w-96 rounded-full bg-indigo-900/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center justify-between px-4 lg:px-6 py-3 border-b border-[#2a2a38] bg-[#0a0a0f]/90 backdrop-blur-sm">
        <Link
          href={isAdmin && !isOwnReport ? `/admin/rm/${consultation.mobile_number}` : '/dashboard'}
          className="flex items-center gap-2 p-2 rounded-lg text-[#9090a8] hover:text-[#f1f1f5] hover:bg-[#1c1c26] transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-medium hidden sm:inline">
            {isAdmin && !isOwnReport ? 'Back' : 'Dashboard'}
          </span>
        </Link>
        <div className="text-center">
          <p className="text-xs text-indigo-400 font-medium">
            {isAdmin && !isOwnReport ? 'Admin View · Report Card' : 'Module 1 · Report Card'}
          </p>
          <h1 className="text-sm font-semibold text-[#f1f1f5]">Seepage Wall Consultation</h1>
        </div>
        {isOwnReport ? (
          <Link
            href={tryAgainHref}
            className="flex items-center gap-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 transition-colors px-3 py-2 text-white text-xs font-semibold"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Retry</span>
          </Link>
        ) : (
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-lg border border-indigo-500/30 bg-indigo-600/10 px-3 py-2 text-indigo-400 text-xs font-semibold hover:bg-indigo-600/20 transition-colors"
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Admin</span>
          </Link>
        )}
      </header>

      {/* Content */}
      <main className="relative max-w-2xl mx-auto px-4 py-6 space-y-5">
        {/* Overall score */}
        <div className="rounded-xl border border-[#2a2a38] bg-[#13131a] overflow-hidden">
          <OverallScore
            score={report.overall_score}
            tier={report.performance_tier}
            customerName={consultation.customer_name ?? 'Customer'}
            duration={consultation.duration_seconds}
          />
        </div>

        {/* Section scores */}
        <div>
          <h2 className="text-xs font-semibold text-[#60607a] uppercase tracking-widest mb-3">Performance Breakdown</h2>
          <div className="space-y-3">
            {Object.entries(report.sections).map(([key, section], i) => (
              <SectionScore
                key={key}
                title={SECTION_TITLES[key] ?? key}
                result={section}
                index={i}
                icon={SECTION_ICONS[key]}
              />
            ))}
          </div>
        </div>

        {/* Critical mistakes + coaching */}
        <div>
          <h2 className="text-xs font-semibold text-[#60607a] uppercase tracking-widest mb-3">Coach&apos;s Assessment</h2>
          <CriticalMistakes
            mistakes={report.critical_mistakes}
            coachingFeedback={report.coaching_feedback}
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2 pb-8">
          {isOwnReport ? (
            <>
              <Link
                href={tryAgainHref}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-semibold text-sm py-3.5 transition-all shadow-lg shadow-indigo-900/30"
              >
                <RotateCcw className="h-4 w-4" />
                Try Again
              </Link>
              <Link
                href="/dashboard"
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#2a2a38] bg-[#13131a] hover:bg-[#1c1c26] text-[#f1f1f5] font-semibold text-sm py-3.5 transition-all"
              >
                <LayoutDashboard className="h-4 w-4" />
                Back to Dashboard
              </Link>
            </>
          ) : (
            <Link
              href={`/admin/rm/${consultation.mobile_number}`}
              className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-[#2a2a38] bg-[#13131a] hover:bg-[#1c1c26] text-[#f1f1f5] font-semibold text-sm py-3.5 transition-all"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to RM Profile
            </Link>
          )}
        </div>
      </main>
    </div>
  );
}
