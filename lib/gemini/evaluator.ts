import { GoogleGenAI } from '@google/genai';
import { getEvaluationPrompt, sanitizeReportCard } from '@/lib/prompts/registry';
import type { TranscriptEntry } from '@/types/transcript';
import type { ReportCard } from '@/types/consultation';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;

export async function evaluateConsultation(params: {
  transcript: TranscriptEntry[];
  customer_name: string;
  module: string;
}): Promise<ReportCard> {
  if (params.transcript.length === 0) {
    // Route through the module's own sanitizer so section structure is correct
    return sanitizeReportCard(params.module, {
      critical_mistakes: ['Consultation was too short or no data captured'],
      coaching_feedback: 'The consultation did not have enough content to evaluate. Please conduct a full consultation next time.',
    });
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const prompt = getEvaluationPrompt(params.module, params.transcript, params.customer_name);

  let lastError: unknown;

  // Phase 1: gemini-2.5-flash with exponential backoff (4s → 8s → 15s)
  const DELAYS_PRIMARY = [4000, 8000, 15000];
  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      return sanitizeReportCard(params.module, await callModel(ai, 'gemini-2.5-flash', prompt));
    } catch (err) {
      lastError = err;
      const status = (err as { status?: number })?.status ?? (err as { code?: number })?.code;
      console.error(`[Evaluator] gemini-2.5-flash attempt ${attempt} failed (status ${status ?? 'unknown'})`);
      if (status !== 503 && status !== 429) throw err; // hard error — don't retry
      if (attempt < 4) {
        console.log(`[Evaluator] Retrying in ${DELAYS_PRIMARY[attempt - 1]! / 1000}s…`);
        await new Promise((r) => setTimeout(r, DELAYS_PRIMARY[attempt - 1]!));
      }
    }
  }

  // Phase 2: fallback to gemini-2.0-flash (2 attempts, 3s gap)
  console.log('[Evaluator] Falling back to gemini-2.0-flash…');
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      return sanitizeReportCard(params.module, await callModel(ai, 'gemini-2.0-flash', prompt));
    } catch (err) {
      lastError = err;
      const status = (err as { status?: number })?.status ?? (err as { code?: number })?.code;
      console.error(`[Evaluator] gemini-2.0-flash attempt ${attempt} failed (status ${status ?? 'unknown'})`);
      if (status !== 503 && status !== 429) throw err;
      if (attempt < 2) await new Promise((r) => setTimeout(r, 3000));
    }
  }

  throw lastError;
}

async function callModel(ai: GoogleGenAI, model: string, prompt: string): Promise<unknown> {
  const response = await ai.models.generateContent({
    model,
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: { responseMimeType: 'application/json', temperature: 0.3, thinkingConfig: { thinkingBudget: 1024 } },
  });

  // Filter out thinking tokens (thought: true parts) — only use actual response text
  const parts = response.candidates?.[0]?.content?.parts ?? [];
  const responseParts = parts.filter((p: { thought?: boolean }) => !p.thought);
  const rawText = (
    responseParts.length > 0
      ? responseParts.map((p: { text?: string }) => p.text ?? '').join('')
      : (response.text ?? '')
  ).trim();

  try {
    const cleaned = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
    return JSON.parse(cleaned);
  } catch (err) {
    console.error('[Evaluator] Failed to parse response:', rawText, err);
    return {};
  }
}
