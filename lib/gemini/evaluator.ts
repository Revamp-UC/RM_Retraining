import { GoogleGenAI } from '@google/genai';
import { getEvaluationPrompt, sanitizeReportCard } from '@/lib/prompts/registry';
import type { TranscriptEntry } from '@/types/transcript';
import type { ReportCard } from '@/types/consultation';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

// ─── Response Schema ──────────────────────────────────────────────────────────

const SECTION_SCHEMA = {
  type: 'object',
  properties: {
    score:                { type: 'number' },
    max_score:            { type: 'number' },
    label:                { type: 'string' },
    strengths:            { type: 'array', items: { type: 'string' } },
    missed_opportunities: { type: 'array', items: { type: 'string' } },
    feedback:             { type: 'string' },
  },
  required: ['score', 'max_score', 'label', 'strengths', 'missed_opportunities', 'feedback'],
};

const MODULE_SECTIONS: Record<string, { keys: string[]; hasIdealResponse: boolean }> = {
  'module_1_seepage': { keys: ['introduction', 'technical', 'budget_discovery', 'discovery_confidence'], hasIdealResponse: false },
  'module_1_task2':   { keys: ['introduction', 'technical', 'budget_discovery', 'discovery_confidence', 'market_comparison'], hasIdealResponse: false },
  'module_1_task3':   { keys: ['introduction', 'technical', 'budget_discovery', 'discovery_confidence'], hasIdealResponse: false },
  'module_2_task1':   { keys: ['empathy_validation', 'personalisation_respect', 'discovery_leaning', 'expert_recommendation', 'reinforcement_tools', 'confidence_building'], hasIdealResponse: true },
  'module_2_task2':   { keys: ['trust_confidence', 'reinforcement_proof', 'hesitation_ownership', 'ff_gallery_validation'], hasIdealResponse: true },
  'module_3_task1':   { keys: ['lever_used', 'confidence_objection', 'personalization'], hasIdealResponse: true },
  'module_3_task2':   { keys: ['lever_used', 'confidence_objection', 'personalization'], hasIdealResponse: true },
  'module_3_task3':   { keys: ['discovery_questions', 'discount_lever', 'trust_confidence'], hasIdealResponse: true },
  'module_4_task1':   { keys: ['value_justification', 'personalisation', 'trust_confidence'], hasIdealResponse: true },
  'module_5_task1':   { keys: ['discovery_diagnosis', 'value_anchoring', 'tailored_differentiation', 'objection_handling', 'curated_design_value', 'conviction_no_discount'], hasIdealResponse: true },
};

function buildResponseSchema(module: string): unknown {
  const config = MODULE_SECTIONS[module] ?? MODULE_SECTIONS['module_1_seepage']!;

  const sectionProperties: Record<string, unknown> = {};
  for (const key of config.keys) {
    sectionProperties[key] = SECTION_SCHEMA;
  }

  const properties: Record<string, unknown> = {
    overall_score:     { type: 'number' },
    sections:          { type: 'object', properties: sectionProperties, required: config.keys },
    critical_mistakes: { type: 'array', items: { type: 'string' } },
    coaching_feedback: { type: 'string' },
    performance_tier:  { type: 'string' },
  };

  if (config.hasIdealResponse) {
    properties['suggested_ideal_response'] = { type: 'string' };
  }

  return {
    type: 'object',
    properties,
    required: [
      'overall_score', 'sections', 'critical_mistakes', 'coaching_feedback', 'performance_tier',
      ...(config.hasIdealResponse ? ['suggested_ideal_response'] : []),
    ],
  };
}

// ─── Evaluator ────────────────────────────────────────────────────────────────

export async function evaluateConsultation(params: {
  transcript: TranscriptEntry[];
  customer_name: string;
  module: string;
}): Promise<ReportCard> {
  if (params.transcript.length === 0) {
    return sanitizeReportCard(params.module, {
      critical_mistakes: ['Consultation was too short or no data captured'],
      coaching_feedback: 'The consultation did not have enough content to evaluate. Please conduct a full consultation next time.',
    });
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const prompt = getEvaluationPrompt(params.module, params.transcript, params.customer_name);
  const schema = buildResponseSchema(params.module);

  let lastError: unknown;

  // Phase 1: gemini-2.5-flash with thinking + schema (4 attempts, exponential backoff)
  const DELAYS_PRIMARY = [4000, 8000, 15000];
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      return sanitizeReportCard(params.module, await callModel(ai, 'gemini-2.5-flash', prompt, schema, true));
    } catch (err) {
      lastError = err;
      const status = (err as { status?: number })?.status ?? (err as { code?: number })?.code;
      console.error(`[Evaluator] gemini-2.5-flash attempt ${attempt} failed (status ${status ?? 'unknown'})`);
      if (status === 404) break; // model retired/unavailable → skip straight to fallback model
      if (status !== 503 && status !== 429) throw err;
      if (attempt < 4) {
        console.log(`[Evaluator] Retrying in ${DELAYS_PRIMARY[attempt - 1]! / 1000}s…`);
        await new Promise((r) => setTimeout(r, DELAYS_PRIMARY[attempt - 1]!));
      }
    }
  }

  // Phase 2: fallback to gemini-2.5-flash-lite — no thinking, same schema (2 attempts, 3s gap)
  console.log('[Evaluator] Falling back to gemini-2.5-flash-lite…');
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      return sanitizeReportCard(params.module, await callModel(ai, 'gemini-2.5-flash-lite', prompt, schema, false));
    } catch (err) {
      lastError = err;
      const status = (err as { status?: number })?.status ?? (err as { code?: number })?.code;
      console.error(`[Evaluator] gemini-2.5-flash-lite attempt ${attempt} failed (status ${status ?? 'unknown'})`);
      if (status !== 503 && status !== 429) throw err;
      if (attempt < 2) await new Promise((r) => setTimeout(r, 3000));
    }
  }

  throw lastError;
}

async function callModel(
  ai: GoogleGenAI,
  model: string,
  prompt: string,
  schema: unknown,
  useThinking: boolean,
): Promise<unknown> {
  const response = await ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseMimeType: 'application/json',
      responseSchema: schema as never,
      temperature: 0.3,
      ...(useThinking ? { thinkingConfig: { thinkingBudget: 1024 } } : {}),
    },
  });

  // Filter out thinking tokens — only parse the actual response parts
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const responseParts = parts.filter((p: { thought?: boolean }) => !p.thought);
  const rawText = responseParts.map((p: { text?: string }) => p.text ?? '').join('').trim();

  if (!rawText) {
    console.error('[Evaluator] Empty response after filtering thinking tokens');
    throw new Error('Empty response after filtering thinking tokens — triggering retry');
  }

  // responseSchema constrains Gemini to valid JSON — throw on failure so retry logic kicks in
  const cleaned = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[Evaluator] JSON parse failed:', rawText, err);
    throw new Error('JSON parse failed — triggering retry');
  }
}
