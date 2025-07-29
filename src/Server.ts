import http, { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { generateBlackDotPNG, handleWatchTracking } from './helpers'
import { Database } from './Database'
import { TrackerManager } from './models/TrackerManager'

export class Server {
  private port: number;
  private trackerManager: TrackerManager;
  public db: Database

  constructor(port: number, db: Database) {
    this.port = port;
    this.db = db;
    this.trackerManager = new TrackerManager(db);
  }

  private async isWatchTracker(req: IncomingMessage, res: ServerResponse): Promise<boolean> {
    const url = parse(req.url || '', true);
    const parts = url.pathname?.split('/').filter(Boolean);
    const sessionIdRaw = url.query.sessionId;
    const sessionId = isNaN(Number(sessionIdRaw)) ? 0 : Number(sessionIdRaw)

    if (parts?.[0] === 'watch' && parts.length === 3) {
        try {
            const id = parts[1];
            const pageName = parts[2];

            const buffer = await generateBlackDotPNG();

            const location = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';

            await handleWatchTracking(this.trackerManager, +id, +sessionId, pageName, location.toString());
      
            res.writeHead(200, {
              'Content-Type': 'image/png',
              'Content-Length': buffer.length,
            });
            res.end(buffer);
        } catch (err) {
            console.log(err)
            res.writeHead(500);
            res.end('Failed to generate image');
        }
        return true
    }

    return false;
  }

  public listen(): void {
    const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
      const handledByTracker = await this.isWatchTracker(req, res);
      if (!handledByTracker) {
        res.writeHead(200, { 'Content-Type': 'text/plain' });
        res.end('Main Page');
      }
    });

    server.listen(this.port, () => {
      console.log(`Server is listening on http://localhost:${this.port}`);
    });
  }
}