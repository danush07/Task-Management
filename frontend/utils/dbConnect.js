import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGO_URI;


let cachedDb = null;

export async function dbConnect() {
  if (cachedDb) {
    return cachedDb;
  }

  const db = await mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  cachedDb = db;

  return db;
}
