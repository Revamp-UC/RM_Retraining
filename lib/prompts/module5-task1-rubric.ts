// Module 5 · Task 1 — NIO Premium Panels: Product Differentiation & Premium Selling (module_attempted: 'module_5_task1')
import type { TranscriptEntry } from '@/types/transcript';

export function buildEvaluationPrompt(
  transcript: TranscriptEntry[],
  customer_name: string,
): string {
  const formattedTranscript = transcript
    .map((e) => `[${e.speaker.toUpperCase()}]: ${e.text}`)
    .join('\n');

  return `You are an expert sales coach evaluating an Urban Company Relationship Manager (RM) on a PREMIUM PRODUCT INTRODUCTION call — specifically selling NIO wall panels to a price-conscious homeowner.

LANGUAGE RULE: Write all feedback, strengths, missed_opportunities, coaching_feedback, and suggested_ideal_response in simple, everyday language. No corporate jargon, no tough English. Write like you are talking to someone directly. SCRIPT RULE: Use Roman script only — no Devanagari (Hindi) script anywhere. Hinglish phrases are welcome but must be written in English letters (e.g. "theek hai", not "ठीक है").

INTENT-MATCHING RULE (VERY IMPORTANT): Do NOT require the RM to use exact words. Score on MEANING / INTENT — if the RM conveyed the idea of a value point in their own words, give credit. But in the report (missed_opportunities and suggested_ideal_response), DO tell the RM clearly what they should have said and how, so they learn the ideal way to express it.

## CONTEXT
- Module: Module 5 — NIO Premium Panels (product differentiation, premium selling, objection handling)
- Customer Name in simulation: ${customer_name}
- Product: NIO wall panels — a premium structured wall panel from Urban Company
- NIO price: approximately ₹1,150 per panel
- Market PVC price the customer knows: ₹250–300 per panel
- The price gap is genuine — approximately 5X. RM must JUSTIFY it through value, never through discounts.
- Customer's state: curious and price-conscious homeowner considering a feature wall in their living room. Guests visit regularly. Not hostile — genuinely open but needs solid reasons.
- Customer's real question: "Is NIO good enough to justify 5X the cost to myself, my spouse, and my neighbour?"
- RM's goal: discover the customer's needs first, anchor value before price, differentiate NIO's specific advantages, handle objections confidently, close with conviction — ZERO discounts.

## KEY NIO DIFFERENTIATORS (RM can earn credit for any of these)
1. One-piece seamless panel — no visible joints, no breakage at corners or edges (PVC panels show joints)
2. Hexagonal internal structure — structurally stronger than hollow PVC; does not dent or crack easily
3. Superior finish — anti-scratch, waterproof, UV-resistant; PVC yellows and fades over time
4. Long-term longevity — NIO panels last 10+ years vs PVC which typically shows yellowing and wear in 2-3 years
5. Professional UC installation — trained team, proper alignment, no DIY joint mismatches
6. Curated design library — 35 carefully selected designs instead of overwhelming 350+ choices
7. Daily cost reframe — a 9-ft feature wall is roughly ₹14,000–15,000 total; spread over 10 years = approx ₹4 per day
8. Project reframe — total wall cost is a small share of any home renovation budget; per-panel price is not the useful unit

## CRITICAL FRAMING — READ BEFORE SCORING
The RM must win this through VALUE DIFFERENTIATION, NOT through discounts or price negotiation.
"Humari quality acchi hai" alone is weak — the RM must explain SPECIFICALLY what makes NIO structurally and visually different, and WHY those differences matter to THIS customer's actual situation.
If the RM tries to close mainly by offering a discount, that is a clear failure of the skill being tested.

## TRANSCRIPT
${formattedTranscript}

## SCORING DIMENSIONS (20 points total)

### 1. Discovery & Diagnosis (max 4 pts)
Did the RM understand the customer's actual situation BEFORE pitching NIO?
Key questions that count: What room? Who uses it? Do guests visit? Why now? Who decides (spouse/family)?

Scoring:
- 4: Asked about room purpose, who uses it, why now, and at least one other discovery angle — created a real picture before any pitch
- 3: Asked 2-3 solid discovery questions but missed one key angle (e.g. never asked about guests, or skipped the decision-maker angle)
- 2: Only 1 surface question ("kaun sa room hai?") without any follow-through or depth
- 1: Half-asked one question then pivoted to product pitch without listening to the answer
- 0: Zero discovery — launched straight into NIO features

In missed_opportunities, explain what discovery the RM should have done and why it matters for the pitch.

### 2. Price Anchoring (max 4 pts)
Did the RM set up value context BEFORE revealing ₹1150 — so the number landed in a value frame rather than naked against ₹250?
Methods that count: total project cost (₹14,000–15,000 for a 9ft wall), daily cost (₹4/day over 10 years), share-of-renovation framing.

Scoring:
- 4: Gave value context BEFORE the number — customer heard the framing first, then ₹1150 as a consequence
- 3: Gave ₹1150 first but immediately followed with a project-cost or per-day reframe — partially recovered
- 2: Gave the price with only a verbal buffer ("yeh thoda premium range mein hai") but no real unit reframe
- 1: Just said ₹1150 with no context, no anchoring
- 0: Refused to give price at all despite the customer repeatedly asking

In missed_opportunities, explain the specific framing the RM should have used.

### 3. Tailored Differentiation (max 4 pts)
Did the RM connect NIO's advantages specifically to what THIS customer mentioned — rather than giving a generic product pitch?

Scoring:
- 4: Made at least 2 explicit connections back to what the customer said in discovery (e.g. "aapne bataya guests aate hain — NIO ki seamless surface mein koi joint nahi dikhti, ekdum premium lagta hai") AND covered the key differentiators (seamless, structural strength, finish/longevity)
- 3: Covered the main differentiators but mostly generic — not tied back to the customer's specific context
- 2: Named 1-2 features but either gave specs without translating the consequence ("3mm thick hai" without "toh dent nahi hogi") OR missed major differentiators entirely
- 1: Only one vague differentiator, or "NIO bahut acha hai" without any specific proof
- 0: Never explained what makes NIO different from market PVC

In missed_opportunities, name the specific differentiators the RM did not cover and explain how they should have been linked to this customer's situation.

### 4. Objection Handling (max 4 pts)
The customer raised 3 key objections — evaluate how well the RM handled each.

The 3 objections:
a) **Price shock** — customer comparing ₹1150 to ₹250-300 PVC
b) **"5X kyun?"** — asking for specific proof of why NIO justifies 5X the price
c) **"Temporary requirement"** — "mujhe 4-5 saal baad waise bhi badlana hai, premium kyun chahiye?"

Scoring:
- 4: Handled all 3 objections well — price shock (reframed to project/daily unit), "5X kyun" (gave specific structural/finish/longevity proof), "temporary" (decade reality + daily regret vs satisfaction contrast)
- 3: Handled 2 of 3 well; the third was either missed or handled with only a generic line
- 2: Handled price shock only, or addressed "5X kyun" but got defensive; "temporary" objection not meaningfully handled
- 1: Gave only one generic response to one objection without specifics
- 0: Avoided, dismissed, or ignored the objections

In missed_opportunities, for each objection that was not handled well, explain exactly what the RM should have said.

### 5. Curated Design Value (max 2 pts)
The customer challenged the RM on limited design choices — "Sirf itne designs? Mujhe 1,000-2,000 mein se choose karna tha."
Score ONLY on how well the RM handled this pushback — not on whether they quoted a specific number of designs.

The ideal response turns the objection around: Urban Company deliberately curated the best designs so the customer gets quality without being overwhelmed by thousands of mediocre options. The limitation is the point — it saves time and ensures a better outcome.

Scoring:
- 2: Flipped the customer's concern — made limited choice feel like a curated, premium experience rather than a restriction. Customer felt valued, not shortchanged.
- 1: Addressed the design question but without reframing — just listed available options or assured "enough hai" without the curation angle.
- 0: Ignored the design concern, or left the customer feeling the options were too few without any recovery.

In missed_opportunities, explain the curation reframe the RM should have used and how it connects to the customer's interest.

### 6. Conviction & No Discount (max 2 pts)
Did the RM maintain calm price confidence throughout with zero discount, zero apology?

Scoring:
- 2: Full conviction — never apologized for price, never hinted at discount, never got defensive; communicated "yeh value hai" energy throughout
- 1: Mostly confident but slipped into mild defensiveness at least once ("haan thoda zyada hai lekin...") without genuinely recovering
- 0: Offered discount, apologized for price, said "dekhte hain kuch karte hain," or caved under price pressure

In missed_opportunities, describe the moment the RM's conviction slipped and what they should have said instead.

## SCORING PHILOSOPHY

### When to deduct
- RM pitches before discovering the customer's room/need/context.
- RM gives ₹1150 raw without any anchoring frame.
- RM uses generic "quality" claims without specific NIO differentiators.
- RM offers a discount, apologizes for price, or negotiates on price.
- RM dismisses an objection instead of reframing it.

### When NOT to deduct
- RM is concise — brevity is fine if the value point's meaning clearly landed.
- RM used their own words instead of exact phrasing — credit the intent.
- Customer pushed back multiple times before softening — that is the scenario working as designed.

## OUTPUT FORMAT

ANTI-REPETITION RULE: Each section must evaluate a different angle. If a finding is already captured in one section's missed_opportunities or strengths — do NOT repeat it in another section. The coaching_feedback must NOT re-summarize what sections already said — it should synthesize and add one new overall insight.

Return valid JSON matching this exact structure:

{
  "overall_score": <sum of all 6 section scores, 0–20>,
  "sections": {
    "discovery_diagnosis": {
      "score": <0–4>,
      "max_score": 4,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": ["<specific discovery moves the RM made well>"],
      "missed_opportunities": ["<what discovery the RM skipped and why it mattered>"],
      "feedback": "<1–2 sentence summary of this dimension>"
    },
    "value_anchoring": {
      "score": <0–4>,
      "max_score": 4,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": ["<the specific frame the RM should have used — e.g. total project cost, daily cost>"],
      "feedback": ""
    },
    "tailored_differentiation": {
      "score": <0–4>,
      "max_score": 4,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": ["<specific NIO differentiators not covered AND how RM should have tied them to customer's situation>"],
      "feedback": ""
    },
    "objection_handling": {
      "score": <0–4>,
      "max_score": 4,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": ["<for each poorly-handled objection: which one and what RM should have said>"],
      "feedback": ""
    },
    "curated_design_value": {
      "score": <0–2>,
      "max_score": 2,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": [],
      "feedback": ""
    },
    "conviction_no_discount": {
      "score": <0–2>,
      "max_score": 2,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": [],
      "feedback": ""
    }
  },
  "critical_mistakes": ["<only include if RM made a clear, significant error — e.g. offered a discount, pitched before any discovery, or gave ₹1150 raw with no framing — leave empty if none>"],
  "coaching_feedback": "<2–3 sentence overall summary — the RM's main strength and the single most important area to improve. For the most important improvement, include one concrete example of what the RM could have said.>",
  "suggested_ideal_response": "<A model response showing how the RM should sell NIO — in natural Hinglish (Roman script) as the RM would actually say it. Must: start with 1 discovery question, then anchor price before revealing it (total project or daily cost), then name 2-3 specific NIO differentiators connected to what the customer mentioned (seamless, structural strength, long-term finish), then handle the 'temporary' objection with a longevity reframe, then close with conviction and no discount using the customer's name + Ji. Example style: '${customer_name} Ji, pehle batao — living room mein guests aate hain na regularly? (discovery) ... dekho ${customer_name} Ji, ek 9-foot wall ke liye total ₹14,000-15,000 ki baat hai — poore 10 saal ke liye chaar rupaye roz ka hisaab hai. NIO ka panel ek hi piece mein hota hai, koi joint nahi dikhti, surface pe koi dent nahi padti jaise hollow PVC mein padti hai, aur 10 saal baad bhi wahi colour rehta hai — PVC panels 2-3 saal mein yellow ho jaate hain. Temporary samajh rahe ho, lekin 4-5 saal bhi toh aap roz uss wall ko dekhoge — satisfaction chahiye ya regret? Discount? Nahi ${customer_name} Ji, main discount offer karne ke liye nahi aaya — main chaahta hoon ki aap sahi decision lo jiske liye regret na ho.'",
  "performance_tier": "<Excellent if >=17 | Good if >=13 | Average if >=9 | Needs Improvement if <9>"
}

Score honestly. An RM who pitches before discovery, dumps ₹1150 without anchoring, gives generic "quality" claims, or tries to close on discount should NOT score well — no matter how polite they are. Discovery → value anchor → tailored differentiation → confident objection handling is the core skill being tested.`;
}
