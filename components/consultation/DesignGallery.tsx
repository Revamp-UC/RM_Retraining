'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Ruler, X, Expand, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Slide {
  src: string;
  tag: string;
  label: string;
  sublabel: string;
}

const SLIDES_M2T1: Slide[] = [
  {
    src: '/images/module2-task1-wall.png',
    tag: 'Wall',
    label: "Customer's Wall",
    sublabel: '10 ft × 9 ft',
  },
  {
    src: '/images/module2-task1-design1.png',
    tag: 'Design 1',
    label: 'Blush Flutes',
    sublabel: '₹40,499 all inclusive · 9.5×10 ft',
  },
  {
    src: '/images/module2-task1-design2.png',
    tag: 'Design 2',
    label: 'Beige Warp',
    sublabel: '₹29,399 all inclusive · 9.5×9 ft',
  },
  {
    src: '/images/module2-task1-design3.png',
    tag: 'Design 3',
    label: 'Blush Arc',
    sublabel: '₹14,899 all inclusive · 9.5×4 ft',
  },
];

const SLIDES_M2T2: Slide[] = [
  {
    src: '/images/module2-task2-wall.png',
    tag: 'Wall',
    label: "Customer's Wall",
    sublabel: '9 ft × 9 ft',
  },
  {
    src: '/images/module2-task2-design1.png',
    tag: 'Design',
    label: 'Finalised Design',
    sublabel: '',
  },
];

interface DesignGalleryProps {
  className?: string;
  taskId?: string;
}

export function DesignGallery({ className = '', taskId }: DesignGalleryProps) {
  const SLIDES = taskId === 'task_2' ? SLIDES_M2T2 : SLIDES_M2T1;
  const [index, setIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);

  function goNext() { setIndex(i => Math.min(i + 1, SLIDES.length - 1)); }
  function goPrev() { setIndex(i => Math.max(i - 1, 0)); }
  function goTo(i: number) { setIndex(i); }

  const current = SLIDES[index]!;
  const nextSlide = index < SLIDES.length - 1 ? SLIDES[index + 1] : null;
  const prevSlide = index > 0 ? SLIDES[index - 1] : null;

  return (
    <div className={`relative w-full h-full ${className}`}>

      {/* Slide panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 1.0, ease: 'easeOut' }}
        className="absolute inset-0 bottom-[72px] rounded-xl overflow-hidden border border-[#2a2a38] bg-[#13131a] cursor-pointer"
        onClick={() => setExpanded(true)}
      >
        {/* All slides always in DOM — position via x offset, no unmount */}
        {SLIDES.map((slide, i) => (
          <motion.div
            key={slide.src}
            animate={{ x: `${(i - index) * 100}%`, opacity: i === index ? 1 : 0 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={slide.src}
              alt={slide.label}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0f]/50 via-transparent to-[#0a0a0f]/20 pointer-events-none" />
          </motion.div>
        ))}

        {/* Next arrow — animated bounce */}
        {nextSlide && (
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 z-20"
            onClick={(e) => { e.stopPropagation(); goNext(); }}
          >
            <motion.div
              animate={{ x: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.3, ease: 'easeInOut' }}
              className="flex items-center gap-1.5 rounded-xl bg-indigo-600/90 backdrop-blur-sm border border-indigo-400/50 px-3 py-2 shadow-xl shadow-indigo-900/50"
            >
              <span className="text-xs font-bold text-white">{nextSlide.tag}</span>
              <ChevronRight className="h-4 w-4 text-white" />
            </motion.div>
          </button>
        )}

        {/* Prev arrow */}
        {prevSlide && (
          <button
            className="absolute left-3 top-1/2 -translate-y-1/2 z-20"
            onClick={(e) => { e.stopPropagation(); goPrev(); }}
          >
            <div className="flex items-center gap-1.5 rounded-xl bg-[#1a1a2a]/85 backdrop-blur-sm border border-[#2a2a38] px-3 py-2">
              <ChevronLeft className="h-4 w-4 text-[#9090a8]" />
              <span className="text-xs font-medium text-[#9090a8]">{prevSlide.tag}</span>
            </div>
          </button>
        )}

        {/* Slide dots */}
        <div
          className="absolute bottom-3 right-3 z-10 flex gap-1.5 items-center"
          onClick={(e) => e.stopPropagation()}
        >
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              className="rounded-full transition-all duration-300"
              style={{ width: i === index ? 18 : 6, height: 6, background: i === index ? '#fff' : 'rgba(255,255,255,0.3)' }}
            />
          ))}
        </div>

        {/* Click to zoom hint */}
        <div className="absolute bottom-3 left-3 z-10">
          <div className="flex items-center gap-1 rounded-md bg-[#0a0a0f]/80 backdrop-blur-sm border border-[#2a2a38] px-2 py-1">
            <Expand className="h-3 w-3 text-[#9090a8]" />
            <span className="text-[9px] font-medium text-[#9090a8]">Click to zoom</span>
          </div>
        </div>

        {/* Live Scenario badge */}
        <div className="absolute top-3 right-3 z-10">
          <div className="rounded-md bg-[#0a0a0f]/75 backdrop-blur-sm border border-amber-500/40 px-2.5 py-1">
            <span className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Live Scenario</span>
          </div>
        </div>

        {/* Slide tag */}
        <div className="absolute top-3 left-3 z-10">
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-[#0a0a0f]/75 backdrop-blur-sm border border-[#2a2a38] px-2.5 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-[11px] font-semibold text-[#f1f1f5]">{current.tag}</span>
          </div>
        </div>
      </motion.div>

      {/* Info bar */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, delay: 1.3, ease: 'easeOut' }}
        className="absolute bottom-0 left-0 right-0 h-[64px] flex items-center justify-between rounded-xl border border-indigo-500/30 bg-gradient-to-r from-indigo-600/15 via-[#13131a] to-[#13131a] px-5 shadow-lg shadow-indigo-900/10"
      >
        <div className="flex items-center gap-2.5">
          <Ruler className="h-5 w-5 text-indigo-400 shrink-0" />
          <AnimatePresence mode="wait">
            <motion.span
              key={current.label}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.18 }}
              className="text-sm font-semibold text-[#9090a8] uppercase tracking-wider"
            >
              {current.label}
            </motion.span>
          </AnimatePresence>
        </div>

        <AnimatePresence mode="wait">
          <motion.span
            key={current.sublabel}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.18 }}
            className="text-sm font-bold text-[#f1f1f5] tracking-wide"
          >
            {current.sublabel}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      {/* Fullscreen lightbox */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/95 flex flex-col"
            onClick={() => setExpanded(false)}
          >
            <div
              className="flex items-center justify-between px-4 py-3 border-b border-white/10 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-sm font-semibold text-[#f1f1f5]">{current.tag} · {current.label}</span>
              </div>
              <button
                className="rounded-full bg-white/10 p-2 active:bg-white/20"
                onClick={() => setExpanded(false)}
              >
                <X className="h-5 w-5 text-white" />
              </button>
            </div>

            <div className="relative flex-1 min-h-0">
              <Image
                src={current.src}
                alt={current.label}
                fill
                className="object-contain"
                priority
              />
            </div>

            <div
              className="flex items-center justify-between px-5 py-4 border-t border-white/10 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-indigo-400" />
                <span className="text-sm font-semibold text-[#9090a8] uppercase tracking-wider">
                  {current.label}
                </span>
              </div>
              <span className="text-lg font-bold text-[#f1f1f5]">{current.sublabel}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
