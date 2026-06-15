'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Volume2, X, Timer } from 'lucide-react';
import { WallDisplay } from './WallDisplay';
import { DesignGallery } from './DesignGallery';
import { DesignDetail } from './DesignDetail';
import { ScenarioModal } from './ScenarioModal';
import { VoiceArea } from './VoiceArea';
import { useConsultationState } from '@/hooks/useConsultationState';

interface ConsultationClientProps {
  consultationId: string;
  wsToken: string;
  customerName: string;
  customerGender: 'male' | 'female';
  moduleId: string;
  taskId: string;
}

export function ConsultationClient({
  consultationId,
  wsToken,
  customerName,
  customerGender,
  moduleId,
  taskId,
}: ConsultationClientProps) {
  const isModule2 = moduleId === 'module_2';
  const isModule3 = moduleId === 'module_3';
  const showScenario = isModule2 || isModule3;
  const [scenarioAcknowledged, setScenarioAcknowledged] = useState(false);

  const {
    status,
    errorMessage,
    isEnding,
    isCapturing,
    elapsedSeconds,
    noiseWarning,
    dismissNoiseWarning,
    timeWarning,
    startSession,
    endConsultation,
  } = useConsultationState({ consultationId, wsToken, moduleId });

  return (
    <div className="flex flex-col lg:flex-row lg:h-full gap-4 lg:gap-6 p-4 lg:p-6 relative">

      {/* Scenario modal for Module 2 & 3 — sits at z-50, revealed after PreStartModal (z-60) exits */}
      {showScenario && !scenarioAcknowledged && (
        <ScenarioModal onAcknowledge={() => setScenarioAcknowledged(true)} moduleId={moduleId} taskId={taskId} />
      )}

      {/* Left panel — WallDisplay for M1, DesignGallery for M2, DesignDetail for M3 */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05, ease: 'easeOut' }}
        className="w-full lg:w-1/2 h-[38vh] lg:h-full shrink-0"
      >
        {isModule3 ? (
          <DesignDetail className="h-full" taskId={taskId} />
        ) : isModule2 ? (
          <DesignGallery className="h-full" taskId={taskId} />
        ) : (
          <WallDisplay className="h-full" taskId={taskId} />
        )}
      </motion.div>

      {/* Right panel — VoiceArea */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.15, ease: 'easeOut' }}
        className="w-full lg:w-1/2 flex flex-col"
      >
        <div className="rounded-xl border border-[#2a2a38] bg-[#13131a] p-5 lg:p-6 flex-1">
          <VoiceArea
            customerName={customerName}
            customerGender={customerGender}
            taskId={taskId}
            moduleId={moduleId}
            status={status}
            isCapturing={isCapturing}
            isEnding={isEnding}
            elapsedSeconds={elapsedSeconds}
            onStart={startSession}
            onEnd={endConsultation}
            errorMessage={errorMessage}
          />
        </div>
      </motion.div>

      {/* Time limit warning toast */}
      <AnimatePresence>
        {timeWarning && !isEnding && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#1a1a2e] border border-red-500/40 rounded-xl px-4 py-3 shadow-2xl max-w-sm w-[calc(100%-2rem)]"
          >
            <Timer className="h-4 w-4 text-red-400 shrink-0 animate-pulse" />
            <p className="text-sm text-red-200/90 flex-1 leading-snug">
              1 minute left — session ends at 8 minutes. Wrap up now.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background noise warning toast */}
      <AnimatePresence>
        {noiseWarning && (
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-[#1a1a2e] border border-amber-500/30 rounded-xl px-4 py-3 shadow-2xl max-w-sm w-[calc(100%-2rem)]"
          >
            <Volume2 className="h-4 w-4 text-amber-400 shrink-0" />
            <p className="text-sm text-amber-200/90 flex-1 leading-snug">
              Background noise detected — please move to a quieter environment
            </p>
            <button
              onClick={dismissNoiseWarning}
              className="text-[#60607a] hover:text-[#9090a8] transition-colors shrink-0"
              aria-label="Dismiss"
            >
              <X className="h-4 w-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
