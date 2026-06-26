import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { validateSession } from '@/lib/auth/session';
import { generateCustomer } from '@/lib/utils/name-generator';
import { createConsultation } from '@/lib/db/consultations';
import { createWsToken } from '@/lib/auth/session';
import { getTaskConfig, getModuleConfig } from '@/lib/config/modules';
import { ConsultationClient } from '@/components/consultation/ConsultationClient';
import { PreStartModal } from '@/components/consultation/PreStartModal';
import { NIOBrandPanel } from '@/components/consultation/NIOBrandPanel';
import { QuizClient } from '@/components/quiz/QuizClient';
import { PlaybookViewer } from '@/components/playbook/PlaybookViewer';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface TaskPageProps {
  params: Promise<{ moduleId: string; taskId: string }>;
}

export default async function ConsultationPage({ params }: TaskPageProps) {
  const { moduleId, taskId } = await params;

  // Validate module + task — coming_soon tasks return 404
  const taskConfig = getTaskConfig(moduleId, taskId);
  if (!taskConfig || taskConfig.status !== 'active') notFound();

  const cookieStore = await cookies();
  const token = cookieStore.get('rm_session')?.value;
  if (!token) redirect('/login');

  const user = await validateSession(token);
  if (!user) redirect('/login');

  const ADMIN_MOBILES = new Set(['7880320915', '9871531279', '9873696654', '8439197965', '8393005909', '9034002226', '9997506778', '9045321000', '9889083993']);
  const moduleConfig = getModuleConfig(moduleId);
  if (moduleConfig?.adminOnly && !ADMIN_MOBILES.has(user.mobile_number)) notFound();

  const moduleNumber = moduleId.replace('module_', '');
  const taskNumber = taskId.replace('task_', '');

  // ─── Quiz task — no DB record, no WS, two-column layout with NIO brand panel ─
  if (taskConfig.type === 'quiz') {
    return (
      <div className="h-screen bg-[#0a0a0f] flex flex-col overflow-hidden">
        {/* Ambient glows */}
        <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-20 h-[500px] w-[600px] rounded-full bg-emerald-900/12 blur-[120px]" />
          <div className="absolute bottom-0 right-0 h-[400px] w-[500px] rounded-full bg-emerald-900/8 blur-[100px]" />
        </div>

        <header className="relative flex items-center justify-between px-4 lg:px-6 py-3 border-b border-[#2a2a38] bg-[#13131a]/90 backdrop-blur-sm shrink-0 z-10">
          <div className="flex items-center gap-3">
            <Link
              href={`/module/${moduleId}`}
              className="p-2 rounded-lg text-[#9090a8] hover:text-[#f1f1f5] hover:bg-[#1c1c26] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <p className="text-xs text-emerald-400 font-medium">Module {moduleNumber}</p>
              <h1 className="text-sm font-semibold text-[#f1f1f5]">Task {taskNumber} of Module {moduleNumber}</h1>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#60607a]">RM Retraining</p>
            <p className="text-xs text-[#9090a8] font-medium">{user.name}</p>
          </div>
        </header>

        <main className="relative flex-1 flex flex-col lg:flex-row gap-4 lg:gap-6 p-4 lg:p-6 min-h-0 overflow-hidden">
          {/* Left: NIO brand panel — hidden on mobile */}
          <div className="hidden lg:block lg:w-[380px] shrink-0 h-full">
            <NIOBrandPanel className="h-full" />
          </div>

          {/* Right: Quiz — scrollable */}
          <div className="flex-1 h-full overflow-y-auto">
            <QuizClient moduleId={moduleId} moduleAttempted={taskConfig.moduleAttempted} />
          </div>
        </main>
      </div>
    );
  }

  // ─── Playbook task — static PDF reader, no DB record ─────────────────────
  if (taskConfig.type === 'playbook') {
    return (
      <div className="h-screen bg-[#0a0a0f] flex flex-col overflow-hidden">
        <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-20 h-[500px] w-[600px] rounded-full bg-emerald-900/10 blur-[120px]" />
          <div className="absolute bottom-0 left-0 h-[400px] w-[500px] rounded-full bg-emerald-900/8 blur-[100px]" />
        </div>

        <header className="relative flex items-center justify-between px-4 lg:px-6 py-3 border-b border-[#2a2a38] bg-[#13131a]/90 backdrop-blur-sm shrink-0 z-10">
          <div className="flex items-center gap-3">
            <Link
              href={`/module/${moduleId}`}
              className="p-2 rounded-lg text-[#9090a8] hover:text-[#f1f1f5] hover:bg-[#1c1c26] transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
            </Link>
            <div>
              <p className="text-xs text-emerald-400 font-medium">Module {moduleNumber}</p>
              <h1 className="text-sm font-semibold text-[#f1f1f5]">Task {taskNumber} of Module {moduleNumber}</h1>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#60607a]">RM Retraining</p>
            <p className="text-xs text-[#9090a8] font-medium">{user.name}</p>
          </div>
        </header>

        <main className="relative flex-1 flex flex-col min-h-0 overflow-hidden">
          <PlaybookViewer />
        </main>
      </div>
    );
  }

  // ─── Consultation task — existing flow ────────────────────────────────────
  const { name: customerName, gender: customerGender } = generateCustomer();

  const consultation = await createConsultation({
    mobile_number: user.mobile_number,
    module_attempted: taskConfig.moduleAttempted,
    customer_name: customerName,
    customer_gender: customerGender,
  });

  const wsToken = createWsToken({
    mobile_number: user.mobile_number,
    consultation_id: consultation.id,
    customer_name: customerName,
    customer_gender: customerGender,
    module_attempted: taskConfig.moduleAttempted,
  });

  return (
    <div className="h-screen bg-[#0a0a0f] flex flex-col overflow-hidden">
      <PreStartModal rmName={user.name} moduleId={moduleId} />
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-[#2a2a38] bg-[#13131a] shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href={`/module/${moduleId}`}
            className="p-2 rounded-lg text-[#9090a8] hover:text-[#f1f1f5] hover:bg-[#1c1c26] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-xs text-indigo-400 font-medium">Module {moduleNumber}</p>
            <h1 className="text-sm font-semibold text-[#f1f1f5]">Task {taskNumber} of Module {moduleNumber}</h1>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#60607a]">RM Retraining</p>
          <p className="text-xs text-[#9090a8] font-medium">{user.name}</p>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto lg:overflow-hidden">
        <ConsultationClient
          consultationId={consultation.id}
          wsToken={wsToken}
          customerName={customerName}
          customerGender={customerGender}
          moduleId={moduleId}
          taskId={taskId}
        />
      </main>
    </div>
  );
}
