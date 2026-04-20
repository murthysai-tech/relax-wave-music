import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

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

    await dbConnect();

    const user = await User.findByIdAndUpdate(
      userId,
      { phoneNumber },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Since they now have a phone number, give them a token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ 
      message: "Profile updated successfully", 
      token,
      user: { id: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber } 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
