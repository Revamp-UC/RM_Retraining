import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { validateSession } from '@/lib/auth/session';
import { generateCustomer } from '@/lib/utils/name-generator';
import { createConsultation } from '@/lib/db/consultations';
import { createWsToken } from '@/lib/auth/session';
import { getTaskConfig } from '@/lib/config/modules';
import { ConsultationClient } from '@/components/consultation/ConsultationClient';
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

  const moduleNumber = moduleId.replace('module_', '');
  const taskNumber = taskId.replace('task_', '');

  return (
    <div className="h-screen bg-[#0a0a0f] flex flex-col overflow-hidden">
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
            <p className="text-xs text-indigo-400 font-medium">
              Module {moduleNumber} · Task {taskNumber}
            </p>
            <h1 className="text-sm font-semibold text-[#f1f1f5]">{taskConfig.title}</h1>
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
