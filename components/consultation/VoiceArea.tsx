'use client';

import { motion } from 'framer-motion';
import { User, Clock } from 'lucide-react';
import { ConnectionIndicator } from './ConnectionIndicator';
import { MicVisualizer } from './MicVisualizer';
import { EndConsultationButton } from './EndConsultationButton';
import type { ConnectionStatus } from '@/types/gemini';

interface VoiceAreaProps {
  customerName: string;
  status: ConnectionStatus;
  isCapturing: boolean;
  isEnding: boolean;
  elapsedSeconds: number;
  onStart: () => void;
  onEnd: () => void;
  errorMessage: string | null;
}

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function VoiceArea({
  customerName,
  status,
  isCapturing,
  isEnding,
  elapsedSeconds,
  onStart,
  onEnd,
  errorMessage,
}: VoiceAreaProps) {
  const isIdle = status === 'idle';

  return (
    <div className="flex flex-col h-full min-h-[400px] lg:min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-xs font-semibold text-indigo-400 uppercase tracking-widest mb-1">Live Consultation</p>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-lg">
              <User className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-[#f1f1f5] text-lg leading-tight">{customerName}</h2>
              <p className="text-xs text-[#60607a]">Simulated Customer</p>
            </div>
          </div>
        </div>

        {status === 'connected' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center gap-1.5 rounded-lg border border-[#2a2a38] bg-[#13131a] px-3 py-1.5"
          >
            <Clock className="h-3.5 w-3.5 text-[#9090a8]" />
            <span className="text-sm font-mono font-medium text-[#f1f1f5]">{formatTime(elapsedSeconds)}</span>
          </motion.div>
        )}
      </div>

      {/* Connection status */}
      <div className="mb-6">
        <ConnectionIndicator status={status} />
      </div>

      {/* Error state */}
      {errorMessage && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3"
        >
          <p className="text-sm text-red-300">{errorMessage}</p>
        </motion.div>
      )}

      {/* Main voice visualizer area */}
      <div className="flex-1 flex flex-col items-center justify-center py-8">
        {isIdle ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center space-y-4"
          >
            <div className="w-20 h-20 rounded-full bg-[#1c1c26] border border-[#2a2a38] flex items-center justify-center mx-auto mb-2">
              <User className="h-9 w-9 text-[#60607a]" />
            </div>
            <div>
              <p className="text-[#9090a8] text-sm">Ready to connect with</p>
              <p className="text-[#f1f1f5] font-semibold text-xl mt-0.5">{customerName}</p>
            </div>
            <button
              onClick={onStart}
              className="mt-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-semibold text-base px-8 py-3.5 transition-all duration-200 shadow-xl shadow-indigo-900/40"
            >
              Start Consultation
            </button>
            <p className="text-xs text-[#60607a] mt-2">Allow microphone access when prompted</p>
          </motion.div>
        ) : (
          <MicVisualizer isActive={isCapturing} status={status} />
        )}
      </div>

      {/* End button */}
      {!isIdle && (
        <div className="pt-4 border-t border-[#2a2a38]">
          <EndConsultationButton
            status={status}
            onConfirm={onEnd}
            isEnding={isEnding}
            disabled={isEnding}
          />
        </div>
      )}

      {/* Hint text */}
      {status === 'connected' && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-xs text-[#60607a] mt-3"
        >
          Speak naturally — the customer will respond automatically
        </motion.p>
      )}
    </div>
  );
}
