// Module 2 · Task 2 — Commitment Confidence Rubric (module_attempted: 'module_2_task2')
import type { TranscriptEntry } from '@/types/transcript';

export function buildEvaluationPrompt(
  transcript: TranscriptEntry[],
  customer_name: string,
): string {
  const formattedTranscript = transcript
    .map((e) => `[${e.speaker.toUpperCase()}]: ${e.text}`)
    .join('\n');

  return `You are an expert sales coach evaluating an Urban Company Relationship Manager (RM) on a Design Commitment consultation call.

LANGUAGE RULE: Write all feedback, strengths, missed_opportunities, coaching_feedback, and suggested_ideal_response in simple, everyday language. No corporate jargon, no tough English. Write like you are talking to someone directly — clear and easy to understand. SCRIPT RULE: Use Roman script only throughout — no Devanagari (Hindi) script anywhere. Hinglish phrases are welcome but must be written in English letters (e.g. "theek hai", "bilkul sahi", not "ठीक है").

## CONTEXT
- Module: Module 2 — Task 2 / Commitment Confidence
- Customer Name in simulation: ${customer_name}
- The customer was a simulated Indian homeowner who had already:
  • Seen their actual wall photo (9 ft × 9 ft)
  • Selected a design they genuinely like
  • Found the pricing acceptable
- Design is settled. Price is settled. The only blocker is commitment.
- Customer's fear: "What if the final installed wall doesn't look as good as what I'm seeing right now?"
- Customer is NOT looking for a different design or a lower price — purely an outcome confidence issue

## CRITICAL FRAMING — READ BEFORE SCORING
This is NOT a design selection exercise and NOT a budget discovery exercise.
The RM's job here is: convert uncertainty into confidence through proof and ownership.

A great RM in this scenario:
1. VALIDATES the customer's fear — acknowledges it is a legitimate concern, not an irrational worry
2. USES PROOF — AI visualization, physical samples, real installation examples (FF Gallery)
3. SETS HONEST EXPECTATIONS — does not overpromise; acknowledges minor AI vs real differences
4. TAKES OWNERSHIP — confidently stands behind the outcome
5. CLOSES WITHOUT PRESSURE — moves the customer toward yes without rushing

The goal is NOT objection handling. The goal is building genuine confidence through evidence and ownership.

## TRANSCRIPT
${formattedTranscript}

## SCORING DIMENSIONS (5 points each, 20 points total)

### 1. Trust Building & Confidence (max 5 pts)
Evaluate: Did the RM acknowledge the customer's fear and actively build trust?

- 5 pts: Validates concern genuinely, takes ownership, builds confidence gradually, no pressure
- 4 pts: Good reassurance with minor gaps
- 3 pts: Basic reassurance without real depth
- 2 pts: Weak reassurance — more generic than genuine
- 1 pt: Ignores or dismisses the concern entirely

DEDUCT if: RM dismisses the fear; says "don't worry"/"trust me" without any explanation; uses urgency or pressure tactics.
DO NOT DEDUCT for: Validation that is brief but sincere.

### 2. Reinforcement Using Proof (max 5 pts)
Evaluate: Did the RM use confidence-building proof — AI visualization, physical samples, or real installation examples?

- 5 pts: Uses proof effectively, anchors it to the customer's own wall and design, meaningfully increases trust
- 4 pts: Uses one proof source well
- 3 pts: Mentions proof but weakly, without anchoring it to the customer's situation
- 2 pts: Minimal usage — proof barely mentioned
- 1 pt: No proof used at all

DO NOT DEDUCT if: A specific proof type was unavailable in the flow and the RM used an equivalent alternative.

### 3. Hesitation Handling & Ownership (max 5 pts)
Evaluate: When the customer questioned whether the AI image would match reality, did the RM handle it honestly and confidently?

- 5 pts: Addresses the concern directly, sets realistic expectations, takes clear ownership of the outcome
- 4 pts: Good explanation with minor gaps
- 3 pts: Average handling — some explanation but limited ownership
- 2 pts: Weak handling — vague or deflecting
- 1 pt: Avoids the concern entirely

DEDUCT if: RM overpromises; claims AI and reality are identical or "100% same."
DO NOT DEDUCT if: RM honestly acknowledges minor differences between AI and real — that is correct and trustworthy behavior, not weakness.

### 4. Real Installation Proof (max 5 pts)
Evaluate: Did the RM show real photos of past completed work to close the realism gap?

This includes ANY of the following — RM does NOT need to say "FF Gallery":
- "yeh kaam maine kiya hai, photo dikhata hoon"
- "ek ghar mein same design lagaya tha, real photo dekho"
- Referencing FF Gallery by name
- Any real completed installation photo shown to the customer

- 5 pts: Shows real installation photos confidently, connects them to customer's own wall/design, customer trust clearly increases
- 4 pts: Shows real photos and explains them well
- 3 pts: Briefly shows or mentions past work photos
- 2 pts: Mentions it but doesn't actually show or anchor to the customer's concern
- 1 pt: Never shows any real installation proof

DO NOT DEDUCT if: RM used any real-world proof method even if they didn't say "FF Gallery".

## SCORING PHILOSOPHY

### When to deduct
- RM dismisses the customer's concern without validation
- RM uses "trust me" or "don't worry" without backing it up
- RM overpromises — claims AI and reality are identical
- RM creates urgency or pressure to commit
- RM never uses any proof source

### When NOT to deduct
- RM acknowledges minor AI vs real differences — this is correct, honest behavior
- RM uses one proof type instead of all three — one well-used proof is enough for a good score
- RM is concise — brevity is fine if the key elements are present
- Customer took multiple turns to warm up — normal and not the RM's fault

## OUTPUT FORMAT

ANTI-REPETITION RULE: Each section must evaluate a different angle. If a finding (e.g. "RM overpromised") is already captured in one section's missed_opportunities or strengths — do NOT repeat it in another section. Every section should surface something new about the RM's performance. The coaching_feedback must NOT re-summarize what sections already said — it should synthesize and add one new overall insight.

Return valid JSON matching this exact structure:

{
  "overall_score": <sum of all 4 section scores>,
  "sections": {
    "trust_confidence": {
      "score": <0–5>,
      "max_score": 5,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": ["<specific thing RM did well>"],
      "missed_opportunities": ["<specific, actionable improvement>"],
      "feedback": "<1–2 sentence summary of this dimension>"
    },
    "reinforcement_proof": {
      "score": <0–5>,
      "max_score": 5,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": [],
      "feedback": ""
    },
    "hesitation_ownership": {
      "score": <0–5>,
      "max_score": 5,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": [],
      "feedback": ""
    },
    "ff_gallery_validation": {
      "score": <0–5>,
      "max_score": 5,
      "label": "<Excellent|Good|Average|Poor>",
      "strengths": [],
      "missed_opportunities": [],
      "feedback": ""
    }
  },
  "critical_mistakes": ["<only include if RM made a clear, significant error — leave empty if none>"],
  "coaching_feedback": "<2–3 sentences in simple language. First: what the RM did well. Second: the single most important thing to improve — be specific, say exactly what the RM should have said or done differently. Example: 'Instead of saying X, RM should have said Y.' Draw this directly from the conversation.>",
  "suggested_ideal_response": "<A best-practice model response combining: genuine validation of the fear, at least one proof source anchored to the customer's wall and design, honest expectation-setting on AI vs real, and a confident ownership-based close. Write in natural Hinglish as the RM would say it.>",
  "performance_tier": "<Excellent if >=17 | Good if >=13 | Average if >=9 | Needs Improvement if <9>"
}

Score honestly. An RM who validates well but never uses proof should not score above 13. Proof and ownership are the core of this task.`;
}
