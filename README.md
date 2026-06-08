# RM Retraining — by Urban Company

A voice-first AI training simulator that helps Relationship Managers practice customer consultations before going on real visits. The RM talks to a simulated Indian homeowner powered by Google's Gemini Live AI, and receives a detailed scored report card at the end.

---

## What It Does

Traditional RM training relies on classroom sessions or shadowing — neither gives the RM actual practice handling tricky customer conversations. This platform puts the RM in a realistic one-on-one consultation scenario:

- The RM speaks naturally (voice call, no typing)
- An AI customer responds in real-time, in Hinglish, behaving like a real homeowner
- The customer has a hidden budget, hidden concerns, and personality quirks — the RM has to discover them through the conversation
- After the session ends, an AI coach evaluates the full transcript and generates a scored report card across 4 categories

---

## How It Works

```
Login → Select Module → Start Consultation → Speak with AI Customer → End Session → View Report Card
```

1. **Login** — RM logs in with their registered mobile number and password
2. **Module** — Each module is a specific consultation scenario (e.g. Seepage Wall)
3. **Consultation** — RM sees the wall image and speaks with the AI customer via microphone
4. **Report Card** — After ending the session, a detailed scored report is generated (takes ~15–30 seconds)

---

## Scoring (per session)

| Category | Max Points | What's Evaluated |
|---|---|---|
| Introduction & Rapport | 15 | Did RM introduce as Project Manager? Build comfort? Natural tone? |
| Technical Knowledge | 5 | Explained panels correctly? Addressed seepage? Durability? |
| Budget Discovery | 20 | Explored budget? Offered options? Read customer reactions? |
| Discovery & Confidence | 10 | Asked dimensions? Design preferences? Handled questions confidently? |
| **Total** | **50** | — |

---

## Available Modules

### Module 1 — Seepage Wall Consultation
The RM visits a homeowner whose wall has seepage/water damage. The customer doesn't bring it up — the RM must notice it and handle it. Core objectives: identify the problem, explain wall panels, discover budget, and suggest appropriate options.

More modules can be added over time for different consultation scenarios.

---

## Admin Dashboard

Admins can:
- View all RMs and their full session history
- See scores, session duration, and attempt dates per RM
- Open any RM's detailed report card directly
- Read the full conversation transcript of any session

Admin access is controlled by a fixed list of mobile numbers in the codebase.

---

## Running Locally

See [SETUP.md](SETUP.md) for the full setup guide. Quick version:

```bash
# 1. Install dependencies
npm install

# 2. Add environment variables
cp .env.local.example .env.local
# Fill in: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, GEMINI_API_KEY

# 3. Run
npm run dev
```

Open `http://localhost:3000` and log in with a seeded mobile number + password `123456`.

---

## Tech Stack

| What | Tool | Why |
|---|---|---|
| Frontend + Backend | Next.js 15 | One codebase, server-side rendering, fast |
| Voice AI | Gemini Live API | Real-time bidirectional voice with low latency |
| Evaluation AI | Gemini 2.5 Flash | Evaluates transcript and generates report card |
| Database | Supabase (PostgreSQL) | Stores RMs, sessions, transcripts, scores |
| Real-time voice bridge | WebSocket (custom server) | Keeps the Gemini connection stable on the server |
| Deployment | Render.com | Supports persistent WebSocket connections |

---

## Deployment

The app is deployed on [Render.com](https://render.com). Render is used instead of Vercel because the voice feature requires a persistent WebSocket connection that stays open for the full duration of a consultation.

Live URL: `https://rm-retraining.onrender.com`

> Note: The free tier on Render spins down after 15 minutes of inactivity, causing a ~50 second cold start on the first login. This is expected on the free plan.

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
components/       → UI components (consultation, admin, report card)
lib/              → Core logic (Gemini AI, database, auth, prompts)
hooks/            → React hooks for consultation state
types/            → TypeScript types
server.ts         → Custom Node.js server with WebSocket support
scripts/          → Database schema and seed files
```

---

© 2026 Urban Company. All rights reserved.
