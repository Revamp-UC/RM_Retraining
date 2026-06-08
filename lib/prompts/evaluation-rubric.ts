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
- Did RM introduce themselves as the Project Manager? (5 pts) — this is a key trust and ownership signal. Deduct significantly if the RM introduced themselves only by name or not at all, without positioning themselves as the Project Manager. Introducing as Project Manager builds customer confidence that this person is accountable and in charge of the entire project.
- Did RM build comfort before diving into the product? (5 pts)
- Did the RM's tone feel natural, warm, and respectful? (5 pts)
Deduct if: RM was robotic, skipped intro, or immediately went into selling.
NOTE: Do NOT deduct points if the RM used "sir/ma'am" instead of the customer's name — name usage is not a scored criterion, it is a coaching tip only (see below).
NOTE: Do NOT deduct points if the RM did not explicitly mention Urban Company — the customer already knows the RM is from Urban Company since the visit was booked through the platform. Mentioning Urban Company is good practice and can be noted as a coaching tip, but it does not affect the score.

### Category 2: Technical Knowledge (Max: 5 points)
Award points based on:
- Did RM accurately explain what wall panels are? (2 pts)
- Did RM explain how panels address seepage? (1 pt)
- Did RM accurately answer installation or delivery timeline questions IF the customer raised this topic? (1 pt) — ONLY evaluate this point if the customer explicitly asked about installation or delivery. If the customer did not ask, do not deduct for omission — it can be mentioned as an improvement tip in coaching feedback. Expected correct answer if asked: material is generally delivered within 24–48 hours.
- Did RM address durability/longevity questions? (1 pt)
Deduct if: RM gave wrong information or couldn't answer basic product questions the customer raised.

### Category 3: Budget Discovery (Max: 20 points)
Award points based on:
- Did RM attempt to discover budget (directly or indirectly)? (5 pts)
- Did RM propose options at multiple price points? (5 pts)
- Did RM correctly read customer's reactions to price? (5 pts)
- Did RM avoid pushing far outside the customer's comfort zone? (5 pts)
Deduct heavily if: RM never discussed budget at all, only quoted a single price with no alternatives, or quoted ₹40k+ without adjusting after reading clear pushback signals.
NOTE: Do NOT deduct if the RM proactively introduced a specific price range (e.g. ₹15k–₹20k) even when the customer had not shared any budget indication. Starting the budget conversation with an anchored range is a valid RM approach — whether the RM mentions a range upfront or after showing designs are both acceptable. Deduct only when the RM ignores clear negative signals and keeps pushing well beyond the customer's comfort zone.

### Category 4: Discovery & Confidence (Max: 10 points)
Award points based on:
- Did RM ask about room/wall dimensions? (2 pts)
- Did RM explore basic design/aesthetic preferences such as color, theme, or style? (3 pts) — basic preference discovery is sufficient; asking about color preferences, design style, or theme qualifies. Do not penalise for not going deep into design if basic exploration was done.
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

MANDATORY COACHING TIPS — always include these naturally within the coaching_feedback paragraph, regardless of the RM's score:
1. Using the customer's name during the conversation (e.g., "Rahul ji" instead of "sir") creates stronger personal rapport and makes the customer feel more valued. However, for senior citizens or clearly older customers, "sir" or "ma'am" is still the most respectful choice and may work better on ground. The RM should read the situation — name + "ji" works best for peer-age or younger customers.
2. Even though the customer already knows the RM is from Urban Company (the visit was booked through the platform), mentioning Urban Company during the introduction adds an extra layer of trust and brand credibility in a face-to-face interaction. This is a good habit to build.`;
}
