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
- The RM skips introduction entirely and jumps straight into selling
- The RM never asks for or uses the customer's name at any point in the entire consultation
- The RM misses multiple introduction sub-criteria (formal intro, agenda setting, ownership, etc.)

### When NOT to deduct marks
Do NOT deduct for:
- Things the RM did not proactively mention, unless the customer specifically asked about them — omitting something unprompted is not a mistake, it is at most a missed enhancement
- The RM prioritising budget discovery before showing designs — this is the correct behaviour for this module; Budget Discovery is the primary objective
- The customer asking to see designs before discussing budget — the RM is right to anchor the budget conversation first; this is not a scoring fault
- Steps where the RM's approach differed from the ideal but still achieved the core objective
- Exact wording — if the RM communicates the same intent in their own natural style, award the marks

### The missed_opportunities field — strict rule
The "missed_opportunities" array in each section must ONLY contain observations that directly caused a point deduction. If you noticed something the RM could have done better but chose not to deduct for it, do NOT put it in missed_opportunities. Those go in "feedback" instead.

### The feedback field — make it actionable
Every coaching suggestion in "feedback" must include a concrete example — not a generic statement. Instead of "RM could build more rapport", write something like: "Before moving to the wall, a line like 'aapka ghar bahut accha hai — kaafi time se wall change karne ka socha hai kya?' would have warmed up the conversation naturally." Suggestions without examples are not useful to the RM.

## SCORING RUBRIC

### Category 1: Introduction & Agenda Setting (Max: 15 points)

IMPORTANT: Do NOT check for exact wording. Award marks if the RM communicates the same intent naturally in their own style. The goal is to evaluate whether the RM successfully built trust, ownership, and clarity — not whether they followed a script.

#### Formal Introduction — 2 points
Did the RM introduce themselves by name and mention Urban Company or Revamp by Urban Company?
Any professional self-introduction that clearly establishes who they are and which company they represent earns these marks.

#### Customer Name & Personalization — 2 points
- 1 pt: Did the RM ask for the customer's name at any point?
- 1 pt: Did the RM address the customer by name during the conversation? Using "ji" after the name (e.g. "Rahul ji") is preferred as it creates warmth and respect.
Deduct both points only if the RM relied exclusively on "sir/ma'am" throughout the entire consultation without ever asking for or using the customer's name. Using "sir/ma'am" occasionally alongside the name is acceptable.

#### Expert Positioning — 1 point
Did the RM position themselves as a wall design expert, specialist, or naturally communicate that they have relevant expertise in this area?
When customers hear words like "expert" or "specialist," it builds credibility and confidence. Any natural communication of this intent earns the mark — exact words are not required.

#### Project Ownership — 2 points
Did the RM communicate that they will personally manage the project from start to finish and take full ownership of the customer's experience?
The customer should clearly feel that the RM is accountable for the entire journey, not just the visit. Wording can vary freely — award if the intent is clearly communicated.

#### Single Point of Contact — 1 point
Did the RM communicate that the customer can reach them directly for any queries, and that they will coordinate everything needed for the project?
The customer should feel supported and know exactly who to contact. Any natural expression of this intent earns the mark.

#### Agenda Setting — 5 points (1 point each)
Did the RM give the customer a clear sense of what will happen during the consultation? Award 1 point for each of the following if clearly communicated:
- Understanding requirements (1 pt): RM mentions they will first understand what the customer needs for the wall.
- Understanding preferences (1 pt): RM mentions they will explore the customer's style, likes, dislikes, or design expectations.
- Design discussion (1 pt): RM mentions they will suggest or present suitable design options.
- Samples & visualization (1 pt): RM mentions they will show samples, designs, or visualizations to help the customer imagine the final result.
- Next steps / closure setting (1 pt): RM sets expectations about what happens after the discussion — e.g. if everything aligns, the project can move forward.
Exact sequence and wording are not required. Award if the intent is naturally communicated.

