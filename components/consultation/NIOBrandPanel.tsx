'use client';

import { motion } from 'framer-motion';

// Swatch colour + optional slatted (fluted) pattern
interface Swatch {
  base: string;       // CSS color string
  fluted?: boolean;   // render vertical slat lines over the base
  label: string;
}

interface Collection {
  name: string;
  swatches: Swatch[];
}

const COLLECTIONS: Collection[] = [
  {
    name: 'Refined Natural',
    swatches: [
      { base: '#2e1f14', fluted: true,  label: 'Dark Walnut Slat' },
      { base: '#5c3820',                label: 'Rich Teak' },
      { base: '#b8945e', fluted: true,  label: 'Sand Oak Slat' },
      { base: '#c9aa7c',                label: 'Light Birch' },
      { base: '#181410',                label: 'Ebony' },
      { base: '#cfc0a2',                label: 'Travertine' },
    ],
  },
  {
    name: 'Soft Hues',
    swatches: [
      { base: '#ede8e0',                label: 'Pearl Cream' },
      { base: '#ddd8ce',                label: 'Warm Linen' },
      { base: '#44444e', fluted: true,  label: 'Slate Slat' },
    ],
  },
  {
    name: 'Opulence',
    swatches: [
      { base: '#f0ece4',                label: 'Pearl White' },
      { base: '#e8e2d6',                label: 'Classic Ivory' },
      { base: '#f5f2ec',                label: 'Blanc' },
      { base: '#dcd5c8',                label: 'Antique White' },
    ],
  },
];

const SLAT_OVERLAY =
  'repeating-linear-gradient(90deg, rgba(0,0,0,0.28) 0px, rgba(0,0,0,0.28) 2px, transparent 2px, transparent 11px)';

function SwatchCell({ swatch, delay }: { swatch: Swatch; delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.88 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      title={swatch.label}
      className="aspect-square rounded-md overflow-hidden relative"
      style={{ backgroundColor: swatch.base }}
    >
      {swatch.fluted && (
        <div
          className="absolute inset-0"
          style={{ backgroundImage: SLAT_OVERLAY }}
        />
      )}
    </motion.div>
  );
}

export function NIOBrandPanel({ className = '' }: { className?: string }) {
  return (
    <div
      className={`relative flex flex-col rounded-xl overflow-hidden border border-[#1e1e28] bg-[#0c0c12] ${className}`}
    >
      {/* Radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 80% 50% at 50% 0%, rgba(52,211,153,0.06) 0%, transparent 60%)',
        }}
      />

      <div className="relative flex flex-col h-full p-6 lg:p-7">

        {/* ── Brand mark ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          {/* "nio" wordmark */}
          <p
            className="text-[52px] font-black leading-none tracking-[-0.04em] select-none"
            style={{ color: 'rgba(255,255,255,0.06)' }}
          >
            nio
          </p>
          <div className="mt-3 mb-1">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/12 border border-emerald-500/25 px-2.5 py-1 text-[10px] font-bold text-emerald-400 uppercase tracking-widest">
              Urban Company Exclusive
            </span>
          </div>
          <p className="text-[15px] font-semibold text-[#c8c8d8] leading-snug mt-2.5">
            The quality you always wanted<br />
            <span className="text-[#f1f1f5]">at a price you never expected</span>
          </p>
        </motion.div>

        {/* Divider */}
        <div className="h-px bg-[#1e1e28] mb-5" />

        {/* ── Panel collections ── */}
        <p className="text-[9px] font-bold text-[#60607a] uppercase tracking-[0.18em] mb-4">
          35 Curated Panel Designs
        </p>

        <div className="flex-1 flex flex-col justify-between gap-4 overflow-hidden">
          {COLLECTIONS.map((col, ci) => (
            <div key={col.name}>
              <p className="text-[11px] font-semibold text-[#9090a8] mb-2.5">{col.name}</p>
              <div
                className="grid gap-2"
                style={{ gridTemplateColumns: `repeat(${col.swatches.length}, minmax(0, 1fr))` }}
              >
                {col.swatches.map((sw, si) => (
                  <SwatchCell
                    key={sw.label}
                    swatch={sw}
                    delay={0.1 + ci * 0.08 + si * 0.03}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* ── Bottom stats ── */}
        <div className="mt-5 pt-4 border-t border-[#1e1e28] grid grid-cols-3 gap-3">
          {[
            { value: '5×', label: 'Structural strength\nvs standard PVC' },
            { value: '10+', label: 'Years of\ndurability' },
            { value: '55%', label: 'Savings vs\npremium WPC' },
          ].map(stat => (
            <div key={stat.label} className="text-center">
              <p className="text-lg font-black text-emerald-400 leading-none">{stat.value}</p>
              <p className="text-[9px] text-[#60607a] leading-tight mt-1 whitespace-pre-line">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
