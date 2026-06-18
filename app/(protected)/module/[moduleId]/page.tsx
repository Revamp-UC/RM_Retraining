import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { validateSession } from '@/lib/auth/session';
import { getModuleStats } from '@/lib/db/consultations';
import { getModuleConfig } from '@/lib/config/modules';
import { ArrowLeft, ChevronRight, Lock, Trophy, RotateCcw, Target, BookOpen } from 'lucide-react';
import { formatScore, formatDate } from '@/lib/utils/formatters';
import type { ModuleStats } from '@/types/consultation';

interface ModulePageProps {
  params: Promise<{ moduleId: string }>;
}

export default async function ModuleTaskListPage({ params }: ModulePageProps) {
  const { moduleId } = await params;

  const moduleConfig = getModuleConfig(moduleId);
  if (!moduleConfig) notFound();

  const cookieStore = await cookies();
  const token = cookieStore.get('rm_session')?.value;
  if (!token) redirect('/login');

  const user = await validateSession(token);
  if (!user) redirect('/login');

  const ADMIN_MOBILES = new Set(['7880320915', '9871531279', '9873696654', '8439197965']);
  if (moduleConfig.adminOnly && !ADMIN_MOBILES.has(user.mobile_number)) notFound();

  // Fetch stats for each active task that writes to the DB (consultation + quiz; not playbook)
  const statsMap: Record<string, ModuleStats | null> = {};
  for (const task of moduleConfig.tasks) {
    if (task.status === 'active' && task.type !== 'playbook' && task.moduleAttempted) {
      statsMap[task.id] = await getModuleStats(user.mobile_number, task.moduleAttempted);
    }
  }

  const moduleNumber = moduleId.replace('module_', '');

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-60 left-1/2 -translate-x-1/2 h-[500px] w-[800px] rounded-full bg-indigo-900/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 flex items-center gap-4 px-4 lg:px-6 py-3 border-b border-[#2a2a38] bg-[#0a0a0f]/90 backdrop-blur-sm">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 p-2 rounded-lg text-[#9090a8] hover:text-[#f1f1f5] hover:bg-[#1c1c26] transition-colors shrink-0"
        >
          <ArrowLeft className="h-4 w-4" />
        </Link>
        <div>
          <p className="text-xs text-indigo-400 font-medium">Module {moduleNumber}</p>
          <h1 className="text-sm font-semibold text-[#f1f1f5] leading-tight">{moduleConfig.title}</h1>
        </div>
      </header>

      <div className="relative max-w-2xl mx-auto px-4 py-8">

        {/* Module header */}
        <div className="mb-7">
          <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Module {moduleNumber}</p>
          <h2 className="text-2xl font-bold text-[#f1f1f5] leading-snug">{moduleConfig.title}</h2>
          <p className="text-sm text-[#60607a] mt-1.5">{moduleConfig.description}</p>
        </div>

        {/* Task list */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-[#9090a8] uppercase tracking-widest">
            Tasks · {moduleConfig.tasks.filter(t => t.status === 'active').length} of {moduleConfig.tasks.length} active
          </p>
        </div>

        <div className="space-y-3">
          {moduleConfig.tasks.map((task, i) => {
            const taskNumber = i + 1;
            const taskStats = statsMap[task.id] ?? null;

            if (task.status === 'coming_soon') {
              return (
                <div
                  key={task.id}
                  className="rounded-xl border border-[#1e1e28] bg-[#0f0f16] px-5 py-4 flex items-center gap-4 opacity-50"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-[#1c1c26] shrink-0">
                    <Lock className="h-3.5 w-3.5 text-[#60607a]" />
                  </div>
                  <span className="flex-1 text-sm font-semibold text-[#60607a]">Task {taskNumber}</span>
                  <span className="text-[11px] font-semibold text-[#60607a] bg-[#1c1c26] border border-[#2a2a38] rounded-full px-3 py-1">
                    Coming Soon
                  </span>
                </div>
              );
            }

            const isQuiz = task.type === 'quiz';
            const isPlaybook = task.type === 'playbook';

            return (
              <Link
                key={task.id}
                href={`/module/${moduleId}/${task.id}`}
                className={`block rounded-xl border bg-gradient-to-br from-[#13131a] to-[#1a1a28] active:scale-[0.99] transition-all duration-200 overflow-hidden p-5 ${
                  isPlaybook
                    ? 'border-amber-500/40 hover:border-amber-500/70 hover:shadow-xl hover:shadow-amber-900/20'
                    : isQuiz
                    ? 'border-emerald-500/40 hover:border-emerald-500/70 hover:shadow-xl hover:shadow-emerald-900/20'
                    : 'border-indigo-500/40 hover:border-indigo-500/70 hover:shadow-xl hover:shadow-indigo-900/25'
                }`}
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-lg text-white font-bold text-sm shadow-lg shrink-0 ${
                      isPlaybook ? 'bg-amber-600 shadow-amber-900/40' : isQuiz ? 'bg-emerald-600 shadow-emerald-900/40' : 'bg-indigo-600 shadow-indigo-900/40'
                    }`}>
                      {isPlaybook || isQuiz ? <BookOpen className="h-4 w-4" /> : taskNumber}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className={`text-[10px] font-bold uppercase tracking-widest ${isPlaybook ? 'text-amber-400' : isQuiz ? 'text-emerald-400' : 'text-indigo-400'}`}>
                          Task {taskNumber}
                        </p>
                        {isPlaybook && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-amber-500/15 text-amber-400 border border-amber-500/25 rounded-full px-2 py-0.5">
                            Playbook
                          </span>
                        )}
                        {isQuiz && (
                          <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/25 rounded-full px-2 py-0.5">
                            Quiz
                          </span>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-[#f1f1f5]">{task.title}</h3>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-[#60607a] shrink-0 mt-1" />
                </div>

                <div className={`flex items-start gap-2.5 rounded-lg px-3.5 py-2.5 mb-4 ${
                  isPlaybook
                    ? 'bg-amber-600/10 border border-amber-500/20'
                    : isQuiz
                    ? 'bg-emerald-600/10 border border-emerald-500/20'
                    : 'bg-indigo-600/10 border border-indigo-500/20'
                }`}>
                  {isPlaybook
                    ? <BookOpen className="h-3.5 w-3.5 text-amber-400 shrink-0 mt-0.5" />
                    : isQuiz
                    ? <BookOpen className="h-3.5 w-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    : <Target className="h-3.5 w-3.5 text-indigo-400 shrink-0 mt-0.5" />
                  }
                  <p className="text-xs text-[#c8c8e0]">{task.description}</p>
                </div>

                <div className="pt-3.5 border-t border-[#2a2a38]">
                  {isPlaybook ? (
                    <p className="text-xs text-[#60607a]">15 pages · read & learn · open anytime</p>
                  ) : isQuiz && taskStats && taskStats.attempt_count > 0 ? (
                    <div className="flex items-center gap-5 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <RotateCcw className="h-3.5 w-3.5 text-[#9090a8]" />
                        <span className="text-xs text-[#9090a8]">
                          <span className="text-[#f1f1f5] font-semibold">{taskStats.attempt_count}</span>{' '}
                          attempt{taskStats.attempt_count !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {taskStats.last_score !== null && (
                        <div className="flex items-center gap-1.5">
                          <Trophy className="h-3.5 w-3.5 text-emerald-400" />
                          <span className="text-xs text-[#9090a8]">
                            Last: <span className="text-emerald-400 font-semibold">{taskStats.last_score}/{15}</span>
                          </span>
                        </div>
                      )}
                      {taskStats.last_attempt_date && (
                        <span className="text-xs text-[#60607a]">{formatDate(taskStats.last_attempt_date)}</span>
                      )}
                    </div>
                  ) : isQuiz ? (
                    <p className="text-xs text-[#60607a]">15 questions · instant feedback · retake anytime</p>
                  ) : taskStats && taskStats.attempt_count > 0 ? (
                    <div className="flex items-center gap-5 flex-wrap">
                      <div className="flex items-center gap-1.5">
                        <RotateCcw className="h-3.5 w-3.5 text-[#9090a8]" />
                        <span className="text-xs text-[#9090a8]">
                          <span className="text-[#f1f1f5] font-semibold">{taskStats.attempt_count}</span>{' '}
                          attempt{taskStats.attempt_count !== 1 ? 's' : ''}
                        </span>
                      </div>
                      {taskStats.last_score !== null && (
                        <div className="flex items-center gap-1.5">
                          <Trophy className="h-3.5 w-3.5 text-amber-400" />
                          <span className="text-xs text-[#9090a8]">
                            Last: <span className="text-amber-400 font-semibold">{formatScore(taskStats.last_score)}</span>
                          </span>
                        </div>
                      )}
                      {taskStats.last_attempt_date && (
                        <span className="text-xs text-[#60607a]">{formatDate(taskStats.last_attempt_date)}</span>
                      )}
                    </div>
                  ) : (
                    <p className="text-xs text-[#60607a]">No attempts yet — tap to start your first session</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
