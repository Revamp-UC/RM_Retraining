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

CRITICAL RULE: Only deduct marks for questions the customer actually asked. Do not deduct for topics the customer never raised. The feedback section may still educate the RM on correct answers for learning purposes even when no marks are deducted.

#### What are Panels and what material are they made of? — 1 point
Did the RM explain what wall panels are and mention the material correctly?
The explanation should be natural, simple, and confident.
IMPORTANT: If the RM mentions "PVC panels" — do NOT deduct marks. PVC is technically acceptable knowledge. However, always add a coaching note in feedback: "NIO Panels is the correct product name to use in customer conversations — PVC panels have been discontinued."
Correct answer for reference: Wall panels (NIO Panels) are made from a high-quality engineered material. They are installed directly on the wall surface to improve aesthetics and cover damage.

#### How do Panels help in Seepage Cases? — 1 point
Did the RM explain how panels address seepage situations?
Correct explanation: Panels help conceal the damaged wall surface and improve the appearance of the wall. They hide the visual impact of seepage. They do NOT permanently fix the root cause of seepage — the underlying seepage issue remains.
Deduct if: RM made a false claim such as "seepage will be completely fixed" or "panels solve seepage permanently." This is factually incorrect and creates wrong customer expectations.

#### Warranty Knowledge — 1 point (0.5 + 0.5)
This section is FULLY conditional on what the customer actually asked.

First warranty question — 0.5 points (only if customer asked about warranty):
Did the RM correctly state that panels come with a 1-year warranty?
Correct answer: Panels have a 1-year warranty.

Follow-up warranty question — 0.5 points (only if customer specifically asked about warranties across all products):
Did the RM correctly explain the warranty for all product types?
Correct answer: Panels — 1 year | Woodwork — 2 years | Lighting — 2 years.

If the customer never asked about warranty → award full 1 point for this sub-section (no deduction).
If the customer asked only the first warranty question and not the follow-up → award 0.5 points if answered correctly, do not deduct the remaining 0.5.
Always mention the complete warranty structure in the feedback's "Correct Answers" section for RM learning — even if no marks were deducted.

#### Product Longevity — 2 points
Did the RM proactively mention how long panels generally last?
This is expected to be volunteered by the RM without the customer asking — it is an important product knowledge point that builds customer confidence.
Any reasonable range is acceptable: 8–10 years, 10–12 years, 15+ years, etc.
Deduct if: RM never mentioned longevity at any point in the consultation.

ALWAYS INCLUDE IN FEEDBACK — Correct Answers for Learning:
Regardless of what the customer asked or what marks were deducted, always include a "Correct Answers" section in the technical feedback field covering:
1. What are NIO Panels and what material are they made of?
2. How do panels help in seepage situations? (conceal, not cure)
3. Warranty: Panels — 1 year | Woodwork — 2 years | Lighting — 2 years
4. How long do panels generally last? (8–12+ years)
This is purely for RM learning and coaching. Providing these correct answers in feedback does NOT automatically mean marks were deducted.

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
      "strengths": ["Describe what the RM explained correctly, why it was accurate or effective, and how it helped the customer understand the product or feel reassured. If the RM proactively mentioned longevity, appreciate it specifically."],
      "missed_opportunities": ["ONLY include if marks were actually deducted. State clearly what was missed, why marks were deducted, and what impact the gap could have on customer trust or expectations. Leave as empty array [] if no points were deducted. Do NOT include topics the customer never asked about."],
      "feedback": "Structure this field in two clear parts:\n\nPart 1 — Coaching on missed points (if any): For each deducted point, explain why that knowledge matters, what customer concern it addresses, and how the RM could have explained it naturally. If RM said 'PVC panels' instead of 'NIO Panels', note: 'The panel material explanation was correct. However, please use NIO Panels in customer conversations going forward — PVC panels have been discontinued.'\n\nPart 2 — Correct Answers for Learning (always include, regardless of score): Provide the ideal answer for each technical topic so the RM can study and improve:\n• What are NIO Panels and what are they made of? [ideal explanation]\n• How do panels help in seepage situations? [conceal, not cure — what this means for the customer]\n• Warranty: Panels — 1 Year | Woodwork — 2 Years | Lighting — 2 Years\n• How long do panels last? [8–10 years, 10–12 years, or 15+ years are all acceptable]\nNote clearly that this section is for learning — marks are only deducted for questions the customer actually asked."
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
