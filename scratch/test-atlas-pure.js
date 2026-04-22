const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

// Basic .env parser
const env = fs.readFileSync(path.join(__dirname, '../.env'), 'utf8');
const MONGODB_URI = env.match(/MONGODB_URI=(.*)/)[1].trim();

console.log("Testing connection to:", MONGODB_URI.split('@').pop());

mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 10000 })
  .then(() => {
    console.log("✅ SUCCESS: Connected to MongoDB Atlas!");
    process.exit(0);
  })
  .catch(err => {
    console.error("❌ FAILURE:", err.message);
    process.exit(1);
  });
