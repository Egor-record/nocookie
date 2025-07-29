import { Server } from './Server';
import { Database } from './Database';
import dotenv from 'dotenv';
dotenv.config();

const db = new Database();

async function main() {
    await db.run().catch(console.dir);

    const PORT = Number(process.env.PORT);
    if (isNaN(PORT)) {
        throw new Error('PORT environment variable is not set or is not a number.');
    }

    const server = new Server(PORT, db);
    server.listen();
}
  
main().catch(console.error)

