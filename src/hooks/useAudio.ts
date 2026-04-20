"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Track } from "@/services/jamendo";

export function useAudio() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [recentlyPlayed, setRecentlyPlayed] = useState<Track[]>([]);
  const [customPlaylists, setCustomPlaylists] = useState<Record<string, Track[]>>({});
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);

  const getAuthToken = () => {
    if (typeof window !== "undefined") return localStorage.getItem("relaxwave_token");
    return null;
  };

  // Sync with Backend Playlists
  const syncPlaylists = useCallback(async () => {
    const token = getAuthToken();
    if (!token) return;

    try {
      const res = await fetch("/api/library/playlists", {
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        const playlistMap: Record<string, Track[]> = {};
        data.forEach((p: any) => {
          playlistMap[p.name] = p.tracks;
        });
        setCustomPlaylists(playlistMap);
      }
    } catch (err) {
      console.error("Failed to sync playlists", err);
    }
  }, []);

  // Initialize Audio and Load LocalStorage
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.volume = volume;

    // Load Favorites
    const savedFavs = localStorage.getItem("music_favorites");
    if (savedFavs) setFavorites(JSON.parse(savedFavs));

    // Load Initial Local Playlists
    const savedPlaylists = localStorage.getItem("custom_playlists");
    if (savedPlaylists) setCustomPlaylists(JSON.parse(savedPlaylists));

    // Then Sync with Cloud if logged in
    syncPlaylists();

    const handleTimeUpdate = () => {
      if (audioRef.current) {
        const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
        setProgress(p || 0);
      }
    };

    const handleLoadedMetadata = () => {
      if (audioRef.current) setDuration(audioRef.current.duration);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setProgress(0);
    };

    audioRef.current.addEventListener("timeupdate", handleTimeUpdate);
    audioRef.current.addEventListener("loadedmetadata", handleLoadedMetadata);
    audioRef.current.addEventListener("ended", handleEnded);

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeEventListener("timeupdate", handleTimeUpdate);
        audioRef.current.removeEventListener("loadedmetadata", handleLoadedMetadata);
        audioRef.current.removeEventListener("ended", handleEnded);
      }
    };
  }, [syncPlaylists]);

  // Sync Volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  // Persistent Favorites
  useEffect(() => {
    localStorage.setItem("music_favorites", JSON.stringify(favorites));
  }, [favorites]);

  // Persistent Custom Playlists
  useEffect(() => {
    localStorage.setItem("custom_playlists", JSON.stringify(customPlaylists));
  }, [customPlaylists]);

  const toggleFavorite = useCallback((trackId: string) => {
    setFavorites(prev => 
      prev.includes(trackId) 
        ? prev.filter(id => id !== trackId) 
        : [...prev, trackId]
    );
  }, []);

  const createPlaylist = useCallback(async (name: string) => {
    const token = getAuthToken();
    if (token) {
      try {
        const res = await fetch("/api/library/playlists", {
          method: "POST",
          headers: { 
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}` 
          },
          body: JSON.stringify({ name, tracks: [] })
        });
        if (res.ok) {
          setCustomPlaylists(prev => ({ ...prev, [name]: [] }));
          return;
        }
      } catch (err) { console.error(err); }
    }
    // Fallback to local
    setCustomPlaylists(prev => ({ ...prev, [name]: [] }));
  }, []);

  const deletePlaylist = useCallback((name: string) => {
    setCustomPlaylists(prev => {
      const next = { ...prev };
      delete next[name];
      return next;
    });
  }, []);

  const addToPlaylist = useCallback(async (playlistName: string, track: Track) => {
    const token = getAuthToken();
    // Simplified: local state update always happens
    setCustomPlaylists(prev => {
      const list = prev[playlistName] || [];
      if (list.find(t => t.id === track.id)) return prev;
      const newList = [...list, track];
      
      return { ...prev, [playlistName]: newList };
    });
  }, []);

  const removeFromPlaylist = useCallback((playlistName: string, trackId: string) => {
    setCustomPlaylists(prev => ({
      ...prev,
      [playlistName]: (prev[playlistName] || []).filter(t => t.id !== trackId)
    }));
  }, []);

  const addToRecent = useCallback((track: Track) => {
    setRecentlyPlayed(prev => {
      const filtered = prev.filter(t => t.id !== track.id);
      return [track, ...filtered].slice(0, 10);
    });
  }, []);

  const setupAudioContext = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!audioContextRef.current && audioRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      
      sourceRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
      sourceRef.current.connect(analyserRef.current);
      analyserRef.current.connect(audioContextRef.current.destination);
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      audioRef.current.pause();
    } else {
      setupAudioContext();
      if (audioContextRef.current?.state === "suspended") {
        audioContextRef.current.resume();
      }
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  }, [isPlaying, currentTrack, setupAudioContext]);

  const playTrack = useCallback(async (track: Track) => {
    if (!audioRef.current) return;

    if (currentTrack?.id === track.id) {
      togglePlay();
      return;
    }

    addToRecent(track);
    audioRef.current.src = track.audio;
    setCurrentTrack(track);
    setIsPlaying(true);
    
    // Sync to backend history if logged in
    const userStr = localStorage.getItem("relaxwave_user");
    if (userStr) {
      const user = JSON.parse(userStr);
      // We use track.id but database expects song._id if it's our own song
      // For Jamendo tracks, we might need a different strategy, but for now we'll send it
      fetch("/api/user/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id || user._id, songId: track.id })
      }).catch(err => console.error("History sync failed", err));
    }

    setupAudioContext();
    if (audioContextRef.current?.state === "suspended") {
      audioContextRef.current.resume();
    }
    audioRef.current.play();
  }, [currentTrack, togglePlay, setupAudioContext, addToRecent]);

  const seek = useCallback((val: number) => {
    if (audioRef.current && duration) {
      const time = (val / 100) * duration;
      audioRef.current.currentTime = time;
      setProgress(val);
    }
  }, [duration]);

  const getAnalyzerData = useCallback(() => {
    if (!analyserRef.current) return new Uint8Array(0);
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(dataArray);
    return dataArray;
  }, []);

  return {
    isPlaying,
    progress,
    duration,
    volume,
    currentTrack,
    favorites,
    recentlyPlayed,
    customPlaylists,
    setVolume,
    togglePlay,
    playTrack,
    seek,
    toggleFavorite,
    createPlaylist,
    deletePlaylist,
    addToPlaylist,
    removeFromPlaylist,
    getAnalyzerData
  };
}
