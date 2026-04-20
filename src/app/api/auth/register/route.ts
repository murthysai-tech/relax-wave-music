import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createUser, findUser } from "@/lib/storageHub";
import { sendWelcomeEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { username, email, password, phoneNumber } = await req.json();

    if (!username || !email || !password || !phoneNumber) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Check if user exists (by email OR username)
    const existingUser = await findUser({ $or: [{ email }, { username }] });
    if (existingUser) {
      const field = existingUser.email === email ? "Email" : "Username";
      return NextResponse.json({ error: `${field} already exists` }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user (Hub will decide local vs cloud)
    const user = await createUser({
      username,
      email,
      password: hashedPassword,
      phoneNumber,
      provider: "local",
    });

    // Send Welcome Email (Fail silently if email config is missing)
    try {
      await sendWelcomeEmail(email, username);
    } catch (e) {
      console.warn("Welcome email could not be sent:", e.message);
    }

    return NextResponse.json({ 
      message: "User registered successfully", 
      user: { id: user._id || user.id, username: user.username, email: user.email } 
    }, { status: 201 });

  } catch (error: any) {
    console.error("REGISTRATION ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
