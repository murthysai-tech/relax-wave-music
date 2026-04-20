import mongoose from "mongoose";

const SongSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Song name is required"],
  },
  artist_name: {
    type: String,
    required: [true, "Artist name is required"],
  },
  image: {
    type: String,
    required: [true, "Cover image URL is required"],
  },
  audio: {
    type: String,
    required: [true, "Audio stream URL is required"],
  },
  album_name: {
    type: String,
  },
  genre: {
    type: String,
  },
  language: {
    type: String,
    required: [true, "Language is required"],
    default: "English",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.models.Song || mongoose.model("Song", SongSchema);
