import { GoogleGenAI, Modality } from '@google/genai';
import type { LiveServerMessage, Session } from '@google/genai';
import type { IncomingMessage } from 'http';
import type WebSocket from 'ws';
import { validateWsToken } from '@/lib/auth/session';
import { getPersonaPrompt } from '@/lib/prompts/registry';
import {
  createSession,
  getSession,
  setGeminiSession,
  appendTranscript,
  updateHeartbeat,
  destroySession,
} from './session-store';
import type { WSMessage } from '@/types/gemini';
import type { CustomerGender } from '@/types/consultation';

const LIVE_MODEL = 'gemini-3.1-flash-live-preview';

export async function handleConsultationStream(
  clientWs: WebSocket,
  req: IncomingMessage,
): Promise<void> {
  const url = new URL(req.url ?? '/', `http://${req.headers.host}`);
  const wsToken = url.searchParams.get('token');
  const consultationId = url.searchParams.get('consultation_id');

  console.log('[LiveProxy] New connection | consultationId:', consultationId);

  const send = (msg: WSMessage) => {
    if (clientWs.readyState === 1) {
      clientWs.send(JSON.stringify(msg));
    }
  };

  if (!wsToken || !consultationId) {
    send({ type: 'error', error: 'Missing token or consultation_id' });
    clientWs.close(1008, 'Unauthorized');
    return;
  }

  const tokenData = validateWsToken(wsToken);
  if (!tokenData || tokenData.consultation_id !== consultationId) {
    send({ type: 'error', error: 'Invalid or expired token' });
    clientWs.close(1008, 'Unauthorized');
    return;
  }

  const { mobile_number: tokenMobile, customer_name, customer_gender, module_attempted } = tokenData;
  console.log('[LiveProxy] Validated | customer:', customer_name, '| gender:', customer_gender, '| module:', module_attempted);

  createSession({
    consultation_id: consultationId,
    mobile_number: tokenMobile,
    customer_name: customer_name ?? 'Customer',
    customer_gender: customer_gender ?? 'male',
    module_id: module_attempted,
    start_time: new Date(),
  });

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  if (!GEMINI_API_KEY) {
    console.error('[LiveProxy] GEMINI_API_KEY not set');
    send({ type: 'error', error: 'Server configuration error.' });
    clientWs.close(1011, 'Config error');
    return;
  }

  // geminiSession is null until Gemini connects; clientAlive tracks whether browser is still connected
  let geminiSession: Session | null = null;
  let clientAlive = true;
  const startTime = Date.now();

  // Register client handlers BEFORE connecting to Gemini so we can abort cleanly
  // if the browser disconnects during the 3-5 second Gemini handshake window
  clientWs.on('close', () => {
    console.log('[LiveProxy] Client disconnected');
    clientAlive = false;
    if (geminiSession) {
      try { geminiSession.close(); } catch {}
    }
    // Do NOT destroySession here — the /api/consultation/end route needs
    // the transcript from this session to run evaluation.
    // cleanStaleSessions() handles orphaned sessions after 45 min.
  });

  clientWs.on('error', (err) => {
    console.error('[LiveProxy] Client WS error:', err);
    clientAlive = false;
  });

  clientWs.on('message', (data: Buffer | string) => {
    if (typeof data === 'string') {
      try {
        const msg = JSON.parse(data) as WSMessage;
        if (msg.type === 'heartbeat') {
          updateHeartbeat(consultationId);
          send({ type: 'heartbeat_ack' });
        }
        if (msg.type === 'end_consultation') {
          clientWs.close(1000, 'Consultation ended by RM');
        }
      } catch { /* ignore parse errors */ }
    } else if (geminiSession) {
      try {
        geminiSession.sendRealtimeInput({
          audio: { data: data.toString('base64'), mimeType: 'audio/pcm;rate=16000' },
        });
      } catch (err) {
        console.error('[LiveProxy] Failed to send audio chunk:', err);
      }
    }
  });

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  const systemPrompt = getPersonaPrompt(
    module_attempted,
    customer_name ?? 'Rahul',
    (customer_gender ?? 'male') as CustomerGender,
  );
  const voiceName = customer_gender === 'female' ? 'Aoede' : 'Puck';

  let openFired = false;

  console.log('[LiveProxy] Connecting to Gemini Live:', LIVE_MODEL);

  try {
    const session = await ai.live.connect({
      model: LIVE_MODEL,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName } } },
        systemInstruction: { parts: [{ text: systemPrompt }] },
        inputAudioTranscription: {},
        outputAudioTranscription: {},
      },
      callbacks: {
        onopen: () => {
          console.log('[LiveProxy] Gemini opened | clientAlive:', clientAlive, '| clientWs.readyState:', clientWs.readyState);
          if (!clientAlive || clientWs.readyState !== 1) {
            console.log('[LiveProxy] Client already gone — Gemini will be closed after connect() resolves');
            return;
          }
          openFired = true;
          send({ type: 'session_ready', data: { customer_name } });
          if (geminiSession) kickOffConversation(geminiSession, module_attempted);
        },

        onmessage: (message: LiveServerMessage) => {
          if (!clientAlive || clientWs.readyState !== 1) return;
          const serverSession = getSession(consultationId);
          if (!serverSession) return;

          const audioData = message.data;
          if (audioData) {
            clientWs.send(Buffer.from(audioData, 'base64'));
          }

          const sc = message.serverContent;
          if (sc) {
            if (sc.inputTranscription?.text && isHindiOrEnglish(sc.inputTranscription.text)) {
              appendTranscript(consultationId, {
                speaker: 'rm',
                text: sc.inputTranscription.text,
                timestamp_ms: Date.now() - startTime,
                absolute_time: new Date().toISOString(),
              });
            }
            if (sc.outputTranscription?.text) {
              appendTranscript(consultationId, {
                speaker: 'customer',
                text: sc.outputTranscription.text,
                timestamp_ms: Date.now() - startTime,
                absolute_time: new Date().toISOString(),
              });
            }
          }
        },

        onclose: (e: CloseEvent) => {
          const reason = e.reason || '(none)';
          console.log('[LiveProxy] Gemini closed | code:', e.code, '| reason length:', reason.length);
          console.log('[LiveProxy] Full reason:', reason);
          send({ type: 'session_ended' });
        },

        onerror: (error: ErrorEvent) => {
          console.error('[LiveProxy] Gemini error:', error?.message ?? error);
          send({ type: 'error', error: 'ai_error' });
        },
      },
    });

    geminiSession = session;

    // Abort if client disconnected during the Gemini connection window
    if (!clientAlive || clientWs.readyState !== 1) {
      console.log('[LiveProxy] Client disconnected during Gemini connect — aborting');
      try { geminiSession.close(); } catch {}
      return;
    }

    if (openFired) {
      kickOffConversation(geminiSession, module_attempted);
    }

    setGeminiSession(consultationId, {
      send: (params) => session.sendRealtimeInput(params as Parameters<typeof session.sendRealtimeInput>[0]),
      close: () => session.close(),
    });

  } catch (err) {
    console.error('[LiveProxy] Failed to connect to Gemini:', err);
    send({ type: 'error', error: 'ai_connect_failed' });
    clientWs.close(1011, 'AI connection failed');
    destroySession(consultationId);
  }
}

