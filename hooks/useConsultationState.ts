'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useConsultationSocket } from './useConsultationSocket';
import { useAudioCapture } from './useAudioCapture';
import { useAudioPlayback } from './useAudioPlayback';
import { getSessionMinutes } from '@/lib/config/modules';
import type { ConnectionStatus } from '@/types/gemini';

interface UseConsultationStateOptions {
  consultationId: string;
  wsToken: string;
  moduleId: string;
  taskId: string;
}

export function useConsultationState({
  consultationId,
  wsToken,
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

  const { initialize, playBinaryChunk, stop: stopPlayback } = useAudioPlayback();

  const { connect, sendAudio, sendEndSignal, disconnect } = useConsultationSocket({
    consultationId,
    wsToken,
    onStatusChange: (s) => {
      setStatus(s);
      if (s === 'connected' && !startedRef.current) {
        startedRef.current = true;
        startTimer();
      }
    },
    onAudioReceived: (data) => {
      initialize(); // Ensure AudioContext is resumed after user gesture
      playBinaryChunk(data);
    },
    onEvaluationComplete: () => {
      // This path is not used — evaluation happens via HTTP after sendEnd
    },
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

  // Auto-start: connect → wait for session_ready → start mic
  const startSession = useCallback(async () => {
    initialize();  // Must be called on user gesture
    connect();
  }, [connect, initialize]);

  // When connected, auto-start mic
  useEffect(() => {
    if (status === 'connected' && !isCapturing) {
      startMic();
    }
  }, [status, isCapturing, startMic]);

  const endConsultation = useCallback(async () => {
    if (isEnding) return;
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
  }, [isEnding, stopMic, sendEndSignal, disconnect, stopPlayback, consultationId, moduleId, router]);

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
    startSession,
    endConsultation,
  };
}
