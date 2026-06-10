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
    return buildEmptyReport();
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const prompt = getEvaluationPrompt(params.module, params.transcript, params.customer_name);

  const DELAYS = [4000, 8000, 15000]; // ms between retries: 4s → 8s → 15s
  let lastError: unknown;

  for (let attempt = 1; attempt <= 4; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          responseMimeType: 'application/json',
          temperature: 0.3,
          thinkingConfig: { thinkingBudget: 0 },
        },
      });

      const rawText = response.text?.trim() ?? '';

      let parsed: ReportCard;
      try {
        const cleaned = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
        parsed = JSON.parse(cleaned) as ReportCard;
      } catch (err) {
        console.error('[Evaluator] Failed to parse response:', rawText, err);
        return buildEmptyReport();
      }

      return sanitizeReportCard(params.module, parsed);
    } catch (err) {
      lastError = err;
      const status = (err as { status?: number })?.status ?? (err as { code?: number })?.code;
      const isTransient = status === 503 || status === 429;
      console.error(`[Evaluator] Attempt ${attempt} failed (status ${status ?? 'unknown'}):`, err);

      // Fail fast on non-transient errors (bad request, auth, etc.)
      if (!isTransient) throw err;

      if (attempt < 4) {
        const delay = DELAYS[attempt - 1];
        console.log(`[Evaluator] Retrying in ${delay / 1000}s…`);
        await new Promise((r) => setTimeout(r, delay));
      }
    }
  }

  throw lastError;
}

function buildEmptyReport(): ReportCard {
  return {
    overall_score: 0,
    sections: {
      introduction:        { score: 0, max_score: 15, label: 'Poor', strengths: [], missed_opportunities: ['No consultation recorded'], feedback: 'No consultation data available.' },
      technical:           { score: 0, max_score: 5,  label: 'Poor', strengths: [], missed_opportunities: [], feedback: '' },
      budget_discovery:    { score: 0, max_score: 15, label: 'Poor', strengths: [], missed_opportunities: [], feedback: '' },
      discovery_confidence: { score: 0, max_score: 10, label: 'Poor', strengths: [], missed_opportunities: [], feedback: '' },
    },
    critical_mistakes: ['Consultation was too short or no data captured'],
    coaching_feedback: 'The consultation did not have enough content to evaluate. Please conduct a full consultation next time.',
    performance_tier: 'Needs Improvement',
  };
}