// Rejects text where >10% of characters are outside ASCII + Devanagari (Hindi).
// Catches foreign-language transcription noise (Spanish, Arabic, CJK, etc.).
function isHindiOrEnglish(text: string): boolean {
  if (!text.trim()) return false;
  let foreign = 0;
  for (const char of text) {
    const cp = char.codePointAt(0) ?? 0;
    if (cp > 0x007F && !(cp >= 0x0900 && cp <= 0x097F)) foreign++;
  }
  return foreign / text.length < 0.1;
}

function getKickOffText(moduleAttempted: string): string {
  if (moduleAttempted === 'module_2_task1') {
    return 'Start the conversation. The introduction is already done — you have seen the RM and discussed your wall. The RM has now shown you all three design options (Blush Flutes, Beige Warp, Blush Arc) and you have looked at them. Begin speaking first as the confused customer — express your genuine indecision about which design to choose.';
  }
  if (moduleAttempted === 'module_3_task1') {
    return 'Start the conversation. Introduction, rapport building and budget discovery are already done. You have seen the final design for your wall and you genuinely love it. Begin speaking first — warmly appreciate the design (in your own fresh words), then gently start postponing the booking by saying you need to discuss it with your family. Do not reveal that you are the actual decision maker.';
  }
  if (moduleAttempted === 'module_3_task2') {
    return 'Start the conversation. Introduction, rapport building and budget discovery are already done. You have seen the final design for your wall and you are reasonably satisfied with it — not overly impressed, just okay with it. Begin speaking first — give a neutral-positive reaction to the design (in your own fresh words), then naturally ask for a day or two of time before committing. Do not reveal that you are the actual decision maker, and do not reveal your upcoming event unless the RM discovers it.';
  }
  if (moduleAttempted === 'module_3_task3') {
    return 'Start the conversation. Introduction, rapport building and budget discovery are already done. You have seen the final design for your wall and you genuinely love it — you do not want any changes. Begin speaking first with ONE short, natural opener (1-2 sentences total): briefly appreciate the design and, in the same breath, ask for a day or two before deciding. Say it ONCE — do not repeat, rephrase, restart, or re-state the same point — then stop and wait for the RM. Do not reveal upfront that the price feels high (the RM must discover it), and do not reveal that you are the actual decision maker.';
  }
  if (moduleAttempted === 'module_4_task1') {
    return 'Start the conversation. Introduction, rapport building and design discovery are already done. The design is selected for your wall and you are okay with it — your only concern is price versus the local market, which you have already explored. Begin speaking first with ONE short, natural opener (1-2 sentences) that goes straight to price — ask the rough cost of a single panel / the cheapest panel rate (in your own fresh words). Keep it brief, then stop and wait for the RM. Do not reveal upfront that you think the market is cheaper — that comes out only after the RM gives you a panel price.';
  }
  if (moduleAttempted === 'module_5_task1') {
    return 'The conversation is already in progress — the RM has just finished examining your wall. Ask them what panel options they have — something like "aapke paas konse konse panels hain, kya kya options hain mere liye?" Do NOT mention Nio yourself. Do NOT greet. One short question only, then stop and wait for the RM to answer.';
  }
  return 'Start the conversation. The RM has just arrived at your door for the scheduled home consultation. Greet them naturally and lead them inside.';
}

function kickOffConversation(session: Session, moduleAttempted: string) {
  try {
    session.sendClientContent({
      turns: [{
        role: 'user',
        parts: [{ text: getKickOffText(moduleAttempted) }],
      }],
      turnComplete: true,
    });
  } catch (err) {
    console.error('[LiveProxy] Failed to kick off conversation:', err);
  }
}
