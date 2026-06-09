'use client';

import { Megaphone, X } from 'lucide-react';
import { useBroadcastMessage } from '@/hooks/useBroadcastMessage';

export function BroadcastBanner() {
  const { message, dismiss } = useBroadcastMessage();
  if (!message) return null;

  return (
    <div className="flex items-start gap-3 bg-amber-500 px-4 py-3 shadow-md">
      <Megaphone className="h-4 w-4 text-amber-950 shrink-0 mt-0.5" />
      <p className="flex-1 text-sm font-medium text-amber-950 leading-snug">{message}</p>
      <button
        onClick={dismiss}
        aria-label="Dismiss"
        className="shrink-0 text-amber-800 hover:text-amber-950 transition-colors"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
