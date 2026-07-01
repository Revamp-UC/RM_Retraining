'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useConsultationSocket } from './useConsultationSocket';
import { useAudioCapture } from './useAudioCapture';
import { useAudioPlayback } from './useAudioPlayback';
import { getSessionMinutes } from '@/lib/config/modules';
import { generateCustomer } from '@/lib/utils/name-generator';
import type { ConnectionStatus } from '@/types/gemini';
import type { CustomerGender } from '@/types/consultation';

interface UseConsultationStateOptions {
  moduleAttempted: string;
  moduleId: string;
  taskId: string;
}

export function useConsultationState({
  moduleAttempted,
  moduleId,
  taskId,
}: UseConsultationStateOptions) {
  const router = useRouter();
  const limitMinutes = getSessionMinutes(moduleId, taskId);
  const limitSeconds = limitMinutes * 60;
  const warnSeconds = limitSeconds - 60;
  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isEnding, setIsEnding] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [noiseWarning, setNoiseWarning] = useState(false);
  const [timeWarning, setTimeWarning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);

  // Generated client-side on mount — sent to API on Start click
  const [{ name: customerName, gender: customerGender }] = useState<{ name: string; gender: CustomerGender }>(generateCustomer);

  // Set after the create API call succeeds
  const consultationIdRef = useRef<string | null>(null);

  const { initialize, playBinaryChunk, stop: stopPlayback } = useAudioPlayback();

  const { connect, sendAudio, sendEndSignal, disconnect } = useConsultationSocket({
    onStatusChange: (s) => {
      setStatus(s);
      if (s === 'connected' && !startedRef.current) {
        startedRef.current = true;
        startTimer();
      }
    },
    onAudioReceived: (data) => {
      initialize();
      playBinaryChunk(data);
    },
    onEvaluationComplete: () => {},
    onError: (msg) => setErrorMessage(msg),
  });

  const handleHighNoise = useCallback(() => setNoiseWarning(true), []);
  const dismissNoiseWarning = useCallback(() => setNoiseWarning(false), []);

  const { start: startMic, stop: stopMic, isCapturing, error: micError } = useAudioCapture({
    sampleRate: 16000,
    onAudioChunk: sendAudio,
    onHighNoise: handleHighNoise,
  });

  function startTimer() {
    timerRef.current = setInterval(() => {
      setElapsedSeconds((s) => s + 1);
    }, 1000);
  }

  function stopTimer() {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }

  // Start button → create DB record → then connect to Gemini Live
  const startSession = useCallback(async () => {
    initialize(); // Must be called on user gesture
    setStatus('connecting');

    try {
      const res = await fetch('/api/consultation/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ moduleAttempted, customerName, customerGender }),
      });
      if (!res.ok) throw new Error('create failed');
      const data = await res.json() as { consultationId: string; wsToken: string };
      consultationIdRef.current = data.consultationId;
      connect(data.consultationId, data.wsToken);
    } catch {
      setErrorMessage('Could not start session. Please try again.');
      setStatus('error');
    }
  }, [initialize, moduleAttempted, customerName, customerGender, connect]);

  // When connected, auto-start mic
  useEffect(() => {
    if (status === 'connected' && !isCapturing) {
      startMic();
    }
  }, [status, isCapturing, startMic]);

  const endConsultation = useCallback(async () => {
    if (isEnding) return;
    const consultationId = consultationIdRef.current;
    if (!consultationId) return;

    setIsEnding(true);
    setStatus('ending');

    stopTimer();
    stopMic();
    sendEndSignal();
    disconnect();
    stopPlayback();

    try {
      const res = await fetch('/api/consultation/end', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ consultation_id: consultationId }),
      });
      const data = await res.json() as { success?: boolean; pending?: boolean; too_short?: boolean; error?: string };

      if (data.success) {
        router.push(`/module/${moduleId}/report/${consultationId}`);
      } else if (data.pending || data.too_short) {
        router.push(`/module/${moduleId}/report/${consultationId}`);
      } else {
        setErrorMessage('Report could not be generated. Please note your session ID and let your admin know. Your data is safe.');
        setIsEnding(false);
        setStatus('error');
      }
    } catch {
      setErrorMessage('Could not reach the server. Please check your internet connection and try again.');
      setIsEnding(false);
      setStatus('error');
    }
  }, [isEnding, stopMic, sendEndSignal, disconnect, stopPlayback, moduleId, router]);

  // Per-scenario session limit: warn 1 min before, auto-end at the limit.
  // limitMinutes === 0 means no forced limit (Module 6 quiz — ends when trainer finishes).
  useEffect(() => {
    if (status !== 'connected') return;
    if (limitSeconds === 0) return;
    if (elapsedSeconds === warnSeconds) setTimeWarning(true);
    if (elapsedSeconds === limitSeconds) endConsultation();
  }, [elapsedSeconds, status, endConsultation, warnSeconds, limitSeconds]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopTimer();
      stopMic();
      disconnect();
      stopPlayback();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    status,
    errorMessage: errorMessage ?? micError,
    isEnding,
    isCapturing,
    elapsedSeconds,
    noiseWarning,
    dismissNoiseWarning,
    timeWarning,
    limitMinutes,
    customerName,
    customerGender,
    startSession,
    endConsultation,
  };
}
