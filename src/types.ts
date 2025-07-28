export type VisitorData = {
    date: Date;
    location: string;
    pageUrl: string;
    trackerId: number;
    sessionId: number;
};

export interface TrackerData {
    name: string;
    userId: string;
    createdAt: Date;
    trackerId: number
}