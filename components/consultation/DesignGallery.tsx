'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, Expand, ChevronLeft, ChevronRight, Ruler } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Design {
  src: string;
  name: string;
  price: string;
  coverage: string;
}

const WALL: { src: string; label: string; dim: string } = {
  src: '/images/module2-task1-wall.png',
  label: "Customer's Wall",
  dim: '10 ft × 9 ft',
};

const DESIGNS: Design[] = [
  { src: '/images/module2-task1-design1.png', name: 'Blush Flutes',  price: '₹40,499', coverage: '9.5×10 ft' },
  { src: '/images/module2-task1-design2.png', name: 'Beige Warp',    price: '₹29,399', coverage: '9.5×9 ft'  },
  { src: '/images/module2-task1-design3.png', name: 'Blush Arc',     price: '₹14,899', coverage: '9.5×4 ft'  },
];

interface DesignGalleryProps {
  className?: string;
}

export function DesignGallery({ className = '' }: DesignGalleryProps) {
  const [lightbox, setLightbox] = useState<number | null>(null); // -1 = wall, 0–2 = designs

  const allImages = [
    { src: WALL.src, label: WALL.label, sub: WALL.dim },
    ...DESIGNS.map(d => ({ src: d.src, label: d.name, sub: `${d.price} · ${d.coverage}` })),
  ];

  function prev() {
    setLightbox(i => (i === null ? null : (i - 1 + allImages.length) % allImages.length));
  }

  function next() {
    setLightbox(i => (i === null ? null : (i + 1) % allImages.length));
  }

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Customer wall */}
      <div
        className="relative rounded-xl overflow-hidden border border-[#2a2a38] bg-[#0f0f17] cursor-pointer group"
        style={{ aspectRatio: '10/9' }}
        onClick={() => setLightbox(0)}
      >
        <Image
          src={WALL.src}
          alt={WALL.label}
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
          <Ruler className="h-3 w-3 text-white/70" />
          <span className="text-[10px] font-semibold text-white/90">{WALL.dim}</span>
        </div>
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black/50 rounded-md p-1">
            <Expand className="h-3.5 w-3.5 text-white" />
          </div>
        </div>
        <div className="absolute top-2 left-2">
          <span className="text-[9px] font-bold text-white/80 bg-black/40 rounded px-1.5 py-0.5 uppercase tracking-wider">
            Wall
          </span>
        </div>
      </div>

      {/* 3 designs */}
      <div className="grid grid-cols-3 gap-2">
        {DESIGNS.map((d, i) => (
          <div
            key={d.name}
            className="relative rounded-xl overflow-hidden border border-[#2a2a38] bg-[#0f0f17] cursor-pointer group"
            style={{ aspectRatio: '1/1' }}
            onClick={() => setLightbox(i + 1)}
          >
            <Image
              src={d.src}
              alt={d.name}
              fill
              sizes="(max-width: 1024px) 33vw, 17vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-1.5 left-0 right-0 px-1.5">
              <p className="text-[9px] font-bold text-white leading-tight truncate">{d.name}</p>
              <p className="text-[8px] text-white/70">{d.price}</p>
            </div>
            <div className="absolute top-1.5 right-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="bg-black/50 rounded p-0.5">
                <Expand className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-sm px-4"
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
              className="relative w-full max-w-xl rounded-2xl overflow-hidden border border-[#2a2a38] bg-[#0f0f17]"
              onClick={e => e.stopPropagation()}
            >
              {/* Image */}
              <div className="relative w-full" style={{ aspectRatio: '4/3' }}>
                <Image
                  src={allImages[lightbox]!.src}
                  alt={allImages[lightbox]!.label}
                  fill
                  sizes="100vw"
                  className="object-contain"
                  priority
                />
              </div>

              {/* Info bar */}
              <div className="flex items-center justify-between px-4 py-3 border-t border-[#1e1e28]">
                <div>
                  <p className="text-sm font-bold text-[#f1f1f5]">{allImages[lightbox]!.label}</p>
                  <p className="text-xs text-[#60607a]">{allImages[lightbox]!.sub}</p>
                </div>
                <span className="text-xs text-[#60607a]">{lightbox + 1} / {allImages.length}</span>
              </div>

              {/* Close */}
              <button
                onClick={() => setLightbox(null)}
                className="absolute top-3 right-3 bg-black/50 hover:bg-black/70 rounded-full p-1.5 transition-colors"
              >
                <X className="h-4 w-4 text-white" />
              </button>

              {/* Prev/Next */}
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
              >
                <ChevronLeft className="h-4 w-4 text-white" />
              </button>
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 rounded-full p-2 transition-colors"
              >
                <ChevronRight className="h-4 w-4 text-white" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
