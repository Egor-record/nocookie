import http, { IncomingMessage, ServerResponse } from 'http';
import geoip from 'geoip-lite';
import { generateBlackDotPNG, handleWatchTracking } from './helpers'
import { Database } from './Database'
import { TrackerManager } from './models/TrackerManager'
import { ParsedTrackerUrl, UserLocation } from './types'


export class Server {
    private port: number;
    private trackerManager: TrackerManager;
    public db: Database

    constructor(port: number, db: Database) {
        this.port = port;
        this.db = db;
        this.trackerManager = new TrackerManager(db);
    }
  
    private parseURL(req: IncomingMessage) : ParsedTrackerUrl {
        const host = req.headers.host || 'localhost';
        const url = new URL(req.url || '', `http://${host}`);

        const pathnameParts = url.pathname.split('/').filter(Boolean);
        const sessionId = Number(url.searchParams.get('sessionId')) || 0;
        if (pathnameParts?.length === 3 && pathnameParts[0] === 'watch') {
            return {
                isTrackerRequest: true,
                trackerId: +pathnameParts[1],
                pageName: pathnameParts[2],
                sessionId,
            };
        } else {
            return {
                isTrackerRequest: false
            }
        }
    }

    public listen(): void {
        const server = http.createServer(async (req: IncomingMessage, res: ServerResponse) => {
            const parsedRequest = this.parseURL(req)
            if (!parsedRequest.isTrackerRequest) {
                res.writeHead(200, { 'Content-Type': 'text/plain' });
                res.end('Main Page');
                return
            }
            let location: UserLocation = {
                city: '',
                country: ''
            };
            const { trackerId, pageName, sessionId } = parsedRequest;
            const ip = (req.headers['x-forwarded-for'] || req.socket.remoteAddress || '') as string;
            const geo = geoip.lookup(ip);

            if (geo) {
                location = {
                    city: geo.city,
                    country: geo.country
                }
            }

            try {
                await handleWatchTracking(
                    this.trackerManager, 
                    Number(trackerId) || 0, 
                    Number(sessionId) || 0, 
                    pageName || "", 
                    location)
            } catch (e) {
                console.error(e)
            }

            try {
                const buffer = await generateBlackDotPNG();
                res.writeHead(200, {
                    'Content-Type': 'image/png',
                    'Content-Length': buffer.length,
                    });
                res.end(buffer);
                return
            } catch (err) {
                console.error(err)
                res.writeHead(500);
                res.end('Failed to generate image');
                return
            }
        });

        server.listen(this.port, () => {
            console.log(`Server is listening on http://localhost:${this.port}`);
        });
  }
}