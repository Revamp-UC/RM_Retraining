import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { validateSession } from '@/lib/auth/session';
import { getTranscriptByConsultationId } from '@/lib/db/transcripts';

const ADMIN_MOBILES = new Set(['7880320915', '9871531279', '9873696654', '8439197965', '8393005909', '9034002226', '9997506778']);

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const cookieStore = await cookies();
  const token = cookieStore.get('rm_session')?.value;
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const user = await validateSession(token);
  if (!user || !ADMIN_MOBILES.has(user.mobile_number)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const { id } = await params;
  const transcript = await getTranscriptByConsultationId(id);
  return NextResponse.json({ transcript });
}
