'use client';

import { useRef, useState, useCallback } from 'react';

interface UseAudioCaptureOptions {
  sampleRate?: number;
  onAudioChunk: (pcmData: ArrayBuffer) => void;
  onHighNoise?: () => void;
}

export function useAudioCapture({ sampleRate = 16000, onAudioChunk, onHighNoise }: UseAudioCaptureOptions) {
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const audioContextRef = useRef<AudioContext | null>(null);
  const processorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const noisyCountRef = useRef(0);
  const noiseFiredRef = useRef(false);
  const noiseWindowRef = useRef(false);
  const noiseWindowTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

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

        // Background noise detection: fire once if sustained RMS > threshold within first 10s
        if (!noiseFiredRef.current && noiseWindowRef.current) {
          let sum = 0;
          for (let i = 0; i < channelData.length; i++) sum += channelData[i] * channelData[i];
          const rms = Math.sqrt(sum / channelData.length);
          if (rms > 0.02) {
            noisyCountRef.current++;
          } else {
            noisyCountRef.current = Math.max(0, noisyCountRef.current - 2);
          }
          if (noisyCountRef.current >= 15) {
            noiseFiredRef.current = true;
            onHighNoise?.();
          }
        }
      };

      source.connect(processor);
      processor.connect(audioContext.destination);

      // Only monitor for background noise in the first 10 seconds
      noiseWindowRef.current = true;
      noiseWindowTimerRef.current = setTimeout(() => {
        noiseWindowRef.current = false;
      }, 10000);

      setIsCapturing(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Microphone access denied';
      setError(message);
    }
  }, [isCapturing, sampleRate, onAudioChunk, onHighNoise]);

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
    noisyCountRef.current = 0;
    noiseWindowRef.current = false;
    if (noiseWindowTimerRef.current) {
      clearTimeout(noiseWindowTimerRef.current);
      noiseWindowTimerRef.current = null;
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
