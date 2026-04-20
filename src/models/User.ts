import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide a name"],
  },
  email: {
    type: String,
    required: [true, "Please provide an email"],
    unique: true,
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
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
