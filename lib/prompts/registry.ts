// Prompt registry — maps module_attempted (DB value) to persona, rubric, and sanitizer.
//
// To add a new task:
//   1. Create lib/prompts/moduleN-taskN-persona.ts
//   2. Create lib/prompts/moduleN-taskN-rubric.ts
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

// Module 1 · Task 3
import { generateCustomerPersonaPrompt as m1t3Persona } from './module1-task3-persona';
import { buildEvaluationPrompt as m1t3Rubric } from './module1-task3-rubric';

// Module 2 · Task 1
import { generateCustomerPersonaPrompt as m2t1Persona } from './module2-task1-persona';
import { buildEvaluationPrompt as m2t1Rubric } from './module2-task1-rubric';

// Module 2 · Task 2
import { generateCustomerPersonaPrompt as m2t2Persona } from './module2-task2-persona';
import { buildEvaluationPrompt as m2t2Rubric } from './module2-task2-rubric';

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

function tier2(overall: number): ReportCard['performance_tier'] {
  if (overall >= 24) return 'Excellent';
  if (overall >= 18) return 'Good';
  if (overall >= 12) return 'Average';
  return 'Needs Improvement';
}

function tier3(overall: number): ReportCard['performance_tier'] {
  if (overall >= 17) return 'Excellent';
  if (overall >= 13) return 'Good';
  if (overall >= 9) return 'Average';
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

// Task 3 sanitizer — 4 sections, max 45 (same structure as Task 1)
function sanitizeTask3(raw: unknown): ReportCard {
  const c = raw as Partial<ReportCard>;
  const intro    = clamp(c.sections?.introduction?.score, 15);
  const tech     = clamp(c.sections?.technical?.score, 5);
  const budget   = clamp(c.sections?.budget_discovery?.score, 15);
  const disc     = clamp(c.sections?.discovery_confidence?.score, 10);
  const overall  = intro + tech + budget + disc;
  return {
    overall_score: overall,
    sections: {
      introduction:         section(c.sections?.introduction, intro, 15),
      technical:            section(c.sections?.technical, tech, 5),
      budget_discovery:     section(c.sections?.budget_discovery, budget, 15),
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

// Module 2 Task 1 sanitizer — 6 sections, max 30
function sanitizeM2Task1(raw: unknown): ReportCard {
  const c = raw as Partial<ReportCard> & { suggested_ideal_response?: string };
  const empathy      = clamp(c.sections?.empathy_validation?.score, 5);
  const personal     = clamp(c.sections?.personalisation_respect?.score, 5);
  const discovery    = clamp(c.sections?.discovery_leaning?.score, 5);
  const recommend    = clamp(c.sections?.expert_recommendation?.score, 5);
  const reinforce    = clamp(c.sections?.reinforcement_tools?.score, 5);
  const confidence   = clamp(c.sections?.confidence_building?.score, 5);
  const overall      = empathy + personal + discovery + recommend + reinforce + confidence;
  return {
    overall_score: overall,
    sections: {
      empathy_validation:      section(c.sections?.empathy_validation, empathy, 5),
      personalisation_respect: section(c.sections?.personalisation_respect, personal, 5),
      discovery_leaning:       section(c.sections?.discovery_leaning, discovery, 5),
      expert_recommendation:   section(c.sections?.expert_recommendation, recommend, 5),
      reinforcement_tools:     section(c.sections?.reinforcement_tools, reinforce, 5),
      confidence_building:     section(c.sections?.confidence_building, confidence, 5),
    },
    critical_mistakes: c.critical_mistakes ?? [],
    coaching_feedback: c.coaching_feedback ?? '',
    performance_tier: tier2(overall),
    suggested_ideal_response: c.suggested_ideal_response ?? '',
  };
}

// Module 2 Task 2 sanitizer — 4 sections, max 20
function sanitizeM2Task2(raw: unknown): ReportCard {
  const c = raw as Partial<ReportCard> & { suggested_ideal_response?: string };
  const trust      = clamp(c.sections?.trust_confidence?.score, 5);
  const proof      = clamp(c.sections?.reinforcement_proof?.score, 5);
  const hesitation = clamp(c.sections?.hesitation_ownership?.score, 5);
  const gallery    = clamp(c.sections?.ff_gallery_validation?.score, 5);
  const overall    = trust + proof + hesitation + gallery;
  return {
    overall_score: overall,
    sections: {
      trust_confidence:      section(c.sections?.trust_confidence, trust, 5),
      reinforcement_proof:   section(c.sections?.reinforcement_proof, proof, 5),
      hesitation_ownership:  section(c.sections?.hesitation_ownership, hesitation, 5),
      ff_gallery_validation: section(c.sections?.ff_gallery_validation, gallery, 5),
    },
    critical_mistakes: c.critical_mistakes ?? [],
    coaching_feedback: c.coaching_feedback ?? '',
    performance_tier: tier3(overall),
    suggested_ideal_response: c.suggested_ideal_response ?? '',
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
  'module_1_task3': {
    persona:  m1t3Persona,
    rubric:   m1t3Rubric,
    sanitize: sanitizeTask3,
  },
  'module_2_task1': {
    persona:  m2t1Persona,
    rubric:   (transcript, customerName) => m2t1Rubric(transcript, customerName),
    sanitize: sanitizeM2Task1,
  },
  'module_2_task2': {
    persona:  m2t2Persona,
    rubric:   (transcript, customerName) => m2t2Rubric(transcript, customerName),
    sanitize: sanitizeM2Task2,
  },
};

const FALLBACK = PROMPT_REGISTRY['module_1_seepage']!;

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
