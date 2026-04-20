import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import Song from "@/models/Song";

export async function POST(req: Request) {
  try {
    const { userId, songId } = await req.json();

    if (!userId || !songId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await dbConnect();

    // Verify song exists
    const song = await Song.findById(songId);
    if (!song) {
      return NextResponse.json({ error: "Song not found" }, { status: 404 });
    }

    // Add to listening history (push to array)
    // Keep only last 50 songs to keep DB clean
    await User.findByIdAndUpdate(userId, {
      $push: {
        listeningHistory: {
          $each: [{ songId, playedAt: new Date() }],
          $slice: -50, // Keep last 50
          $sort: { playedAt: -1 }
        }
      }
    });

    return NextResponse.json({ message: "History updated" });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
