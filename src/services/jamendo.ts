const JAMENDO_CLIENT_ID = "56d30862"; // Using a public/demo key for this standalone version

export interface Track {
  id: string;
  name: string;
  duration: number;
  artist_name: string;
  image: string;
  audio: string;
  album_name: string;
}

export async function getTrendingTracks(limit: number = 24): Promise<Track[]> {
  try {
    const response = await fetch(
      `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=jsonpretty&limit=${limit}&fuzzytags=electronic,chill,future,pop&order=ratingmonth_desc&include=musicinfo`
    );
    const data = await response.json();
    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      duration: item.duration,
      artist_name: item.artist_name,
      image: item.album_image || item.image || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=500&auto=format&fit=crop",
      audio: item.audio,
      album_name: item.album_name,
    }));
  } catch (error) {
    console.error("Error fetching trending tracks:", error);
    return [];
  }
}

export async function searchTracks(query: string, limit: number = 24): Promise<Track[]> {
  try {
    const response = await fetch(
      `https://api.jamendo.com/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=jsonpretty&limit=${limit}&search=${encodeURIComponent(query)}&order=popularity_desc`
    );
    const data = await response.json();
    return data.results.map((item: any) => ({
      id: item.id,
      name: item.name,
      duration: item.duration,
      artist_name: item.artist_name,
      image: item.album_image || item.image || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=500&auto=format&fit=crop",
      audio: item.audio,
      album_name: item.album_name,
    }));
  } catch (error) {
    console.error("Error searching tracks:", error);
    return [];
  }
}
