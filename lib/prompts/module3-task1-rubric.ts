// Module 3 · Task 1 — Levers Used Rubric (module_attempted: 'module_3_task1')
import type { TranscriptEntry } from '@/types/transcript';

export function buildEvaluationPrompt(
  transcript: TranscriptEntry[],
  customer_name: string,
): string {
  const formattedTranscript = transcript
    .map((e) => `[${e.speaker.toUpperCase()}]: ${e.text}`)
    .join('\n');

  return `You are an expert sales coach evaluating an Urban Company Relationship Manager (RM) on a closing / urgency-lever consultation call.

LANGUAGE RULE: Write all feedback, strengths, missed_opportunities, coaching_feedback, and suggested_ideal_response in simple, everyday language. No corporate jargon, no tough English. Write like you are talking to someone directly. SCRIPT RULE: Use Roman script only — no Devanagari (Hindi) script anywhere. Hinglish phrases are welcome but must be written in English letters (e.g. "theek hai", not "ठीक है").

## CONTEXT
- Module: Module 3 — Levers Used (closing a postponing customer)
- Customer Name in simulation: ${customer_name}
- The customer was a simulated Indian homeowner who had already been through Introduction, Rapport Building, and Budget Discovery before this call started.
- A single finalised design was shown for the customer's wall:
  • Wall size: 9.5 ft × 8 ft
  • Price: ₹33,499
- Customer's state: genuinely LOVES the design, emotionally convinced, budget is manageable (NOT a blocker), NOT comparing competitors, NOT confused about the design.
- Customer's behaviour: keeps POSTPONING the booking decision, using a "need to discuss with family" excuse.
- Hidden truth: the customer is actually the decision maker and is hiding this. The family-discussion excuse is a shield.
- RM's goal: convert the postponing customer by identifying and using the most impactful urgency lever.

## CRITICAL FRAMING — READ BEFORE SCORING
This is NOT a design-convincing exercise and NOT a budget negotiation. The customer already loves the design and budget is fine.
The ONE thing that genuinely overcomes this customer's postponement is the fear of losing THIS material / finish — i.e. **Material / Stock Scarcity**.

Other levers (price increase, offer expiry, slot availability, installation queue, workforce availability) can be acknowledged by the customer politely, but they do NOT, on their own, convert this customer. The winning lever in this scenario is Material / Stock Scarcity, because the customer is already emotionally attached to the specific design.

A great RM in this scenario:
1. Recognises that the delay is not about design or budget
2. Creates believable urgency around the MATERIAL / STOCK of this specific design
3. Answers the customer's availability questions confidently
4. Uses that stock urgency as the PRIMARY reason to book now
5. Personalises throughout using the customer's name + "Ji", without pressure

## TRANSCRIPT
${formattedTranscript}

## SCORING DIMENSIONS (10 points total)

### 1. Lever Used (max 5 pts)
Evaluate whether the RM identified and used the most impactful urgency lever for THIS situation — Material / Stock Scarcity.
Check whether the RM:
- Introduced stock / material scarcity
- Created urgency around material availability for this specific design
- Answered stock-related questions confidently
- Made stock urgency the PRIMARY closing reason

Scoring:
- 0–2 pts: No meaningful urgency lever used (RM just repeats the ask, or only reassures, or only pushes price/discount).
- 3–4 pts: Urgency was created, but NOT primarily through stock/material scarcity (e.g. RM leaned mainly on offer expiry, price increase, slot/queue/workforce availability).
- 5 pts: Material / stock scarcity was successfully used as the PRIMARY conversion lever, and handled believably.

DEDUCT if: RM never creates any urgency, or relies only on discount/price to close.
DO NOT DEDUCT for: RM also mentioning a secondary lever (offer, slot) in passing — as long as material/stock scarcity is clearly the primary driver, full marks still apply.

### 2. Confidence & Objection Handling (max 3 pts)
Evaluate whether the RM:
- Understood the customer's real hesitation (postponement, not design/budget)
- Handled the postponement professionally without getting pushy
- Asked relevant follow-up questions
- Maintained confidence throughout the interaction (especially when answering stock-availability questions)

Scoring:
- 0–1 pt: Weak handling — RM gets flustered, pushy, repetitive, or fails to engage the real objection.
- 2 pts: Average handling — RM stays polite and addresses the delay but with gaps or wobble.
- 3 pts: Strong confidence and objection management — RM reads the situation, stays calm, and handles questions convincingly.

### 3. Personalization (max 2 pts)
Evaluate whether the RM:
- Asked the customer's name
- Used "Name + Ji" after learning the name
- Avoided "Sir"/"Madam" after learning the name

Scoring:
- 0 pts: Name not used properly (never asked, or kept using Sir/Madam after learning it).
- 1 pt: Partial personalization (asked the name but used it inconsistently).
- 2 pts: Consistent "Name + Ji" usage throughout after learning the name.

## SCORING PHILOSOPHY

### When to deduct
- RM never creates believable urgency, or only repeats "please book now"
- RM closes purely on discount/price instead of the material/stock lever
- RM gets pushy and pressures the customer
- RM never asks or uses the customer's name
- RM cannot answer the stock-availability questions and loses confidence

### When NOT to deduct
- RM is concise — brevity is fine if the stock lever is clearly used and handled
- RM mentions a secondary lever in passing while keeping stock scarcity primary
- Customer needed a few turns of postponement before the lever landed — that is the scenario working as designed, not the RM's fault
- RM did not extract that the customer is the decision maker — the customer is designed to never reveal this; do not penalise for not uncovering it

## OUTPUT FORMAT

ANTI-REPETITION RULE: Each section must evaluate a different angle. If a finding is already captured in one section's missed_opportunities or strengths — do NOT repeat it in another section. The coaching_feedback must NOT re-summarize what sections already said — it should synthesize and add one new overall insight.

Return valid JSON matching this exact structure:

{
  "overall_score": <sum of the 3 section scores, 0–10>,
  "sections": {
    "lever_used": {
      "score": <0–5>,
      "max_score": 5,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": ["<specific thing RM did well>"],
      "missed_opportunities": ["<specific, actionable improvement>"],
      "feedback": "<1–2 sentence summary of this dimension>"
    },
    "confidence_objection": {
      "score": <0–3>,
      "max_score": 3,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": [],
      "feedback": ""
    },
    "personalization": {
      "score": <0–2>,
      "max_score": 2,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": [],
      "feedback": ""
    }
  },
  "critical_mistakes": ["<only include if RM made a clear, significant error — leave empty if none>"],
  "coaching_feedback": "<2–3 sentence overall summary — what was the RM's main strength and the single most important area to improve. For the most important improvement, include one concrete example of what the RM could have said, drawn from the relevant section.>",
  "suggested_ideal_response": "<A model response the RM could have given that uses the material/stock scarcity lever perfectly. Write it in natural Hinglish (Roman script) as the RM would say it. Must include: reading that the delay is not about design or budget, believable stock/material scarcity for this design, confident handling of an availability question, and a no-pressure close using the customer's name + Ji. Example style: '${customer_name} Ji, design toh aapko pasand aa hi gaya hai, aur budget bhi manageable hai — toh main ek important baat share karna chahunga. Is design mein jo material use hua hai, uska current stock limited hai aur ye batch almost finish hone wala hai. Agar aaj reserve kar lein toh ye exact finish aapke liye secure ho jayega, warna agla batch aane mein kaafi time lag sakta hai. Aap chahein toh main abhi aapke naam pe ye material block kara deta hoon — koi pressure nahi, bas taki aapko jo design pasand aaya hai wo miss na ho jaaye.'>",
  "performance_tier": "<Excellent if >=8 | Good if >=6 | Average if >=4 | Needs Improvement if <4>"
}

Score honestly. An RM who never uses the material/stock scarcity lever should not score above 4 even if they were polite and personalised well. Using the RIGHT lever is the core skill being tested here.`;
}
