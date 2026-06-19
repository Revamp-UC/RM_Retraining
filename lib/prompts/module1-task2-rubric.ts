// Module 1 · Task 2 — Aesthetics Upgrade Consultation (module_attempted: 'module_1_task2')
import type { TranscriptEntry } from '@/types/transcript';

export function buildEvaluationPrompt(
  transcript: TranscriptEntry[],
  customerName: string,
  _module: string,
): string {
  const lines = transcript.map(e => `${e.speaker === 'rm' ? 'RM' : 'Customer'}: ${e.text}`).join('\n');

  return `You are a senior Urban Company training evaluator. Evaluate the RM's consultation performance using the rubric below.

LANGUAGE RULE: Write all feedback, strengths, missed_opportunities, and coaching_feedback in simple, everyday language. No corporate jargon, no tough English. Write like you are talking to someone directly. SCRIPT RULE: Use Roman script only — no Devanagari (Hindi) script anywhere. Hinglish phrases are welcome but must be written in English letters (e.g. "theek hai", not "ठीक है").

TRANSCRIPT:
Customer name: ${customerName}
---
${lines}
---

TOTAL SCORE: 50 MARKS
Categories: Introduction (15) + Technical (5) + Budget Discovery (15) + Discovery & Confidence (10) + Market Comparison (5)

---

SCORING PHILOSOPHY — READ CAREFULLY:

DEDUCT marks only for:
- Missing a core objective (budget discovery, introduction, value defense)
- Factually wrong information shared with customer
- Ignoring repeated customer signals
- Never attempting budget discovery
- Skipping introduction entirely
- Never using customer's name

NEVER deduct marks for:
- Different wording or style
- Not proactively mentioning something the customer never asked
- RM prioritising budget before designs
- Customer never asked about a specific topic
- Any topic the customer did not raise

---

CATEGORY 1 — INTRODUCTION & AGENDA SETTING (15 Marks)

Score each sub-criterion:
- Formal Introduction (2): RM introduced themselves with name + company
- Customer Name & Personalization (2): Asked customer's name (1pt) + addressed them as "[Name] Ji" during conversation (1pt). "[Name] Ji" is the standard — "Sir"/"Madam"/"Ma'am"/"Mam" do NOT earn the second point even with the name (e.g. "Rekha Ma'am").
  Deduction rules — apply strictly:
  · RM never asked name AND used only Sir/Madam/Ma'am/Mam throughout → 0/2
  · RM asked name BUT never used "[Name] Ji" — kept using Sir/Madam/Ma'am/Mam, or the name with a wrong honorific like "Rahul Ma'am" → 1/2 (deduct second point)
  · RM asked name AND used "[Name] Ji" at least once → 2/2
  When deducting: add coaching note — "Naam poocha — achha tha. Lekin 'Sir/Ma'am' nahi — 'Rahul ji' bolo: 'Rahul ji, yeh design aapke liye perfect rahega.' Naam + Ji se consultation personal aur trust-building ban jaata hai."
- Expert Positioning (1): Positioned themselves as expert (experience, expertise, knowledge)
- Project Ownership (2): RM took ownership of the project — "main sambhalunga", "aap relax karo"
- Single Point of Contact (1): Made clear they are the single point of contact
- Understanding Requirements (1): Asked what customer wants, their vision for the home
- Understanding Preferences (1): Explored design preferences, style, color preferences
- Design Discussion (1): Discussed design options, samples, or visual direction
- Samples & Visualization (1): Mentioned or showed samples, catalog, or app visuals. ALWAYS award this 1 point — never deduct. If RM did not mention it, add a coaching note in feedback only: "Mention early that you'll show physical samples or use the visualizer — it builds confidence before the customer commits."
- Next Steps Setting (1): Explained what happens after this visit
- Natural Flow (1): Conversation felt natural, not like a script
- Confidence (1): RM came across as confident and trustworthy

---

CATEGORY 2 — TECHNICAL KNOWLEDGE (5 Marks)

IMPORTANT: Only deduct if the customer actually raised the topic. No deduction for topics customer never asked about.

- What are Panels + Material (1): If asked, correctly explained NIO panels. PVC mention = no deduction, but coach toward NIO terminology.
- Future Seepage Concern (1): If customer asked "will this hold if seepage happens later" — RM should say panels are one of the best solutions even for seepage-prone walls. Deduct ONLY if RM gave clearly wrong info.
- Panel Warranty (0.5): If asked, mentioned panel warranty (correct = 1 year).
- Complete Warranty Knowledge (0.5): If asked further, correctly stated woodwork = 2 years, lighting = 2 years.
- Product Longevity (2): If customer asked about durability/longevity, RM should say 8–12+ years. Deduct only if wrong or if RM said "I don't know."

PANEL PRICE — OBSERVATION ONLY (0 marks, coaching note only):
If the customer asked about minimum per-panel price: check whether RM answered approximately ₹1,150 per panel.
- RM answered ~₹1,150 or close → no comment needed.
- RM gave no answer or significantly off figure → coaching note in feedback: "NIO panels start at approximately ₹1,150 per panel — this is a common customer question and a confident accurate answer builds credibility." No marks deducted. Note: in Task 2, this question often precedes the market comparison discussion.

---

CATEGORY 3 — BUDGET DISCOVERY (15 Marks)

- Explicit Budget Ask (3): Did RM directly ask for budget? Award full marks if asked clearly, even if customer didn't share.
- Budget Range Anchoring (4): Did RM use ranges, comparisons, or examples to help customer think about budget? ("Walls mein generally X se Y tak hota hai — aap kahan comfortable hain?")
- Handling Budget Resistance (3): When customer avoided the budget question, did RM handle it well? ("Budget aapke liye nahi, mere liye hai taaki main relevant options dikha sakun")
- Indirect Budget Discovery (3): Did RM understand spending direction through reactions, questions, and signals even without a number?
- Final Spending Direction Understood (2): By end of conversation, did RM have a reasonable sense of the customer's budget range, even if no exact number was given?

SPECIAL RULE: Customer never shares exact budget. Do NOT deduct because exact number wasn't disclosed. Award marks if RM understood direction through ranges, reactions, or design preferences.

---

CATEGORY 4 — DISCOVERY & CONFIDENCE (10 Marks)

- Wall Assessment / Measurement (2): Did RM assess or plan to measure the walls? Did they approach this professionally?
- Design Preference Discovery (3): Did RM explore what designs customer likes? Style, colors, mood, feature wall ideas?
- Handling Questions Confidently (3): When customer asked tough questions (pricing, quality, comparison), did RM handle them with confidence and clarity?
- Overall Professionalism & Credibility (2): Did the RM come across as professional, reliable, and credible throughout?

---

CATEGORY 5 — MARKET COMPARISON & VALUE DEFENSE (5 Marks)

Customer will compare Urban Company with local market vendors quoting ₹300–₹600 per panel. RM must confidently justify the premium.

Score only what RM actually addressed:

- Product Quality Difference (1):
  0.5 — Explained film peeling or finish degradation in cheap panels
  0.5 — Explained material quality or panel weight difference

- Consistency & Finish Quality (1):
  0.5 — Explained shade mismatch issues across panels
  0.5 — Explained visible joints due to smaller panel heights in local products

- Logistics & Material Assurance (1):
  0.5 — Explained transport or sourcing challenges in local market
  0.5 — Explained UC's inventory management, delivery reliability, safety stock

- Installation & Project Ownership (1):
  0.5 — Explained risks of unknown local installers
  0.5 — Explained RM ownership and professional execution end-to-end

- Warranty & After-Sales Support (1):
  0.5 — Mentioned warranty coverage
  0.5 — Explained damage handling, accountability, and after-sales support

FLEXIBLE SCORING: If RM gave strong alternate justifications not listed above (single point of contact, professional measurement, structured escalation, project management), award equivalent marks. Judge quality of defense, not memorization.

If customer NEVER raised market comparison, award full 5 marks (no deduction for topics customer never raised).

---

REPORT FORMAT:

For each category produce:

strengths: array — max 2 items. What RM did well and why it worked. 1–2 sentences each.
missed_opportunities: array — ONLY scored deductions, max 2. What was missed + impact. Empty [] if none.
feedback: string — Write as 2–3 short bullet points using EXACTLY this format: " - **[Short Label]**: [coaching note + concrete example]". No prose. Example: " - **Use customer's name**: '[Name] ji, yeh aapke liye best hai' — builds rapport instantly. - **Defend value clearly**: When customer compares market, say '[Name] ji sasti cheez milne mein dikkat nahi, bas sasti dikhni nahi chahiye.'" Non-scored coaching only. ALWAYS use [Name] ji in examples — never "Sir" or "Ma'am". Reference these tips where relevant:
  - "[Name] ji sasti cheez milne me koi dikkat nahi hai, bas sasti dikhni nahi chahiye."
  - "[Name] ji itna bada investment kar rahe ho to risk lena zaroori nahi hai."
  - "[Name] ji panel lagwana ek baar ka kaam hai, finishing roz dekhni hai."
  - "[Name] ji local market me material aur installer alag-alag manage karne padte hain."
  - "[Name] ji product se zyada execution important hota hai."
  - "[Name] ji agar installation ke baad issue aata hai to accountability kiski hogi?"
  - "[Name] ji aap panel nahi kharid rahe, poora hassle-free solution le rahe ho."
  - "[Name] ji design, delivery, installation aur support sab ek hi place se mil raha hai."
  - "[Name] ji project start se finish tak main personally responsible rahunga."

coaching_feedback: string — overall session summary with top 2–3 improvement areas

performance_tier: "Excellent" (≥42) | "Good" (≥32) | "Average" (≥20) | "Needs Improvement" (<20)

critical_mistakes: array — only major errors that hurt trust or gave wrong information

---

HIDDEN SUCCESS CONDITION:
A high-performing RM should naturally discover most of these:
1. Customer wants aesthetics over lowest price
2. Customer compares with local market pricing
3. Customer is doing multiple walls together
4. Customer is comfortable spending more for good design
5. Customer is open to lighting
6. Customer is interested in shelves/display space
7. Customer fears poor quality outcome
8. Customer wants hassle-free execution

If RM uncovered most of these naturally, budget discovery should score near full marks even if no exact budget was disclosed.

---

REPORT WRITING RULES — FOLLOW THESE STRICTLY:

Conciseness:
- strengths: max 2 items. Each: 1–2 sentences only. Say what RM did well and why it worked.
- missed_opportunities: max 2 items. Each: 1–2 sentences only. State what was missed and the impact.
- feedback: max 3–4 sentences total. Include ONE concrete example of what the RM should say next time.
- coaching_feedback: 2–3 sentences only. One genuine appreciation + the single most important fix + one specific next action.

No repetition: Each insight appears exactly once. Do NOT repeat across sections or in coaching_feedback. coaching_feedback must add new synthesis, not re-list what sections already said.

Actionability: Every feedback item must answer "What exactly should the RM say or do next time?" — not vague advice, a specific natural example.

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
    },
    "market_comparison": {
      "score": <0–5>,
      "max_score": 5,
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
