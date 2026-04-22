const mongoose = require('mongoose');
require('dotenv').config();

async function testConnection() {
  console.log("Checking MONGODB_URI...");
  const uri = process.env.MONGODB_URI;
  
  if (!uri) {
    console.error("No MONGODB_URI found in .env");
    process.exit(1);
  }

  console.log("Attempting to connect to MongoDB...");
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 5000
    });
    console.log("✅ SUCCESS: Successfully connected to MongoDB Atlas!");
    
    // Check if we can see the collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log("Collections in DB:", collections.map(c => c.name));
    
    await mongoose.disconnect();
    console.log("Disconnected successfully.");
  } catch (error) {
    console.error("❌ FAILURE: Could not connect to MongoDB.");
    console.error("Error Detail:", error.message);
    if (error.message.includes("IP not whitelisted") || error.message.includes("timeout")) {
      console.log("\nTIP: Ensure your current IP address is added to the MongoDB Atlas Network Access whitelist.");
    }
  }
}

testConnection();
