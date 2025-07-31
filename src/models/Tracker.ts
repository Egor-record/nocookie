import { VisitorData, TrackerData } from '../types'
import { Db } from 'mongodb';
import { UserLocation } from '../types'
  
export class Tracker {
  public name: string;
  public userId: string;
  public createdAt: Date;
  public db: Db

  constructor(data: TrackerData, db: Db) {
    this.name = data.name;
    this.userId = data.userId;
    this.createdAt = data.createdAt;
    this.db = db
  }
  
  async addVisitor(location: UserLocation, pageUrl: string, trackerId: number, sessionId: number, db: Db) {
    const visitorsCollection = db.collection<VisitorData>('Visitors');
    const visitor: VisitorData = {
      date: new Date(),
      location,
      pageUrl,
      trackerId,
      sessionId
    };
    await visitorsCollection.insertOne(visitor);
  }
}