'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

interface RoomCard {
  src: string;
  label: string;
  subLabel?: string;
  position?: string; // object-position for fine-tuning crop
}

const ROOMS: RoomCard[] = [
  {
    src: '/images/nio-room-1.jpg',
    label: 'Traditional panels',
    subLabel: 'Wood with touch of gold',
    position: 'center top',
  },
  {
    src: '/images/nio-room-2.jpg',
    label: 'Terracotta red panels',
    subLabel: 'Real wood textures',
    position: 'center top',
  },
  {
    src: '/images/nio-room-3.jpg',
    label: 'Green limewash',
    subLabel: 'Fabric panels',
    position: 'center',
  },
  {
    src: '/images/nio-room-4.jpg',
    label: 'Refined Natural',
    subLabel: 'Soft Hues',
    position: 'center',
  },
];

function RoomCard({ room, delay }: { room: RoomCard; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="relative rounded-xl overflow-hidden bg-[#1a1a22] aspect-[4/3]"
    >
      <Image
        src={room.src}
        alt={room.label}
        fill
        className="object-cover"
        style={{ objectPosition: room.position ?? 'center' }}
        sizes="(max-width: 1024px) 50vw, 25vw"
        onError={() => {/* silently keep bg fallback */}}
      />

      {/* Gradient overlay for readability */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

      {/* Labels — stacked like reference */}
      <div className="absolute bottom-0 left-0 right-0 p-2.5 flex flex-col gap-1">
        {room.subLabel && (
          <span className="self-start text-[10px] font-semibold text-[#2a1f14] bg-white/85 rounded-full px-2.5 py-0.5 leading-none backdrop-blur-sm">
            {room.subLabel}
          </span>
        )}
        <span className="self-start text-[10px] font-semibold text-[#2a1f14] bg-white/85 rounded-full px-2.5 py-0.5 leading-none backdrop-blur-sm">
          {room.label}
        </span>
      </div>
    </motion.div>
  );
}

export function NIOBrandPanel({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative flex flex-col rounded-xl overflow-hidden border border-[#1e1e28] ${className}`}
      style={{ background: 'linear-gradient(160deg, #0d1a14 0%, #0c0c12 50%, #0a0a0f 100%)' }}
    >
      {/* Top glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 70% 40% at 30% 0%, rgba(52,211,153,0.10) 0%, transparent 60%)' }}
      />

      <div className="relative flex flex-col h-full p-6 lg:p-7">

        {/* ── Brand mark (unchanged) ── */}
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-5"
        >
          <p
            className="font-black leading-none tracking-[-0.04em] select-none mb-4"
            style={{ fontSize: 64, color: 'rgba(255,255,255,0.07)' }}
          >
            nio
          </p>

          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 text-[10px] font-bold text-emerald-400 uppercase tracking-widest mb-3">
            Urban Company Exclusive
          </span>

          <p className="text-[16px] font-semibold text-[#b8b8cc] leading-snug">
            The quality you always wanted<br />
            <span className="text-[#f1f1f5] font-bold">at a price you never expected</span>
          </p>
        </motion.div>

        {/* Divider */}
        <div
          className="h-px mb-5"
          style={{ background: 'linear-gradient(90deg, rgba(52,211,153,0.3) 0%, rgba(52,211,153,0.05) 60%, transparent 100%)' }}
        />

        {/* ── Room image grid ── */}
        <div className="flex-1 flex flex-col justify-between">
          <p className="text-[9px] font-bold text-[#60607a] uppercase tracking-[0.18em] mb-3">
            35 Curated Designs · See What&apos;s Possible
          </p>

          <div className="grid grid-cols-2 gap-2 flex-1">
            {ROOMS.map((room, i) => (
              <RoomCard key={room.label} room={room} delay={0.12 + i * 0.07} />
            ))}
          </div>
        </div>

        {/* ── Bottom tag ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-4 pt-4 border-t border-[#1a1a24]"
        >
          <p className="text-[10px] text-[#3a3a4a] uppercase tracking-widest text-center">
            Premium Structured Wall Panel · India&apos;s First
          </p>
        </motion.div>
      </div>
    </div>
  );
}
