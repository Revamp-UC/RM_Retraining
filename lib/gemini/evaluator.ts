import { GoogleGenAI } from '@google/genai';
import { buildEvaluationPrompt } from '@/lib/prompts/evaluation-rubric';
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
  const prompt = buildEvaluationPrompt(params.transcript, params.customer_name, params.module);

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',   // Confirmed working 2025-06-06
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    config: {
      responseMimeType: 'application/json',
      temperature: 0.3,
    },
  });

  const rawText = response.text?.trim() ?? '';

  let parsed: ReportCard;
  try {
    // Strip any accidental markdown code fences
    const cleaned = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '');
    parsed = JSON.parse(cleaned) as ReportCard;
  } catch (err) {
    console.error('[Evaluator] Failed to parse response:', rawText, err);
    return buildEmptyReport();
  }

  // Validate and clamp scores
  return sanitizeReportCard(parsed);
}

function sanitizeReportCard(card: Partial<ReportCard>): ReportCard {
  const clamp = (v: unknown, max: number): number => {
    const n = typeof v === 'number' ? v : 0;
    return Math.min(Math.max(0, Math.round(n * 10) / 10), max);
  };

  const intro_score = clamp(card.sections?.introduction?.score, 15);
  const tech_score = clamp(card.sections?.technical?.score, 5);
  const budget_score = clamp(card.sections?.budget_discovery?.score, 20);
  const discovery_score = clamp(card.sections?.discovery_confidence?.score, 10);
  const overall = intro_score + tech_score + budget_score + discovery_score;

  const tier = (() => {
    if (overall >= 42) return 'Excellent' as const;
    if (overall >= 32) return 'Good' as const;
    if (overall >= 20) return 'Average' as const;
    return 'Needs Improvement' as const;
  })();

  return {
    overall_score: overall,
    sections: {
      introduction: {
        score: intro_score,
        max_score: 15,
        label: card.sections?.introduction?.label ?? 'Average',
        strengths: card.sections?.introduction?.strengths ?? [],
        missed_opportunities: card.sections?.introduction?.missed_opportunities ?? [],
        feedback: card.sections?.introduction?.feedback ?? '',
      },
      technical: {
        score: tech_score,
        max_score: 5,
        label: card.sections?.technical?.label ?? 'Average',
        strengths: card.sections?.technical?.strengths ?? [],
        missed_opportunities: card.sections?.technical?.missed_opportunities ?? [],
        feedback: card.sections?.technical?.feedback ?? '',
      },
      budget_discovery: {
        score: budget_score,
        max_score: 20,
        label: card.sections?.budget_discovery?.label ?? 'Average',
        strengths: card.sections?.budget_discovery?.strengths ?? [],
        missed_opportunities: card.sections?.budget_discovery?.missed_opportunities ?? [],
        feedback: card.sections?.budget_discovery?.feedback ?? '',
      },
      discovery_confidence: {
        score: discovery_score,
        max_score: 10,
        label: card.sections?.discovery_confidence?.label ?? 'Average',
        strengths: card.sections?.discovery_confidence?.strengths ?? [],
        missed_opportunities: card.sections?.discovery_confidence?.missed_opportunities ?? [],
        feedback: card.sections?.discovery_confidence?.feedback ?? '',
      },
    },
    critical_mistakes: card.critical_mistakes ?? [],
    coaching_feedback: card.coaching_feedback ?? 'No coaching feedback generated.',
    performance_tier: tier,
  };
}

function buildEmptyReport(): ReportCard {
  return {
    overall_score: 0,
    sections: {
      introduction: { score: 0, max_score: 15, label: 'Poor', strengths: [], missed_opportunities: ['No consultation recorded'], feedback: 'No consultation data available for evaluation.' },
      technical: { score: 0, max_score: 5, label: 'Poor', strengths: [], missed_opportunities: [], feedback: '' },
      budget_discovery: { score: 0, max_score: 20, label: 'Poor', strengths: [], missed_opportunities: [], feedback: '' },
      discovery_confidence: { score: 0, max_score: 10, label: 'Poor', strengths: [], missed_opportunities: [], feedback: '' },
    },
    critical_mistakes: ['Consultation was too short or no data captured'],
    coaching_feedback: 'The consultation did not have enough content to evaluate. Please conduct a full consultation next time.',
    performance_tier: 'Needs Improvement',
  };
}
