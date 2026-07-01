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

// Module 3 · Task 1
import { generateCustomerPersonaPrompt as m3t1Persona } from './module3-task1-persona';
import { buildEvaluationPrompt as m3t1Rubric } from './module3-task1-rubric';

// Module 3 · Task 2
import { generateCustomerPersonaPrompt as m3t2Persona } from './module3-task2-persona';
import { buildEvaluationPrompt as m3t2Rubric } from './module3-task2-rubric';

// Module 3 · Task 3
import { generateCustomerPersonaPrompt as m3t3Persona } from './module3-task3-persona';
import { buildEvaluationPrompt as m3t3Rubric } from './module3-task3-rubric';

// Module 4 · Task 1
import { generateCustomerPersonaPrompt as m4t1Persona } from './module4-task1-persona';
import { buildEvaluationPrompt as m4t1Rubric } from './module4-task1-rubric';

// Module 5 · Task 1
import { generateCustomerPersonaPrompt as m5t1Persona } from './module5-task1-persona';
import { buildEvaluationPrompt as m5t1Rubric } from './module5-task1-rubric';

// Module 6 · Task 1 (Voice Quiz — Product Fundamentals)
import { generateCustomerPersonaPrompt as m6t1Persona } from './module6-task1-persona';
import { buildEvaluationPrompt as m6t1Rubric } from './module6-task1-rubric';

// Module 6 · Task 2 (Technical & Application Knowledge)
import { generateCustomerPersonaPrompt as m6t2Persona } from './module6-task2-persona';
import { buildEvaluationPrompt as m6t2Rubric } from './module6-task2-rubric';

// Module 6 · Task 3 (Pricing, Quotation & Calculation)
import { generateCustomerPersonaPrompt as m6t3Persona } from './module6-task3-persona';
import { buildEvaluationPrompt as m6t3Rubric } from './module6-task3-rubric';

// ─── Sanitizer helpers ────────────────────────────────────────────────────────

function clamp(v: unknown, max: number): number {
  const n = typeof v === 'number' ? v : 0;
  return Math.min(Math.max(0, Math.round(n)), max);
}

