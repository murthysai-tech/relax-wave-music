import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Song from "@/models/Song";
import fs from "node:fs/promises";
import path from "node:path";

// Helper to check for Auth
const checkAuth = (req: Request) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return false;
  return true;
};

export async function GET() {
  try {
    await dbConnect();
    const songs = await Song.find({}).sort({ createdAt: -1 });
    
    // Sync check: verify if uploaded files still exist on the PC
    const validSongs = [];
    for (const song of songs) {
      let isFileMissing = false;
      
      // Check audio file
      if (song.audio && song.audio.startsWith("/uploads/")) {
        const filePath = path.join(process.cwd(), "public", song.audio);
        try {
          await fs.access(filePath);
        } catch {
          isFileMissing = true;
        }
      }
      
      // If file is missing, remove from DB and skip from list
      if (isFileMissing) {
        console.log(`🗑️ Auto-deleting ${song.name} from DB as file is missing on PC.`);
        await Song.findByIdAndDelete(song._id);
      } else {
        validSongs.push(song);
      }
    }
    
    return NextResponse.json(validSongs);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    if (!checkAuth(req)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name, artist_name, audio, image, album_name, language, genre } = body;

    if (!name || !artist_name || !audio || !image || !language) {
      return NextResponse.json({ error: "Missing required fields (Name, Artist, Audio, Image, and Language are all required)" }, { status: 400 });
    }

    await dbConnect();
    const song = await Song.create({
      name,
      artist_name,
      audio,
      image,
      album_name,
      language,
      genre
    });

    return NextResponse.json(song, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing song ID" }, { status: 400 });
    }

    await dbConnect();
    const song = await Song.findById(id);
    
    if (song) {
      // If it's an uploaded file, delete it from the filesystem
      if (song.audio && song.audio.startsWith("/uploads/")) {
        try {
          const filePath = path.join(process.cwd(), "public", song.audio);
          await fs.unlink(filePath);
        } catch (e) {
          console.error("Failed to delete audio file:", e);
        }
      }
      if (song.image && song.image.startsWith("/uploads/")) {
        try {
          const filePath = path.join(process.cwd(), "public", song.image);
          await fs.unlink(filePath);
        } catch (e) {
          console.error("Failed to delete image file:", e);
        }
      }
      
      await Song.findByIdAndDelete(id);
    }

    return NextResponse.json({ message: "Song and associated files deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing song ID" }, { status: 400 });
    }

    const body = await req.json();
    await dbConnect();
    const updatedSong = await Song.findByIdAndUpdate(id, body, { new: true });

    if (!updatedSong) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    return NextResponse.json(updatedSong);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
