import { NextResponse } from 'next/server';
import { db } from '@/lib/db/client';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const { data } = await db
      .from('app_config')
      .select('value')
      .eq('key', 'broadcast_message')
      .maybeSingle();
    return NextResponse.json({ message: data?.value ?? '' });
  } catch {
    return NextResponse.json({ message: '' });
  }
}
