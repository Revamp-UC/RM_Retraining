// Prompt registry — maps module_attempted (DB value) to the correct persona and rubric.
//
// To add a new task:
//   1. Create lib/prompts/module1-task2-persona.ts  (export generateCustomerPersonaPrompt)
//   2. Create lib/prompts/module1-task2-rubric.ts   (export buildEvaluationPrompt)
//   3. Add a new entry in PROMPT_REGISTRY below — nothing else needs touching.

import type { CustomerGender } from '@/types/consultation';
import type { TranscriptEntry } from '@/types/transcript';

// Module 1 · Task 1
import { generateCustomerPersonaPrompt as m1t1Persona } from './customer-persona';
import { buildEvaluationPrompt as m1t1Rubric } from './evaluation-rubric';

interface PromptHandlers {
  persona: (name: string, gender: CustomerGender) => string;
  rubric: (transcript: TranscriptEntry[], customerName: string, module: string) => string;
}

const PROMPT_REGISTRY: Record<string, PromptHandlers> = {
  'module_1_seepage': {
    persona: m1t1Persona,
    rubric: m1t1Rubric,
  },
  // 'module_1_task2_xxx': { persona: m1t2Persona, rubric: m1t2Rubric },  ← add here when Task 2 is ready
};

const FALLBACK = PROMPT_REGISTRY['module_1_seepage'];

export function getPersonaPrompt(
  moduleAttempted: string,
  customerName: string,
  customerGender: CustomerGender,
): string {
  const handlers = PROMPT_REGISTRY[moduleAttempted] ?? FALLBACK;
  return handlers.persona(customerName, customerGender);
}

export function getEvaluationPrompt(
  moduleAttempted: string,
  transcript: TranscriptEntry[],
  customerName: string,
): string {
  const handlers = PROMPT_REGISTRY[moduleAttempted] ?? FALLBACK;
  return handlers.rubric(transcript, customerName, moduleAttempted);
}
