const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function wipe() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Connected to DB.");
    
    // Delete all documents in 'songs' collection
    const result = await mongoose.connection.db.collection('songs').deleteMany({});
    console.log(`Deleted ${result.deletedCount} songs from database.`);

    // Clear uploads directory
    const uploadsDir = path.join(__dirname, '../public/uploads');
    if (fs.existsSync(uploadsDir)) {
      const files = fs.readdirSync(uploadsDir);
      for (const file of files) {
        fs.unlinkSync(path.join(uploadsDir, file));
      }
      console.log(`Deleted ${files.length} files from uploads directory.`);
    }

    console.log("Wipe complete.");
  } catch (err) {
    console.error("Error:", err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

wipe();
