import { NextResponse } from "next/server";
const youtubesearchapi = require("youtube-search-api");

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q");

    if (!query) {
      return NextResponse.json({ error: "Missing query" }, { status: 400 });
    }

    // Search for music videos specifically
    const results = await youtubesearchapi.GetListByKeyword(query + " music", false, 10, [{ type: "video" }]);
    
    // Transform into our Track interface format
    const tracks = results.items.map((item: any) => {
      // Use a public streaming proxy for the audio URL
      // We'll use a reliable public instance pattern
      const audioUrl = `https://p.ocean-of-web.com/api/stream?id=${item.id}`;
      
      return {
        id: "yt_" + item.id,
        name: item.title,
        artist_name: item.channelTitle || "YouTube Artist",
        duration: 0, // YouTube search API doesn't always provide duration easily
        image: item.thumbnail?.thumbnails[0]?.url || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17",
        audio: audioUrl,
        album_name: "YouTube Music",
        source: "youtube"
      };
    });

    return NextResponse.json(tracks);

  } catch (error: any) {
    console.error("YOUTUBE SEARCH ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
