import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { findUser, updateUser } from "@/lib/storageHub";
import { sendWelcomeEmail } from "@/lib/email";
 
const JWT_SECRET = process.env.JWT_SECRET || "RelaxWaveSecret123";

export async function POST(req: Request) {
  try {
    const { identifier, password } = await req.json(); // identifier can be email OR username

    if (!identifier || !password) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Find user by email OR username (Hub handles fallback)
    const user = await findUser({ 
      $or: [
        { email: identifier.toLowerCase() }, 
        { username: identifier }
      ] 
    });

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // Trigger Welcome Email on First Login
    if (user.isFirstLogin) {
      try {
        await sendWelcomeEmail(user.email, user.username);
        await updateUser(user._id || user.id, { isFirstLogin: false });
      } catch (emailError: any) {
        console.warn("First login email hint:", emailError.message);
      }
    }

    // Create JWT
    const token = jwt.sign(
      { id: user._id || user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return NextResponse.json({ 
      message: "Login successful", 
      token, 
      user: { 
        id: user._id || user.id, 
        username: user.username, 
        email: user.email, 
        phoneNumber: user.phoneNumber 
      } 
    }, { status: 200 });

  } catch (error: any) {
    console.error("LOGIN ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
