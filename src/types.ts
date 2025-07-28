export type VisitorData = {
    date: Date;
    location: string;
    pageUrl: string;
    trackerId: string;
};

export interface TrackerData {
    id: string;
    name: string;
    userId: string;
    createdAt: Date;
}