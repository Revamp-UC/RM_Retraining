'use client';

import { useRef, useCallback } from 'react';

// Gemini Live outputs 24kHz PCM audio
const OUTPUT_SAMPLE_RATE = 24000;

export function useAudioPlayback() {
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextPlayTimeRef = useRef<number>(0);
  const isRunningRef = useRef(false);

  const initialize = useCallback(() => {
    if (audioContextRef.current) return;
    const ctx = new AudioContext({ sampleRate: OUTPUT_SAMPLE_RATE });
    audioContextRef.current = ctx;
    nextPlayTimeRef.current = ctx.currentTime;
    isRunningRef.current = true;
  }, []);

  const playAudioChunk = useCallback((base64OrBuffer: string | ArrayBuffer) => {
    if (!audioContextRef.current || !isRunningRef.current) return;
    const ctx = audioContextRef.current;

    let pcmBuffer: ArrayBuffer;
    if (typeof base64OrBuffer === 'string') {
      const binary = atob(base64OrBuffer);
      const bytes = new Uint8Array(binary.length);
      for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
      pcmBuffer = bytes.buffer;
    } else {
      pcmBuffer = base64OrBuffer;
    }

    const pcm16 = new Int16Array(pcmBuffer);
    const float32 = new Float32Array(pcm16.length);
    for (let i = 0; i < pcm16.length; i++) {
      float32[i] = pcm16[i] / (pcm16[i] < 0 ? 0x8000 : 0x7fff);
    }

    const audioBuffer = ctx.createBuffer(1, float32.length, OUTPUT_SAMPLE_RATE);
    audioBuffer.copyToChannel(float32, 0);

    const source = ctx.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(ctx.destination);

    const now = ctx.currentTime;
    const startTime = Math.max(nextPlayTimeRef.current, now);
    source.start(startTime);
    nextPlayTimeRef.current = startTime + audioBuffer.duration;
  }, []);

  const playBinaryChunk = useCallback((data: ArrayBuffer | Blob) => {
    if (data instanceof Blob) {
      data.arrayBuffer().then((buf) => playAudioChunk(buf));
    } else {
      playAudioChunk(data);
    }
  }, [playAudioChunk]);

  const stop = useCallback(() => {
    isRunningRef.current = false;
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    nextPlayTimeRef.current = 0;
  }, []);

  return { initialize, playAudioChunk, playBinaryChunk, stop };
}
