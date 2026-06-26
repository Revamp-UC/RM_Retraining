import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { validateSession } from '@/lib/auth/session';
import { getRMConsultations, getRMName } from '@/lib/db/admin';
import { TranscriptViewer } from '@/components/admin/TranscriptViewer';
import { ArrowLeft, Trophy, RotateCcw, Clock, User, ChevronLeft, FileBarChart } from 'lucide-react';
import type { AdminConsultation } from '@/lib/db/admin';
import { normaliseScore, NORMALISED_MAX } from '@/lib/config/modules';

export const dynamic = 'force-dynamic';

const ADMIN_MOBILES = new Set(['7880320915', '9871531279', '9873696654', '8439197965', '8393005909', '9034002226', '9997506778']);

function formatDuration(seconds: number | null): string {
  if (!seconds) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}m ${s}s`;
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function getSessionMax(c: AdminConsultation): number {
  if (c.customer_name === 'Quiz') return 15;
  const s = c.report_card_json?.sections;
  if (!s) return 45;
  return Object.values(s).reduce((sum, section) => sum + (section?.max_score ?? 0), 0);
}

function ScoreChip({ score, max }: { score: number | null; max: number }) {
  if (score === null)
    return <span className="text-xs text-[#60607a]">Not scored</span>;
  const pct = (score / max) * 100;
  const cls =
    pct >= 80
      ? 'bg-green-500/12 border-green-500/30 text-green-400'
      : pct >= 60
        ? 'bg-amber-500/12 border-amber-500/30 text-amber-400'
        : 'bg-red-500/12 border-red-500/30 text-red-400';
  return (
    <span className={`inline-block rounded-lg border px-3 py-1 text-base font-bold ${cls}`}>
      {score}/{max}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === 'completed')
    return (
      <span className="rounded-full bg-green-500/10 border border-green-500/20 px-2.5 py-0.5 text-[10px] font-bold text-green-400 uppercase tracking-wider">
        Completed
      </span>
    );
  if (status === 'evaluation_pending')
    return (
      <span className="rounded-full bg-amber-500/10 border border-amber-500/20 px-2.5 py-0.5 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
        Pending Report
      </span>
    );
  if (status === 'abandoned')
    return (
      <span className="rounded-full bg-red-500/10 border border-red-500/20 px-2.5 py-0.5 text-[10px] font-bold text-red-400 uppercase tracking-wider">
        Abandoned
      </span>
    );
  return (
    <span className="rounded-full bg-[#1c1c26] border border-[#2a2a38] px-2.5 py-0.5 text-[10px] font-bold text-[#60607a] uppercase tracking-wider">
      {status}
    </span>
  );
}

function SubScoreRow({ label, score, max }: { label: string; score: number | null; max: number }) {
  if (score === null) return null;
  const pct = Math.min(100, Math.round((score / max) * 100));
  const barColor = pct >= 80 ? 'bg-green-500' : pct >= 60 ? 'bg-amber-500' : 'bg-red-500';
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-[#60607a] w-36 shrink-0">{label}</span>
      <div className="flex-1 h-1.5 rounded-full bg-[#1e1e28] overflow-hidden">
        <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium text-[#9090a8] w-12 text-right">{score}/{max}</span>
    </div>
  );
}

const MODULE_ID_MAP: Record<string, string> = {
  module_1_seepage: 'module_1',
  module_1_task2: 'module_1',
  module_1_task3: 'module_1',
  module_2_task1: 'module_2',
  module_2_task2: 'module_2',
  module_3_task1: 'module_3',
  module_3_task2: 'module_3',
  module_3_task3: 'module_3',
  module_4_task1: 'module_4',
  module_5_task1: 'module_5',
};

const MODULE_TASK_LABEL: Record<string, string> = {
  module_1_seepage: 'Module 1 · Task 1',
  module_1_task2: 'Module 1 · Task 2',
  module_1_task3: 'Module 1 · Task 3',
  module_2_task1: 'Module 2 · Task 1',
  module_2_task2: 'Module 2 · Task 2',
  module_3_task1: 'Module 3 · Task 1',
  module_3_task2: 'Module 3 · Task 2',
  module_3_task3: 'Module 3 · Task 3',
  module_4_task1: 'Module 4 · Task 1',
  module_5_task1: 'Module 5 · Roleplay',
  module_5_task2: 'Module 5 · Quiz',
};

const SECTION_LABELS: Record<string, string> = {
  introduction: 'Introduction',
  technical: 'Technical Knowledge',
  budget_discovery: 'Budget Discovery',
  discovery_confidence: 'Discovery Confidence',
  market_comparison: 'Market Comparison',
  empathy_validation: 'Empathy & Validation',
  personalisation_respect: 'Personalisation',
  discovery_leaning: 'Discovery',
  expert_recommendation: 'Expert Recommendation',
  reinforcement_tools: 'Reinforcement Tools',
  confidence_building: 'Confidence Building',
  lever_used: 'Lever Used',
  confidence_objection: 'Trust & Confidence',
  personalization: 'Personalisation',
  discovery_questions: 'Discovery Questions',
  discount_lever: 'Discount Lever Execution',
  trust_confidence: 'Trust Building & Confidence',
};

function toModuleId(moduleAttempted: string): string {
  return MODULE_ID_MAP[moduleAttempted] ?? moduleAttempted;
}

function toTaskLabel(moduleAttempted: string): string {
  return MODULE_TASK_LABEL[moduleAttempted] ?? moduleAttempted;
}

function ConsultationCard({ c, index }: { c: AdminConsultation; index: number }) {
  const isQuiz = c.customer_name === 'Quiz';
  const gender = c.customer_gender === 'female' ? 'F' : 'M';
  const sessionMax = getSessionMax(c);
  const s = c.report_card_json?.sections;

  return (
    <div className="rounded-xl border border-[#1e1e28] bg-[#13131a] p-5">
      {/* Card header */}
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
              Session #{index}
            </span>
            <span className="text-[10px] font-semibold text-[#9090a8] bg-[#1c1c26] border border-[#2a2a38] rounded px-1.5 py-0.5">
              {toTaskLabel(c.module_attempted)}
            </span>
            <StatusBadge status={c.status} />
            {!isQuiz && (c.status === 'completed' || c.status === 'evaluation_pending') && (
              <Link
                href={`/module/${toModuleId(c.module_attempted)}/report/${c.id}`}
                className="flex items-center gap-1 rounded-md border border-indigo-500/30 bg-indigo-600/10 px-2 py-0.5 text-[10px] font-semibold text-indigo-400 hover:bg-indigo-600/20 hover:border-indigo-500/45 transition-colors"
              >
                <FileBarChart className="h-3 w-3" />
                {c.status === 'evaluation_pending' ? 'Retry Report' : 'Report'}
              </Link>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-[#60607a] mt-1">
            {!isQuiz && (
              <span className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {c.customer_name ?? 'Customer'} ({gender})
              </span>
            )}
            {!isQuiz && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {formatDuration(c.duration_seconds)}
              </span>
            )}
            <span>{formatDate(c.attempt_date)} · {c.attempt_time?.slice(0, 5)}</span>
          </div>
        </div>
        <ScoreChip score={c.overall_score} max={sessionMax} />
      </div>

      {/* Sub-scores — render dynamically from report_card_json for any module */}
      {c.status === 'completed' && s && Object.keys(s).length > 0 && (
        <div className="space-y-1.5 mb-3 border-t border-[#1a1a24] pt-3">
          {Object.entries(s).map(([key, sec]) => (
            <SubScoreRow
              key={key}
              label={SECTION_LABELS[key] ?? key}
              score={sec.score}
              max={sec.max_score}
            />
          ))}
        </div>
      )}

      {/* Transcript toggle */}
      <TranscriptViewer consultationId={c.id} />
    </div>
  );
}

export default async function RMDetailPage({
  params,
}: {
  params: Promise<{ mobile: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('rm_session')?.value;
  const user = token ? await validateSession(token) : null;

  if (!user || !ADMIN_MOBILES.has(user.mobile_number)) {
    redirect('/dashboard');
  }

  const { mobile } = await params;
  const [rmName, allConsultations] = await Promise.all([
    getRMName(mobile),
    getRMConsultations(mobile),
  ]);

  if (!rmName) notFound();

  // Only show sessions where a real conversation happened:
  // completed/evaluation_pending (any duration) OR in-progress with ≥60s of talk time
  const consultations = allConsultations.filter(
    c =>
      c.status === 'completed' ||
      c.status === 'evaluation_pending' ||
      (c.duration_seconds !== null && c.duration_seconds >= 60),
  );

  const completed = consultations.filter(c => c.status === 'completed' || c.status === 'evaluation_pending');
  // Aggregate Best/Avg are normalised to /50 (tasks have different max marks).
  // Per-session scores below keep their real max via getSessionMax().
  const normScores = completed
    .filter(c => c.overall_score !== null && c.customer_name !== 'Quiz')
    .map(c => normaliseScore(c.overall_score as number, c.module_attempted));
  const bestScore = normScores.length > 0 ? Math.round(Math.max(...normScores)) : null;
  const avgScore =
    normScores.length > 0
      ? Math.round(normScores.reduce((a, b) => a + b, 0) / normScores.length)
      : null;

  const maskedMobile = mobile.slice(0, 5) + 'XXXXX';

  return (
    <div className="min-h-screen bg-[#0a0a0f]">

      {/* Header */}
      <div className="border-b border-[#1e1e28] bg-[#0a0a0f]/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-6 h-14 flex items-center gap-4">
          <Link
            href="/admin"
            className="flex items-center gap-1.5 text-xs text-[#60607a] hover:text-[#9090a8] transition-colors shrink-0"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Admin
          </Link>
          <div className="h-4 w-px bg-[#2a2a38]" />
          <span className="text-sm font-bold text-[#f1f1f5] truncate">{rmName}</span>
          <span className="text-xs text-[#60607a] shrink-0">{maskedMobile}</span>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Summary strip */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-xl border border-[#1e1e28] bg-[#13131a] px-4 py-3 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <RotateCcw className="h-3.5 w-3.5 text-indigo-400" />
              <p className="text-[10px] font-bold text-[#60607a] uppercase tracking-wider">Sessions</p>
            </div>
            <p className="text-2xl font-bold text-[#f1f1f5]">{consultations.length}</p>
            <p className="text-xs text-[#60607a]">{completed.length} completed</p>
          </div>
          <div className="rounded-xl border border-[#1e1e28] bg-[#13131a] px-4 py-3 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <Trophy className="h-3.5 w-3.5 text-amber-400" />
              <p className="text-[10px] font-bold text-[#60607a] uppercase tracking-wider">Best Score</p>
            </div>
            <p className={`text-2xl font-bold ${bestScore !== null && bestScore >= 36 ? 'text-green-400' : bestScore !== null && bestScore >= 27 ? 'text-amber-400' : bestScore !== null ? 'text-red-400' : 'text-[#60607a]'}`}>
              {bestScore !== null ? bestScore : '—'}
              {bestScore !== null && <span className="text-sm font-normal text-[#60607a]">/{NORMALISED_MAX}</span>}
            </p>
          </div>
          <div className="rounded-xl border border-[#1e1e28] bg-[#13131a] px-4 py-3 text-center">
            <div className="flex items-center justify-center gap-1.5 mb-1">
              <RotateCcw className="h-3.5 w-3.5 text-[#9090a8]" />
              <p className="text-[10px] font-bold text-[#60607a] uppercase tracking-wider">Avg Score</p>
            </div>
            <p className={`text-2xl font-bold ${avgScore !== null && avgScore >= 36 ? 'text-green-400' : avgScore !== null && avgScore >= 27 ? 'text-amber-400' : avgScore !== null ? 'text-red-400' : 'text-[#60607a]'}`}>
              {avgScore !== null ? avgScore : '—'}
              {avgScore !== null && <span className="text-sm font-normal text-[#60607a]">/{NORMALISED_MAX}</span>}
            </p>
          </div>
        </div>

        {/* Consultations timeline */}
        {consultations.length === 0 ? (
          <div className="rounded-xl border border-[#1e1e28] bg-[#13131a] px-5 py-12 text-center">
            <p className="text-sm text-[#60607a]">No consultation sessions recorded yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {consultations.map((c, i) => (
              <ConsultationCard key={c.id} c={c} index={consultations.length - i} />
            ))}
          </div>
        )}

      </div>

      {/* Floating back button — always visible regardless of scroll */}
      <Link
        href="/admin"
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full border border-[#2a2a38] bg-[#13131a]/90 backdrop-blur px-4 py-2.5 text-xs font-semibold text-[#9090a8] shadow-lg hover:border-indigo-500/40 hover:text-indigo-400 transition-all"
      >
        <ChevronLeft className="h-3.5 w-3.5" />
        Admin
      </Link>
    </div>
  );
}
