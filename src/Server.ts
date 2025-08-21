import http, { IncomingMessage, ServerResponse } from 'http';

import { handleWatchTracking, getLocation } from './helpers'
import { Database } from './Database'
import { TrackerManager } from './models/TrackerManager'
import { ParsedTrackerUrl } from './types'


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
        if (pathnameParts?.length === 3 && pathnameParts[0] === 'api') {
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
    
            const { trackerId, pageName, sessionId } = parsedRequest;     
            const location = getLocation(req);
            
            try {
                await handleWatchTracking(
                    this.trackerManager, 
                    Number(trackerId) || 0, 
                    Number(sessionId) || 0, 
                    pageName || "", 
                    location
                )
            } catch (e) {
                console.error(e)
            }

            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Logged');
            return
        });

        server.listen(this.port, () => {
            console.log(`Server is listening on http://localhost:${this.port}`);
        });
  }
}