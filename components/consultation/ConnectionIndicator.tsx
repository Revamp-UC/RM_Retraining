'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Wifi, WifiOff, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import type { ConnectionStatus } from '@/types/gemini';
import { cn } from '@/lib/utils/cn';

interface ConnectionIndicatorProps {
  status: ConnectionStatus;
}

const CONFIG: Record<ConnectionStatus, { label: string; color: string; dotColor: string; Icon: React.ElementType; pulse: boolean }> = {
  idle: { label: 'Ready to connect', color: 'text-[#60607a]', dotColor: 'bg-[#60607a]', Icon: Wifi, pulse: false },
  connecting: { label: 'Connecting…', color: 'text-amber-400', dotColor: 'bg-amber-400', Icon: Loader2, pulse: true },
  connected: { label: 'Live Session', color: 'text-emerald-400', dotColor: 'bg-emerald-400', Icon: CheckCircle2, pulse: true },
  ending: { label: 'Ending session…', color: 'text-amber-400', dotColor: 'bg-amber-400', Icon: Loader2, pulse: false },
  error: { label: 'Connection failed', color: 'text-red-400', dotColor: 'bg-red-400', Icon: AlertCircle, pulse: false },
  completed: { label: 'Session complete', color: 'text-indigo-400', dotColor: 'bg-indigo-400', Icon: CheckCircle2, pulse: false },
};

export function ConnectionIndicator({ status }: ConnectionIndicatorProps) {
  const { label, color, dotColor, Icon, pulse } = CONFIG[status];
  const isSpinner = status === 'connecting' || status === 'ending';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: -4 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 4 }}
        transition={{ duration: 0.2 }}
        className="flex items-center gap-2"
      >
        <span className="relative flex h-2.5 w-2.5">
          <span className={cn(
            'absolute inline-flex h-full w-full rounded-full',
            dotColor,
            pulse && 'animate-ping opacity-75',
          )} />
          <span className={cn('relative inline-flex rounded-full h-2.5 w-2.5', dotColor)} />
        </span>
        <Icon className={cn('h-3.5 w-3.5', color, isSpinner && 'animate-spin')} />
        <span className={cn('text-sm font-medium', color)}>{label}</span>
      </motion.div>
    </AnimatePresence>
  );
}
