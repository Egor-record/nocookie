export interface VisitorData {
    date: Date;
    location: UserLocation
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

export interface ParsedTrackerUrl {
    isTrackerRequest: boolean,
    trackerId?: number;
    pageName?: string;
    sessionId?: number;
}

export interface UserLocation { 
    city: string;
    country: string;
}