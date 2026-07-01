// Module 6 · Task 1 — Training Module: Product Fundamentals — Voice Quiz Evaluator
// Evaluates Q1–Q16 from the transcript, outputs a 4-section ReportCard (total 16 marks).
import type { TranscriptEntry } from '@/types/transcript';

export function buildEvaluationPrompt(
  transcript: TranscriptEntry[],
  _customer_name: string,
): string {
  const formattedTranscript = transcript
    .map((e) => `[${e.speaker.toUpperCase()}]: ${e.text}`)
    .join('\n');

  return `You are an expert evaluator scoring an Urban Company Relationship Manager (RM) on a PRODUCT KNOWLEDGE VOICE QUIZ. The RM was asked 16 questions (Q1–Q16) by an AI trainer. Evaluate the RM's answers from the transcript below.

LANGUAGE RULE: Write all feedback in simple, everyday language. Roman script only — no Devanagari. Hinglish in English letters is welcome.

INTENT-MATCHING RULE: Score on MEANING / INTENT, not exact words. Accept synonyms, Hinglish, and paraphrases as correct if the concept is right. Do NOT penalize accent, filler words, or sentence structure.

NORMALIZATION: Before matching, mentally normalize: lowercase all text, ignore fillers (matlab, jaise, basically), map number words to digits (do=2, paanch=5, dus=10, dhai=2.5), treat "pvc/PVC", "nio/NIO", "wpc/WPC" as equivalent.

---

## ANSWER KEY (Q1–Q16)

### SECTION A: Product Catalog (Q1–Q2, total 2 marks)

**Q1** (1 mark) — TWO_PART_LIST: Panels (0.5) + Sheets (0.5)
- Panels expected (0.5, proportional): PVC Panel, NIO Panel, WPC Panel, Ceramic Panel, Charcoal Panel → score = (correct count / 5) × 0.5, round to 0.1, cap 0.5
- Sheets expected (0.5, proportional): WPC Sheet, WPC Textured Sheet, SPC Sheet → score = (correct count / 3) × 0.5, round to 0.1, cap 0.5

**Q2** (1 mark) — LIST: Other offerings beyond panels & sheets
- Expected: Woodwork, Lighting, Mouldings
- 2 or 3 correct = 1.0; exactly 1 correct = 0.5; 0 = 0

### SECTION B: Warranty & Durability (Q3–Q6, total 4 marks)

**Q3** (1 mark) — RANGE: Lifespan of panels/sheets
- Any answer in the range 7–15 years = 1.0; outside range or not answered = 0
- Ideal answer: 10–12 years

**Q4** (1 mark) — FACT + JUSTIFICATION: Warranty
- Warranty period (0.5): Must say "1 year" (or "1 saal") = 0.5; else 0
- Justification (0.5): Must explain WHY — 1 year covers all 3 seasons / genuine issues surface within 1 year / product life ≠ warranty = 0.5; vague answer = 0

**Q5** (1 mark) — TWO FACTS: Light warranties
- Feature Light (0.5): 1 year = 0.5; else 0
- Decorative Light (0.5): 2 years = 0.5; else 0

**Q6** (1 mark) — DEFINITION + EXAMPLE: Feature Light vs Decorative Light
- Must give correct distinction: Decorative = aesthetic/decoration; Feature = wall highlighting/accent lighting
- AND give at least one correct example of either type
- Examples of Decorative: Marble Hollow Light, Obsidian Light, Picture Light
- Examples of Feature: Wall Washer Light, Profile Light, Cove Light
- Full distinction + at least one correct example = 1.0; distinction only, no example = 0.5; wrong or no answer = 0

### SECTION C: Materials & Accessories (Q7–Q12, total 6 marks)

**Q7** (1 mark) — FACT: PVC Board uses
- Wire Management AND/OR Elevation = 1.0; neither mentioned correctly = 0

**Q8** (1 mark) — TWO FACTS: PVC Board sizes
- 5 mm (0.5) + 10 mm (0.5) — both correct = 1.0; one = 0.5; neither = 0

**Q9** (1 mark) — TWO_PART_LIST: When to use 5mm vs 10mm
- 5mm use (0.5): Wire Management OR Feature Light Installation OR Mild Seepage Wall = 0.5
- 10mm use (0.5): Elevation OR Plain Surface over Aluminium Channel OR Cove Installation = 0.5

**Q10** (1 mark) — TWO FACTS: Moulding lengths
- 2.5 ft (0.5) + 5 ft (0.5) — both = 1.0; one = 0.5; neither = 0
- (Note: Flat Moulding = 2 ft is bonus context, not required)

**Q11** (1 mark) — SINGLE FACT: Moulding material
- Charcoal = 1.0; anything else = 0

**Q12** (1 mark) — FACT + FULL FORM: SPC Sheet
- Explanation (0.5): premium sheet, stone/marble finish, modern premium look = 0.5; vague or wrong = 0
- Full form (0.5): "Stone Polymer Composite" (word order tolerant) = 0.5; else 0

### SECTION D: Designs & Woodwork Knowledge (Q13–Q16, total 4 marks)

**Q13** (1 mark) — LIST: WPC Panel designs/molds
- Expected: Classic, Convex, Concave, Small Square, Ceramic
- Score = 0.2 per correct design, cap 1.0
- (e.g. 3 correct = 0.6, 5 correct = 1.0)

**Q14** (1 mark) — LIST with THRESHOLD: Charcoal Panel molds
- Expected: Classic, Concave, Fluted, Mini Rectangle, Mini Concave, Embossed, Slat, Flat Rib, Ceramic
- 4 or more correct = 1.0; 2–3 correct = 0.5; 0–1 = 0

**Q15** (1 mark) — TWO FACTS: Wood material price ranking
- Most expensive (0.5): HDMR = 0.5; else 0
- Most economical (0.5): Particle Board = 0.5; else 0

**Q16** (1 mark) — SINGLE FACT: HDMR full form
- "High Density Moisture Resistant" (word order tolerant) = 1.0; else 0

---

## TRANSCRIPT
${formattedTranscript}

---

## INSTRUCTIONS

1. Read the transcript carefully.
2. Find the RM's answer to each question Q1–Q16.
3. Apply the answer key above to determine marks for each question.
4. Sum up marks per section:
   - product_catalog = Q1 + Q2 (max 2)
   - warranty_durability = Q3 + Q4 + Q5 + Q6 (max 4)
   - materials_usage = Q7 + Q8 + Q9 + Q10 + Q11 + Q12 (max 6)
   - designs_woodwork = Q13 + Q14 + Q15 + Q16 (max 4)
5. Total overall_score = sum of all 4 sections (max 16).

For strengths: name the specific questions the RM got fully correct.
For missed_opportunities: for each missed/partial question, state: what was asked → what RM said → what was missing → ideal answer.
Keep feedback concise and coaching-focused.

---

## OUTPUT FORMAT

Return valid JSON matching this exact structure:

{
  "overall_score": <sum of all 4 sections, 0–16>,
  "sections": {
    "product_catalog": {
      "score": <0–2>,
      "max_score": 2,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": ["<Q numbers and topics the RM got fully correct in this group>"],
      "missed_opportunities": ["<For each partial/missed Q: what was asked → what RM said → what was missing → ideal answer>"],
      "feedback": "<1–2 sentence summary of how well RM knows the product catalog>"
    },
    "warranty_durability": {
      "score": <0–4>,
      "max_score": 4,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": [],
      "feedback": ""
    },
    "materials_usage": {
      "score": <0–6>,
      "max_score": 6,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": [],
      "feedback": ""
    },
    "designs_woodwork": {
      "score": <0–4>,
      "max_score": 4,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": [],
      "feedback": ""
    }
  },
  "critical_mistakes": ["<only if RM gave clearly wrong factual information, e.g. stated wrong warranty period, wrong material for mouldings — leave empty if no clear factual errors>"],
  "coaching_feedback": "<2–3 sentence overall summary: RM's strongest area by section + single most important gap to fill. Name specific questions by number.>",
  "suggested_ideal_response": "<A compact model answer covering the most-missed facts: e.g. 'Q1: Panels — PVC, NIO, WPC, Ceramic, Charcoal. Sheets — WPC, WPC Textured, SPC. Q4: 1 saal warranty — kyunki 1 saal mein teeno seasons cover ho jaate hain aur genuine issues is window mein aa jaate hain. Product life aur warranty alag cheezein hain. Q6: Decorative lights = wall decoration (e.g. Marble Hollow, Picture Light). Feature lights = wall highlight karna (e.g. Wall Washer, Profile Light). Q11: Mouldings Charcoal material ki hoti hain. Q16: HDMR = High Density Moisture Resistant.'">
  "performance_tier": "<Excellent if >=13 | Good if >=9 | Average if >=5 | Needs Improvement if <5>"
}`;
}
