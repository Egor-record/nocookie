import { Tracker } from './Tracker';
import { Database } from '../Database';

export class TrackerManager { 
  constructor(public db: Database) {
    this.db = db.getDataBase().collection('Trackers')
  }

  public async getTracker(trackerId: number): Promise<Tracker> {
    const trackerDoc = await this.db.findOne({ "tracker": trackerId });
    if (!trackerDoc) {
      throw new Error(`Tracker with id ${trackerId} not found`);
    }
    return new Tracker(trackerDoc);
  }

  public async createTracker(id: string, name: string, userId: string): Promise<Tracker> {
    const trackerDoc = await this.db.findOne({ id });
    let trackerData: TrackerData;
    if (trackerDoc) {
      trackerData = {
        id: trackerDoc.id,
        name: trackerDoc.name,
        userId: trackerDoc.userId,
        createdAt: trackerDoc.createdAt,
      };
    } else {
      trackerData = {
        id,
        name,
        userId,
        createdAt: new Date(),
      };
  
      await db.collection('trackers').insertOne(trackerData);
    }
  
    return new Tracker(trackerData);
  }

  getAllTrackers() {
    return [...this.trackers.values()];
  }
}