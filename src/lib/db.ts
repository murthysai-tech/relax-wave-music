import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

/**
 * Global is used here to maintain a cached connection across hot reloads in development.
 * This prevents connections from growing exponentially during API Route usage.
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 3000, // Fail fast (3 seconds) if DB is unreachable
      connectTimeoutMS: 5000,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    // Add a race condition to ensure we don't wait too long
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Database connection timeout")), 4000)
    );

    cached.conn = await Promise.race([cached.promise, timeoutPromise]);
  } catch (e) {
    cached.promise = null;
    console.warn("MONGODB CONNECTION FAILED. Entering Offline Mode.");
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
