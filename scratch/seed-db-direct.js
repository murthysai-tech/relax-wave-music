import mongoose from "mongoose";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error("MONGODB_URI is missing");
  process.exit(1);
}

const SongSchema = new mongoose.Schema({
  name: String,
  artist_name: String,
  image: String,
  audio: String,
  album_name: String,
  genre: String,
  language: String,
  createdAt: { type: Date, default: Date.now },
});

const Song = mongoose.models.Song || mongoose.model("Song", SongSchema);

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB");

    const SAMPLE_SONGS = [
      {
        name: "Butta Bomma",
        artist_name: "Armaan Malik",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
        album_name: "Ala Vaikunthapurramuloo",
        language: "Telugu",
        genre: "Pop"
      },
      {
        name: "Kesariya",
        artist_name: "Arijit Singh",
        image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
        album_name: "Brahmastra",
        language: "Hindi",
        genre: "Romance"
      },
      {
        name: "Blinding Lights",
        artist_name: "The Weeknd",
        image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&auto=format&fit=crop",
        audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
        album_name: "After Hours",
        language: "English",
        genre: "Synthwave"
      }
    ];

    await Song.insertMany(SAMPLE_SONGS);
    console.log("Seeding successful!");
    process.exit(0);
  } catch (err) {
    console.error("Seeding failed:", err);
    process.exit(1);
  }
}

seed();
