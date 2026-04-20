import { NextResponse } from "next/server";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "RelaxWaveSecret123";

/**
 * SIMULATED Social Login Endpoint
 * In a real application, you would use an OAuth library (like NextAuth.js or passport)
 * to verify the token from Google/Instagram.
 */
export async function POST(req: Request) {
  try {
    const { email, name, provider, socialId } = await req.json();

    if (!email || !name || !provider) {
      return NextResponse.json({ error: "Missing identity fields" }, { status: 400 });
    }

    await dbConnect();

    // Find user by email
    let user = await User.findOne({ email });

    if (!user) {
      // Create a new user but without a phone number initially
      user = await User.create({
        name,
        email,
        provider,
        password: "SOCIAL_LOGIN_NO_PASSWORD", // Placeholder
        phoneNumber: "", // Will be required in the next step
      });
    }

    // Check if phone number is missing
    if (!user.phoneNumber) {
      return NextResponse.json({ 
        message: "Phone number required", 
        user: { id: user._id, email: user.email, name: user.name },
        needsPhone: true 
      });
    }

    // If everything is fine, generate token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ 
      message: "Login successful", 
      token, 
      user: { id: user._id, name: user.name, email: user.email, phoneNumber: user.phoneNumber } 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
