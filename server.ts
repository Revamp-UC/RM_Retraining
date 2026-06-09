import { config as loadEnv } from 'dotenv';
loadEnv({ path: '.env.local' });
import { createServer } from 'http';
import next from 'next';
import { WebSocketServer } from 'ws';
import { handleConsultationStream } from './lib/gemini/live-proxy';
import type { IncomingMessage } from 'http';
import type WebSocket from 'ws';

const dev = process.env.NODE_ENV !== 'production';
const hostname = process.env.HOST ?? 'localhost';
const port = parseInt(process.env.PORT ?? '3000', 10);

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer((req, res) => {
    handle(req, res);
  });

  const wss = new WebSocketServer({ noServer: true });

  httpServer.on('upgrade', (req: IncomingMessage, socket, head) => {
    const pathname = req.url?.split('?')[0] ?? '/';
    console.log('[Server] WS upgrade:', pathname);

    if (pathname === '/api/consultation/stream') {
      console.log('[Server] Handling consultation stream upgrade');
      wss.handleUpgrade(req, socket as never, head, (ws: WebSocket) => {
        wss.emit('connection', ws, req);
        handleConsultationStream(ws, req).catch((err) => {
          console.error('[WS] Unhandled error in consultation stream:', err);
          ws.close(1011, 'Internal error');
        });
      });
    }
    // Don't destroy other upgrades (HMR, etc.) — Next.js handles them internally
  });

  httpServer.listen(port, () => {
    console.log(`> RM Retraining ready on http://${hostname}:${port}`);
    console.log(`> Mode: ${dev ? 'development' : 'production'}`);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    httpServer.close(() => process.exit(0));
  });
  process.on('SIGINT', () => {
    httpServer.close(() => process.exit(0));
  });
});
