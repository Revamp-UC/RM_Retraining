// Module 1 · Task 1 — Seepage Wall Consultation (module_attempted: 'module_1_seepage')
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
- 1 pt: Did the RM address the customer by name naturally during the conversation?

Deduction rules — apply strictly:
- RM never asked the name AND addressed customer only as Sir/Ma'am throughout → 0/2
- RM asked the name BUT continued using only Sir/Ma'am without using the name even once → 1/2 (deduct the second point)
- RM asked the name AND used it at least once during the conversation → 2/2

When deducting the second point: add a coaching note in feedback explaining that asking for the name is only half the job — using it during the conversation is what builds trust and makes the consultation feel personal. Example coaching line: "Aapne naam poocha — achha step tha. Lekin ek baar bhi use karo conversation mein: 'Rahul ji, yeh option aapke liye best rahega.' Yeh chhota sa change rapport aur comfort bahut badha deta hai."

#### Expert Positioning — 1 point
Did the RM communicate — in any way — that they have relevant experience, knowledge, or expertise in wall design, panels, or home interiors?

This is a fully INTENT-BASED criterion. Do NOT look for specific words like "expert" or "specialist." Award this point if the RM said anything that conveys: "I know what I'm doing in this area, I have experience with walls or panels, you can trust my guidance."

Examples that MUST earn the mark (not exhaustive):
- "Main wall panels ka expert hoon" / "Main specialist hoon"
- "Main kaafi saare wall projects handle karta hoon"
- "Hum sirf walls aur interiors pe kaam karte hain"
- "Mujhe is field mein kaafi experience hai"
- "Main personally aapko best option suggest karunga — yeh mera area hai"
- Any statement where the RM says they are experienced, knowledgeable, or focused on walls / panels / home design

Award the mark if the RM communicated confidence and relevant expertise in any natural form. The exact wording does not matter — the intent does. If the RM said anything that would make a homeowner think "yeh banda jaanta hai", award this point.

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
Evaluate only if the customer specifically asked whether panels hide seepage or permanently fix it.

Correct explanation: Panels conceal the visual impact of seepage. They do NOT permanently fix the root cause — the underlying seepage issue remains and may need separate treatment.

Deduct ONLY if: The customer directly asked "will this permanently solve the seepage?" or "will this hide it or actually fix it?" AND the RM incorrectly said panels completely/permanently solve seepage.

Do NOT deduct if: The customer asked a general question like "kuch solution hai iska?" and the RM gave a general positive answer without the customer probing further into whether it hides vs. fixes. In that case, add a brief coaching tip in feedback only: "When a customer asks about seepage, it's good practice to clarify that panels effectively conceal the seepage and improve the wall's appearance, but the root cause may need separate treatment. This sets correct customer expectations."

If the customer never raised seepage at all → skip this criterion entirely, do not mention in feedback.

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

CONDITIONAL — Correct Answers for Learning:
Only include correct answers in feedback for topics the customer actually raised or asked about during the consultation. Do NOT include correct answers for topics the customer never mentioned — it creates unnecessary noise in the report.

- Customer asked about panel material → include the correct NIO Panels explanation
- Customer asked about seepage solution → include the conceal-not-cure explanation as a coaching note (not a deduction unless they asked specifically about hide vs. fix)
- Customer asked about warranty → include the warranty breakdown
- Customer asked about longevity → include the expected lifespan range

If a topic was not raised by the customer at all → skip it in feedback entirely.

EXCEPTION — Product Longevity: This is expected to be proactively mentioned by the RM regardless of whether the customer asks. If the RM never mentioned longevity, include a coaching note with a concrete example. This is also the ideal moment to address any quality/finishing concerns the customer raised — e.g. if the customer asked "is price mein finishing kaisi rahegi?", the RM should have responded with specific reassurance tied to longevity: "Is range mein jo panels aate hain, unki quality bahut acchi hoti hai. Yeh 10-12 saal aasani se chalte hain — koi quality compromise nahi hoga, finishing ekdum clean aayegi." Generic responses like "best rahega" miss this opportunity.

### Category 3: Budget Discovery (Max: 15 points)

IMPORTANT: Do NOT hardcode scripts. If the RM communicates the same intent in their own natural style and successfully discovers the customer's budget range, award full marks. Focus on consultation outcome and quality — not exact wording.

#### Explicitly Asking for Budget — 3 points
Did the RM make a genuine attempt to understand the customer's budget by asking directly?
Any natural budget question earns these marks — e.g. asking roughly how much they want to spend, whether they have a range in mind, or what investment they are comfortable with for this wall.
Award if the intent is clear, regardless of exact phrasing.

#### Giving a Relevant Budget Range Based on Wall Size — 4 points
Did the RM proactively suggest a practical budget range to help guide the conversation?
This is a critical step — giving the customer a reference range (e.g. below ₹15k / ₹15k–₹25k / above ₹25k) makes it easier for the customer to respond and move forward.
The exact range may vary by wall size, design preference, or product category. Award marks if the RM makes a genuine effort to anchor the budget conversation with a relevant range rather than leaving it completely open-ended.

#### Handling Budget Resistance — 3 points
If the customer redirected to designs first or said they haven't thought about budget: did the RM make an effort to explain WHY understanding the budget is helpful?
The RM should communicate — in their own words — that the budget range helps them show the most relevant options, not that it limits the customer.
Award if the RM made any genuine attempt to re-engage the customer on budget with a clear reason, even if not fully successful.
Do NOT deduct if the customer never showed resistance (i.e. the situation never arose).

