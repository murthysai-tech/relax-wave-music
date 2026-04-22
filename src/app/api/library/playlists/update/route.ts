import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { updatePlaylist } from "@/lib/storageHub";
 
const JWT_SECRET = process.env.JWT_SECRET || "RelaxWaveSecret123";

const getUserId = (req: Request) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) return null;
  const token = authHeader.split(" ")[1];
  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);
    return decoded.id || decoded.userId;
  } catch (error) {
    return null;
  }
};

export async function PUT(req: Request) {
  try {
    const userId = getUserId(req);
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, tracks } = await req.json();
    if (!name || !tracks) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const playlist = await updatePlaylist(name, userId, tracks);
    return NextResponse.json(playlist);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
