import { Tracker } from './Tracker';
import { Database } from '../Database';
import { TrackerData } from '../types'

export class TrackerManager { 
  constructor(public db: Database) {
    this.db = db.getDataBase()
    this.collection = this.db.collection('Trackers')
  }

  public async getTracker(trackerId: number): Promise<Tracker> {
    const trackerDoc = await this.collection.findOne({ "trackerId": trackerId });
    if (!trackerDoc) {
      throw new Error(`Tracker with id ${trackerId} not found`);
    }
    return new Tracker(trackerDoc, this.db);
  }

  public async createTracker(trackerId: string, name: string, userId: string): Promise<Tracker> {
    const trackerDoc = await this.collection.findOne({ trackerId });
    let trackerData: TrackerData;

    if (trackerDoc) {
      trackerData = {
        name: trackerDoc.name,
        userId: trackerDoc.userId,
        createdAt: new Date(trackerDoc.createdAt),
        trackerId: trackerDoc.trackerId
      };
    } else {
      trackerData = {
        name,
        userId,
        createdAt: new Date(),
        trackerId: Number(id)
      };
    }
  
    await this.collection.insertOne(trackerData);
  
    return new Tracker(trackerData);
  }
}