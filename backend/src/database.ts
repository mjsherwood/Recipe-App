import { MongoClient, Db } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config({ path: './backend/src/.env' });

console.log('Current working directory:', process.cwd());

let db: Db;

const MONGO_URI = process.env.MONGODB_URI || '';

if (!MONGO_URI) {
    console.error('Missing MONGODB_URI');
} else {
    console.log('Connecting to MongoDB');  
}

const initDb = async () => {
    if (db) {
        console.log('DB is already initialized!');
        return db;
    }
    try {
        const client = await MongoClient.connect(MONGO_URI);
        db = client.db();
        console.log('Connected to MongoDB');
        return db;
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        throw error;
    }
};

const getDb = () => {
    if (!db) {
        console.error('DB not initialized');
        throw new Error('Db not initialized');
    }
    return db;
};

export { initDb, getDb };