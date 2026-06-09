import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { validateSession } from '@/lib/auth/session';
import { BroadcastBanner } from '@/components/BroadcastBanner';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const token = cookieStore.get('rm_session')?.value;

  if (!token) {
    redirect('/login');
  }

  const user = await validateSession(token);
  if (!user) {
    redirect('/login');
  }

  return (
    <>
      <BroadcastBanner />
      {children}
    </>
  );
}
