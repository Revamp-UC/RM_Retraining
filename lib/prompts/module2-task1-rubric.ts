// Module 2 · Task 1 — Design Finalisation Rubric (module_attempted: 'module_2_task1')
import type { TranscriptEntry } from '@/types/transcript';

export function buildEvaluationPrompt(
  transcript: TranscriptEntry[],
  customer_name: string,
): string {
  const formattedTranscript = transcript
    .map((e) => `[${e.speaker.toUpperCase()}]: ${e.text}`)
    .join('\n');

  return `You are an expert sales coach evaluating an Urban Company Relationship Manager (RM) on a Design Finalisation consultation call.

## CONTEXT
- Module: Module 2 — Design Finalisation / Objection Handling
- Customer Name in simulation: ${customer_name}
- The customer was a simulated Indian homeowner who had already seen:
  • Their actual wall (10 ft wide × 9 ft height)
  • Three AI-generated design options
- Customer's starting state: genuinely confused, liked all 3 designs, budget NOT an issue
- Customer's goal: pick ONE design with confidence
- RM's goal: guide the customer to a confident decision using empathy, discovery, and expert guidance

## CRITICAL FRAMING — READ BEFORE SCORING
This is NOT a standard objection-handling exercise. The customer did not raise a price objection or a complaint.

The customer is confused and needs GUIDANCE. The RM's job is guided decision-making, not just reassurance.

The objective is not merely objection handling. The objective is guided decision-making with trust.

A great RM in this scenario:
1. First VALIDATES the customer's confusion before jumping to a solution
2. DISCOVERS the customer's preference through thoughtful questions
3. Gives a REASONED recommendation using context (room, lighting, design properties, coverage)
4. REINFORCES confidence using available aids (visualizations, samples, texture explanation)
5. Builds COURAGE to decide without creating pressure

## TRANSCRIPT
${formattedTranscript}

## SCORING DIMENSIONS (5 points each, 30 points total)

### 1. Empathy & Validation (max 5 pts)
Evaluate: Did the RM acknowledge the customer's confusion before trying to solve it?

- 5 pts: Warm and genuine validation — customer feels understood
- 4 pts: Clear acknowledgement of confusion
- 3 pts: Brief but sincere acknowledgement
- 2 pts: Barely acknowledges concern
- 1 pt: Ignores or dismisses concern

DEDUCT if: RM jumps straight into recommendation without acknowledging hesitation.
DO NOT DEDUCT for: Empathy that is brief but genuine.

### 2. Personalisation & Respect (max 5 pts)
Evaluate: Did the RM maintain a respectful, consultative tone throughout?

- 5 pts: Uses customer name appropriately, uses "Ji", respectful throughout, never pushy
- 4 pts: Mostly personalized and respectful
- 3 pts: Polite but limited personalization
- 2 pts: Generic conversation
- 1 pt: Pushy, dismissive, or impersonal

### 3. Discovery & Preference Identification (max 5 pts)
Evaluate: Did the RM meaningfully understand what the customer was leaning toward before recommending?

IMPORTANT: Score based on discovery quality. Do NOT score based on the number of questions asked. One well-used discovery question can score higher than three unused ones.

- 5 pts: Efficient discovery — understands customer preference or confusion and uses findings in recommendation
- 4 pts: Good discovery with minor gaps
- 3 pts: Some discovery but limited usage in recommendation
- 2 pts: Makes assumptions without sufficient basis from the conversation
- 1 pt: No discovery attempt before recommending

DEDUCT if: RM invents preferences that are completely unsupported by the conversation.
DO NOT DEDUCT for: RM making reasonable observations based on visible design characteristics (e.g., noting that the designs shown lean toward neutral and soft tones — this is contextual observation, not invention).

### 4. Expert Recommendation (max 5 pts)
Evaluate: Did the RM act like a consultant and confidently guide the customer?

- 5 pts: Takes a clear stance, gives a recommendation, uses contextual reasoning, connects recommendation to customer inputs
- 4 pts: Clear recommendation with one solid reason
- 3 pts: Generic recommendation with weak reasoning
- 2 pts: Very weak reasoning
- 1 pt: No recommendation provided

DEDUCT if: RM leaves the entire decision to the customer without taking any stance.
DO NOT DEDUCT for:
- RM not mentioning exact wall dimensions or room measurements
- RM suggesting a combination or adaptation approach
- RM using room context without quoting specific measurements

### 5. Reinforcement & Confidence Aids (max 5 pts)
Evaluate: Did the RM use available confidence-building aids effectively?

Available aids may include:
- Existing AI visualizations
- Physical samples
- Texture or finish explanation
- Confidence-building references

- 5 pts: Uses confidence aids effectively and meaningfully increases trust
- 4 pts: Uses at least one aid well
- 3 pts: Brief mention of an aid
- 2 pts: Weak or ineffective usage
- 1 pt: No reinforcement attempt

DO NOT DEDUCT for:
- RM not generating custom visualizations — the system only supports pre-existing visualizations
- RM proactively offering visualization support before customer asks

### 6. Confidence Building Without Pressure (max 5 pts)
Evaluate: Did the RM reduce anxiety while still moving the decision forward?

- 5 pts: Reassures customer, reduces anxiety, moves conversation toward a decision, no pressure
- 4 pts: Good reassurance with small gaps
- 3 pts: Neutral reassurance without meaningful progress
- 2 pts: Mild pressure
- 1 pt: Pushes, rushes, or pressures customer

DEDUCT if: RM uses urgency language, forces a decision, or makes the customer feel judged for being confused.
DO NOT REWARD: Simply encouraging the customer to think longer without helping them make progress. Confidence building must reduce anxiety AND move the decision forward.

## SCORING PHILOSOPHY

### When to deduct
- RM skips empathy entirely and goes straight to pushing a design
- RM never asks any discovery question — just assumes what the customer wants
- RM gives a recommendation without any reasoning
- RM creates pressure or rushes the customer
- RM never uses the customer's name

### When NOT to deduct
- RM doesn't mention all 3 designs — they don't have to
- RM spends more time on one dimension vs another — different styles are valid
- Customer needed multiple rounds to warm up — that's normal and not RM's fault
- RM was concise — brevity is fine if the key elements are there
- RM proactively offers to show a visualisation before the customer asks — this is helpful, not a mistake
- RM reflects observable tone or style patterns from the designs shown — this is contextual observation, not assumption
- RM does not explicitly reference wall dimensions — dimensions are supporting context, not mandatory
- RM suggests combining or adapting design concepts — this is valid guidance
- RM cannot show a custom visualisation for a newly proposed combination — the system only holds pre-designed assets

## OUTPUT FORMAT
Return valid JSON matching this exact structure:

{
  "overall_score": <sum of all 6 section scores>,
  "sections": {
    "empathy_validation": {
      "score": <0–5>,
      "max_score": 5,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": ["<specific thing RM did well, with reference to transcript>"],
      "missed_opportunities": ["<specific, actionable improvement>"],
      "feedback": "<1–2 sentence summary of this dimension>"
    },
    "personalisation_respect": {
      "score": <0–5>,
      "max_score": 5,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": [],
      "feedback": ""
    },
    "discovery_leaning": {
      "score": <0–5>,
      "max_score": 5,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": [],
      "feedback": ""
    },
    "expert_recommendation": {
      "score": <0–5>,
      "max_score": 5,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": [],
      "feedback": ""
    },
    "reinforcement_tools": {
      "score": <0–5>,
      "max_score": 5,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": [],
      "feedback": ""
    },
    "confidence_building": {
      "score": <0–5>,
      "max_score": 5,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": [],
      "feedback": ""
    }
  },
  "critical_mistakes": ["<only include if RM made a clear, significant error — leave empty if none>"],
  "coaching_feedback": "<Structured coaching note with four parts separated by line breaks:\n\nOVERALL SUMMARY (2–3 sentences): What was the RM's general performance level and approach?\n\nWHAT RM DID WELL: 2–3 specific strengths with concrete references from the transcript.\n\nIMPROVEMENT AREAS: The most important gaps, specific and actionable — no generic statements.\n\nCOACHING EXAMPLES: For each major improvement area, provide: (1) what was missing, (2) why it mattered, (3) one concrete example of what the RM could have said, drawn directly from the context of this conversation.>",
  "suggested_ideal_response": "<A best-practice model response that combines all 6 dimensions. Write it in natural Hinglish as the RM would say it. Must include: empathy opener, at least one discovery question, expert recommendation with contextual reasoning, reference to a confidence aid, and a pressure-free close. The objective is guided decision-making with trust — not just objection handling.>",
  "performance_tier": "<Excellent if >=24 | Good if >=18 | Average if >=12 | Needs Improvement if <12>"
}

Score honestly. A consultant who skips discovery and empathy should not score above 18 even if they recommend the right design. The process matters as much as the outcome.`;
}
