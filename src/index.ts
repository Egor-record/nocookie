import { Server } from './Server';
import { Database } from './Database';
import dotenv from 'dotenv';
dotenv.config();

const db = new Database();
const server = new Server(process.env.PORT);

async function main() {
    await db.run().catch(console.dir);
    server.listen();
}
  
main();