// Half-step clamp for tasks with fractional section maxes (e.g. 3.5, 1.5).
function clampHalf(v: unknown, max: number): number {
  const n = typeof v === 'number' ? v : 0;
  const rounded = Math.round(n * 2) / 2; // round to nearest 0.5
  return Math.min(Math.max(0, rounded), max);
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

// Module 3 tier — out of 10
function tierM3(overall: number): ReportCard['performance_tier'] {
  if (overall >= 8) return 'Excellent';
  if (overall >= 6) return 'Good';
  if (overall >= 4) return 'Average';
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

// Module 3 sanitizer (Task 1 & 2 share this) — 3 sections, max 10 (5 + 3 + 2)
function sanitizeM3(raw: unknown): ReportCard {
  const c = raw as Partial<ReportCard> & { suggested_ideal_response?: string };
  const lever      = clamp(c.sections?.lever_used?.score, 5);
  const confidence = clamp(c.sections?.confidence_objection?.score, 3);
  const personal   = clamp(c.sections?.personalization?.score, 2);
  const overall    = lever + confidence + personal;
  return {
    overall_score: overall,
    sections: {
      lever_used:           section(c.sections?.lever_used, lever, 5),
      confidence_objection: section(c.sections?.confidence_objection, confidence, 3),
      personalization:      section(c.sections?.personalization, personal, 2),
    },
    critical_mistakes: c.critical_mistakes ?? [],
    coaching_feedback: c.coaching_feedback ?? '',
    performance_tier: tierM3(overall),
    suggested_ideal_response: c.suggested_ideal_response ?? '',
  };
}

// Module 3 Task 3 sanitizer — 3 sections, max 10 (discovery 2 + discount 5 + trust 3)
function sanitizeM3Task3(raw: unknown): ReportCard {
  const c = raw as Partial<ReportCard> & { suggested_ideal_response?: string };
  const discovery = clamp(c.sections?.discovery_questions?.score, 2);
  const discount  = clamp(c.sections?.discount_lever?.score, 5);
  const trust     = clamp(c.sections?.trust_confidence?.score, 3);
  const overall   = discovery + discount + trust;
  return {
    overall_score: overall,
    sections: {
      discovery_questions: section(c.sections?.discovery_questions, discovery, 2),
      discount_lever:      section(c.sections?.discount_lever, discount, 5),
      trust_confidence:    section(c.sections?.trust_confidence, trust, 3),
    },
    critical_mistakes: c.critical_mistakes ?? [],
    coaching_feedback: c.coaching_feedback ?? '',
    performance_tier: tierM3(overall),
    suggested_ideal_response: c.suggested_ideal_response ?? '',
  };
}

// Module 4 Task 1 sanitizer — 3 sections, max 30 (value 21 + personalisation 4 + trust 5)
function sanitizeM4Task1(raw: unknown): ReportCard {
  const c = raw as Partial<ReportCard> & { suggested_ideal_response?: string };
  const value      = clamp(c.sections?.value_justification?.score, 21);
  const personal   = clamp(c.sections?.personalisation?.score, 4);
  const trust      = clamp(c.sections?.trust_confidence?.score, 5);
  const overall    = value + personal + trust;
  return {
    overall_score: overall,
    sections: {
      value_justification: section(c.sections?.value_justification, value, 21),
      personalisation:     section(c.sections?.personalisation, personal, 4),
      trust_confidence:    section(c.sections?.trust_confidence, trust, 5),
    },
    critical_mistakes: c.critical_mistakes ?? [],
    coaching_feedback: c.coaching_feedback ?? '',
    performance_tier: tier2(overall),
    suggested_ideal_response: c.suggested_ideal_response ?? '',
  };
}

// Module 5 Task 1 sanitizer — 6 sections, max 20 (4+4+4+4+2+2)
function sanitizeM5Task1(raw: unknown): ReportCard {
  const c = raw as Partial<ReportCard> & { suggested_ideal_response?: string };
  const discovery   = clamp(c.sections?.discovery_diagnosis?.score, 4);
  const anchoring   = clamp(c.sections?.value_anchoring?.score, 4);
  const diffn       = clamp(c.sections?.tailored_differentiation?.score, 4);
  const objection   = clamp(c.sections?.objection_handling?.score, 4);
  const curation    = clamp(c.sections?.curated_design_value?.score, 2);
  const conviction  = clamp(c.sections?.conviction_no_discount?.score, 2);
  const overall     = discovery + anchoring + diffn + objection + curation + conviction;
  return {
    overall_score: overall,
    sections: {
      discovery_diagnosis:      section(c.sections?.discovery_diagnosis, discovery, 4),
      value_anchoring:          section(c.sections?.value_anchoring, anchoring, 4),
      tailored_differentiation: section(c.sections?.tailored_differentiation, diffn, 4),
      objection_handling:       section(c.sections?.objection_handling, objection, 4),
      curated_design_value:     section(c.sections?.curated_design_value, curation, 2),
      conviction_no_discount:   section(c.sections?.conviction_no_discount, conviction, 2),
    },
    critical_mistakes: c.critical_mistakes ?? [],
    coaching_feedback: c.coaching_feedback ?? '',
    performance_tier: tier3(overall),
    suggested_ideal_response: c.suggested_ideal_response ?? '',
  };
}

// Module 6 Task 1 performance tier — out of 16
function tierM6Task1(overall: number): ReportCard['performance_tier'] {
  if (overall >= 13) return 'Excellent';
  if (overall >= 9)  return 'Good';
  if (overall >= 5)  return 'Average';
  return 'Needs Improvement';
}

// Module 6 Task 1 sanitizer — 4 sections, max 16 (product quiz)
function sanitizeM6Task1(raw: unknown): ReportCard {
  const c = raw as Partial<ReportCard>;
  const catalog  = clamp(c.sections?.product_catalog?.score, 2);
  const warranty = clamp(c.sections?.warranty_durability?.score, 4);
  const materials = clamp(c.sections?.materials_usage?.score, 6);
  const designs  = clamp(c.sections?.designs_woodwork?.score, 4);
  const overall  = catalog + warranty + materials + designs;
  return {
    overall_score: overall,
    sections: {
      product_catalog:     section(c.sections?.product_catalog, catalog, 2),
      warranty_durability: section(c.sections?.warranty_durability, warranty, 4),
      materials_usage:     section(c.sections?.materials_usage, materials, 6),
      designs_woodwork:    section(c.sections?.designs_woodwork, designs, 4),
    },
    critical_mistakes: c.critical_mistakes ?? [],
    coaching_feedback: c.coaching_feedback ?? '',
    performance_tier: tierM6Task1(overall),
    suggested_ideal_response: (c as Partial<ReportCard> & { suggested_ideal_response?: string }).suggested_ideal_response ?? '',
  };
}

// Module 6 Task 2 performance tier — out of 20
function tierM6Task2(overall: number): ReportCard['performance_tier'] {
  if (overall >= 16) return 'Excellent';
  if (overall >= 12) return 'Good';
  if (overall >= 7)  return 'Average';
  return 'Needs Improvement';
}

// Module 6 Task 2 sanitizer — 5 sections, max 20 (technical & application quiz)
// Uses clampHalf (0.5 step) because sections have fractional maxes (3.5, 5.5).
function sanitizeM6Task2(raw: unknown): ReportCard {
  const c = raw as Partial<ReportCard> & { suggested_ideal_response?: string };
  const finishing   = clampHalf(c.sections?.finishing_basics?.score,        3.5);
  const components  = clampHalf(c.sections?.component_knowledge?.score,     5.5);
  const install     = clampHalf(c.sections?.installation_methods?.score,    3);
  const selection   = clampHalf(c.sections?.selection_logic?.score,         5);
  const judgment    = clampHalf(c.sections?.judgment_calc?.score,           3);
  const overall     = finishing + components + install + selection + judgment;
  return {
    overall_score: overall,
    sections: {
      finishing_basics:     section(c.sections?.finishing_basics,     finishing,  3.5),
      component_knowledge:  section(c.sections?.component_knowledge,  components, 5.5),
      installation_methods: section(c.sections?.installation_methods, install,    3),
      selection_logic:      section(c.sections?.selection_logic,      selection,  5),
      judgment_calc:        section(c.sections?.judgment_calc,        judgment,   3),
    },
    critical_mistakes: c.critical_mistakes ?? [],
    coaching_feedback: c.coaching_feedback ?? '',
    performance_tier: tierM6Task2(overall),
    suggested_ideal_response: c.suggested_ideal_response ?? '',
  };
}

// Module 6 Task 3 performance tier — out of 13
function tierM6Task3(overall: number): ReportCard['performance_tier'] {
  if (overall >= 11)  return 'Excellent';
  if (overall >= 8)   return 'Good';
  if (overall >= 4.5) return 'Average';
  return 'Needs Improvement';
}

// Module 6 Task 3 sanitizer — 3 sections, max 13 (pricing, quotation & calculation quiz)
function sanitizeM6Task3(raw: unknown): ReportCard {
  const c = raw as Partial<ReportCard> & { suggested_ideal_response?: string };
  const prices    = clamp(c.sections?.unit_prices?.score,       5);
  const quotes    = clamp(c.sections?.quotations?.score,        5);
  const glue      = clamp(c.sections?.glue_calculations?.score, 3);
  const overall   = prices + quotes + glue;
  return {
    overall_score: overall,
    sections: {
      unit_prices:        section(c.sections?.unit_prices,        prices, 5),
      quotations:         section(c.sections?.quotations,         quotes, 5),
      glue_calculations:  section(c.sections?.glue_calculations,  glue,   3),
    },
    critical_mistakes: c.critical_mistakes ?? [],
    coaching_feedback: c.coaching_feedback ?? '',
    performance_tier: tierM6Task3(overall),
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
  'module_3_task1': {
    persona:  m3t1Persona,
    rubric:   (transcript, customerName) => m3t1Rubric(transcript, customerName),
    sanitize: sanitizeM3,
  },
  'module_3_task2': {
    persona:  m3t2Persona,
    rubric:   (transcript, customerName) => m3t2Rubric(transcript, customerName),
    sanitize: sanitizeM3,
  },
  'module_3_task3': {
    persona:  m3t3Persona,
    rubric:   (transcript, customerName) => m3t3Rubric(transcript, customerName),
    sanitize: sanitizeM3Task3,
  },
  'module_4_task1': {
    persona:  m4t1Persona,
    rubric:   (transcript, customerName) => m4t1Rubric(transcript, customerName),
    sanitize: sanitizeM4Task1,
  },
  'module_5_task1': {
    persona:  m5t1Persona,
    rubric:   (transcript, customerName) => m5t1Rubric(transcript, customerName),
    sanitize: sanitizeM5Task1,
  },
  'module_6_task1': {
    persona:  m6t1Persona,
    rubric:   (transcript, customerName) => m6t1Rubric(transcript, customerName),
    sanitize: sanitizeM6Task1,
  },
  'module_6_task2': {
    persona:  m6t2Persona,
    rubric:   (transcript, customerName) => m6t2Rubric(transcript, customerName),
    sanitize: sanitizeM6Task2,
  },
  'module_6_task3': {
    persona:  m6t3Persona,
    rubric:   (transcript, customerName) => m6t3Rubric(transcript, customerName),
    sanitize: sanitizeM6Task3,
  },
};

export function getPersonaPrompt(
  moduleAttempted: string,
  customerName: string,
  customerGender: CustomerGender,
): string {
  const handler = PROMPT_REGISTRY[moduleAttempted];
  if (!handler) throw new Error(`Unknown moduleAttempted: "${moduleAttempted}"`);
  return handler.persona(customerName, customerGender);
}

export function getEvaluationPrompt(
  moduleAttempted: string,
  transcript: TranscriptEntry[],
  customerName: string,
): string {
  const handler = PROMPT_REGISTRY[moduleAttempted];
  if (!handler) throw new Error(`Unknown moduleAttempted: "${moduleAttempted}"`);
  return handler.rubric(transcript, customerName, moduleAttempted);
}

export function sanitizeReportCard(moduleAttempted: string, raw: unknown): ReportCard {
  const handler = PROMPT_REGISTRY[moduleAttempted];
  if (!handler) throw new Error(`Unknown moduleAttempted: "${moduleAttempted}"`);
  return handler.sanitize(raw);
}
