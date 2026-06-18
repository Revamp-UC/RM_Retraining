'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Clock, Sparkles, Home, Layers } from 'lucide-react';
import { ConnectionIndicator } from './ConnectionIndicator';
import { MicVisualizer } from './MicVisualizer';
import { EndConsultationButton } from './EndConsultationButton';
import type { ConnectionStatus } from '@/types/gemini';

const WALL_INSIGHTS = [
  "Transform your wall, transform your room.",
  "Luxury begins with the wall you look at every day.",
  "A beautiful wall creates a beautiful space.",
  "Give your home a designer touch — without major renovation.",
  "From plain walls to statement walls.",
  "Every great room starts with one great wall.",
  "The wall you choose reflects the home you envision.",
];

interface VoiceAreaProps {
  customerName: string;
  customerGender: 'male' | 'female';
  taskId?: string;
  moduleId?: string;
  status: ConnectionStatus;
  isCapturing: boolean;
  isEnding: boolean;
  elapsedSeconds: number;
  onStart: () => void;
  onEnd: () => void;
  errorMessage: string | null;
}

const CUSTOMER_PROFILE: Record<string, { age: string; home: string; scope?: string }> = {
  // Module 1
  task_1: { age: 'Homeowner', home: '2 BHK · Tier-1 City' },
  task_2: { age: '45 yr old', home: '3 BHK · Newly Built Flat', scope: '2 Wall Requirement' },
  task_3: { age: '40 yr old', home: '3 BHK · Gated Society, West Delhi', scope: 'Seepage Wall · Living Room' },
  // Module 2
  module_2_task_1: { age: 'Homeowner', home: 'Design Finalisation', scope: '3 Options Shown · Confused to Pick' },
  // Module 3
  module_3_task_1: { age: 'Homeowner', home: 'Booking Stage', scope: 'Design Finalised · Postponing' },
  module_3_task_2: { age: 'Homeowner', home: 'Booking Stage', scope: 'Satisfied · Wants Time' },
  module_3_task_3: { age: 'Homeowner', home: 'Booking Stage', scope: 'Design Liked · Hesitating' },
  // Module 4
  module_4_task_1: { age: 'Homeowner', home: 'Design Selected', scope: 'Market Comparison · Price Objection' },
  // Module 5
  module_5_task_2: { age: 'Homeowner', home: 'Feature Wall · Living Room', scope: 'Exploring NIO Premium Panels' },
};

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

export function VoiceArea({
  customerName,
  customerGender,
  taskId = 'task_1',
  moduleId = 'module_1',
  status,
  isCapturing,
  isEnding,
  elapsedSeconds,
  onStart,
  onEnd,
  errorMessage,
}: VoiceAreaProps) {
  const isIdle = status === 'idle';
  const isModule5 = moduleId === 'module_5';
  // accent colours — emerald for Module 5, indigo for everything else
  const accent = isModule5
    ? {
        label:   'text-emerald-400',
        avatar:  'from-emerald-600 to-teal-700',
        profile: 'border-emerald-500/25 bg-emerald-500/[0.06]',
        profBadge: 'text-emerald-400/60',
        icon:    'text-emerald-400',
        ending:  'bg-emerald-600/15 border-emerald-500/25 shadow-emerald-900/20',
        endIcon: 'text-emerald-400',
        endLabel: 'text-emerald-400/60',
        button:  'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-900/40',
      }
    : {
        label:   'text-indigo-400',
        avatar:  'from-indigo-600 to-purple-700',
        profile: 'border-indigo-500/25 bg-indigo-500/[0.06]',
        profBadge: 'text-indigo-400/60',
        icon:    'text-indigo-400',
        ending:  'bg-indigo-600/15 border-indigo-500/25 shadow-indigo-900/20',
        endIcon: 'text-indigo-400',
        endLabel: 'text-indigo-400/60',
        button:  'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-900/40',
      };
  const [quoteIndex, setQuoteIndex] = useState(0);
  // Use module-specific composite key first, fallback to taskId
  const profileKey = moduleId !== 'module_1' ? `${moduleId}_${taskId}` : taskId;
  const profile = CUSTOMER_PROFILE[profileKey] ?? CUSTOMER_PROFILE[taskId] ?? CUSTOMER_PROFILE['task_1']!;

  useEffect(() => {
    if (!isEnding) return;
    const interval = setInterval(() => {
      setQuoteIndex((i) => (i + 1) % WALL_INSIGHTS.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isEnding]);

  return (
    <div className="flex flex-col h-full min-h-[400px] lg:min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className={`text-xs font-semibold ${accent.label} uppercase tracking-widest mb-1`}>Live Consultation</p>
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${accent.avatar} flex items-center justify-center shadow-lg`}>
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

      {/* Customer overview */}
      <div className={`mb-4 rounded-lg border ${accent.profile} px-3.5 py-2.5`}>
        <p className={`text-[9px] font-bold ${accent.profBadge} uppercase tracking-[0.16em] mb-2`}>Customer Profile</p>
        <div className="flex items-center gap-2 mb-1.5">
          <User className={`h-3 w-3 ${accent.icon} shrink-0`} />
          <span className="text-xs text-[#c8c8e0] font-medium">
            {profile.age} {customerGender === 'female' ? 'Woman' : 'Man'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Home className={`h-3 w-3 ${accent.icon} shrink-0`} />
          <span className="text-xs text-[#c8c8e0] font-medium">{profile.home}</span>
        </div>
        {profile.scope && (
          <div className="flex items-center gap-2 mt-1.5">
            <Layers className={`h-3 w-3 ${accent.icon} shrink-0`} />
            <span className="text-xs text-[#c8c8e0] font-medium">{profile.scope}</span>
          </div>
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

      {/* Main area */}
      <div className="flex-1 flex flex-col items-center justify-center py-8">
        {isEnding ? (

          /* ── Report generating: rotating wall insights ── */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.35 }}
            className="flex flex-col items-center w-full"
          >
            <div className={`mb-4 w-11 h-11 rounded-full ${accent.ending} flex items-center justify-center shadow-lg`}>
              <Sparkles className={`h-5 w-5 ${accent.endIcon}`} />
            </div>

            <p className={`text-[10px] font-bold ${accent.endLabel} uppercase tracking-[0.18em] mb-5`}>
              Wall Design Insight
            </p>

            <div className="min-h-[72px] flex items-center justify-center px-2">
              <AnimatePresence mode="wait">
                <motion.p
                  key={quoteIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="text-center text-[#e8e8f0] text-[15px] font-semibold leading-relaxed max-w-[260px]"
                >
                  &ldquo;{WALL_INSIGHTS[quoteIndex]}&rdquo;
                </motion.p>
              </AnimatePresence>
            </div>

            <div className="flex items-center gap-1.5 mt-5">
              {WALL_INSIGHTS.map((_, i) => (
                <motion.span
                  key={i}
                  animate={{
                    width: i === quoteIndex ? 16 : 4,
                    backgroundColor: i === quoteIndex ? '#818cf8' : '#2a2a38',
                  }}
                  transition={{ duration: 0.3 }}
                  className="h-1 rounded-full block"
                />
              ))}
            </div>
          </motion.div>

        ) : isIdle ? (

          /* ── Idle: start prompt ── */
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
              className={`mt-2 rounded-xl ${accent.button} active:scale-[0.98] text-white font-semibold text-base px-8 py-3.5 transition-all duration-200 shadow-xl`}
            >
              Start Consultation
            </button>
            <p className="text-xs text-[#60607a] mt-2">Allow microphone access when prompted</p>
          </motion.div>

        ) : (

          /* ── Active session: mic visualizer ── */
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
