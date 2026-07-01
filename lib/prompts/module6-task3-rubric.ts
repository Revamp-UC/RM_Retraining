// Module 6 · Task 3 — Training Module: Pricing, Quotation & Calculation — Voice Quiz Evaluator
// Evaluates Q36–Q46 (13 questions, flow order) from the transcript.
// Key mechanic: session_city extracted from Q36 pre-step → used for city-dependent pricing.
// Outputs a 3-section ReportCard (total 13 marks).
import type { TranscriptEntry } from '@/types/transcript';

export function buildEvaluationPrompt(
  transcript: TranscriptEntry[],
  _customer_name: string,
): string {
  const formattedTranscript = transcript
    .map((e) => `[${e.speaker.toUpperCase()}]: ${e.text}`)
    .join('\n');

  return `You are an expert evaluator scoring an Urban Company Relationship Manager (RM) on a PRICING, QUOTATION & CALCULATION VOICE QUIZ (Section 3). The RM answered 13 questions (Q36 to Q46) asked by an AI trainer. Evaluate each answer from the transcript below.

LANGUAGE RULE: Write all feedback in simple everyday language. Roman script only — no Devanagari. Hinglish in English letters is welcome.

INTENT-MATCHING RULE: Score on MEANING / INTENT. Accept spoken approximations, ranges, and number-words.

---

## STEP 0 — EXTRACT SESSION_CITY FIRST (do this before scoring anything)

Before the graded questions, the trainer asked the RM: "Aap kis city se ho?"
Find the RM's answer in the transcript. Map it using these rules:
- "Delhi" / "dilli" / "Delhi NCR" → Delhi
- "Mumbai" / "Bombay" / "Bombai" → Mumbai
- "Bangalore" / "Bengaluru" / "Bengaluru" → Bangalore
- "Hyderabad" / "hyd" → Hyderabad
- Any other city / no answer given → Default

State the session_city you identified at the top of your evaluation reasoning. Use this city for Q36, Q37, and Q38.

---

## NORMALIZATION (apply before any numeric comparison)

Number-word parsing (Hindi/Hinglish → integer):
- "sau" = ×100 (e.g. "chhe sau" = 600, "aath sau pachas" = 850)
- "hazaar" = ×1000 (e.g. "das hazaar" = 10000, "pandrah hazaar" = 15000)
- "lakh" = 100000
- Common patterns: "barah hazaar" = 12000, "aath hazaar" = 8000, "tees hazaar" = 30000, "paintis hazaar" = 35000
- "k" suffix: "12k" = 12000, "9k" = 9000
- Range expressions: "das-barah hazaar" → range [10000, 12000]
- Strip "rupaye", "rs", "rupees", "₹" — keep the number

Product synonyms:
- "pvc plain" = PVC Plain Panel
- "pvc fluted" = PVC Fluted Panel
- "mini rectangle" = Charcoal Mini Rectangle Panel
- "silicon glue" = "silicone" = "glue" (in glue-count context)
- "cove" = "cove design"
- "aluminium" = "aluminum"

---

## CITY-PRICE MASTER (reference for city-dependent scoring)

Unit prices per panel/sheet:
| Product          | Delhi | Mumbai | Bangalore | Hyderabad | Default |
|------------------|------:|-------:|----------:|----------:|--------:|
| PVC Plain Panel  |  650  |   650  |    800    |    800    |   650   |
| PVC Fluted Panel | 1450  |  1500  |   1550    |   1500    |  1450   |
| WPC Panel        | 1300  |  1500  |   1600    |   1600    |  1300   |

Flat prices (city-agnostic):
| Product       | Value / Band       |
|---------------|--------------------|
| Charcoal Panel| 3500–4000 per panel|
| SPC Sheet     | ~9000 (±500)       |

Quotation bands (all city-agnostic):
| Scenario                         | Accepted Band      |
|----------------------------------|--------------------|
| NIO Panels, 10×9 ft              | 12000–15000        |
| PVC Plain, 10×9 ft               | 8000–11000         |
| Half PVC Plain + Half WPC, 10×9  | 15000–18000        |
| Charcoal Mini Rectangle, full wall| 30000–35000       |
| Full Cove Design, 10×9 ft        | 15000–18000        |

Glue counts (exact per spec):
| Scenario                              | Accepted count(s) | Logic                              |
|---------------------------------------|-------------------|------------------------------------|
| NIO wall, 10×9 ft                     | {2}               | 1 beginning side + 1 ending side   |
| 2 WPC Sheets + 5 PVC Panels, 9×9 ft  | {5}               | 4→WPC sheets, 1→last PVC panel     |
| Mild-seepage, full PVC Plain, 10×9   | {0, 1}            | Ideal=0; 1 acceptable for support  |

---

## ANSWER KEY (Q36–Q46, in flow order)

### SECTION A — Unit Prices (Q36 + Q37 + Q38 + Q39 + Q40, max 5)

**Q36** (max 1.0) — CITY_PRICE_LOOKUP: PVC Plain Panel unit cost
Look up session_city in the City-Price Master → PVC Plain Panel price.
Full (1.0) if RM's answer is within ±100 of the session_city price.
Zero (0) if outside tolerance or no answer.
Example: Bangalore city → correct answer = 800 (±100 → accept 700–900).

**Q37** (max 1.0) — SINGLE_FACT_WITH_INTENT: Are all PVC Panels the same price?
Required: RM must say NOT all same AND identify PVC Fluted Panel as comparatively more expensive.
Full (1.0) if both present. Zero (0) if RM says "yes all same" or doesn't identify Fluted as pricier.
Bonus (no extra mark): if RM gives a roughly correct Fluted price for the session_city (±100), note it positively in coaching.

**Q38** (max 1.0) — CITY_PRICE_LOOKUP: WPC Panel unit cost
Look up session_city → WPC Panel price.
Full (1.0) if within ±100 of session_city price. Zero (0) otherwise.
Example: Mumbai city → correct answer = 1500 (±100 → accept 1400–1600).

**Q39** (max 1.0) — PRICE_RANGE: Charcoal Panel price range
Accepted band: 3500–4000.
Full (1.0) if RM's answer/range overlaps [3500, 4000]. Zero (0) if no overlap.

**Q40** (max 1.0) — PRICE_RANGE: SPC Sheet unit cost
Accepted band: 8500–9500 (ideal ~9000).
Full (1.0) if RM's answer/range overlaps [8500, 9500]. Zero (0) otherwise.

### SECTION B — Quotations (Q28 + Q41 + Q42 + Q43 + Q44, max 5)

**Q28** (max 1.0) — PRICE_RANGE: NIO Panels, 10×9 ft quotation
Accepted band: 12000–15000.
Full (1.0) if RM's answer/range overlaps [12000, 15000]. Zero (0) if no overlap.

**Q41** (max 1.0) — PRICE_RANGE: PVC Plain, 10×9 ft quotation
Accepted band: 8000–11000.
Full (1.0) if overlaps [8000, 11000]. Zero (0) otherwise.

**Q42** (max 1.0) — PRICE_RANGE: Half PVC Plain + Half WPC, 10×9 ft quotation
Accepted band: 15000–18000.
Full (1.0) if overlaps [15000, 18000]. Zero (0) otherwise.
Coaching note: breakup = half PVC ~4k–5k, half WPC ~11k–12k.

**Q43** (max 1.0) — PRICE_RANGE: Charcoal Mini Rectangle, full wall quotation
Accepted band: 30000–35000.
Full (1.0) if overlaps [30000, 35000]. Zero (0) otherwise.

**Q44** (max 1.0) — COMPONENT_PLUS_COST: Full Cove Design, 10×9 ft
Split 0.5 components + 0.5 cost:
Components (0.5): expected = Aluminium L Channel, Iron U Channel, Aluminium U Channel, Aluminium L Corner Light Profile, 10mm PVC Board, Copper Wire (~5m), Edge Band, Biddings.
  → 3 or more correct = 0.5; 1–2 correct = 0.25; 0 = 0
Cost (0.5): accepted band 15000–18000.
  → overlaps band = 0.5; else 0
Total for Q44: sum of both parts (0, 0.25, 0.5, 0.75, or 1.0).

### SECTION C — Glue Calculations (Q29 + Q45 + Q46, max 3)

**Q29** (max 1.0) — GLUE_COUNT: NIO wall 10×9 ft
Accepted count: 2 only.
Full (1.0) if RM says 2. Zero (0) for any other count.
Coaching: 1 beginning side + 1 ending side = 2 glue.

**Q45** (max 1.0) — GLUE_COUNT: 2 WPC Sheets + 5 PVC Panels, 9×9 ft
Accepted count: 5 only.
Full (1.0) if RM says 5. Zero (0) for any other count.
Coaching: 4 glue for WPC sheets, 1 glue for last PVC panel = 5.

**Q46** (max 1.0) — GLUE_COUNT: Mild-seepage, full PVC Plain wall, 10×9 ft (TRICK)
Accepted counts: 0 OR 1 (both = full marks).
Full (1.0) if RM says 0 or 1. Zero (0) for 2 or more.
Coaching: ideal = 0 (glue not used on PVC plain in seepage cases); 1 is acceptable for first/last support. Capture the RM's reasoning for the report.

---

## TRANSCRIPT
${formattedTranscript}

---

## INSTRUCTIONS

1. Extract session_city from the city-capture turn (before Q36). Note it explicitly.
2. Score Q36, Q37, Q38 using the city-price lookup for session_city.
3. Score Q39–Q46 using flat ranges and glue counts.
4. Apply range-overlap logic: a point inside the band = full; a stated range that intersects the band = full.
5. Apply number-word normalization before any numeric comparison.
6. Sum into 3 sections:
   - unit_prices = Q36 + Q37 + Q38 + Q39 + Q40 (max 5)
   - quotations = Q28 + Q41 + Q42 + Q43 + Q44 (max 5)
   - glue_calculations = Q29 + Q45 + Q46 (max 3)
7. overall_score = sum of all 3 sections (max 13)

For strengths: name Q numbers and topics RM got fully correct.
For missed_opportunities: for each missed/partial Q — what was asked → what RM said → what was correct (with session_city noted for price Qs) → coaching note.
For Q46 especially: capture the RM's reasoning ("why") even if the count is wrong — show in coaching.

---

## OUTPUT FORMAT

Return valid JSON matching this exact structure:

{
  "overall_score": <sum of all 3 sections, 0–13>,
  "session_city": "<Delhi|Mumbai|Bangalore|Hyderabad|Default>",
  "sections": {
    "unit_prices": {
      "score": <0–5>,
      "max_score": 5,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": ["<Q numbers and products RM priced correctly for their city>"],
      "missed_opportunities": [
        "<For each price miss: Q number, topic, session_city, rm_said, correct_value (for city), coaching. Example: Q38 WPC Panel (Bangalore) — RM said 1300, correct for Bangalore = 1600. Coaching: Bangalore me WPC ~1600 hota hai, Delhi se alag hai.>"
      ],
      "feedback": "<1–2 sentence summary of pricing knowledge>"
    },
    "quotations": {
      "score": <0–5>,
      "max_score": 5,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": [
        "<For each quotation miss: Q number, scenario, rm_said, accepted_band, coaching note. For Q44: score each part separately — components listed vs expected, cost vs band.>"
      ],
      "feedback": ""
    },
    "glue_calculations": {
      "score": <0–3>,
      "max_score": 3,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": [
        "<For Q29: rm_said vs correct count 2, with logic explanation. For Q45: rm_said vs correct count 5 (4 WPC + 1 PVC). For Q46: rm_said, was it 0/1 (correct) or not, RM's reasoning as stated, ideal coaching.>"
      ],
      "feedback": ""
    }
  },
  "critical_mistakes": ["<Only if RM gave a wildly wrong price (e.g. >10x the correct value) or a glue count that would cause real damage on site. Leave empty if no critical errors.>"],
  "coaching_feedback": "<2–3 sentence overall summary: RM's strongest section + the most important gap. Name specific Q numbers. For pricing misses, always note the city so corrections are contextual. Include one concrete example.>",
  "suggested_ideal_response": "<Compact model answers for most-missed topics. Focus on city-specific pricing and glue logic. Example: 'Q38 (Bangalore): WPC Panel Bangalore mein ~₹1,600 hota hai — Delhi se alag hai (~₹1,300). Q45: 2 WPC Sheets + 5 PVC Panels → 4 glue WPC ke liye + 1 glue last PVC ke liye = 5. Q46: Mild seepage wali wall par PVC Plain ke liye glue ki zaroorat nahi hoti — answer = 0 (ya 1 support ke liye). Yeh trick question tha.'>",
  "performance_tier": "<Excellent if >=11 | Good if >=8 | Average if >=4.5 | Needs Improvement if <4.5>"
}`;
}
