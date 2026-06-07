'use client';

import { useRef, useCallback, useState } from 'react';
import type { ConnectionStatus, WSMessage } from '@/types/gemini';

interface UseConsultationSocketOptions {
  consultationId: string;
  wsToken: string;
  onStatusChange: (status: ConnectionStatus) => void;
  onAudioReceived: (data: ArrayBuffer) => void;
  onEvaluationComplete: () => void;
  onError: (message: string) => void;
}

export function useConsultationSocket({
  consultationId,
  wsToken,
  onStatusChange,
  onAudioReceived,
  onEvaluationComplete,
  onError,
}: UseConsultationSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const connect = useCallback(() => {
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
          case 'error':
            onError(msg.error ?? 'Unknown error occurred');
            onStatusChange('error');
            break;
          case 'session_ended':
            onStatusChange('completed');
            break;
        }
      } catch {
        // Non-JSON, non-binary message — ignore
      }
    };

    ws.onerror = () => {
      onError('Connection error. Please check your internet and try again.');
      onStatusChange('error');
    };

    ws.onclose = (event) => {
      setIsConnected(false);
      clearHeartbeat();
      if (event.code !== 1000 && event.code !== 1001) {
        onStatusChange('error');
      }
    };
  }, [consultationId, wsToken, onStatusChange, onAudioReceived, onEvaluationComplete, onError]);

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
