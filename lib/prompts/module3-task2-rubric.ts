// Module 3 · Task 2 — Levers Used (Slot / Execution Timeline) Rubric (module_attempted: 'module_3_task2')
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
- Module: Module 3 — Levers Used (closing a customer who wants more time)
- Customer Name in simulation: ${customer_name}
- The customer was a simulated Indian homeowner who had already been through Introduction, Rapport Building, and Budget Discovery before this call started.
- A single finalised design was shown for the customer's wall:
  • Wall size: 9.5 ft × 8 ft
  • Price: ₹57,499 (all inclusive)
- Customer's state: reasonably SATISFIED with the design (not in love with it, not impressed), budget is manageable (NOT a blocker), NOT negotiating price, NOT confused about the design.
- Customer's behaviour: wants MORE TIME before committing — "mujhe ek-do din ka time chahiye".
- Hidden truth: the customer is actually the decision maker (hidden), and has an important personal/family event coming up in roughly 5 days (birthday, anniversary, function, festival, guests, etc.). The customer secretly wants the wall ready before that event but does NOT state it — the RM must DISCOVER it.
- RM's goal: discover the situation and convert the customer using the most impactful urgency lever.

## CRITICAL FRAMING — READ BEFORE SCORING
This is NOT a design-convincing exercise and NOT a budget negotiation. The customer is fine with the design and budget — they just want time.
The ONE thing that genuinely overcomes this customer's "I want time" is realising the WORK MUST BE COMPLETED BEFORE THEIR UPCOMING EVENT — i.e. **Slot Availability / Execution Timeline**.

The RM has to: probe and DISCOVER the upcoming event, explain that work does not finish instantly after booking (measurement → material → installation slot → execution all take days), connect that timeline to the customer's event, and create urgency around booking the slot NOW so it is completed in time.

