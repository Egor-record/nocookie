import { Tracker } from './Tracker';
import { Database } from '../Database';
import { TrackerData } from '../types'
import { Collection, Db } from 'mongodb';

export class TrackerManager { 
  private collection: Collection<TrackerData>;
  private _db: Db;

  constructor(public database: Database) {
    this._db = database.getDataBase()
    this.collection = this._db.collection('Trackers')
  }

  public async getTracker(trackerId: number): Promise<Tracker> {
    const trackerDoc = await this.collection.findOne({ "trackerId": trackerId });
    if (!trackerDoc) {
      throw new Error(`Tracker with id ${trackerId} not found`);
    }
    return new Tracker(trackerDoc, this.db);
  }

  public async createTracker(trackerId: number, name: string, userId: string): Promise<Tracker> {
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
        trackerId
      };
    }
  
    await this.collection.insertOne(trackerData);
  
    return new Tracker(trackerData, this.db);
  }

  public get db(): Db {
    return this._db;
  }
}