// Module 6 · Task 2 — Training Module: Technical & Application Knowledge — Voice Quiz Evaluator
// Evaluates Q17–Q22 (17 questions, flow order) from the transcript.
// Outputs a 5-section ReportCard (total 19.5 marks).
import type { TranscriptEntry } from '@/types/transcript';

export function buildEvaluationPrompt(
  transcript: TranscriptEntry[],
  _customer_name: string,
): string {
  const formattedTranscript = transcript
    .map((e) => `[${e.speaker.toUpperCase()}]: ${e.text}`)
    .join('\n');

  return `You are an expert evaluator scoring an Urban Company Relationship Manager (RM) on a TECHNICAL & APPLICATION KNOWLEDGE VOICE QUIZ (Section 2). The RM answered 17 questions (Q17 to Q22, in a specific order) asked by an AI trainer. Evaluate each answer from the transcript below.

LANGUAGE RULE: Write all feedback in simple everyday language. Roman script only — no Devanagari. Hinglish in English letters is welcome.

INTENT-MATCHING RULE: Score on MEANING / INTENT, not exact words. Accept synonyms and paraphrases if the concept is correct.

## NORMALIZATION (apply before matching)
- Lowercase all text, ignore fillers (matlab, jaise, basically, uh)
- "beading" = "bidding" (common spoken variant — treat identical throughout)
- "l beading" = "L Bidding" | "u beading" = "U Bidding" | "h profile" = "H Trim"
- "router" = "Router Machine" = "grooving machine" = "groove machine"
- "wall washer" = "Wall Washer Light" | "profile light" = "profile" (light context)
- "edge tape" = "edge band" = "edge banding tape"
- "l channel" = "L Aluminium Channel" | "aluminium" = "aluminum"
- "external corner trim" = "external corner" | "internal corner trim" = "internal corner"
- "protrusion" = "projection" (accept as intent)
- Number words: das=10, saade teen≈3.5, dhai=2.5

---

## ANSWER KEY (Q17–Q22, in flow order)

### SECTION A — Finishing Basics (Q17 + Q18, max 3.5)

**Q17** (max 2.0) — LIST_PER_ITEM: Finishing check points before Final Finish
Expected points: Open End Edge, Closed End Edge, External Corner, Internal Corner, Horizontal Joint, Vertical Joint, Protrusion
Scoring: 0.25 per correct point. If RM names all 7 correctly → award 2.0 (full marks). Otherwise: min(0.25 × correct_count, 1.75). Cap at 2.0.

**Q18** (max 1.5) — LIST_PER_ITEM: Finishing accessories/components
Expected: U Bidding, L Bidding, H Trim, Recess Trim, Edge Tape, J Trim
Scoring: 0.30 per correct component, cap 1.5. (5 or more correct = full 1.5)

### SECTION B — Component Knowledge (Q19 + Q20 + Q21 + Q26 + Q27, max 5.5)

**Q19** (max 1.0) — SINGLE_FACT_WITH_INTENT: L Aluminium Channel use
Required intent: used to create a REMOVABLE COVE on the perimeter of the cove
Full (1.0): "removable cove" / "cove perimeter" intent clearly present
Zero (0): intent absent — e.g. RM only says "for cove" without "removable" concept

**Q20** (max 1.0) — SINGLE_FACT_WITH_INTENT: H Trim use
Required intent: to JOIN two panels or two sheets together for a clean finish
Full (1.0): "joining two panels/sheets" intent present
Zero (0): intent absent

**Q21** (max 1.0) — LIST_PER_ITEM: Trims available in 3mm and 5mm variants
Expected: H Trim, J Trim, External Corner Trim, Internal Corner Trim
Scoring: 0.25 per correct trim, cap 1.0. (All 4 correct = 1.0)

**Q26** (max 1.0) — SINGLE_FACT_WITH_INTENT: Ceramic Profile use
Required: either WIRE TRANSMISSION or PROFILE LIGHT installation in Ceramic Panel is mentioned
Full (1.0): either core use correctly stated
Zero (0): neither use mentioned

**Q27** (max 1.5) — SINGLE_FACT: Edge Tape standard length
Expected: 10 Meter (or "10 metre", "das meter")
Full (1.5) or Zero (0)

### SECTION C — Installation Methods (Q23 + Q24 + Q30, max 3.0)

**Q23** (max 1.0) — SINGLE_FACT: Ceramic Panel installation method
Expected: Glue (accept "adhesive", "fevicol-type", "construction adhesive")
Full (1.0) if glue installation clearly stated. Zero (0) otherwise.

**Q24** (max 1.0) — SINGLE_FACT_WITH_INTENT: Ceramic Panel on mild seepage wall
Required intent: FIRST install PVC Board (as underlayment/base), THEN install Ceramic Panel over it
Full (1.0): PVC Board underlayment mentioned before ceramic
Zero (0): only glue/ceramic mentioned without PVC Board — missing the key step

**Q30** (max 1.0) — SINGLE_FACT: Machine for grooves on sheets
Expected: Router Machine (accept "router", "grooving machine", "groove machine")
Full (1.0) or Zero (0)

### SECTION D — Component Selection Logic (Q31 + Q32 + Q33 + Q34, max 5.0)

**Q31** (max 1.0) — SINGLE_FACT_WITH_REASONING: Bidding vs Trim preference
Expected choice: Bidding
Full (1.0) if RM chooses Bidding (with or without reasoning)
Zero (0) if RM chooses Trim or gives no choice
Note: Capture reasoning ("better finish" or similar) in feedback, but reasoning is NOT separately scored.

**Q32** (max 1.0) — SINGLE_FACT: Different-thickness gap finishing
Expected: Bidding
Full (1.0) or Zero (0)

**Q33** (max 1.0) — TWO_FACT: Open End Edge finishing
Panel finish (0.5): L Bidding → 0.5; else 0
Sheet finish (0.5): L Trim → 0.5; else 0
Award each part independently. If RM only answers for one correctly, award 0.5.

**Q34** (max 2.0) — TWO_FACT (with follow-up): Closed End Edge Bidding selection
PVC Plain / PVC Grooved (1.0): U Bidding → 1.0; else 0
Other panels (follow-up) (1.0): L Bidding → 1.0; else 0
Award each part independently.

### SECTION E — Applied Judgment & Calc Bridge (Q25 + Q35 + Q22, max 3.0)

**Q25** (max 1.0) — SINGLE_FACT_WITH_REASONING: Light suggestion (12ft wall, low budget, switch on other wall)
Expected choice: Wall Washer Light
Full (1.0) if RM says Wall Washer Light (with or without reasoning)
Zero (0) if different light suggested
Reasoning intent (not scored separately): existing electrical point can be utilized; economical solution. Capture presence/absence for coaching.

**Q35** (max 1.0) — SINGLE_FACT_WITH_REASONING: Full-wall installation — which costs more?
Expected: Wall Washer Light (costs more for full-wall)
Full (1.0) if Wall Washer Light identified as more expensive
Zero (0) otherwise
Capture reasoning presence for coaching.

**Q22** (max 1.0) — APPROACH: 1 meter = how many feet (method, not just number)
Expected method: 1 meter = 100 cm → divide by 2.54 → get inches → divide by 12 → get feet ≈ 3.28
Score the METHOD:
Full (1.0): conversion logic correct (cm→inch→feet sequence), even if final number is slightly off
Zero (0): method absent or completely wrong
If RM only gives "3.28 ft" (or similar number) with no method: flag needs_review=true
Ideal answer: approx 3.28 feet

---

## TRANSCRIPT
${formattedTranscript}

---

## INSTRUCTIONS

1. Read the transcript. Find each answer in order: Q17, Q18, Q19, Q20, Q21, Q26, Q27, Q23, Q24, Q30, Q31, Q32, Q33, Q34 (both parts), Q25, Q35, Q22.
2. Apply the answer key to compute marks for each question.
3. Sum into 5 sections:
   - finishing_basics = Q17 + Q18 (max 3.5)
   - component_knowledge = Q19 + Q20 + Q21 + Q26 + Q27 (max 5.5)
   - installation_methods = Q23 + Q24 + Q30 (max 3.0)
   - selection_logic = Q31 + Q32 + Q33 + Q34 (max 5.0)
   - judgment_calc = Q25 + Q35 + Q22 (max 3.0)
4. overall_score = sum of all 5 sections (max 20.0)

For strengths: name the specific Q numbers and topics the RM got fully correct.
For missed_opportunities: for each missed/partial question — what was asked → what RM said → what was missing → ideal answer.
For SINGLE_FACT_WITH_REASONING questions where choice is correct but reasoning is absent: note it in missed_opportunities with "reasoning_present: false" but do NOT dock marks.

---

## OUTPUT FORMAT

Return valid JSON matching this exact structure:

{
  "overall_score": <sum of all 5 sections, 0–20.0>,
  "sections": {
    "finishing_basics": {
      "score": <0–3.5>,
      "max_score": 3.5,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": ["<Q17/Q18 items RM correctly named>"],
      "missed_opportunities": ["<For Q17: which checkpoint was missing + ideal list. For Q18: which component was missing + ideal list>"],
      "feedback": "<1–2 sentence summary>"
    },
    "component_knowledge": {
      "score": <0–5.5>,
      "max_score": 5.5,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": ["<For each Q19/Q20/Q21/Q26/Q27 that was wrong or missed: what was asked, what RM said, what was needed>"],
      "feedback": ""
    },
    "installation_methods": {
      "score": <0–3>,
      "max_score": 3,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": ["<Q24 is the key catch — if RM forgot PVC Board underlayment, explain it clearly here>"],
      "feedback": ""
    },
    "selection_logic": {
      "score": <0–5>,
      "max_score": 5,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": ["<For each wrong choice (Q31/Q32/Q33/Q34) explain which choice was made, why it's wrong, and the correct rule>"],
      "feedback": ""
    },
    "judgment_calc": {
      "score": <0–3>,
      "max_score": 3,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": ["<Q25: which light RM suggested and why Wall Washer was correct. Q22: what method RM gave vs the 3-step cm→inch→feet approach>"],
      "feedback": ""
    }
  },
  "critical_mistakes": ["<Only if RM gave a clearly wrong factual answer that could mislead a customer — e.g. wrong installation method for seepage wall, wrong Bidding type for PVC. Leave empty if no critical errors.>"],
  "coaching_feedback": "<2–3 sentence overall summary: RM's strongest section + the most important knowledge gap. Name specific question numbers. Include one concrete example of what the RM should have said.>",
  "suggested_ideal_response": "<Compact model answers for the most-missed topics. Focus on the hardest questions: Q19: 'L Aluminium Channel removable cove banane ke liye hota hai — cove ke perimeter par use hota hai.' Q24: 'Seepage wall par pehle PVC Board lagao, uske baad Ceramic Panel — directly mat lagao.' Q34: 'PVC Plain ya PVC Grooved ke liye U Bidding, baaki sabke liye L Bidding.' Q25: 'Wall Washer suggest karunga — switch doosri wall par hai toh existing point easily use hota hai, aur economical bhi hai.'>"
  "performance_tier": "<Excellent if >=16 | Good if >=12 | Average if >=7 | Needs Improvement if <7>"
}`;
}
