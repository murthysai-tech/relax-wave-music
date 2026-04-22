import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Playlist name is required"],
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  username: {
    type: String,
  },
  tracks: [{
    type: Object, // Storing full track object for performance, or can use references
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Playlist || mongoose.model("Playlist", PlaylistSchema);
