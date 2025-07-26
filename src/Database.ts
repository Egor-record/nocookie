import { MongoClient } from 'mongodb';
import { MongoClient, ServerApiVersion } from ('mongodb');

export class Database {
  private readonly uri: string;
  private client: MongoClient;

  constructor() {
    this.uri = process.env.MONGO_URI
    this.client = new MongoClient(uri, {
        serverApi: {
          version: ServerApiVersion.v1,
          strict: true,
          deprecationErrors: true,
        }
    });
  }

  public async run(): Promise<void> {
    try {
      await this.client.connect();
      // Send a ping to confirm a successful connection
      await client.db("admin").command({ ping: 1 });
      console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } catch (error) {
      console.error('❌ MongoDB connection failed:', error);
    } finally {
        await this.client.close();
    }
  }

  public getClient(): MongoClient {
    return this.client;
  }

  public async close(): Promise<void> {
    await this.client.close();
    console.log('🔌 MongoDB connection closed');
  }
}