import { VisitorData } from './types'
import { Database } from '../Database';
import { Db } from 'mongodb';
  
export class Tracker {

  public name: string;
  public userId: string;
  public createdAt: Date;
  public db: Db

  constructor(data: TrackerData, db) {
    this.name = data.name;
    this.userId = data.userId;
    this.createdAt = data.createdAt;
    this.db = db
  }
  
  async addVisitor(location: string, pageUrl: string, id: number, db: Db) {
    const visitorsCollection = db.collection<Visitor>('Visitors');
    
    const visitor: VisitorData = {
      date: new Date(),
      location,
      pageUrl,
      trackerId: id,
    };
    await visitorsCollection.insertOne(visitor);
  }
  
  getVisitors() {
      return this.visitors;
  }
}