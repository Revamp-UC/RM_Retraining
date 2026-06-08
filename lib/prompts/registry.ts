// Prompt registry — maps module_attempted (DB value) to persona, rubric, and sanitizer.
//
// To add a new task:
//   1. Create lib/prompts/module1-taskN-persona.ts
//   2. Create lib/prompts/module1-taskN-rubric.ts
//   3. Add a new entry in PROMPT_REGISTRY below — nothing else needs touching.

import type { CustomerGender } from '@/types/consultation';
import type { TranscriptEntry } from '@/types/transcript';
import type { ReportCard, SectionResult } from '@/types/consultation';

// Module 1 · Task 1
import { generateCustomerPersonaPrompt as m1t1Persona } from './module1-task1-persona';
import { buildEvaluationPrompt as m1t1Rubric } from './module1-task1-rubric';

// Module 1 · Task 2
import { generateCustomerPersonaPrompt as m1t2Persona } from './module1-task2-persona';
import { buildEvaluationPrompt as m1t2Rubric } from './module1-task2-rubric';

// ─── Sanitizer helpers ────────────────────────────────────────────────────────

function clamp(v: unknown, max: number): number {
  const n = typeof v === 'number' ? v : 0;
  return Math.min(Math.max(0, Math.round(n * 10) / 10), max);
}

function section(
  raw: Partial<SectionResult> | undefined,
  score: number,
  max: number,
): SectionResult {
  return {
    score,
    max_score: max,
    label: raw?.label ?? 'Average',
    strengths: raw?.strengths ?? [],
    missed_opportunities: raw?.missed_opportunities ?? [],
    feedback: raw?.feedback ?? '',
  };
}

function tier(overall: number): ReportCard['performance_tier'] {
  if (overall >= 42) return 'Excellent';
  if (overall >= 32) return 'Good';
  if (overall >= 20) return 'Average';
  return 'Needs Improvement';
}

// Task 1 sanitizer — 4 sections, max 45
function sanitizeTask1(raw: unknown): ReportCard {
  const c = raw as Partial<ReportCard>;
  const intro    = clamp(c.sections?.introduction?.score, 15);
  const tech     = clamp(c.sections?.technical?.score, 5);
  const budget   = clamp(c.sections?.budget_discovery?.score, 15);
  const disc     = clamp(c.sections?.discovery_confidence?.score, 10);
  const overall  = intro + tech + budget + disc;
  return {
    overall_score: overall,
    sections: {
      introduction:        section(c.sections?.introduction, intro, 15),
      technical:           section(c.sections?.technical, tech, 5),
      budget_discovery:    section(c.sections?.budget_discovery, budget, 15),
      discovery_confidence: section(c.sections?.discovery_confidence, disc, 10),
    },
    critical_mistakes: c.critical_mistakes ?? [],
    coaching_feedback: c.coaching_feedback ?? '',
    performance_tier: tier(overall),
  };
}

// Task 2 sanitizer — 5 sections, max 50
function sanitizeTask2(raw: unknown): ReportCard {
  const c = raw as Partial<ReportCard>;
  const intro    = clamp(c.sections?.introduction?.score, 15);
  const tech     = clamp(c.sections?.technical?.score, 5);
  const budget   = clamp(c.sections?.budget_discovery?.score, 15);
  const disc     = clamp(c.sections?.discovery_confidence?.score, 10);
  const market   = clamp(c.sections?.market_comparison?.score, 5);
  const overall  = intro + tech + budget + disc + market;
  return {
    overall_score: overall,
    sections: {
      introduction:        section(c.sections?.introduction, intro, 15),
      technical:           section(c.sections?.technical, tech, 5),
      budget_discovery:    section(c.sections?.budget_discovery, budget, 15),
      discovery_confidence: section(c.sections?.discovery_confidence, disc, 10),
      market_comparison:   section(c.sections?.market_comparison, market, 5),
    },
    critical_mistakes: c.critical_mistakes ?? [],
    coaching_feedback: c.coaching_feedback ?? '',
    performance_tier: tier(overall),
  };
}

// ─── Registry ─────────────────────────────────────────────────────────────────

interface PromptHandlers {
  persona: (name: string, gender: CustomerGender) => string;
  rubric: (transcript: TranscriptEntry[], customerName: string, module: string) => string;
  sanitize: (raw: unknown) => ReportCard;
}

const PROMPT_REGISTRY: Record<string, PromptHandlers> = {
  'module_1_seepage': {
    persona:  m1t1Persona,
    rubric:   m1t1Rubric,
    sanitize: sanitizeTask1,
  },
  'module_1_task2': {
    persona:  m1t2Persona,
    rubric:   m1t2Rubric,
    sanitize: sanitizeTask2,
  },
  // 'module_1_task3': { persona: m1t3Persona, rubric: m1t3Rubric, sanitize: sanitizeTask3 },
};

const FALLBACK = PROMPT_REGISTRY['module_1_seepage'];

export function getPersonaPrompt(
  moduleAttempted: string,
  customerName: string,
  customerGender: CustomerGender,
): string {
  return (PROMPT_REGISTRY[moduleAttempted] ?? FALLBACK).persona(customerName, customerGender);
}

export function getEvaluationPrompt(
  moduleAttempted: string,
  transcript: TranscriptEntry[],
  customerName: string,
): string {
  return (PROMPT_REGISTRY[moduleAttempted] ?? FALLBACK).rubric(transcript, customerName, moduleAttempted);
}

export function sanitizeReportCard(moduleAttempted: string, raw: unknown): ReportCard {
  return (PROMPT_REGISTRY[moduleAttempted] ?? FALLBACK).sanitize(raw);
}
