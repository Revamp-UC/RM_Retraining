import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { validateSession } from '@/lib/auth/session';
import { getModule1SkillGaps } from '@/lib/db/admin';
import type { SkillGapRM } from '@/lib/db/admin';
import { SkillGapList } from '@/components/admin/SkillGapList';
import { ArrowLeft, TrendingDown, Lock } from 'lucide-react';

export const dynamic = 'force-dynamic';

const ADMIN_MOBILES = new Set(['7880320915', '9871531279', '9873696654', '8439197965', '8393005909', '9034002226']);

// Only Module 1 is live for now; others render a "coming soon" state.
const MODULE_META: Record<string, { num: number; title: string }> = {
  'module-1': { num: 1, title: 'Know the Budget of Your Customer' },
};

export default async function SkillGapModulePage({
  params,
}: {
  params: Promise<{ moduleId: string }>;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get('rm_session')?.value;
  const user = token ? await validateSession(token) : null;
  if (!user || !ADMIN_MOBILES.has(user.mobile_number)) {
    redirect('/dashboard');
  }

  const { moduleId } = await params;
  const meta = MODULE_META[moduleId];

  let intro: SkillGapRM[] = [];
  let budget: SkillGapRM[] = [];
  if (moduleId === 'module-1') {
    const gaps = await getModule1SkillGaps();
    intro = gaps.introduction.filter(rm => !ADMIN_MOBILES.has(rm.mobile_number));
    budget = gaps.budget_discovery.filter(rm => !ADMIN_MOBILES.has(rm.mobile_number));
  }
  const distinct = new Set([...intro, ...budget].map(rm => rm.mobile_number)).size;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Header */}
      <div className="border-b border-[#1e1e28] bg-[#0a0a0f]/95 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <TrendingDown className="h-5 w-5 text-red-400 shrink-0" />
            <span className="text-sm font-bold text-[#f1f1f5] truncate">
              {meta ? `Module ${meta.num} · Needs Practice` : 'Needs Practice'}
            </span>
          </div>
          <Link
            href="/admin"
            className="flex items-center gap-2 rounded-lg border border-indigo-500/50 bg-indigo-600/15 hover:border-indigo-500/80 hover:bg-indigo-600/25 px-3.5 py-2 text-sm font-semibold text-indigo-300 hover:text-indigo-200 transition-all shrink-0"
          >
            <ArrowLeft className="h-4 w-4" />
            Admin Dashboard
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8 space-y-6">
        {!meta ? (
          <div className="rounded-xl border border-[#1e1e28] bg-[#13131a] px-6 py-20 text-center">
            <Lock className="h-8 w-8 text-[#3a3a4a] mx-auto mb-3" />
            <h2 className="text-base font-bold text-[#f1f1f5]">Data will be visible soon</h2>
            <p className="text-sm text-[#60607a] mt-1">This module&apos;s skill-gap breakdown isn&apos;t available yet.</p>
          </div>
        ) : (
          <>
            {/* Title block */}
            <div className="rounded-xl border border-[#1e1e28] bg-gradient-to-r from-red-500/8 to-transparent px-5 sm:px-6 py-5">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-lg font-bold text-[#f1f1f5]">These RMs Need Practice</h1>
                {distinct > 0 && (
                  <span className="text-[10px] font-bold text-red-400 bg-red-500/10 border border-red-500/25 rounded-full px-2 py-0.5">
                    {distinct} RM{distinct !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <p className="text-sm text-[#9090a8]">
                Module {meta.num} · {meta.title} — sub-skill mastery below 60% across all their Module {meta.num} sessions
              </p>
            </div>

            {/* Two sub-skills */}
            <div className="grid md:grid-cols-2 gap-5">
              <SkillGapList title="Introduction" rms={intro} />
              <SkillGapList title="Budget Discovery" rms={budget} />
            </div>
          </>
        )}
      </div>

      {/* Floating back button */}
      <Link
        href="/admin"
        className="fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full border border-[#2a2a38] bg-[#13131a]/90 backdrop-blur px-4 py-2.5 text-xs font-semibold text-[#9090a8] shadow-lg hover:border-indigo-500/40 hover:text-indigo-400 transition-all"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Admin Dashboard
      </Link>
    </div>
  );
}
