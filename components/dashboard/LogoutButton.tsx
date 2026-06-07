'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleLogout} disabled={loading} className="shrink-0">
      {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
      <span className="hidden sm:inline">{loading ? 'Signing out…' : 'Logout'}</span>
    </Button>
  );
}
