// Module 4 · Task 1 — Market Comparison / Value Justification Rubric (module_attempted: 'module_4_task1')
import type { TranscriptEntry } from '@/types/transcript';

export function buildEvaluationPrompt(
  transcript: TranscriptEntry[],
  customer_name: string,
): string {
  const formattedTranscript = transcript
    .map((e) => `[${e.speaker.toUpperCase()}]: ${e.text}`)
    .join('\n');

  return `You are an expert sales coach evaluating an Urban Company Relationship Manager (RM) on a MARKET-COMPARISON / VALUE-JUSTIFICATION consultation call.

LANGUAGE RULE: Write all feedback, strengths, missed_opportunities, coaching_feedback, and suggested_ideal_response in simple, everyday language. No corporate jargon, no tough English. Write like you are talking to someone directly. SCRIPT RULE: Use Roman script only — no Devanagari (Hindi) script anywhere. Hinglish phrases are welcome but must be written in English letters (e.g. "theek hai", not "ठीक है").

INTENT-MATCHING RULE (VERY IMPORTANT): Do NOT require the RM to use exact words. Score on MEANING / INTENT — if the RM conveyed the idea of a value point in their own words, give credit. But in the report (missed_opportunities and suggested_ideal_response), DO tell the RM clearly what they should have said and how, so they learn the ideal way to express it.

## CONTEXT
- Module: Module 4 — Market Comparison (justifying premium pricing vs the local market)
- Customer Name in simulation: ${customer_name}
- The customer was a simulated Indian homeowner who had already been through Introduction, Rapport Building, and Design Discovery before this call started.
- A single finalised design was selected for the customer's wall:
  • Wall size: 9 ft × 9 ft
  • Design price: ₹29,999
- Customer's state: OKAY with the design (not confused, not comparing designs). The ONLY friction is PRICE vs the local market.
- Customer's belief: similar-looking panels are available in the market at much lower prices; the customer has already explored multiple vendors (e.g. Sikanderpur, Kirti Nagar) and keeps asking "aapka solution market se itna mehnga kyun hai?"
- RM's goal: justify the premium pricing through VALUE — service quality, accountability, logistics, warranty, execution standards, risk reduction, hassle-free experience, single point of contact, professional installation, long-term reliability.

## CRITICAL FRAMING — READ BEFORE SCORING
The RM must WIN THIS THROUGH VALUE JUSTIFICATION, **not through discounts**. If the RM tries to close mainly by cutting price / offering a discount, that is NOT the winning lever — do not reward it as if it justified the premium.
The customer concedes "quality" easily, so "humari quality acchi hai" ALONE is weak. The RM must stack up concrete value and risk-reduction points until the customer feels: "Market cheaper hai, lekin risk bhi zyada hai, aur ye log poori responsibility le rahe hain."

## TRANSCRIPT
${formattedTranscript}

## SCORING DIMENSIONS (30 points total)

### 1. Value Justification (max 21 pts)
This is the core of the scenario. Below are the 20 value/risk points the RM can earn credit for — each worth 1 mark, EXCEPT the yellowing & shade-variation point which is worth 2 — for a section total of 21. Award credit when the RM conveys the MEANING of a point (exact wording not required).

1. Delivery included — 1
2. Premium packaging included — 1
3. Doorstep delivery included — 1
4. Large panel handling & difficult-access delivery (e.g. 9.5 ft panels, staircase movement, lift issues, upper-floor handling) — 1
5. Transit damage responsibility (if panels break/get damaged in delivery, the company takes responsibility) — 1
6. Installation included — 1
7. Trained installation team — 1
8. End-to-end ownership (company takes complete responsibility) — 1
9. Warranty support — explained across Panels, Feature Lights, Decorative Lights, Woodwork — 1 (give partial credit if only some sub-items are covered)
10. Film peeling risk in local-market panels — 1
11. Yellowing & shade variation risk in local-market panels (cheap panels yellow/fade over time, and shades often don't match across panels) — 2 (give 1 mark if the RM covers only one of the two, full 2 if both are conveyed)
12. Panel height advantage & visible-joint problem (market panels are often shorter → visible joints → look gets compromised) — 1
13. Material procurement burden (customer may have to coordinate material separately with local vendors) — 1
14. Safety stock availability — 1
15. Replacement assurance — 1
16. Single point of contact — 1
17. Hassle-free service (no need to coordinate between multiple people) — 1
18. Risk reduction & accountability — 1
19. Brand trust & professional execution — 1
20. Local-vendor failure examples (RM may use gallery examples of poor local installations; customer reacts positively if shown) — 1

Scoring guidance:
- Sum the per-point credit the RM genuinely earned (by intent), then cap at 21.
- Do NOT give credit for a point the RM only gestured at vaguely without conveying the actual value.
- Discount-led closing does NOT earn value-justification credit.
In missed_opportunities, list the specific HIGH-IMPACT points the RM did not cover, and phrase what they should have said.

### 2. Personalisation (max 4 pts)
Two independent parts:
- **Name Discovery (2 pts):** Did the RM ask for and learn the customer's name? Full 2 if yes, 0 if never asked/learned.
- **Name Usage Discipline (2 pts):** After learning the name, did the RM consistently address the customer as "${customer_name} Ji"? Award 2 ONLY if "${customer_name} Ji" is used consistently. **If the RM uses "Sir", "Madam", "Ma'am" or "Mam" even ONCE after learning the name — including the name with a wrong honorific like "${customer_name} Ma'am" — deduct the FULL 2 marks of this part (Name Discovery marks are unaffected). "${customer_name} Ji" is the only form that earns these marks.**
The section score is Name Discovery + Name Usage Discipline (0–4).

### 3. Trust Building & Confidence (max 5 pts)
Evaluate whether the RM: sounded confident; justified the premium pricing effectively; built trust; reduced perceived risk; maintained control of the conversation; created confidence in company execution; handled objections smoothly.
Scoring:
- 0–2 pts: Weak — flustered, defensive, or could not justify the premium.
- 3–4 pts: Average — held the conversation and made some points but with gaps/wobble.
- 5 pts: Strong — confident, controlled, justified the premium convincingly and reduced perceived risk.

## SCORING PHILOSOPHY

### When to deduct
- RM leans on "quality" alone, or tries to close mainly via discount/price-cut.
- RM dismisses the market comparison without explaining concrete value.
- RM gives up after a couple of points, or gets flustered / pushy.
- RM never asks or uses the customer's name, or slips into "Sir/Madam/Ma'am/Mam" (or name + wrong honorific like "Rekha Ma'am") after learning it.

### When NOT to deduct
- RM is concise — brevity is fine if the value point's meaning clearly landed.
- RM used their own words instead of the exact phrasing above — credit the intent.
- Customer needed several turns of resistance before softening — that is the scenario working as designed, not the RM's fault.

## OUTPUT FORMAT

ANTI-REPETITION RULE: Each section must evaluate a different angle. If a finding is already captured in one section's missed_opportunities or strengths — do NOT repeat it in another section. The coaching_feedback must NOT re-summarize what sections already said — it should synthesize and add one new overall insight.

Return valid JSON matching this exact structure:

{
  "overall_score": <sum of the 3 section scores, 0–30>,
  "sections": {
    "value_justification": {
      "score": <0–21>,
      "max_score": 21,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": ["<specific value points the RM justified well>"],
      "missed_opportunities": ["<specific high-impact value points the RM missed, with what they should have said>"],
      "feedback": "<1–2 sentence summary of this dimension>"
    },
    "personalisation": {
      "score": <0–4>,
      "max_score": 4,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": [],
      "feedback": "<note name discovery (2) and name-usage discipline (2) separately>"
    },
    "trust_confidence": {
      "score": <0–5>,
      "max_score": 5,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": [],
      "feedback": ""
    }
  },
  "critical_mistakes": ["<only include if RM made a clear, significant error — e.g. closed purely on discount, or insulted the market the customer researched — leave empty if none>"],
  "coaching_feedback": "<2–3 sentence overall summary — the RM's main strength and the single most important area to improve. For the most important improvement, include one concrete example of what the RM could have said.>",
  "suggested_ideal_response": "<A model response showing how the RM should justify the premium through stacked value (not discount), in natural Hinglish (Roman script) as the RM would actually say it. Must: acknowledge the market is cheaper, then justify the premium with several concrete value/risk points (delivery + premium packaging, transit-damage responsibility, professional installation by a trained team, warranty across panels/lights/woodwork, risks in local panels like peeling/yellowing/shade variation and visible joints, single point of contact, end-to-end accountability), and close with no-pressure confidence using the customer's name + Ji. Example style: '${customer_name} Ji, bilkul sahi keh rahe hain — market mein sasta zaroor milta hai, par ek baar dekhiye aapko mil kya raha hai. In panels ki delivery, premium packaging, aur agar transit mein kuch damage hua toh poori zimmedari humari. Installation hamari trained team karti hai, aur panels, lights, woodwork — sab pe warranty milti hai. Local panels mein aksar film peel ho jaati hai, ya colour yellow pad jaata hai, ya shade match nahi karta, aur chhote panels lagne se joints dikhte hain — look kharab ho jaata hai. Aapko alag-alag bando ke peeche nahi bhaagna, ek hi point of contact, poori responsibility humari. Isliye ${customer_name} Ji, market sasta hai par risk bhi zyada — yahan aap nishchint reh sakte hain.'>",
  "performance_tier": "<Excellent if >=24 | Good if >=18 | Average if >=12 | Needs Improvement if <12>"
}

Score honestly. An RM who only argues "quality" or tries to close on a discount should NOT score well on Value Justification, no matter how polite. Stacking concrete value and risk-reduction points is the core skill being tested here.`;
}
