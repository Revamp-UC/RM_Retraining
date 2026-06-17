'use client';

import { motion } from 'framer-motion';
import { getTierColor } from '@/lib/utils/formatters';

interface SectionResult {
  score: number;
  max_score: number;
}

interface OverallScoreProps {
  score: number;
  maxScore?: number;
  tier: string;
  customerName: string;
  duration: number | null;
  sections?: Record<string, SectionResult>;
}

const SECTION_SHORT: Record<string, string> = {
  // Module 1
  introduction: 'Intro',
  technical: 'Technical',
  budget_discovery: 'Budget',
  discovery_confidence: 'D&C',
  market_comparison: 'Market',
  // Module 2 Task 1
  empathy_validation: 'Empathy',
  personalisation_respect: 'Respect',
  discovery_leaning: 'Discovery',
  expert_recommendation: 'Recommendation',
  reinforcement_tools: 'Reinforcement',
  confidence_building: 'Confidence',
  // Module 2 Task 2
  trust_confidence: 'Trust Building',
  reinforcement_proof: 'Reinforcement Proof',
  hesitation_ownership: 'Hesitation',
  ff_gallery_validation: 'Real Installs',
  // Module 3 Task 1 & 2
  lever_used: 'Lever',
  confidence_objection: 'Trust & Confidence',
  personalization: 'Personalisation',
  // Module 3 Task 3
  discovery_questions: 'Discovery',
  discount_lever: 'Discount',
  // Module 4 Task 1
  value_justification: 'Value',
  personalisation: 'Personalisation',
  // Module 5 Task 1
  discovery_diagnosis: 'Discovery',
  value_anchoring: 'Anchoring',
  tailored_differentiation: 'Tailored Pitch',
  objection_handling: 'Objections',
  curated_design_value: 'Curation',
  conviction_no_discount: 'Conviction',
};

export function OverallScore({ score, maxScore = 45, tier, customerName, duration, sections }: OverallScoreProps) {
  const pct = Math.round((score / maxScore) * 100);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - pct / 100);

  const tierColor = getTierColor(tier);
  const strokeColor =
    tier === 'Excellent' ? '#34d399' :
    tier === 'Good' ? '#60a5fa' :
    tier === 'Average' ? '#fbbf24' :
    '#f87171';

  function formatDur(s: number | null): string {
    if (!s) return '';
    return `${Math.floor(s / 60)}m ${s % 60}s`;
  }

  return (
    <div className="flex flex-col items-center py-8">
      {/* Circular score */}
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative"
      >
        <svg width="116" height="116" viewBox="0 0 140 140">
          {/* Background ring */}
          <circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke="#1c1c26"
            strokeWidth="10"
          />
          {/* Score ring */}
          <motion.circle
            cx="70" cy="70" r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, delay: 0.3, ease: 'easeOut' }}
            transform="rotate(-90 70 70)"
            style={{ filter: `drop-shadow(0 0 8px ${strokeColor}60)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-4xl font-bold text-[#f1f1f5] leading-none"
          >
            {score.toFixed(0)}
          </motion.span>
          <span className="text-sm text-[#60607a] mt-0.5">/ {maxScore}</span>
        </div>
      </motion.div>

      {/* Tier badge */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="mt-4 text-center"
      >
        <span className={`text-xl font-bold ${tierColor}`}>{tier}</span>
        <p className="text-sm text-[#9090a8] mt-1">
          Session with <span className="text-[#f1f1f5] font-medium">{customerName}</span>
          {duration ? <span className="ml-1.5 text-[#60607a]">· {formatDur(duration)}</span> : null}
        </p>
      </motion.div>

      {/* Section score pills */}
      {sections && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-5 w-full px-4 flex flex-wrap justify-center gap-2"
        >
          {Object.entries(sections).map(([key, s]) => {
            const pct = s.max_score > 0 ? s.score / s.max_score : 0;
            const color =
              pct >= 0.75
                ? 'bg-green-500/12 border-green-500/30 text-green-400'
                : pct >= 0.5
                  ? 'bg-amber-500/12 border-amber-500/30 text-amber-400'
                  : 'bg-red-500/12 border-red-500/30 text-red-400';
            return (
              <div key={key} className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 ${color}`}>
                <span className="text-sm font-semibold">{SECTION_SHORT[key] ?? key}</span>
                <span className="text-sm opacity-70">{s.score}/{s.max_score}</span>
              </div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
