'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff } from 'lucide-react';

interface MicVisualizerProps {
  isActive: boolean;
  status: string;
}

export function MicVisualizer({ isActive, status }: MicVisualizerProps) {
  const isConnected = status === 'connected';
  const bars = [0.4, 0.7, 1.0, 0.8, 0.5, 0.9, 0.6, 0.4, 0.8, 0.5, 1.0, 0.7];

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Mic icon with pulse ring */}
      <div className="relative flex items-center justify-center">
        {isActive && isConnected && (
          <>
            <span className="absolute inline-flex h-20 w-20 rounded-full bg-indigo-500/20 animate-ping" />
            <span className="absolute inline-flex h-16 w-16 rounded-full bg-indigo-500/10 animate-pulse" />
          </>
        )}
        <div className={`relative flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all duration-300 ${
          isActive && isConnected
            ? 'bg-indigo-600/20 border-indigo-500 shadow-lg shadow-indigo-900/40'
            : 'bg-[#1c1c26] border-[#2a2a38]'
        }`}>
          {isActive && isConnected
            ? <Mic className="h-6 w-6 text-indigo-400" />
            : <MicOff className="h-6 w-6 text-[#60607a]" />
          }
        </div>
      </div>

      {/* Waveform bars */}
      <AnimatePresence>
        {isActive && isConnected && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-end gap-0.5 h-8"
          >
            {bars.map((height, i) => (
              <motion.div
                key={i}
                className="w-1 rounded-full bg-indigo-500"
                animate={{
                  scaleY: [height * 0.3, height, height * 0.4, height * 0.8, height * 0.3],
                }}
                transition={{
                  duration: 0.8 + Math.random() * 0.4,
                  repeat: Infinity,
                  delay: i * 0.07,
                  ease: 'easeInOut',
                }}
                style={{ height: '100%', originY: 1 }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <p className={`text-xs font-medium transition-colors ${
        isActive && isConnected ? 'text-indigo-400' : 'text-[#60607a]'
      }`}>
        {isActive && isConnected ? 'Listening…' : isConnected ? 'Mic off' : 'Waiting for connection'}
      </p>
    </div>
  );
}
