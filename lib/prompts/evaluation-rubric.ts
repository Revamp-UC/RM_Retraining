import type { TranscriptEntry } from '@/types/transcript';

export function buildEvaluationPrompt(
  transcript: TranscriptEntry[],
  customer_name: string,
  module: string,
): string {
  const formattedTranscript = transcript
    .map((e) => `[${e.speaker.toUpperCase()}]: ${e.text}`)
    .join('\n');

  return `You are an expert sales coach evaluating an Urban Company Relationship Manager (RM) on a wall panel consultation call.

## CONTEXT
- Module: ${module}
- Customer Name in simulation: ${customer_name}
- The customer was a simulated Indian homeowner with seepage wall problem
- Customer's internal budget comfort: ₹20,000–₹25,000 (RM didn't know this)
- Customer had interest in lighting (only revealed if asked about aesthetics)

## TRANSCRIPT
${formattedTranscript}

## SCORING RUBRIC

### Category 1: Introduction & Rapport (Max: 15 points)
Award points based on:
- Did RM greet warmly and introduce themselves by name? (3 pts)
- Did RM mention Urban Company clearly? (2 pts)
- Did RM build comfort before diving into the product? (5 pts)
- Did the RM's tone feel natural, warm, and respectful? (5 pts)
Deduct if: RM was robotic, skipped intro, or immediately went into selling.
NOTE: Do NOT deduct points if the RM used "sir/ma'am" instead of the customer's name — name usage is not a scored criterion. It is a coaching tip only (see below).

### Category 2: Technical Knowledge (Max: 5 points)
Award points based on:
- Did RM accurately explain what wall panels are? (2 pts)
- Did RM explain how panels address seepage? (1 pt)
- Did RM mention installation process or timeline? (1 pt)
- Did RM address durability/longevity questions? (1 pt)
Deduct if: RM gave wrong information or couldn't answer basic product questions.

### Category 3: Budget Discovery (Max: 20 points)
Award points based on:
- Did RM attempt to discover budget (directly or indirectly)? (5 pts)
- Did RM propose options at multiple price points? (5 pts)
- Did RM correctly read customer's reactions to price? (5 pts)
- Did RM avoid pushing far outside the customer's comfort zone? (5 pts)
Deduct heavily if: RM never discussed budget, only quoted one price, or quoted ₹40k+ without reading pushback signals.

### Category 4: Discovery & Confidence (Max: 10 points)
Award points based on:
- Did RM ask about room/wall dimensions? (2 pts)
- Did RM explore design/aesthetic preferences (leading to lighting discovery)? (3 pts)
- Did RM handle customer questions confidently and accurately? (3 pts)
- Did RM sound credible and professional throughout? (2 pts)
Deduct if: RM was defensive, unsure, or skipped discovery entirely.

## YOUR TASK
Evaluate the RM's performance STRICTLY based on the transcript. Be honest and critical. Do not inflate scores.

Return a JSON object matching this exact schema. Do not include markdown, just the JSON:

{
  "overall_score": <number 0-50>,
  "sections": {
    "introduction": {
      "score": <number 0-15>,
      "max_score": 15,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": ["<specific strength from transcript>"],
      "missed_opportunities": ["<specific miss from transcript>"],
      "feedback": "<2-3 sentence coaching feedback>"
    },
    "technical": {
      "score": <number 0-5>,
      "max_score": 5,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": ["<specific strength>"],
      "missed_opportunities": ["<specific miss>"],
      "feedback": "<2-3 sentence coaching feedback>"
    },
    "budget_discovery": {
      "score": <number 0-20>,
      "max_score": 20,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": ["<specific strength>"],
      "missed_opportunities": ["<specific miss>"],
      "feedback": "<2-3 sentence coaching feedback>"
    },
    "discovery_confidence": {
      "score": <number 0-10>,
      "max_score": 10,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": ["<specific strength>"],
      "missed_opportunities": ["<specific miss>"],
      "feedback": "<2-3 sentence coaching feedback>"
    }
  },
  "critical_mistakes": ["<critical mistake if any, max 3>"],
  "coaching_feedback": "<3-5 sentence overall coaching paragraph>",
  "performance_tier": "<Excellent|Good|Average|Needs Improvement>"
}

IMPORTANT: overall_score must equal the sum of all four section scores. Be specific — reference actual things said or not said in the transcript.

MANDATORY COACHING TIP — always include this naturally within the coaching_feedback paragraph, regardless of the RM's score:
Using the customer's name during the conversation (e.g., "Rahul ji" instead of "sir") creates stronger personal rapport and makes the customer feel more valued. However, for senior citizens or clearly older customers, "sir" or "ma'am" is still the most respectful choice and may work better on ground. The RM should read the situation — name + "ji" works best for peer-age or younger customers.`;
}
