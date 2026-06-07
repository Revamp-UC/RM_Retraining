/**
 * Deep debug test for Gemini Live API.
 * Logs every single message received so we can see what's happening.
 */
import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  const lines = readFileSync(resolve(__dirname, '../.env.local'), 'utf-8').split('\n');
  for (const line of lines) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const i = t.indexOf('=');
    if (i === -1) continue;
    process.env[t.slice(0, i).trim()] = t.slice(i + 1).trim();
  }
}
loadEnv();

const API_KEY = process.env.GEMINI_API_KEY;
console.log('API Key:', API_KEY.slice(0, 8) + '...' + API_KEY.slice(-4));

const { GoogleGenAI, Modality } = await import('@google/genai');
const ai = new GoogleGenAI({ apiKey: API_KEY });

// Try both TEXT and AUDIO modalities
const MODEL = 'gemini-3.1-flash-live-preview';
const TIMEOUT_MS = 25000;

console.log(`\nConnecting to ${MODEL}...`);

let receivedAny = false;

const session = await ai.live.connect({
  model: MODEL,
  config: {
    responseModalities: [Modality.AUDIO],   // Live preview only supports AUDIO output
    systemInstruction: {
      parts: [{ text: 'You are a helpful assistant. Greet the user warmly when they say hello.' }],
    },
    outputAudioTranscription: {},           // Still get text transcript alongside audio
  },
  callbacks: {
    onopen: () => console.log('✅ WebSocket OPENED'),
    onmessage: (msg) => {
      receivedAny = true;
      console.log('\n📨 Message received:');

      // Check all possible fields
      if (msg.text) console.log('  .text:', msg.text.slice(0, 100));
      if (msg.data) console.log('  .data: [audio base64]', msg.data.length, 'chars');
      if (msg.serverContent) {
        const sc = msg.serverContent;
        console.log('  .serverContent:', JSON.stringify({
          turnComplete: sc.turnComplete,
          interrupted: sc.interrupted,
          hasModelTurn: !!sc.modelTurn,
          hasOutputTranscription: !!sc.outputTranscription,
          hasInputTranscription: !!sc.inputTranscription,
        }));
        if (sc.outputTranscription?.text) {
          console.log('  .outputTranscription.text:', sc.outputTranscription.text);
        }
      }
      if (msg.setupComplete) console.log('  .setupComplete:', JSON.stringify(msg.setupComplete));
      if (msg.usageMetadata) console.log('  .usageMetadata:', JSON.stringify(msg.usageMetadata));
    },
    onclose: (event) => {
      console.log('\n🔒 WebSocket CLOSED. Code:', event?.code, 'Reason:', event?.reason);
    },
    onerror: (err) => {
      console.log('\n❌ WebSocket ERROR:', err?.message ?? String(err));
    },
  },
});

console.log('✅ Session created. Sending text message...');

// Method 1: sendClientContent
try {
  session.sendClientContent({
    turns: [{ role: 'user', parts: [{ text: 'Hello! Please say hi back.' }] }],
    turnComplete: true,
  });
  console.log('📤 Sent via sendClientContent');
} catch (e) {
  console.log('⚠️ sendClientContent failed:', e.message);
}

// Wait for responses
await new Promise((resolve) => setTimeout(resolve, TIMEOUT_MS));

if (!receivedAny) {
  console.log('\n⚠️ No messages received in', TIMEOUT_MS / 1000, 'seconds');
  console.log('   Trying sendRealtimeInput with text...\n');

  try {
    session.sendRealtimeInput({
      text: 'Hello! Please greet me.',
    });
    console.log('📤 Sent via sendRealtimeInput (text)');
    await new Promise((resolve) => setTimeout(resolve, 10000));
  } catch (e) {
    console.log('⚠️ sendRealtimeInput(text) failed:', e.message);
  }
}

if (!receivedAny) {
  console.log('\n❌ No response from Gemini Live API at all.');
  console.log('   The Live API may require special model access or different setup.');
} else {
  console.log('\n✅ Gemini Live API IS responding!');
}

try { session.close(); } catch {}
process.exit(0);
