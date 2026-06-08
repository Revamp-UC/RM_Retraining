import { cookies } from 'next/headers';
import { redirect, notFound } from 'next/navigation';
import { validateSession } from '@/lib/auth/session';
import { generateCustomer } from '@/lib/utils/name-generator';
import { createConsultation } from '@/lib/db/consultations';
import { createWsToken } from '@/lib/auth/session';
import { ConsultationClient } from '@/components/consultation/ConsultationClient';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

const ACTIVE_MODULES = new Set(['module_1']);

interface ConsultationPageProps {
  params: Promise<{ moduleId: string }>;
}

export default async function ConsultationPage({ params }: ConsultationPageProps) {
  const { moduleId } = await params;

  if (!ACTIVE_MODULES.has(moduleId)) {
    notFound();
  }

  const cookieStore = await cookies();
  const token = cookieStore.get('rm_session')?.value;
  if (!token) redirect('/login');

  const user = await validateSession(token);
  if (!user) redirect('/login');

  // Create a fresh consultation on page load
  const { name: customerName, gender: customerGender } = generateCustomer();

  const moduleMap: Record<string, string> = { module_1: 'module_1_seepage' };
  const module_attempted = moduleMap[moduleId] ?? moduleId;

  const consultation = await createConsultation({
    mobile_number: user.mobile_number,
    module_attempted,
    customer_name: customerName,
    customer_gender: customerGender,
  });

  const wsToken = createWsToken({
    mobile_number: user.mobile_number,
    consultation_id: consultation.id,
    customer_name: customerName,
    customer_gender: customerGender,
    module_attempted,
  });

  return (
    <div className="h-screen bg-[#0a0a0f] flex flex-col overflow-hidden">
      {/* Top bar */}
      <header className="flex items-center justify-between px-4 lg:px-6 py-3 border-b border-[#2a2a38] bg-[#13131a] shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="p-2 rounded-lg text-[#9090a8] hover:text-[#f1f1f5] hover:bg-[#1c1c26] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <p className="text-xs text-indigo-400 font-medium">Module 1</p>
            <h1 className="text-sm font-semibold text-[#f1f1f5]">Seepage Wall Consultation</h1>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#60607a]">RM Retraining</p>
          <p className="text-xs text-[#9090a8] font-medium">{user.name}</p>
        </div>
      </header>

      {/* Main content — scrollable on mobile, fixed on desktop */}
      <main className="flex-1 overflow-y-auto lg:overflow-hidden">
        <ConsultationClient
          consultationId={consultation.id}
          wsToken={wsToken}
          customerName={customerName}
          customerGender={customerGender}
          moduleId={moduleId}
        />
      </main>
    </div>
  );
}
