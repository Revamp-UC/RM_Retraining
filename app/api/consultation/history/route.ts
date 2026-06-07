import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth/session';
import { getConsultationHistory, getModuleStats } from '@/lib/db/consultations';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const token = req.cookies.get('rm_session')?.value;
  if (!token) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const user = await validateSession(token);
  if (!user) {
    return NextResponse.json({ error: 'Session expired' }, { status: 401 });
  }

  const history = await getConsultationHistory(user.mobile_number);

  // Compute per-module stats
  const moduleIds = ['module_1_seepage'];
  const statsMap: Record<string, Awaited<ReturnType<typeof getModuleStats>>> = {};
  for (const moduleId of moduleIds) {
    statsMap[moduleId] = await getModuleStats(user.mobile_number, moduleId);
  }

  return NextResponse.json({ history, stats: statsMap });
}
