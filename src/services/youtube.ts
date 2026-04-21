import { Track } from "./jamendo";

export async function searchYouTubeTracks(query: string): Promise<Track[]> {
  try {
    const response = await fetch(`/api/music/search?q=${encodeURIComponent(query)}`);
    if (!response.ok) return [];
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("YouTube search service error:", error);
    return [];
  }
}
