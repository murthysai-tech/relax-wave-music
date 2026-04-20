import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import Song from "@/models/Song";

const SAMPLE_SONGS = [
  // Telugu Songs
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
    name: "Samajavaragamana",
    artist_name: "Sid Sriram",
    image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&auto=format&fit=crop",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    album_name: "Ala Vaikunthapurramuloo",
    language: "Telugu",
    genre: "Melody"
  },
  // Hindi Songs
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
    name: "Raataan Lambiyan",
    artist_name: "Jubin Nautiyal",
    image: "https://images.unsplash.com/photo-1459749411177-042180ce673c?w=800&auto=format&fit=crop",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    album_name: "Shershaah",
    language: "Hindi",
    genre: "Soulful"
  },
  // English Songs
  {
    name: "Blinding Lights",
    artist_name: "The Weeknd",
    image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&auto=format&fit=crop",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    album_name: "After Hours",
    language: "English",
    genre: "Synthwave"
  },
  {
    name: "Shape of You",
    artist_name: "Ed Sheeran",
    image: "https://images.unsplash.com/photo-1514525253361-bee871846439?w=800&auto=format&fit=crop",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    album_name: "Divide",
    language: "English",
    genre: "Pop"
  }
];

export async function GET() {
  try {
    await dbConnect();
    
    // Clear existing songs (optional, but good for seeding)
    // await Song.deleteMany({});
    
    const count = await Song.countDocuments();
    if (count > 0) {
      return NextResponse.json({ message: "Database already seeded", count });
    }

    const createdSongs = await Song.insertMany(SAMPLE_SONGS);
    
    return NextResponse.json({ 
      message: "Seeding successful", 
      count: createdSongs.length,
      songs: createdSongs 
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