#### Communication Quality — 2 points
- Natural flow (1 pt): The introduction feels comfortable and conversational, not robotic or heavily scripted.
- Confidence (1 pt): The RM sounds confident, professional, and in control of the consultation.

Deduct only if: The RM skipped the introduction entirely and went straight into selling OR relied exclusively on "sir/ma'am" throughout without ever using the customer's name.

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
      "strengths": ["Write in simple English. For each strength: describe what the RM did well, explain WHY it was effective, and how it helped build customer trust or improve the customer experience. Do not just list completed points — explain the impact so the RM feels genuinely recognized."],
      "missed_opportunities": ["ONLY include items where marks were actually deducted. For each deduction: state clearly what was missed, why marks were deducted, and what impact this missed behavior could have on the customer's trust or experience. Leave as empty array [] if no points were deducted."],
      "feedback": "This is the most important part — 'How It Could Have Been Done Better'. For each missed point: explain WHY that behavior matters (what trust or confidence it builds, what business objective it serves). Then give a simple, natural example of how the RM could have covered it in their own words. Write in plain English that any RM can read once and immediately know what to do differently next time. Do not write generic advice — every suggestion must include a concrete example."
    },
    "technical": {
      "score": <number 0-5>,
      "max_score": 5,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": ["Describe what the RM did well technically, why it was correct or effective, and how it helped the customer understand the product or feel reassured."],
      "missed_opportunities": ["ONLY include if marks were deducted. State what was missed, why marks were deducted, and what impact it had. Leave as empty array [] if no points were deducted."],
      "feedback": "For any missed points: explain why the knowledge matters, and give a simple example of how the RM could have explained it correctly. For non-critical omissions (things the customer did not ask about), mention briefly as an improvement tip with an example — do not treat as a scored miss."
    },
    "budget_discovery": {
      "score": <number 0-20>,
      "max_score": 20,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": ["Describe what the RM did well in budget discovery, why the approach was effective, and how it helped move the conversation forward."],
      "missed_opportunities": ["ONLY include if marks were deducted. State what was missed and why. Leave as empty array [] if no points were deducted. Remember: RM prioritising budget before designs is correct behaviour — do not list it as a miss."],
      "feedback": "For any missed points: explain why budget discovery matters, and give a simple example of how the RM could have handled it better. Be specific and concrete."
    },
    "discovery_confidence": {
      "score": <number 0-10>,
      "max_score": 10,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": ["Describe what the RM did well in discovery and confidence, and how it benefited the consultation."],
      "missed_opportunities": ["ONLY include if marks were deducted. Leave as empty array [] if no points were deducted."],
      "feedback": "For any missed points: explain why the behavior matters and give a concrete example of how to do it better."
    }
  },
  "critical_mistakes": ["Only include genuine core-objective failures — max 3. These are behaviors that significantly hurt the customer experience or directly undermined the consultation's primary objective. Do not include minor omissions or non-critical missed steps here."],
  "coaching_feedback": "<3-5 sentence overall coaching paragraph in simple English. Start with genuine appreciation for what went well. Then clearly state the one or two most important areas to work on. End with an encouraging, specific action the RM can take in their very next consultation.>",
  "performance_tier": "<Excellent|Good|Average|Needs Improvement>"
}

IMPORTANT: overall_score must equal the sum of all four section scores. Be specific — reference actual things said or not said in the transcript.

IMPORTANT REMINDERS FOR WRITING THE REPORT:
- Write everything in simple, easy-to-understand English. The RM reading this report should immediately understand what they did well, what they missed, and exactly how to improve — without needing to ask anyone for clarification.
- The "feedback" field in each section is the most valuable part of the report. Do not write vague statements. Every coaching suggestion must include a concrete, natural example of what the RM could have said or done differently.
- The overall goal of this report is learning and improvement, not just scoring. An RM should read this report and feel motivated and clear about their next steps — not confused or discouraged.`;
}
