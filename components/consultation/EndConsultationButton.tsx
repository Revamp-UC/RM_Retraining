'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { PhoneOff, Loader2, RefreshCw } from 'lucide-react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface EndConsultationButtonProps {
  onConfirm: () => void;
  disabled?: boolean;
  isEnding?: boolean;
  status: string;
}

export function EndConsultationButton({ onConfirm, disabled, isEnding, status }: EndConsultationButtonProps) {
  const [open, setOpen] = useState(false);
  const isConnected = status === 'connected';
  const isError = status === 'error';

  function handleConfirm() {
    setOpen(false);
    onConfirm();
  }

  // When evaluation failed, show a direct retry button (no dialog needed — session already ended)
  if (isError) {
    return (
      <motion.div whileTap={{ scale: 0.97 }}>
        <Button
          variant="outline"
          size="lg"
          className="w-full sm:w-auto h-14 px-8 text-base font-bold gap-3 border-indigo-500/40 text-indigo-400 hover:bg-indigo-600/10"
          onClick={onConfirm}
          disabled={disabled || isEnding}
        >
          {isEnding ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating Report…
            </>
          ) : (
            <>
              <RefreshCw className="h-5 w-5" />
              Retry Report
            </>
          )}
        </Button>
      </motion.div>
    );
  }

  return (
    <>
      <motion.div whileTap={{ scale: 0.97 }}>
        <Button
          variant="destructive"
          size="lg"
          className="w-full sm:w-auto h-14 px-8 text-base font-bold gap-3 shadow-xl shadow-red-900/30"
          onClick={() => setOpen(true)}
          disabled={disabled || isEnding || !isConnected}
        >
          {isEnding ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" />
              Generating Report…
            </>
          ) : (
            <>
              <PhoneOff className="h-5 w-5" />
              End Consultation
            </>
          )}
        </Button>
      </motion.div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>End this consultation?</DialogTitle>
            <DialogDescription>
              The session will be terminated and your AI-generated scorecard will be ready in a few seconds.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-2 gap-2 sm:gap-0">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Continue Session
            </Button>
            <Button variant="destructive" onClick={handleConfirm}>
              <PhoneOff className="h-4 w-4" />
              End & Get Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
