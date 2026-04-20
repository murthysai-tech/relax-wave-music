import { NextResponse } from "next/server";
import crypto from "crypto";
import dbConnect from "@/lib/db";
import User from "@/models/User";
import { sendResetPasswordEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // For security, don't reveal if email exists or not
      return NextResponse.json({ message: "If an account with that email exists, we have sent a reset link." }, { status: 200 });
    }

    // Generate token
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 3600000); // 1 hour

    user.resetPasswordToken = token;
    user.resetPasswordExpires = expires;
    await user.save();

    // Send Reset Email
    const resetUrl = `${process.env.NEXT_PUBLIC_URL || "http://localhost:3000"}/reset-password?token=${token}`;
    await sendResetPasswordEmail(email, resetUrl);

    return NextResponse.json({ message: "If an account with that email exists, we have sent a reset link." }, { status: 200 });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
