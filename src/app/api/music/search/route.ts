import { NextResponse } from "next/server";
import YTMusic from "ytmusic-api";

const ytmusic = new YTMusic();
let isInitialized = false;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    if (!isInitialized) {
      await ytmusic.initialize();
      isInitialized = true;
    }

    const results = await ytmusic.searchSongs(query);
    
    // Transform into our Track interface format
    const tracks = results.map((item: any) => {
      const coverUrl = item.thumbnails && item.thumbnails.length > 0 
        ? item.thumbnails[item.thumbnails.length - 1].url 
        : "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17";
        
      return {
        id: "yt_" + item.videoId,
        name: item.name,
        artist_name: item.artist?.name || "YouTube Music Artist",
        duration: item.duration || 0,
        image: coverUrl,
        audio: `/api/music/stream?id=${item.videoId}`, // Proxied audio stream
        album_name: item.album?.name || "YouTube Music",
        source: "youtube"
      };
    });

    return NextResponse.json(tracks.slice(0, 15));

  } catch (error: any) {
    console.error("YTMUSIC SEARCH ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
