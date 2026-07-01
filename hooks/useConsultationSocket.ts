'use client';

import { useRef, useCallback, useState } from 'react';
import type { ConnectionStatus, WSMessage } from '@/types/gemini';

interface UseConsultationSocketOptions {
  onStatusChange: (status: ConnectionStatus) => void;
  onAudioReceived: (data: ArrayBuffer) => void;
  onEvaluationComplete: () => void;
  onError: (message: string) => void;
}

export function useConsultationSocket({
  onStatusChange,
  onAudioReceived,
  onEvaluationComplete,
  onError,
}: UseConsultationSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback((consultationId: string, wsToken: string) => {
    // Already open or connecting — do nothing
    const state = wsRef.current?.readyState;
    if (state === WebSocket.OPEN || state === WebSocket.CONNECTING) return;

    onStatusChange('connecting');

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = window.location.host;
    const url = `${protocol}//${host}/api/consultation/stream?consultation_id=${consultationId}&token=${wsToken}`;

    const ws = new WebSocket(url);
    ws.binaryType = 'arraybuffer';
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      onStatusChange('connecting'); // Still waiting for session_ready from Gemini

      // Start heartbeat every 30s
      heartbeatRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: 'heartbeat' }));
        }
      }, 30000);
    };

    ws.onmessage = (event: MessageEvent) => {
      if (event.data instanceof ArrayBuffer) {
        // Binary audio from Gemini customer voice
        onAudioReceived(event.data);
        return;
      }

      try {
        const msg = JSON.parse(event.data as string) as WSMessage;

        switch (msg.type) {
          case 'session_ready':
            onStatusChange('connected');
            break;
          case 'heartbeat_ack':
            break;
          case 'evaluation_complete':
            onEvaluationComplete();
            break;
          case 'error': {
            const code = msg.error ?? '';
            const friendly =
              code === 'ai_error' || code === 'ai_connect_failed'
                ? 'The AI service is busy right now. Please wait 2-3 minutes and try again. If the problem continues, let your admin know.'
                : code.includes('token') || code.includes('session')
                  ? 'Your session has expired. Please refresh the page to start again.'
                  : 'Something went wrong. Please refresh the page and try again.';
            onError(friendly);
            onStatusChange('error');
            break;
          }
          case 'session_ended':
            onStatusChange('completed');
            break;
        }
      } catch {
        // Non-JSON, non-binary message — ignore
      }
    };

    ws.onerror = () => {
      onError('Connection failed. Please check your internet connection and try again.');
      onStatusChange('error');
    };

    ws.onclose = (event) => {
      setIsConnected(false);
      clearHeartbeat();
      if (event.code !== 1000 && event.code !== 1001) {
        onError('Connection was lost. Please refresh the page — your session data has been saved.');
        onStatusChange('error');
      }
    };
  }, [onStatusChange, onAudioReceived, onEvaluationComplete, onError]);

  const sendAudio = useCallback((pcmData: ArrayBuffer) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(pcmData);
    }
  }, []);

  const sendEndSignal = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type: 'end_consultation' }));
      wsRef.current.close(1000, 'Consultation ended');
    }
  }, []);

  const disconnect = useCallback(() => {
    clearHeartbeat();
    if (wsRef.current) {
      wsRef.current.close(1000, 'Client disconnected');
      wsRef.current = null;
    }
    setIsConnected(false);
  }, []);

  function clearHeartbeat() {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  }

  return { connect, sendAudio, sendEndSignal, disconnect, isConnected };
}
