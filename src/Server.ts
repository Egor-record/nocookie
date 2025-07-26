import http, { IncomingMessage, ServerResponse } from 'http';
import { parse } from 'url';
import { generateBlackDotPNG } from './helpers'
import { TrackerManager } from './TrackerManager';

export class Server {
  private port: number;
  private trackerManager = new TrackerManager();

  constructor(port: number) {
    this.port = port;
  }

  private async isWatchTracker(req: IncomingMessage, res: ServerResponse): boolean {
    const url = parse(req.url || '', true);
    const parts = url.pathname?.split('/').filter(Boolean);

    if (parts?.[0] === 'watch' && parts.length === 3) {
        try {
            const id = parts[1];
            const pageName = parts[2];

            const buffer = await generateBlackDotPNG();

            const location = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
            const tracker = this.trackerManager.getOrCreateTracker(id);
            tracker.addVisitor(location.toString(), pageName);
      
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
        res.end('Hello from custom Server class!');
      }
      console.dir(this.trackerManager.getAllTrackers(), { depth: null });
    });

    server.listen(this.port, () => {
      console.log(`Server is listening on port ${this.port}`);
    });
  }
}