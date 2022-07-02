import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

let db = null;
const mongoClient = new MongoClient(process.env.MONGO_URL);

try {
    await mongoClient.connect();
    db = mongoClient.db(process.env.BANCO);
    console.log("Database online")
} catch (error) {
    console.log("It was not possible to connect with the database!",error);
}

export default db