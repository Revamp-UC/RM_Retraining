'use client';

import { motion } from 'framer-motion';
import { WallDisplay } from './WallDisplay';
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
  const {
    status,
    errorMessage,
    isEnding,
    isCapturing,
    elapsedSeconds,
    startSession,
    endConsultation,
  } = useConsultationState({ consultationId, wsToken, moduleId });

  return (
    <div className="flex flex-col lg:flex-row lg:h-full gap-4 lg:gap-6 p-4 lg:p-6">

      {/* Wall panel — container appears quickly, internal elements animate at 1s via WallDisplay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3, delay: 0.05, ease: 'easeOut' }}
        className="w-full lg:w-1/2 h-[38vh] lg:h-full shrink-0"
      >
        <WallDisplay className="h-full" />
      </motion.div>

      {/* Customer info — appears first */}
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

    </div>
  );
}
