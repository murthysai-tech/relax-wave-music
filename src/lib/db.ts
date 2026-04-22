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
      serverSelectionTimeoutMS: 30000, // 30 seconds for cloud
      connectTimeoutMS: 30000,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
      console.log("✅ MONGODB CONNECTED SUCCESSFULLY TO ATLAS");
      return mongoose;
    });
  }

  try {
    // Add a race condition to ensure we don't wait too long
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Database connection timeout after 35 seconds")), 35000)
    );

    cached.conn = await Promise.race([cached.promise, timeoutPromise]);
  } catch (e: any) {
    cached.promise = null;
    console.error("❌ MONGODB CONNECTION FAILED:", e.message);
    console.warn("⚠️ Entering Offline Mode (Data will be saved to local JSON files).");
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
