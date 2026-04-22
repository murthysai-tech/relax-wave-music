import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: [true, "Please provide a username"],
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
    lowercase: true,
    trim: true,
  },
  password: {
    type: String,
    // Password not required for social login
  },
  phoneNumber: {
    type: String,
    default: "",
  },
  provider: {
    type: String,
    enum: ["local", "google", "instagram"],
    default: "local",
  },
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  listeningHistory: [
    {
      songId: { type: mongoose.Schema.Types.ObjectId, ref: "Song" },
      playedAt: { type: Date, default: Date.now },
    }
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isFirstLogin: {
    type: Boolean,
    default: true,
  }
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
