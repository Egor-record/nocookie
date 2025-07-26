import { VisitorData } from './types'
  
export class Tracker {
    private visitors: VisitorData[] = [];
  
    constructor(public readonly id: string) {}
  
    addVisitor(location: string, pageUrl: string) {
      this.visitors.push({
        date: new Date(),
        location,
        pageUrl,
      });
    }
  
    getVisitors() {
      return this.visitors;
    }
}