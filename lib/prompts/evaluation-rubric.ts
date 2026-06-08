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

## SCORING PHILOSOPHY — READ THIS BEFORE SCORING

### When to deduct marks
Only deduct marks when the RM fails a core module objective. Specifically:
- The RM never attempts budget discovery despite clear opportunities or customer signals
- The RM quotes only a single price with no alternatives and ignores pushback
- The RM gives factually wrong information on something the customer explicitly asked about
- The RM ignores repeated, explicit customer signals (confusion, concern, price pushback) and keeps pushing
- The RM skips the Project Manager introduction entirely
- The RM immediately jumps into selling without any attempt to build comfort

### When NOT to deduct marks
Do NOT deduct for:
- Things the RM did not proactively mention, unless the customer specifically asked about them — omitting something unprompted is not a mistake, it is at most a missed enhancement
- The RM prioritising budget discovery before showing designs — this is the correct behaviour for this module; Budget Discovery is the primary objective
- The customer asking to see designs before discussing budget — the RM is right to anchor the budget conversation first; this is not a scoring fault
- Steps where the RM's approach differed from the ideal but still achieved the core objective
- Building rapport briefly vs at length — any genuine warmth counts, not a checklist of rapport steps

### The missed_opportunities field — strict rule
The "missed_opportunities" array in each section must ONLY contain observations that directly caused a point deduction. If you noticed something the RM could have done better but chose not to deduct for it, do NOT put it in missed_opportunities. Those go in "feedback" instead.

### The feedback field — make it actionable
Every coaching suggestion in "feedback" must include a concrete example — not a generic statement. Instead of "RM could build more rapport", write something like: "Before moving to the wall, a line like 'aapka ghar bahut accha hai — kaafi time se wall change karne ka socha hai kya?' would have warmed up the conversation naturally." Suggestions without examples are not useful to the RM.

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
      "missed_opportunities": ["<ONLY include if this observation directly caused a point deduction — leave array empty if no points were deducted>"],
      "feedback": "<2-3 sentences: coaching suggestions for this section, each with a concrete example of better phrasing or approach. Non-critical tips that did not affect the score go here, not in missed_opportunities.>"
    },
    "technical": {
      "score": <number 0-5>,
      "max_score": 5,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": ["<specific strength>"],
      "missed_opportunities": ["<ONLY include if this observation directly caused a point deduction — leave array empty if no points were deducted>"],
      "feedback": "<2-3 sentences: coaching suggestions with concrete examples. Non-critical omissions (e.g. not proactively mentioning timeline when customer didn't ask) go here as improvement tips, not in missed_opportunities.>"
    },
    "budget_discovery": {
      "score": <number 0-20>,
      "max_score": 20,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": ["<specific strength>"],
      "missed_opportunities": ["<ONLY include if this observation directly caused a point deduction — leave array empty if no points were deducted>"],
      "feedback": "<2-3 sentences: coaching suggestions with concrete examples. Remember: RM prioritising budget before designs is correct behaviour, not a mistake.>"
    },
    "discovery_confidence": {
      "score": <number 0-10>,
      "max_score": 10,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": ["<specific strength>"],
      "missed_opportunities": ["<ONLY include if this observation directly caused a point deduction — leave array empty if no points were deducted>"],
      "feedback": "<2-3 sentences: coaching suggestions with concrete examples.>"
    }
  },
  "critical_mistakes": ["<only genuine core-objective failures — max 3. Do not include minor omissions or proactive enhancement opportunities here>"],
  "coaching_feedback": "<3-5 sentence overall coaching paragraph>",
  "performance_tier": "<Excellent|Good|Average|Needs Improvement>"
}

IMPORTANT: overall_score must equal the sum of all four section scores. Be specific — reference actual things said or not said in the transcript.

MANDATORY COACHING TIPS — always include these naturally within the coaching_feedback paragraph, regardless of the RM's score:
1. Using the customer's name during the conversation (e.g., "Rahul ji" instead of "sir") creates stronger personal rapport and makes the customer feel more valued. However, for senior citizens or clearly older customers, "sir" or "ma'am" is still the most respectful choice and may work better on ground. The RM should read the situation — name + "ji" works best for peer-age or younger customers.
2. Even though the customer already knows the RM is from Urban Company (the visit was booked through the platform), mentioning Urban Company during the introduction adds an extra layer of trust and brand credibility in a face-to-face interaction. This is a good habit to build.`;
}
