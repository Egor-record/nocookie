import { VisitorData } from './types'
import { Database } from '../Database';
import { Db } from 'mongodb';
  
export class Tracker {

  public id: string;
  public name: string;
  public userId: string;
  public createdAt: Date;

  constructor(data: TrackerData, db) {
    this.id = data.id;
    this.name = data.name;
    this.userId = data.userId;
    this.createdAt = data.createdAt;
  }
  
  async addVisitor(location: string, pageUrl: string, db: Db) {
    const db = Database.getClient();
    const visitorsCollection = db.collection<Visitor>('Visitors');

    const visitor: Visitor = {
      date: new Date(),
      location,
      pageUrl,
      trackerId: this.id,
    };

    await visitorsCollection.insertOne(visitor);
  }
  
  getVisitors() {
      return this.visitors;
  }
}