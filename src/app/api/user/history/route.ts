import { NextResponse } from "next/server";
import { addHistory } from "@/lib/storageHub";

export async function POST(req: Request) {
  try {
    const { userId, songId } = await req.json();

    if (!userId || !songId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Hub will decide whether to save to MongoDB or Local Users file
    await addHistory(userId, songId);

    return NextResponse.json({ message: "History updated" });

  } catch (error: any) {
    console.error("HISTORY ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
