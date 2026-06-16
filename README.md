# RM Retraining — by Urban Company

A voice-first AI training simulator that helps Relationship Managers practice customer consultations before going on real visits. The RM talks to a simulated Indian homeowner powered by Google's Gemini Live AI, and receives a detailed scored report card at the end.

---

## What It Does

Traditional RM training relies on classroom sessions or shadowing — neither gives the RM actual practice handling tricky customer conversations. This platform puts the RM in a realistic one-on-one consultation scenario:

- The RM speaks naturally (voice call, no typing)
- An AI customer responds in real-time, in Hinglish, behaving like a real homeowner
- The customer has a hidden budget, hidden concerns, and personality quirks — the RM has to discover them through the conversation
- After the session ends, an AI coach evaluates the full transcript and generates a scored report card

---

## How It Works

```
Login → Select Module → Read Scenario Brief → Start Consultation → Speak with AI Customer → End Session → View Report Card
```

1. **Login** — RM logs in with their registered mobile number and OTP/password
2. **Module** — Each module is a specific consultation scenario with one or more tasks
3. **Scenario Brief** — A modal explains what the RM already knows before the call starts
4. **Consultation** — RM sees the wall/design image and speaks with the AI customer via microphone
5. **Report Card** — After ending the session, a detailed scored report is generated (~15–30 seconds)

---

## Available Modules

### Module 1 — Know the Budget of Your Customer
Three tasks, each with a different customer type and wall scenario. Core objective across all tasks: discover the customer's budget through natural conversation.

| Task | Scenario | Max Score |
|---|---|---|
| Task 1 | Seepage wall — customer hides budget, RM must notice wall damage | 45 pts |
| Task 2 | New flat — aesthetic upgrade, handle market price comparisons | 50 pts |
| Task 3 | Value-focused customer — extreme budget resistance, scope negotiation | 45 pts |

### Module 2 — Design Finalisation: Objection Handling *(Admin only)*
Customer has already been shown designs. Core objective: guide the customer from confusion/hesitation to a confident decision.

| Task | Scenario | Max Score |
|---|---|---|
| Task 1 | Customer likes all 3 designs but can't decide — guide without pressure | 30 pts |
| Task 2 | Design is selected, price is fine — customer anxious real wall won't match image | 20 pts |

---

## Scoring

Each task has its own scoring dimensions. Report cards include:
- Per-section scores with strengths and missed opportunities
- Coach's feedback with a specific actionable improvement
- Ideal RM response example (Module 2 only)
- Performance tier: **Excellent / Good / Average / Needs Improvement**

---

## AI Stack

| Role | Model | Details |
|---|---|---|
| Voice customer | `gemini-3.1-flash-live-preview` | Real-time bidirectional voice, Hinglish persona |
| Evaluator | `gemini-2.5-flash` | Thinking enabled (`thinkingBudget: 1024`), constrained JSON output via `responseSchema` |
| Evaluator fallback | `gemini-2.5-flash-lite` | Used if 2.5-flash is overloaded (4 retries → fallback) |

### Evaluation reliability features
- `responseSchema` constrained generation — Gemini is forced to output valid JSON at the token level
- Thinking token filter — thinking tokens are stripped before JSON parsing
- Retry logic — 4 attempts on primary model with exponential backoff, then 2 attempts on fallback
- Parse failure throws (not silent return) so retries kick in correctly

---

## Admin Dashboard

Admins can:
- View all RMs and their full session history
- See scores, session duration, and attempt dates per RM
- Open any RM's detailed report card and full transcript
- Access Module 2 (admin-only modules)

Admin access is controlled by a fixed allowlist of mobile numbers in the codebase.

---

## Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Add environment variables
cp .env.local.example .env.local
# Fill in: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY

# 3. Run
npm run dev
```

Open `http://localhost:3000` and log in with a seeded mobile number.

---

## Tech Stack

| What | Tool |
|---|---|
| Frontend + Backend | Next.js 15 (App Router) |
| Voice AI | Gemini Live API |
| Evaluation AI | Gemini 2.5 Flash |
| Database | Supabase (PostgreSQL) |
| Real-time voice bridge | Custom WebSocket server |
| Deployment | Render.com |

> Render is used instead of Vercel because the voice feature requires a persistent WebSocket connection for the full duration of a consultation.

---

## Environment Variables

| Variable | Description |
|---|---|
| `SUPABASE_URL` | Your Supabase project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) |
| `GEMINI_API_KEY` | Google AI Studio API key with Gemini Live access |
| `SESSION_EXPIRY_HOURS` | How long login sessions last (e.g. `8`) |

---

## Project Structure

```
app/              → Pages and API routes (Next.js App Router)
components/       → UI components (consultation, report, admin)
lib/
  gemini/         → Gemini Live voice client + evaluator
  prompts/        → Persona and rubric files per module/task + registry
  config/         → Module and task configuration (single source of truth)
  db/             → Database queries
  auth/           → Session management
hooks/            → React hooks for consultation state machine
types/            → TypeScript types
server.ts         → Custom Node.js server with WebSocket support
```

### Adding a new task
1. Create `lib/prompts/moduleN-taskN-persona.ts`
2. Create `lib/prompts/moduleN-taskN-rubric.ts`
3. Add entry in `lib/prompts/registry.ts` (persona + rubric + sanitizer)
4. Add section keys in `lib/gemini/evaluator.ts` → `MODULE_SECTIONS`
5. Add task in `lib/config/modules.ts`
6. **Add the task's total max marks to `MODULE_MAX_SCORE` in `lib/config/modules.ts`** — this is mandatory. All cross-task averages (admin "Overall Avg", personal "Avg Score") normalise every session to `/50` via this map. A new task with any max (10, 50, 100, anything) only averages correctly once its max is registered here; tasks missing from the map fall back to their raw score and skew every average.

---

© 2026 Urban Company. All rights reserved.
