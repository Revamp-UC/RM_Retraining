# RM Retraining — Setup Guide

## Prerequisites
- Node.js 20+
- Supabase account (free tier works)
- Google AI Studio API key (Gemini)

---

## Step 1: Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Go to **SQL Editor** and run the contents of `scripts/schema.sql`
3. Generate a bcrypt hash for the default password (123456):
   ```bash
   node scripts/generate-hash.js
   ```
4. Edit `scripts/seed.sql` — replace `placeholder_hash_replace_me` with the actual hash
5. Run `scripts/seed.sql` in the Supabase SQL Editor
6. From **Project Settings → API**, copy:
   - `Project URL` → `SUPABASE_URL`
   - `service_role` secret → `SUPABASE_SERVICE_ROLE_KEY`

---

## Step 2: Google Gemini API Key

1. Go to https://aistudio.google.com/apikey
2. Create a new API key
3. Enable **Gemini Live API** access (may require allowlist request for live-001 model)

---

## Step 3: Environment Variables

Copy `.env.local.example` to `.env.local` and fill in:

```bash
cp .env.local.example .env.local
```

Required values:
```
SUPABASE_URL=https://xxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJ...
GEMINI_API_KEY=AIza...
SESSION_EXPIRY_HOURS=8
```

---

## Step 4: Wall Image

Replace `public/images/seepage-wall.jpg` with an actual image of a wall with water seepage/damp stains. This is what the RM sees during the consultation.

---

## Step 5: Run Locally

```bash
npm run dev
```

Open http://localhost:3000

Login with any pre-seeded mobile number + password `123456`

---

## Step 6: Production Deployment

### Option A: Any Node.js host (Railway, Render, fly.io — RECOMMENDED for WebSocket)

```bash
npm run build
npm start
```

Set all environment variables in the hosting platform.

### Option B: Vercel (requires Fluid compute for WebSocket)

```bash
vercel deploy
```

Note: WebSocket support on Vercel requires Fluid compute. Configure in vercel.json:
```json
{
  "functions": {
    "api/consultation/stream": {
      "maxDuration": 3600
    }
  }
}
```

---

## Architecture Notes

- **WebSocket server** runs on the same port as Next.js via `server.ts`
- **Gemini Live** session is server-side proxied — API key never exposed to browser
- **Customer persona** prompt is server-side only — RM cannot access it
- **Transcripts** are stored but never shown to RM frontend
- **Evaluation** uses a separate Gemini Flash call (not the Live session)
