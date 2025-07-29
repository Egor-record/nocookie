import { MongoClient, ServerApiVersion, Db } from 'mongodb';

export class Database {
    private readonly uri: string;
    private client: MongoClient;
    private db: Db | null;

    constructor() {
        this.uri = process.env.MONGO_URI || '';
        this.client = new MongoClient(this.uri, {
            serverApi: {
                version: ServerApiVersion.v1,
                strict: true,
                deprecationErrors: true,
            }
        });
        this.db = null
    }

    public async run(): Promise<void> {
        try {
            await this.client.connect()
            await this.client.db("NotCookie").command({ ping: 1 })
            console.log("Pinged your deployment. You successfully connected to MongoDB!")
            this.db = this.client.db("NotCookie")
        } catch (error) {
            console.error('❌ MongoDB connection failed:', error);
        }
    }

    getDataBase(): Db {
        if (!this.db) throw new Error('Database not connected. Call run() first.');
        return this.db;
    }

    public async close(): Promise<void> {
        await this.client.close();
        console.log('🔌 MongoDB connection closed');
    }
}