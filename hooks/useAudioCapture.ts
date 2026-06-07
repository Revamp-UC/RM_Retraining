'use client';

import { useRef, useState, useCallback } from 'react';

interface UseAudioCaptureOptions {
  sampleRate?: number;
  onAudioChunk: (pcmData: ArrayBuffer) => void;
}

export function useAudioCapture({ sampleRate = 16000, onAudioChunk }: UseAudioCaptureOptions) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);

  const start = useCallback(async () => {
    if (isCapturing) return;
    setError(null);

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      streamRef.current = stream;

      const audioContext = new AudioContext({ sampleRate });
      audioContextRef.current = audioContext;

      const source = audioContext.createMediaStreamSource(stream);
      sourceRef.current = source;

      // Use ScriptProcessorNode for raw PCM access (deprecated but widely supported)
      // Buffer size 4096 = ~256ms at 16kHz — good balance for real-time
      const bufferSize = 4096;
      const processor = audioContext.createScriptProcessor(bufferSize, 1, 1);
      processorRef.current = processor;

      processor.onaudioprocess = (event) => {
        const inputBuffer = event.inputBuffer;
        const channelData = inputBuffer.getChannelData(0);

        // Convert float32 to int16 PCM
        const pcm16 = floatTo16BitPCM(channelData);
        onAudioChunk(pcm16.buffer as ArrayBuffer);
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      setIsCapturing(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Microphone access denied';
      setError(message);
    }
  }, [isCapturing, sampleRate, onAudioChunk]);

  const stop = useCallback(() => {
    if (processorRef.current) {
      processorRef.current.disconnect();
      processorRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
    setIsCapturing(false);
  }, []);

  return { start, stop, isCapturing, error };
}

function floatTo16BitPCM(input: Float32Array): Int16Array {
  const output = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    output[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return output;
}
