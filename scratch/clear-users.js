import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env' });

async function clearUsers() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected!');

    const result = await mongoose.connection.db.collection('users').deleteMany({});
    console.log(`Successfully deleted ${result.deletedCount} users.`);

    await mongoose.connection.close();
    console.log('Disconnected.');
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

clearUsers();
