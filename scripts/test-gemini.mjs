/**
 * Gemini Live API Test — No database, no auth, no browser needed.
 * Tests: API key validity, model access, text response, audio response.
 *
 * Run: node scripts/test-gemini.mjs
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env.local manually (no dotenv needed)
function loadEnv() {
  try {
    const envPath = resolve(__dirname, '../.env.local');
    const lines = readFileSync(envPath, 'utf-8').split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) continue;
      const eqIdx = trimmed.indexOf('=');
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const val = trimmed.slice(eqIdx + 1).trim();
      if (key && val) process.env[key] = val;
    }
  } catch {
    console.error('Could not read .env.local — make sure it exists');
    process.exit(1);
  }
}

loadEnv();

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY || GEMINI_API_KEY === 'your-gemini-api-key-here') {
  console.error('\n❌  GEMINI_API_KEY not set in .env.local\n');
  process.exit(1);
}

console.log('\n🔑  API key found:', GEMINI_API_KEY.slice(0, 8) + '...' + GEMINI_API_KEY.slice(-4));

// ─── Test 1: Basic Gemini Flash (REST) ───────────────────────────────────────
async function testGeminiFlash() {
  console.log('\n━━━ Test 1: Gemini Flash REST API ━━━');
  const { GoogleGenAI } = await import('@google/genai');
  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  // Try models in order — newest first
  const candidates = [
    'gemini-2.5-flash',
    'gemini-2.5-flash-preview-05-20',
    'gemini-2.5-pro',
    'gemini-2.0-flash-001',
    'gemini-2.0-flash-exp',
    'gemini-1.5-flash',
    'gemini-1.5-flash-latest',
  ];

  for (const model of candidates) {
    try {
      process.stdout.write(`   Trying ${model}... `);
      const response = await ai.models.generateContent({
        model,
        contents: [{ role: 'user', parts: [{ text: 'Reply with exactly three words: API works fine.' }] }],
      });
      const text = response.text;
      if (text?.length > 0) {
        console.log('✅');
        console.log(`✅  REST API WORKING with model: ${model}`);
        console.log(`   Response: ${text.trim().slice(0, 80)}`);
        return { ok: true, model };
      }
    } catch (err) {
      const msg = err?.message ?? String(err);
      if (msg.includes('API key not valid') || msg.includes('INVALID_ARGUMENT') || msg.includes('401') || msg.includes('403')) {
        console.log('❌');
        console.log('\n❌  API key rejected by Google. Please get a valid key from:');
        console.log('   https://aistudio.google.com/apikey');
        return { ok: false, model: null };
      }
      console.log(`⚠️  (${msg.slice(0, 50)})`);
    }
  }

  console.log('❌  No working REST model found.');
  return { ok: false, model: null };
}

// ─── Test 2: Gemini Live WebSocket ───────────────────────────────────────────
async function testGeminiLive() {
  console.log('\n━━━ Test 2: Gemini Live API (WebSocket) ━━━');

  // Try Live models in order — newest first based on model list
  const liveModels = [
    'gemini-3.1-flash-live-preview',
    'gemini-2.0-flash-live-001',
    'gemini-2.0-flash-exp',
  ];

  for (const liveModel of liveModels) {
    const result = await tryLiveModel(liveModel);
    if (result.ok) return { ok: true, model: liveModel };
    if (result.fatalError) break; // API key issue — no point trying more
  }

  return { ok: false, model: null };
}

function tryLiveModel(liveModel) {
  return new Promise((resolve) => {
    const timeout = setTimeout(() => {
      console.log(`   ⚠️  ${liveModel}: Timed out (no text response in 12s)`);
      resolve({ ok: false });
    }, 12000);

    (async () => {
      try {
        const { GoogleGenAI, Modality } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

        process.stdout.write(`   Trying ${liveModel}... `);

        // session is assigned AFTER connect resolves, but onopen fires during the await.
        // Use a queue to defer sends until session is ready.
        let sessionObj = null;
        let pendingSend = false;

        const session = await ai.live.connect({
          model: liveModel,
          config: {
            responseModalities: [Modality.TEXT],
            systemInstruction: {
              parts: [{ text: 'You are a test assistant. When the user says hello, reply with: "Live API working."' }],
            },
          },
          callbacks: {
            onopen: () => {
              pendingSend = true;
              // If session already assigned, send now; otherwise deferred below
              if (sessionObj) {
                sessionObj.sendClientContent({
                  turns: [{ role: 'user', parts: [{ text: 'Hello' }] }],
                  turnComplete: true,
                });
              }
            },
            onmessage: (msg) => {
              const text = msg.text;
              const audioData = msg.data;
              if (text || audioData) {
                clearTimeout(timeout);
                console.log('✅');
                console.log(`✅  Gemini Live WORKING with model: ${liveModel}`);
                if (text) console.log(`   Text response: ${text.trim().slice(0, 80)}`);
                if (audioData) console.log(`   Audio data: ${audioData.length} chars (PCM base64)`);
                try { session.close(); } catch {}
                resolve({ ok: true });
              }
            },
            onclose: () => {},
            onerror: (err) => {
              clearTimeout(timeout);
              const msg = err?.message ?? String(err);
              const isFatal = msg.includes('401') || msg.includes('403') || msg.includes('API key');
              console.log(`❌ (${msg.slice(0, 60)})`);
              resolve({ ok: false, fatalError: isFatal });
            },
          },
        });

        // Assign session and flush any pending send from onopen
        sessionObj = session;
        if (pendingSend) {
          session.sendClientContent({
            turns: [{ role: 'user', parts: [{ text: 'Hello' }] }],
            turnComplete: true,
          });
        }

      } catch (err) {
        clearTimeout(timeout);
        const msg = err?.message ?? String(err);
        const isFatal = msg.includes('401') || msg.includes('403') || msg.includes('API key');
        console.log(`❌ (${msg.slice(0, 60)})`);
        resolve({ ok: false, fatalError: isFatal });
      }
    })();
  });
}

// ─── Test 3: List available models ───────────────────────────────────────────
async function listModels() {
  console.log('\n━━━ Test 3: Available Models ━━━');
  try {
    const { GoogleGenAI } = await import('@google/genai');
    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

    const models = await ai.models.list();
    const liveModels = [];
    const flashModels = [];

    for await (const model of models) {
      if (model.name?.includes('live')) liveModels.push(model.name);
      if (model.name?.includes('flash') || model.name?.includes('2.0')) flashModels.push(model.name);
    }

    if (liveModels.length > 0) {
      console.log('✅  Live-capable models:');
      liveModels.forEach(m => console.log('   -', m));
    } else {
      console.log('⚠️  No live models found (may need allowlist access)');
    }

    if (flashModels.length > 0) {
      console.log('   Flash/2.0 models available:');
      flashModels.slice(0, 5).forEach(m => console.log('   -', m));
    }
  } catch (err) {
    console.log('⚠️  Could not list models:', err?.message ?? String(err));
  }
}

// ─── Run all tests ────────────────────────────────────────────────────────────
async function main() {
  console.log('═══════════════════════════════════════');
  console.log('  RM RETRAINING — Gemini API Test');
  console.log('═══════════════════════════════════════');

  const rest = await testGeminiFlash();

  if (!rest.ok) {
    console.log('\n⛔  REST API failed. Fix the API key first.');
    process.exit(1);
  }

  await listModels();
  const live = await testGeminiLive();

  console.log('\n═══════════════════════════════════════');
  console.log('  SUMMARY');
  console.log('═══════════════════════════════════════');
  console.log(`  Gemini REST:      ${rest.ok ? `✅ OK (${rest.model})` : '❌ FAIL'}`);
  console.log(`  Gemini Live WSS:  ${live.ok ? `✅ OK (${live.model})` : '❌ FAIL / Not accessible'}`);

  if (rest.ok && live.ok) {
    console.log('\n  🎉 All systems go!');
    console.log(`\n  Working models to update in your app:`);
    console.log(`    Evaluator (lib/gemini/evaluator.ts):  "${rest.model}"`);
    console.log(`    Live proxy (lib/gemini/live-proxy.ts): "${live.model}"`);
    console.log('\n  Next step: Set up Supabase, then: npm run dev\n');
  } else if (rest.ok && !live.ok) {
    console.log('\n  ⚠️  REST works but Live API is not accessible yet.');
    console.log(`  Update evaluator model to: "${rest.model}"`);
    console.log('  For Live: enable "Gemini Live API" at https://aistudio.google.com\n');
  }

  process.exit(0);
}

main().catch((err) => {
  console.error('\n💥 Unexpected error:', err);
  process.exit(1);
});