As a FINAL push-back, the customer typically asks the RM to "hold / reserve / block the slot for me without booking" (I'll pay or confirm in 1-2 days). The RM must NOT promise to hold it — instead the RM should explain that a slot cannot be blocked without an actual booking (FIFO / first-come-first-served, this is the latest available slot anyone can take any moment) and turn that into urgency to book NOW. Giving in and falsely promising to hold the slot is a mistake.

Other levers do NOT, on their own, convert this customer:
- Price hike / future price increase → customer dismisses it ("ek-do din mein prices nahi badalte").
- Discount → customer brushes it off ("57k pe 3-4 hazaar se farak nahi padta, mujhe satisfaction chahiye").
- Stock / material scarcity → customer ACKNOWLEDGES it as valid, but it is not their real concern; it should not be the primary closing reason.

## TRANSCRIPT
${formattedTranscript}

## SCORING DIMENSIONS (10 points total)

### 1. Lever Used (max 5 pts)
Expected lever: **Slot Availability / Execution Timeline**, connected to the customer's upcoming event.
Check whether the RM:
- Identified the correct urgency lever (timeline / slot, not price or stock).
- Discovered the customer's upcoming event and reason for wanting time.
- Explained the execution timeline clearly (booking does not mean instant completion).
- Connected the timeline with the customer's situation / event.
- Created urgency around scheduling and used slot urgency as the PRIMARY conversion trigger.

Scoring:
- 0–2 pts: Weak or incorrect urgency lever (no real urgency, or relied on price/discount; never discovered the situation).
- 3–4 pts: Slot / timeline urgency was discussed but not effectively leveraged (e.g. mentioned timelines but never connected them to the customer's event, or did not make it the main closing reason).
- 5 pts: Slot / execution-timeline urgency became the PRIMARY reason for conversion, clearly tied to the customer's upcoming event.

NOTE: If the RM uses stock / material urgency effectively, acknowledge it positively in the comments. However, award full lever marks ONLY when slot / timeline urgency is the primary closing reason.
NOTE: Effectively rebutting the customer's final "hold / reserve the slot for me without booking" push-back — explaining FIFO / first-come-first-served, that the latest available slot can be taken by anyone, and that it cannot be frozen without booking — is part of using the slot lever well. Credit it. The customer only books after this is handled, so a strong rebuttal here is a key signal of an effective close.
DEDUCT if: RM never discovers the event, or closes (or tries to close) purely on price/discount/stock.

### 2. Confidence & Objection Handling (max 3 pts)
Evaluate whether the RM:
- Explored the real reason behind the customer's delay (not just accepting "I want time").
- Asked meaningful discovery questions that could surface the upcoming event.
- Handled the postponement objection confidently without getting pushy.
- Handled the customer's final "hold / reserve the slot for me without booking" push-back — explained that a slot cannot be blocked without an actual booking (FIFO / first-come-first-served), that this is the latest available slot any other customer can take, and built genuine urgency to book now instead of promising to hold it.
- Maintained control and direction of the conversation.

Scoring:
- 0–1 pt: Weak handling — RM accepts the delay passively, gets pushy, or never probes.
- 2 pts: Average handling — RM probes a little and stays polite but with gaps.
- 3 pts: Strong handling — RM digs into the reason, asks good questions, and steers the conversation with confidence.

### 3. Personalization (max 2 pts)
Evaluate whether the RM:
- Asked the customer's name.
- Used "Name + Ji" after learning the name.
- Avoided "Sir"/"Madam" after learning the name.

Scoring:
- 0 pts: Poor personalization (never asked, or kept using Sir/Madam after learning the name).
- 1 pt: Partial personalization (asked the name but used it inconsistently).
- 2 pts: Consistent "Name + Ji" usage throughout after learning the name.

## SCORING PHILOSOPHY

### When to deduct
- RM never discovers the upcoming event / reason for the delay
- RM tries to close purely on price, discount, or stock
- RM mentions timelines but never connects them to the customer's situation
- RM gives in to the "reserve / hold the slot for me" ask — falsely promises to block or freeze the slot without a booking instead of explaining FIFO and creating urgency to book now
- RM gets pushy and pressures the customer
- RM never asks or uses the customer's name

### When NOT to deduct
- RM is concise — brevity is fine if the slot/timeline lever is clearly used and tied to the event
- RM also mentions stock or discount in passing while keeping slot/timeline urgency primary
- Customer needed a few turns and some probing before revealing the event — that is the scenario working as designed
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
  "suggested_ideal_response": "<A model response the RM could have given that uses the slot / execution-timeline lever perfectly. Write it in natural Hinglish (Roman script) as the RM would say it. Must include: discovering the upcoming event, explaining that work does not finish instantly after booking, connecting the timeline to the event, handling the customer's final 'hold / reserve the slot for me without booking' push-back by explaining it cannot be blocked without an actual booking (FIFO / first-come-first-served, latest slot any other customer can take), and a no-pressure close using the customer's name + Ji. Example style: '${customer_name} Ji, bilkul samajh sakta hoon ki aap thoda time lena chahte hain. Ek baat clear kar doon — booking ke baad kaam turant shuru nahi hota; pehle measurement, phir material aur installation ka slot allocate hota hai, aur is poore process mein kuch din lagte hain. Aapne bataya ki agle hafte ghar pe function hai — is timeline ko dekhte hue slot abhi lena zaroori hai. Main chahta to hoon ki aapke liye slot rok ke rakh loon, par sach ye hai ki slot bina booking ke block nahi hota — ye first-come-first-served chalta hai, aur abhi ye latest available slot hai, koi bhi customer ise kabhi bhi le sakta hai. Agar 1-2 din ruke aur slot kisi aur ne le liya, to kaam aapke function ke baad chala jayega. Isliye ${customer_name} Ji, koi pressure nahi — par aapke function ko dekhte hue aaj slot book kar lena hi sabse safe rahega.'>",
  "performance_tier": "<Excellent if >=8 | Good if >=6 | Average if >=4 | Needs Improvement if <4>"
}

Score honestly. An RM who never discovers the upcoming event or never makes the slot/timeline the primary closing reason should not score above 4, even if they were polite and personalised well. Discovering the situation and using the RIGHT lever is the core skill being tested here.`;
}
