import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getUserPlaylists, createPlaylist } from "@/lib/storageHub";
 
const JWT_SECRET = process.env.JWT_SECRET || "RelaxWaveSecret123";

// Helper to get user ID from token
const getUserId = (req: Request) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    return decoded.id || decoded.userId; // handle different payload structures
  } catch (error) {
    return null;
  }
};

export async function GET(req: Request) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Hub will lookup in MongoDB, then fall back to local playlists.json
    const playlists = await getUserPlaylists(userId);
    return NextResponse.json(playlists);
  } catch (error: any) {
    console.error("GET PLAYLISTS ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, tracks = [], username } = await req.json();
    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Hub will save to MongoDB if online, otherwise to local file
    const playlist = await createPlaylist({
      name,
      userId,
      username,
      tracks,
    });

    return NextResponse.json(playlist, { status: 201 });
  } catch (error: any) {
    console.error("POST PLAYLISTS ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
