import { PNG } from 'pngjs';
import { Buffer } from 'buffer';
import { TrackerManager } from './models/TrackerManager'

export async function generateBlackDotPNG(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    const png = new PNG({ width: 1, height: 1 });
    png.data[0] = 255;
    png.data[1] = 0;
    png.data[2] = 0;
    png.data[3] = 255;

    const chunks: Buffer[] = [];

    png.pack()
      .on('data', (chunk) => chunks.push(chunk))
      .on('end', () => resolve(Buffer.concat(chunks)))
      .on('error', reject);
  });
}

export async function handleWatchTracking(
    trackerManager: TrackerManager,
    id: number,
    sessionId: number,
    pageName: string,
    location: string
  ): Promise<void> {
    let tracker: Tracker | null = null;
    const db = trackerManager.db  
    try {
      tracker = await trackerManager.getTracker(id);
    } catch (error) {
      console.error('Failed to get tracker:', error);
    }
    
    if (tracker) {
     await tracker.addVisitor(location.toString(), pageName, +id, +sessionId, db);
    }
}