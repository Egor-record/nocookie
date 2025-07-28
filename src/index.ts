import { Server } from './Server';
import { Database } from './Database';
import dotenv from 'dotenv';
dotenv.config();

const db = new Database();

async function main() {
    await db.run().catch(console.dir);
    const server = new Server(process.env.PORT, db);
    server.listen();
}
  
main().catch(console.error)

