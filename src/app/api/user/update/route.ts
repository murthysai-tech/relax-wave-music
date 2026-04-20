import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { updateUser } from "@/lib/storageHub";

const JWT_SECRET = process.env.JWT_SECRET || "RelaxWaveSecret123";

/**
 * Update user profile (specifically phone number for social logins)
 */
export async function POST(req: Request) {
  try {
    const { userId, phoneNumber } = await req.json();

    if (!userId || !phoneNumber) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Hub will look in MongoDB first, then Local File
    const user = await updateUser(userId, { phoneNumber });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Since they now have a phone number, give them a token
    const token = jwt.sign(
      { userId: user._id || user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ 
      message: "Profile updated successfully", 
      token,
      user: { 
        id: user._id || user.id, 
        username: user.username, 
        email: user.email, 
        phoneNumber: user.phoneNumber 
      } 
    });

  } catch (error: any) {
    console.error("UPDATE ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
