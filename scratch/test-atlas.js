import dbConnect from '../src/lib/db.ts';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  console.log("Starting DB connection test...");
  try {
    const conn = await dbConnect();
    console.log("Connection state:", conn.readyState);
    if (conn.readyState === 1) {
      console.log("SUCCESS: Connected to MongoDB Atlas!");
    } else {
      console.log("FAILURE: Connection established but state is not 1.");
    }
  } catch (e) {
    console.error("ERROR: Could not connect to MongoDB Atlas.");
    console.error(e.message);
  }
  process.exit();
}

test();
