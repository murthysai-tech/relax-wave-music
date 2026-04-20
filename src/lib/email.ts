import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendWelcomeEmail(to: string, username: string) {
  const mailOptions = {
    from: `"RelaxWave" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: "Welcome to RelaxWave! 🌊",
    html: `
      <div style="font-family: sans-serif; background: #050505; color: white; padding: 40px; border-radius: 20px;">
        <h1 style="color: #2dd4bf;">Welcome Home, ${username}!</h1>
        <p>Thank you for joining the wave. Your account has been successfully created.</p>
        <p><b>Your Username:</b> ${username}</p>
        <div style="margin-top: 30px; border-top: 1px solid #333; padding-top: 20px; font-size: 12px; color: #666;">
          RelaxWave Music Platform | Your Oasis of Sound
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${to}`);
  } catch (error) {
    console.error("Error sending welcome email:", error);
  }
}

export async function sendResetPasswordEmail(to: string, resetUrl: string) {
  const mailOptions = {
    from: `"RelaxWave" <${process.env.EMAIL_USER}>`,
    to: to,
    subject: "Reset Your RelaxWave Password 🔐",
    html: `
      <div style="font-family: sans-serif; background: #050505; color: white; padding: 40px; border-radius: 20px;">
        <h1 style="color: #f43f5e;">Password Reset Request</h1>
        <p>You requested a password reset. Click the button below to set a new password:</p>
        <a href="${resetUrl}" style="display: inline-block; background: #2dd4bf; color: black; padding: 12px 24px; border-radius: 12px; font-weight: bold; text-decoration: none; margin-top: 20px;">RESET PASSWORD</a>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">This link will expire in 1 hour. If you didn't request this, you can safely ignore this email.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Reset email sent to ${to}`);
  } catch (error) {
    console.error("Error sending reset email:", error);
  }
}
