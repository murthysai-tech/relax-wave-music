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
    await mongoose.connect(uri);
    console.log("✅ SUCCESS: Successfully connected to MongoDB Atlas!");
    
    // Get replica set name
    const status = await mongoose.connection.db.admin().command({ isMaster: 1 });
    console.log("Replica Set Name:", status.setName);
    
    await mongoose.disconnect();
    console.log("Disconnected successfully.");
  } catch (error) {
    console.error("❌ FAILURE: Could not connect.");
    console.error("Error Detail:", error.message);
  }
}

testConnection();
