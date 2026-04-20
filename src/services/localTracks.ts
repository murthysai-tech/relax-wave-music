export interface Track {
  id: string;
  name: string;
  duration: number;
  artist_name: string;
  image: string;
  audio: string;
  album_name: string;
  language?: string; // Extended for our local tracks
}

export const LOCAL_TRACKS: Track[] = [
  // Telugu Songs
  {
    id: "local_tel_01",
    name: "Butta Bomma",
    artist_name: "Armaan Malik",
    duration: 232,
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    album_name: "Ala Vaikunthapurramuloo",
    language: "Telugu"
  },
  {
    id: "local_tel_02",
    name: "Samajavaragamana",
    artist_name: "Sid Sriram",
    duration: 215,
    image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&auto=format&fit=crop",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    album_name: "Ala Vaikunthapurramuloo",
    language: "Telugu"
  },
  // Hindi Songs
  {
    id: "local_hin_01",
    name: "Kesariya",
    artist_name: "Arijit Singh",
    duration: 180,
    image: "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    album_name: "Brahmastra",
    language: "Hindi"
  },
  {
    id: "local_hin_02",
    name: "Raataan Lambiyan",
    artist_name: "Jubin Nautiyal",
    duration: 210,
    image: "https://images.unsplash.com/photo-1459749411177-042180ce673c?w=800&auto=format&fit=crop",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    album_name: "Shershaah",
    language: "Hindi"
  },
  // English Songs
  {
    id: "local_eng_01",
    name: "Blinding Lights",
    artist_name: "The Weeknd",
    duration: 200,
    image: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?w=800&auto=format&fit=crop",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
    album_name: "After Hours",
    language: "English"
  },
  {
    id: "local_eng_02",
    name: "Shape of You",
    artist_name: "Ed Sheeran",
    duration: 233,
    image: "https://images.unsplash.com/photo-1514525253361-bee871846439?w=800&auto=format&fit=crop",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
    album_name: "Divide",
    language: "English"
  }
];

export function getLocalTracksByLanguage(language: string): Track[] {
  if (!language) return [];
  return LOCAL_TRACKS.filter(t => t.language?.toLowerCase() === language.toLowerCase());
}
