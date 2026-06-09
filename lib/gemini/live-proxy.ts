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

const LIVE_MODEL = 'gemini-2.5-flash-native-audio-latest';

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
        thinkingConfig: { thinkingBudget: 0 },
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
          if (geminiSession) kickOffConversation(geminiSession);
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
            if (sc.inputTranscription?.text) {
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
          send({ type: 'error', error: 'Gemini session error. Please try again.' });
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
      kickOffConversation(geminiSession);
    }

    setGeminiSession(consultationId, {
      send: (params) => session.sendRealtimeInput(params as Parameters<typeof session.sendRealtimeInput>[0]),
      close: () => session.close(),
    });

  } catch (err) {
    console.error('[LiveProxy] Failed to connect to Gemini:', err);
    send({ type: 'error', error: 'Failed to connect to AI service. Please try again.' });
    clientWs.close(1011, 'AI connection failed');
    destroySession(consultationId);
  }
}

function kickOffConversation(session: Session) {
  try {
    session.sendClientContent({
      turns: [{
        role: 'user',
        parts: [{ text: 'Start the conversation. The RM has just arrived at your door for the scheduled home consultation. Greet them naturally and lead them inside.' }],
      }],
      turnComplete: true,
    });
  } catch (err) {
    console.error('[LiveProxy] Failed to kick off conversation:', err);
  }
}
