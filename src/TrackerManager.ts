import { Tracker } from './Tracker';

export class TrackerManager {
  private trackers = new Map<string, Tracker>();

  getOrCreateTracker(id: string): Tracker {
    if (!this.trackers.has(id)) {
      this.trackers.set(id, new Tracker(id));
    }
    return this.trackers.get(id)!;
  }

  getAllTrackers() {
    return [...this.trackers.values()];
  }
}