import dotenv from "dotenv";
dotenv.config();

import dbConnect from "../src/lib/db";
import Song from "../src/models/Song";
import mongoose from "mongoose";

const dummySongs = [
  {
    name: "Midnight Oasis",
    artist_name: "Lofi Dreamer",
    image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=500",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    language: "English",
    genre: "Chill",
    album_name: "Desert Echoes"
  },
  {
    name: "Telugu Rhythm",
    artist_name: "Deccan Beats",
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=500",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    language: "Telugu",
    genre: "Pop",
    album_name: "Hyderabad Vibes"
  },
  {
    name: "Tamil Serenity",
    artist_name: "Chennai Soul",
    image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=500",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    language: "Tamil",
    genre: "Classical",
    album_name: "Marina Waves"
  },
  {
    name: "Neon Nights",
    artist_name: "Cyber Synth",
    image: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=500",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    language: "English",
    genre: "Electronic",
    album_name: "Future City"
  },
  {
    name: "Hindi Heartbeat",
    artist_name: "Bollywood Pulse",
    image: "https://images.unsplash.com/photo-1459749411177-042180ce673f?q=80&w=500",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3",
    language: "Hindi",
    genre: "Romance",
    album_name: "Dil Se"
  }
];

async function seed() {
  try {
    console.log("🚀 Connecting to MongoDB...");
    // Load .env manually if needed, but dbConnect usually handles it
    await dbConnect();
    
    console.log("🗑️ Clearing existing songs...");
    await Song.deleteMany({});
    
    console.log("🌱 Seeding dummy songs...");
    await Song.insertMany(dummySongs);
    
    console.log("✅ Database seeded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seed();