#### Indirect Budget Discovery — 5 points
If the customer still avoided sharing a budget after direct asking: did the RM continue exploring the customer's spending intent through other effective methods?
Award full marks if the RM used any of the following (or any similarly effective approach):
- Offering comparison options and reading reactions
- Narrowing down through preference-based questions
- Using analogies, stories, or real-life examples to make the customer comfortable
- Revisiting budget after showing a few designs
- Any creative technique that successfully helped arrive at a reasonable budget range
Award marks based on outcome — if the RM understood the customer's likely spending range by the end, they earn these marks. The method does not matter; the result does.
NOTE: If the customer shared budget willingly without resistance, the RM earns these marks by default — the discovery was successful.

Deduct only if: The RM never discussed budget at all, accepted the first resistance and completely dropped the topic, or recommended designs with no attempt to understand affordability.

### Category 4: Discovery & Confidence (Max: 10 points)
Award points based on:
- Did RM ask about room/wall dimensions? (2 pts)
- Did RM explore basic design/aesthetic preferences such as color, theme, or style? (3 pts) — basic preference discovery is sufficient; asking about color preferences, design style, or theme qualifies. Do not penalise for not going deep into design if basic exploration was done.
- Did RM handle customer questions confidently and accurately? (3 pts)
- Did RM sound credible and professional throughout? (2 pts)
Deduct if: RM was defensive, unsure, or skipped discovery entirely.

## YOUR TASK
Evaluate the RM's performance STRICTLY based on the transcript. Be honest and critical. Do not inflate scores.

## REPORT WRITING RULES — FOLLOW THESE STRICTLY

### Conciseness
- strengths: max 2 items. Each item: 1–2 sentences only. Explain what they did well and WHY it worked.
- missed_opportunities: max 2 items. Each item: 1–2 sentences only. State what was missed and the impact.
- feedback: Write as 2–3 short bullet points using EXACTLY this format: " - **[Short Label]**: [coaching note + concrete example of what RM should say]". No prose paragraphs. Example: " - **Use the customer's name**: After asking for the name, say 'Rahul ji, yeh aapke liye best option hai' — this builds instant rapport. - **Anchor budget early**: Before showing designs, ask 'Roughly kitna invest soch rahe ho? Main relevant options dikhata hoon.'"
- coaching_feedback: 2–3 sentences only. One genuine appreciation + the single most important fix + one specific next action.

### No repetition across sections
Each insight appears exactly once in the entire report. If mentioned in section A, do NOT repeat in section B or coaching_feedback. The coaching_feedback must NOT re-summarize what sections already said.

### Actionability
Every feedback item must answer: "What exactly should the RM say next time?"
Bad: "RM should position themselves as an expert."
Good: "Next time, a line like 'Main wall panels mein specialist hoon — aapko sab kuch main personally handle karunga' takes 5 seconds and sets the right tone immediately."

Return a JSON object matching this exact schema. Do not include markdown, just the JSON:

{
  "overall_score": <number 0-50>,
  "sections": {
    "introduction": {
      "score": <number 0-15>,
      "max_score": 15,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": ["max 2 items — what RM did well and why it built customer trust"],
      "missed_opportunities": ["ONLY scored deductions, max 2 — what was missed and its impact. Empty array [] if no deductions."],
      "feedback": "Max 3–4 sentences. The single most impactful thing to improve, with one concrete natural example of what to say next time."
    },
    "technical": {
      "score": <number 0-5>,
      "max_score": 5,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": ["max 2 items — what RM explained correctly and how it helped the customer"],
      "missed_opportunities": ["ONLY scored deductions, max 2. Empty array [] if no deductions. Do NOT include topics customer never raised."],
      "feedback": "Max 3–4 sentences. If marks deducted: one concrete coaching example. If longevity was missed: give a specific line. For topics customer raised: one 'For your learning' correction only if wrong info was given."
    },
    "budget_discovery": {
      "score": <number 0-15>,
      "max_score": 15,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": ["max 2 items — what RM did well in budget discovery and why it worked"],
      "missed_opportunities": ["ONLY scored deductions, max 2. Empty array [] if no deductions."],
      "feedback": "Max 3–4 sentences. One missed behavior explained with a concrete example. Plus one pro tip the RM can use next time."
    },
    "discovery_confidence": {
      "score": <number 0-10>,
      "max_score": 10,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": ["max 2 items — what RM did well in discovery and confidence"],
      "missed_opportunities": ["ONLY scored deductions, max 2. Empty array [] if no deductions."],
      "feedback": "Max 2–3 sentences. One concrete improvement with an example."
    }
  },
  "critical_mistakes": ["Only include genuine core-objective failures — max 3. These are behaviors that significantly hurt the customer experience or directly undermined the consultation's primary objective. Do not include minor omissions or non-critical missed steps here."],
  "coaching_feedback": "<3-5 sentence overall coaching paragraph in simple English. Start with genuine appreciation for what went well. Then clearly state the one or two most important areas to work on. End with an encouraging, specific action the RM can take in their very next consultation.>",
  "performance_tier": "<Excellent|Good|Average|Needs Improvement>"
}

IMPORTANT: overall_score must equal the sum of all four section scores (max total = 45: Introduction 15 + Technical 5 + Budget Discovery 15 + Discovery & Confidence 10). Be specific — reference actual things said or not said in the transcript.

IMPORTANT REMINDERS FOR WRITING THE REPORT:
- Write everything in simple, easy-to-understand English. The RM reading this report should immediately understand what they did well, what they missed, and exactly how to improve — without needing to ask anyone for clarification.
- The "feedback" field in each section is the most valuable part of the report. Do not write vague statements. Every coaching suggestion must include a concrete, natural example of what the RM could have said or done differently.
- The overall goal of this report is learning and improvement, not just scoring. An RM should read this report and feel motivated and clear about their next steps — not confused or discouraged.`;
}
