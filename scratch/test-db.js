import mongoose from "mongoose";

const MONGODB_URI = "mongodb+srv://murthysai79_db_user:Murthysai%402025@cluster0.7nhcbsg.mongodb.net/test?retryWrites=true&w=majority";

async function testConnection() {
  console.log("Testing MongoDB Connection...");
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("SUCCESS: Connected to MongoDB!");
    await mongoose.disconnect();
  } catch (err) {
    console.error("FAILURE: Could not connect to MongoDB.");
    console.error(err);
  }
}

testConnection();
