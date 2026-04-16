import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/db";
import Song from "@/models/Song";

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
    return NextResponse.json(songs);
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
    const { name, artist_name, audio, image, album_name } = body;

    if (!name || !artist_name || !audio || !image) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    await dbConnect();
    const song = await Song.create({
      name,
      artist_name,
      audio,
      image,
      album_name,
    });

    return NextResponse.json(song, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
