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
  tracks: [
    {
      id: String,
      name: String,
      artist_name: String,
      image: String,
      audio: String,
      album_name: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Playlist || mongoose.model("Playlist", PlaylistSchema);
