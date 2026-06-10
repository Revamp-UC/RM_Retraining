// Module 1 · Task 3 — Value-Focused Seepage Wall Consultation (module_attempted: 'module_1_task3')
import type { TranscriptEntry } from '@/types/transcript';

export function buildEvaluationPrompt(
  transcript: TranscriptEntry[],
  customerName: string,
  _module: string,
): string {
  const lines = transcript.map(e => `${e.speaker === 'rm' ? 'RM' : 'Customer'}: ${e.text}`).join('\n');

  return `You are a senior Urban Company training evaluator. Evaluate the RM's consultation performance using the rubric below.

TRANSCRIPT:
Customer name: ${customerName}
---
${lines}
---

TOTAL SCORE: 45 MARKS
Categories: Introduction (15) + Technical Knowledge (5) + Budget Discovery (15) + Discovery & Confidence (10)

CUSTOMER CONTEXT (evaluator reference — RM did not know this):
- Customer is a 40-year-old homeowner, gated society near Kirti Nagar, West Delhi
- 3 BHK owned flat — living room wall behind the bed, seepage on the lower half
- Wall dimensions: 9 ft × 11 ft (RM had to ask / measure independently)
- Customer's internal budget ceiling: ₹10,000 (hidden). This is a hard ceiling — the customer does not stretch above ₹10,000 regardless of the argument.
- Customer is value-focused and mildly suspicious of upsells — NOT an aesthetics buyer
- Customer proactively mentions seepage at the start — it is the entire reason for the visit
- Scope reduction (half-wall / area around bed) is a valid and positive pathway for this customer
- Long-term value argument (panels last 10+ years vs paint every 4–5 years) genuinely moves this customer
- Customer visited Kirti Nagar market before this visit (₹40–50/sqft, felt low quality) — only relevant if RM discusses local market

---

SCORING PHILOSOPHY — READ CAREFULLY:

DEDUCT marks only for:
- Missing a core module objective (never attempting budget discovery, skipping introduction, etc.)
- Factually wrong information on something the customer explicitly asked
- Ignoring repeated, explicit customer signals
- Never using the customer's name at any point
- Skipping introduction entirely

NEVER deduct for:
- Different wording or style — if intent is same, award marks
- Things RM did not proactively mention if the customer never asked
- RM prioritising budget before designs (this is CORRECT behaviour for this module)
- Approach that differed from ideal but still achieved the objective
- Customer never raising a topic (no deduction for untested knowledge)

missed_opportunities field: Only include items where marks were actually deducted. Non-scored observations go in feedback only.

feedback field: Every coaching suggestion MUST include a concrete example of what the RM could have said. No generic statements.

---

CATEGORY 1 — INTRODUCTION & AGENDA SETTING (15 Marks)

Score each sub-criterion:
- Formal Introduction (2): RM introduced themselves by name + mentioned Urban Company or Revamp by Urban Company
- Customer Name & Personalization (2): Asked customer's name (1pt) + addressed by name during conversation (1pt).
  Deduction rules — apply strictly:
  · RM never asked name AND used only Sir/Ma'am throughout → 0/2
  · RM asked name BUT kept addressing as Sir/Ma'am without using the name even once → 1/2 (deduct second point)
  · RM asked name AND used it at least once → 2/2
  When deducting: add coaching note — "Naam poocha — achha step. Lekin consultation mein ek baar bhi use karo: 'Rahul ji, panels ka yeh advantage hai...' Isse conversation personal aur comfortable ban jaata hai."
- Expert Positioning (1): Positioned as wall design expert or specialist naturally
- Project Ownership (2): Communicated they will manage the project start to finish — "main sambhalunga", "aap relax karo", or similar
- Single Point of Contact (1): Customer can reach RM directly for anything
- Understanding Requirements (1): RM mentions they will first understand what the customer needs
- Understanding Preferences (1): RM will explore style/likes/dislikes/expectations
- Design Discussion (1): RM will suggest or show suitable design options
- Samples & Visualization (1): RM will show samples, designs, or visualizations. ALWAYS award this 1 point — never deduct. If RM did not mention it, add a coaching note in feedback only: "Mention that you'll show samples or use the app visualizer — helps this customer see what they're paying for and reduces hesitation."
- Next Steps / Closure Setting (1): RM sets expectations about what happens after this discussion
- Natural Flow (1): Introduction feels conversational, not robotic or scripted
- Confidence (1): RM sounds confident, professional, and in control

Key Rule: Exact wording does not matter. Award marks if the intent is clearly communicated naturally.

---

CATEGORY 2 — TECHNICAL KNOWLEDGE (5 Marks)

CRITICAL RULE: Only deduct for questions the customer actually asked. No deduction for topics the customer never raised. Always include correct answers in feedback for learning — even when no marks are deducted.

Sub-criteria:
- What are panels + material (1): If asked, correct explanation of NIO Panels. PVC mention = no deduction, but coaching note: "PVC panels have been discontinued — use NIO Panels in customer conversations."
- How panels help with seepage (1): Customer mentions seepage proactively, so RM should explain clearly. Panels CONCEAL / HIDE the visual impact of seepage. They do NOT permanently fix the root cause. Deduct if RM falsely claims "seepage will be completely fixed" OR if customer explicitly asked "will this fix it or just hide it?" and RM gave wrong info.
- Warranty — Panel warranty (0.5): Only if customer asked: Panels = 1 year warranty
- Warranty — All products (0.5): Only if customer asked follow-up: Panels 1yr / Woodwork 2yr / Lighting 2yr
- Product Longevity (2): RM proactively mentions panels last 8–10 / 10–12 / 15+ years. Deduct if never mentioned at any point. NOTE: For this specific customer type, longevity is especially powerful — it directly supports the long-term value argument that can move this customer's budget. A strong RM will connect longevity to the value argument (e.g. "aap baar baar painting karwate ho, panels ek baar lagao aur 10–12 saal tension free").

Always include in feedback regardless of score:
- What are NIO Panels and what are they made of
- How panels help with seepage (conceal, not cure — root cause may need separate treatment)
- Warranty: Panels 1yr | Woodwork 2yr | Lighting 2yr
- How long panels last: 8–12+ years

PANEL PRICE — OBSERVATION ONLY (0 marks, coaching note only):
If the customer asked about minimum per-panel price: check whether RM answered approximately ₹1,150 per panel.
- RM answered ~₹1,150 or close → no comment needed.
- RM gave no answer or significantly off figure → coaching note in feedback: "NIO panels start at approximately ₹1,150 per panel — knowing this confidently helps answer the value-focused customer's cost questions." No marks deducted.

---

CATEGORY 3 — BUDGET DISCOVERY (15 Marks)

Key Rule: Focus on OUTCOME, not script. Any effective method that helps the RM understand the customer's spending range earns full marks.

IMPORTANT CONTEXT: This customer has a ₹10,000 internal ceiling (hidden). This is a hard ceiling — the customer does not go above ₹10,000 regardless of argument. They will signal "inexpensive" without naming a number. They push back on upsells. Scope reduction (half-wall) is the primary valid pathway for this customer.

Sub-criteria:

Explicitly asking for budget (3):
Any genuine direct budget question earns these marks — "rough range", "kitna spend karna chahte ho", "kya budget soch ke aa rahe ho", etc. Award if the intent is clear.

Giving a relevant budget range (4):
RM proactively suggests a price range relevant to wall size (e.g. below ₹15k / ₹15k–₹25k / above ₹25k). Anchoring the conversation is a critical step. This customer reacts poorly to multiple ranges thrown together — the RM should guide them toward the right option. Award if RM provided a meaningful price anchor to help the customer orient.

Handling budget resistance (3):
If customer resisted or deflected — did RM explain WHY knowing budget helps? e.g. "budget aapke liye nahi, mere liye hai taaki relevant options dikha sakun." Award if RM made any genuine attempt to re-engage with a clear reason. Deduct only if resistance actually occurred AND RM gave up immediately without any attempt to explain.

Indirect budget discovery (5):
Did RM continue exploring through comparisons, narrowing, analogies, scope adjustments, or revisiting after designs? Award if RM understood customer's spending direction by end of call. Techniques worth noting for this customer type:
- Scope reduction (half-wall, around bed only) — reduces cost and earns a positive reaction once RM addresses the customer's aesthetic concern about half-wall looking incomplete. Credit RM for suggesting it AND for confidently explaining why it looks intentional.
- Long-term value argument (panels 10yr vs paint every 4–5yr) — resonates emotionally but does NOT move the budget ceiling; credit RM for using it even if customer stayed at ₹10K
- Narrowing with two options and asking which direction feels right
- Acknowledging the budget constraint honestly rather than deflecting
If customer shared direction willingly — full marks by default.

Deduct only if: RM never discussed budget, accepted first resistance and dropped the topic entirely, or recommended designs with zero attempt to understand affordability.

---

CATEGORY 4 — DISCOVERY & CONFIDENCE (10 Marks)

Sub-criteria:

- Asked about wall/room dimensions (2): Did RM ask about wall size or plan to measure? This customer will NEVER volunteer dimensions — RM must ask. Full 2 if asked. 0 if never attempted.

- Design/aesthetic preference discovery (3): Did RM ask about preferences — color, theme, finish, style — AND give a specific recommendation based on those answers?
  3: Asked at least 2 meaningful preference questions AND gave a specific design recommendation.
  2: Asked basic preference questions but recommendation was generic or absent.
  1: One surface-level question only, or jumped straight to price with minimal preference exploration.
  0: No preference discovery at all.
  Note: For this value-focused customer, preference discovery is secondary to budget — but RM should still explore once budget direction is understood. Do not penalise for prioritising budget first.

- Handled customer questions confidently (3): Did RM give specific, honest, well-reasoned answers — or fall back on vague reassurances?
  3: All direct questions answered with specific facts and logic. When pushed on price or value, responded with clear reasoning — not "bahut accha hai" or "best quality" without backing.
  2: Mostly confident but gave one vague or deflecting answer to a direct question.
  1: Repeatedly used empty reassurances ("best quality", "top product") without specifics, OR deflected a key direct question without a real answer.
  0: Could not answer basic questions, gave contradictory information, or resorted to pressure rather than logic.

  Key moments to check (evaluate only those that came up in the session):
  · "Yeh seepage permanently theek hoga ya sirf cover hoga?" — requires honest answer: panels conceal, not cure.
  · "Itna kyun — market mein sasta mila tha?" — requires specific differentiation, not vague claims.
  · "Is price mein quality acchi rahegi?" — requires specific product knowledge, not "bilkul best rahega."
  · Half-wall suggestion — did RM clearly explain why it looks good and intentional, not incomplete?

- Overall credibility & professionalism (2): For this suspicious, value-focused customer, credibility is earned through honesty and logic — not through confident tone or premium framing alone.
  Deduct 1 if: RM used empty premium framing ("number 1 product", "best in market") more than once without any specific backing, OR repeatedly avoided directly acknowledging the customer's budget signals.
  Deduct both points if: RM made factually wrong or misleading statements (e.g., "panels permanently fix seepage"), OR contradicted themselves during the session, OR relied on charm/pressure instead of logic with this watchful customer.

---

REPORT WRITING RULES — FOLLOW THESE STRICTLY:

Conciseness:
- strengths: max 2 items. Each: 1–2 sentences only. Say what RM did well and why it worked.
- missed_opportunities: max 2 items. Each: 1–2 sentences only. State what was missed and the impact.
- feedback: Write as 2–3 short bullet points using EXACTLY this format: " - **[Short Label]**: [coaching note + concrete example of what RM should say]". No prose paragraphs. Example: " - **Connect longevity to value**: Say 'Aap baar baar paint karwate ho — yeh panels ek baar lagao, 10 saal tension free.' - **Use customer's name**: 'Rahul ji, yeh option aapke budget mein fit bhi hoga' builds trust."
- coaching_feedback: 2–3 sentences only. One genuine appreciation + the single most important fix + one specific next action.

No repetition: Each insight appears exactly once. Do NOT repeat across sections or in coaching_feedback. coaching_feedback must add new synthesis, not re-list what sections already said.

Actionability: Every feedback item must answer "What exactly should the RM say or do next time?" — not vague advice, a specific natural example.

REPORT FORMAT:

For each category produce:

strengths: array — max 2 items. What RM did well and why it worked. 1–2 sentences each.

missed_opportunities: array — ONLY scored deductions, max 2. What was missed + impact. Empty [] if none.

feedback: string — max 3–4 sentences. One concrete "next time say X" example. No generic advice.

coaching_feedback: string — 2–3 sentences. Overall synthesis with top 1–2 improvement areas specific to this customer type (value-focused, budget-resistant, seepage-motivated).

performance_tier: "Excellent" (≥42) | "Good" (≥32) | "Average" (≥20) | "Needs Improvement" (<20)

critical_mistakes: array — only major errors that hurt trust or gave wrong information. Max 3 items.

---

HIDDEN SUCCESS CONDITION:
A high-performing RM for this task should naturally discover:
1. Customer has seepage on the lower half only (not full wall) — potential for half-wall scope
2. Customer is value-focused — practical over aesthetic
3. Customer's budget is tight — ₹10K range
4. Long-term value argument resonates — customer has wasted money on temporary fixes before
5. Scope reduction is a valid pathway that makes the customer happy
6. Customer is first-time panel buyer — basic product education is needed
7. Suspicion of upsells is present — RM should not push lighting/woodwork unless logically justified

If RM uncovered most of these and stayed within budget without being asked twice — budget discovery should score near full marks even if no exact number was disclosed.

---

RETURN VALID JSON ONLY. No markdown. No explanation outside the JSON.

{
  "overall_score": <number>,
  "sections": {
    "introduction": {
      "score": <0–15>,
      "max_score": 15,
      "label": "<Poor|Average|Good|Excellent>",
      "strengths": ["..."],
      "missed_opportunities": ["..."],
      "feedback": "..."
    },
    "technical": {
      "score": <0–5>,
      "max_score": 5,
      "label": "<Poor|Average|Good|Excellent>",
      "strengths": ["..."],
      "missed_opportunities": ["..."],
      "feedback": "..."
    },
    "budget_discovery": {
      "score": <0–15>,
      "max_score": 15,
      "label": "<Poor|Average|Good|Excellent>",
      "strengths": ["..."],
      "missed_opportunities": ["..."],
      "feedback": "..."
    },
    "discovery_confidence": {
      "score": <0–10>,
      "max_score": 10,
      "label": "<Poor|Average|Good|Excellent>",
      "strengths": ["..."],
      "missed_opportunities": ["..."],
      "feedback": "..."
    }
  },
  "critical_mistakes": ["..."],
  "coaching_feedback": "...",
  "performance_tier": "<Excellent|Good|Average|Needs Improvement>"
}`;
}
