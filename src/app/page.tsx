"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { 
  Search, 
  TrendingUp, 
  Heart, 
  Clock, 
  Sparkles, 
  Play, 
  Headphones,
  ArrowRight,
  Globe,
  ListMusic,
  Plus,
  LayoutGrid,
  FolderPlus,
  Music2,
  LogOut,
  RotateCw,
  Compass,
  Mic2,
  User
} from "lucide-react";
import { useRouter } from "next/navigation";
import { searchYouTubeTracks } from "@/services/youtube";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

import { getTrendingTracks, searchTracks, Track } from "@/services/jamendo";
import { LOCAL_TRACKS, getLocalTracksByLanguage } from "@/services/localTracks";
import { useAudio } from "@/hooks/useAudio";
import { SongCard } from "@/components/SongCard";
import { FloatingPlayer } from "@/components/FloatingPlayer";
import { MusicVisualizer } from "@/components/MusicVisualizer";
import { ParticleBackground } from "@/components/ParticleBackground";
import { GlassNavbar } from "@/components/GlassNavbar";
import { CategorySection } from "@/components/CategorySection";
import { TrackSkeleton, HeroSkeleton } from "@/components/SkeletonLoader";
import { TrendingSidebar } from "@/components/TrendingSidebar";
import { ArtistDetails } from "@/components/ArtistDetails";
import { PlaylistManager } from "@/components/PlaylistManager";

export default function Home() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("trending");
  const [activeNav, setActiveNav] = useState("home");
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [languageTracks, setLanguageTracks] = useState<Track[]>([]);
  const [isLangLoading, setIsLangLoading] = useState(false);

  // New States for Advanced Features
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);
  const [isPlaylistOpen, setIsPlaylistOpen] = useState(false);
  const [trackToAddToPlaylist, setTrackToAddToPlaylist] = useState<Track | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const router = useRouter();

  const heroRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    // Initial user check
    const savedUser = localStorage.getItem("relaxwave_user");
    if (!savedUser) {
      router.push("/login");
    } else {
      setCurrentUser(JSON.parse(savedUser));
      setIsAuthChecking(false);
    }
  }, [router]);

  const {
    isPlaying,
    progress,
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
  } = useAudio();

  const artistTracks = useMemo(() => {
    if (!selectedArtist) return [];
    return tracks.filter(t => t.artist_name === selectedArtist).slice(0, 10);
  }, [tracks, selectedArtist]);

  // Load initial trending tracks and DB tracks
  useEffect(() => {
    async function init() {
      try {
        // Fetch tracks from our MongoDB only
        let dbTracks: Track[] = [];
        try {
          const res = await fetch("/api/songs");
          if (res.ok) {
            const data = await res.json();
            dbTracks = data.map((t: any) => ({
              ...t,
              id: t._id || t.id, // Ensure we have a string id
            }));
          }
        } catch (e) {
          console.error("Failed to fetch DB tracks:", e);
        }

        // Use ONLY DB tracks
        setTracks(dbTracks);
      } catch (err) {
        console.error("Initialization failed:", err);
      } finally {
        setIsLoading(false);
      }
      
      // GSAP Entrance Animation
      const tl = gsap.timeline();
      if (heroRef.current) {
        tl.fromTo(heroRef.current, 
          { opacity: 0, y: 50, scale: 0.95 }, 
          { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "expo.out", delay: 0.5 }
        );
      }
      if (contentRef.current) {
        tl.fromTo(contentRef.current,
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
          "-=0.6"
        );
      }
    }
    init();
  }, []);

  // Fetch songs by language
  useEffect(() => {
    if (!selectedLanguage) {
      setLanguageTracks([]);
      return;
    }
    
    async function fetchLang() {
      setIsLangLoading(true);
      
      try {
        // Search YouTube for top songs in this language
        const ytLangTracks = await searchYouTubeTracks(`Top ${selectedLanguage} songs`);
        
        // Also get any DB tracks for this language
        const dbForLang = tracks.filter(t => 
          (t as any).language?.toLowerCase() === selectedLanguage.toLowerCase()
        );
        
        // Combine them, putting local DB tracks first
        setLanguageTracks([...dbForLang, ...ytLangTracks]);
      } catch (err) {
        console.error("Failed to fetch language tracks", err);
      } finally {
        setIsLangLoading(false);
      }
    }
    fetchLang();
  }, [selectedLanguage, tracks]);

  // Universal Search Integration
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 3) {
      setSearchResults([]);
      return;
    }

    const delayDebounceSelector = setTimeout(async () => {
      setIsSearching(true);
      try {
        // 1. Search YouTube API
        const ytResults = await searchYouTubeTracks(searchQuery);

        // 2. Search local DB
        const res = await fetch("/api/songs");
        const dbData = await res.json();
        const allDb = dbData.map((t: any) => ({ ...t, id: t._id || t.id }));

        const localMatches = allDb.filter((t: any) => 
          t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
          t.artist_name.toLowerCase().includes(searchQuery.toLowerCase())
        );

        setSearchResults([...localMatches, ...ytResults]);
      } catch (e) {
        console.error(e);
      } finally {
        setIsSearching(false);
      }
    }, 800);

    return () => clearTimeout(delayDebounceSelector);
  }, [searchQuery]);

  // Combined Filter Logic
  const filteredTracks = useMemo(() => {
    if (searchQuery && searchResults.length > 0) {
      return searchResults;
    }
    if (activeTab === 'favorites') {
      return tracks.filter(t => favorites.includes(t.id));
    }
    if (activeTab === 'recent') {
      return recentlyPlayed;
    }
    return tracks;
  }, [tracks, searchResults, searchQuery, activeTab, favorites, recentlyPlayed]);

  const handleNext = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex !== -1 && currentIndex < tracks.length - 1) {
      playTrack(tracks[currentIndex + 1]);
    }
  };

  const handlePrev = () => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
    if (currentIndex > 0) {
      playTrack(tracks[currentIndex - 1]);
    }
  };

  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 gap-6 selection:bg-music-primary/30">
        <ParticleBackground />
        <div className="relative">
           <div className="w-24 h-24 border-4 border-music-accent/20 rounded-full animate-[spin_3s_linear_infinite]" />
           <div className="absolute inset-0 w-24 h-24 border-t-4 border-music-accent rounded-full animate-spin" />
           <Music2 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white w-8 h-8" />
        </div>
        <div className="flex flex-col items-center gap-2 relative z-10">
           <h2 className="text-white font-black tracking-tighter uppercase text-sm">Synchronizing your oasis</h2>
           <p className="text-white/30 text-[10px] font-bold tracking-[0.3em] uppercase animate-pulse">Establishing secure connection...</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen relative flex flex-col selection:bg-music-primary/30">
      {/* Quick Refresh Button (Top-Left) */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1, backgroundColor: "rgba(255, 255, 255, 0.1)" }}
        whileTap={{ scale: 0.9 }}
        onClick={() => window.location.reload()}
        title="Refresh Platform"
        className="fixed top-8 left-6 z-[1001] w-10 h-10 rounded-xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white/40 hover:text-white transition-all shadow-2xl"
      >
        <RotateCw className="w-5 h-5" />
      </motion.button>

      <ParticleBackground />
      <GlassNavbar 
        currentLanguage={selectedLanguage} 
        onLanguageChange={setSelectedLanguage} 
        activeNav={activeNav}
        onNavChange={(id) => {
          setActiveNav(id);
          if (id === 'playlists') setIsPlaylistOpen(true);
          if (id === 'search') {
            const searchInput = document.querySelector('input[placeholder*="Search"]');
            (searchInput as HTMLInputElement)?.focus();
          }
        }}
        onHomeClick={() => {
          setActiveNav('home');
          setSelectedArtist(null);
          setSearchQuery("");
        }}
      />

      {/* Persistent Library Toggle Button (Bottom Left) */}
      <motion.button
        onClick={() => setIsPlaylistOpen(true)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-32 left-8 z-[110] w-14 h-14 rounded-full bg-black/40 backdrop-blur-xl border border-white/10 text-white flex items-center justify-center shadow-2xl"
      >
        <ListMusic className="w-6 h-6" />
      </motion.button>

      <div className="relative z-10 flex-grow pt-32 pb-48 lg:pt-36 lg:pb-52 container mx-auto px-6 max-w-7xl xl:pr-[400px]">
        <div className="relative">
          {/* Floating Search Bar (Top Right) */}
          <div className="absolute top-0 right-0 hidden xl:block z-50">
            <div className="relative group">
              {isSearching ? (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 border-2 border-music-accent border-t-transparent rounded-full animate-spin" />
              ) : (
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-music-accent transition-colors" />
              )}
              <input
                type="text"
                placeholder="Search any song in the world..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl py-3 pl-12 pr-4 w-72 focus:outline-none focus:ring-2 focus:ring-music-accent/30 focus:border-music-accent/50 transition-all text-sm font-medium"
              />
            </div>
          </div>

          {/* Hero & Home Content - Only show when on Home */}
          {activeNav === "home" && (
            <>
              {/* Hero Section */}
              <section ref={heroRef} className="mb-20">
                {isLoading ? <HeroSkeleton /> : (
                  <div className="relative h-[450px] md:h-[500px] w-full rounded-[3rem] overflow-hidden group shadow-2xl border border-white/10">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
                    <img 
                      src={tracks[0]?.image || "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=1200"} 
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      alt="Feature"
                    />
                    
                    <div className="relative z-20 h-full flex flex-col justify-end p-8 md:p-16">
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="flex items-center gap-3 text-music-accent mb-4"
                      >
                        <Sparkles className="w-5 h-5 animate-pulse" />
                        <span className="text-xs md:text-sm font-black uppercase tracking-[0.3em] font-mono">Trending Masterpiece</span>
                      </motion.div>
                      
                      <h1 className="text-5xl md:text-8xl font-black text-white mb-6 leading-none tracking-tighter">
                        {tracks[0]?.name || "Relaxing Waves"}
                      </h1>
                      <p className="text-white/60 text-lg md:text-xl max-w-xl mb-10 font-medium leading-relaxed">
                        Dive into a world of serenity. Crystal clear audio paired with mesmerizing visualizers.
                      </p>
                      
                      <div className="flex flex-wrap gap-4">
                        <button 
                          onClick={() => {
                            if (!currentUser) {
                              router.push("/login");
                              return;
                            }
                            tracks[0] && playTrack(tracks[0]);
                          }}
                          className="bg-white text-black px-10 py-5 rounded-full font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        >
                          <Play className="w-5 h-5 fill-black" /> LISTEN NOW
                        </button>
                        <button 
                          onClick={() => {
                            if (!currentUser) {
                              router.push("/login");
                              return;
                            }
                            if (tracks[0]) setTrackToAddToPlaylist(tracks[0]);
                          }}
                          className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-full font-black hover:bg-white/20 transition-all flex items-center gap-3"
                        >
                          ADD TO PLAYLIST <ArrowRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>

                    {/* Live Spectrum Overlay */}
                    <div className="absolute top-8 right-8 z-20 w-48 h-12 flex items-end gap-1 px-4">
                       {[...Array(20)].map((_, i) => (
                         <motion.div
                          key={i}
                          animate={{ height: isPlaying ? [10, 30, 10] : 10 }}
                          transition={{ repeat: Infinity, duration: 0.4, delay: i * 0.05 }}
                          className="w-1 bg-white/20 rounded-full"
                         />
                       ))}
                    </div>
                  </div>
                )}
              </section>

              {/* Categories Tab Navigation */}
              <div className="flex items-center gap-6 mb-12 overflow-x-auto pb-4 hide-scrollbar">
                 {[
                   { id: 'trending', label: 'Trending', icon: TrendingUp },
                   { id: 'recent', label: 'Recently Played', icon: Clock },
                   { id: 'favorites', label: 'My Favorites', icon: Heart },
                 ].map((tab) => (
                   <button
                     key={tab.id}
                     onClick={() => setActiveTab(tab.id)}
                     className={`px-8 py-3.5 rounded-2xl flex items-center gap-3 transition-all font-bold text-sm whitespace-nowrap ${
                       activeTab === tab.id 
                        ? "bg-white/20 text-white border border-white/20 shadow-2xl backdrop-blur-md" 
                        : "bg-white/5 text-white/50 border border-white/10 hover:border-white/20 hover:text-white"
                     }`}
                   >
                     <tab.icon className="w-4 h-4" /> {tab.label}
                   </button>
                 ))}
              </div>

              {/* Language Based Songs Section */}
              <AnimatePresence mode="wait">
                {selectedLanguage && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-16 overflow-hidden"
                  >
                    <CategorySection 
                      title={`${selectedLanguage.toUpperCase()} SONGS`} 
                      icon={Globe}
                      horizontal={true}
                    >
                      {isLangLoading ? (
                        [...Array(6)].map((_, i) => <TrackSkeleton key={i} />)
                      ) : languageTracks.length > 0 ? (
                        languageTracks.map((track, i) => (
                          <SongCard 
                            key={track.id}
                            track={track}
                            index={i}
                            isActive={currentTrack?.id === track.id}
                            isPlaying={isPlaying}
                            isFavorite={favorites.includes(track.id)}
                            onPlay={playTrack}
                            onToggleFavorite={toggleFavorite}
                            onArtistClick={setSelectedArtist}
                            onAddToPlaylist={(t) => setTrackToAddToPlaylist(t)}
                          />
                        ))
                      ) : (
                        <div className="col-span-full py-10 text-center glass-panel rounded-[2rem]">
                          <p className="text-white/30 font-bold italic">No {selectedLanguage} tracks found.</p>
                        </div>
                      )}
                    </CategorySection>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Visualizer Hero Section */}
              <div className="mb-16">
                <div className="flex items-center justify-between mb-8 px-2">
                  <h2 className="text-2xl font-black flex items-center gap-4 text-white">
                    <div className="p-2 rounded-xl bg-music-accent/20 text-music-accent shadow-[0_0_10px_rgba(34,211,238,0.2)]">
                      <Headphones className="w-6 h-6" />
                    </div> 
                    LIVE SPECTRUM VISUALIZER
                  </h2>
                  {currentTrack && (
                    <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-music-accent/10 border border-music-accent/20">
                       <div className="w-2 h-2 bg-music-accent rounded-full animate-pulse" />
                       <span className="text-[10px] font-black tracking-widest text-music-accent uppercase">REAL-TIME SYNC</span>
                    </div>
                  )}
                </div>
                <MusicVisualizer getAnalyzerData={getAnalyzerData} isPlaying={isPlaying} />
              </div>
            </>
          )}

          <div ref={contentRef}>

            {/* Grid Section - Conditional based on Nav */}
            {activeNav === 'home' ? (
              <CategorySection 
                title={activeTab === 'trending' ? 'Global Trending' : activeTab === 'recent' ? 'Recently Played' : 'Your Favorites'} 
                icon={activeTab === 'trending' ? TrendingUp : activeTab === 'recent' ? Clock : Heart}
              >
                {isLoading ? (
                  [...Array(12)].map((_, i) => <TrackSkeleton key={i} />)
                ) : filteredTracks.length > 0 ? (
                  filteredTracks.map((track, i) => (
                    <SongCard 
                      key={track.id}
                      track={track}
                      index={i}
                      isActive={currentTrack?.id === track.id}
                      isPlaying={isPlaying}
                      isFavorite={favorites.includes(track.id)}
                      onPlay={playTrack}
                      onToggleFavorite={toggleFavorite}
                      onArtistClick={setSelectedArtist}
                      onAddToPlaylist={(t) => setTrackToAddToPlaylist(t)}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center glass-panel rounded-[3rem]">
                    <p className="text-white/30 font-bold italic">No tracks found in this category.</p>
                  </div>
                )}
              </CategorySection>
            ) : activeNav === 'browse' ? (
              <div className="space-y-16">
                <CategorySection title="Explore Genres" icon={Compass}>
                    {['Pop', 'Chill', 'Lofi', 'Electronic', 'Classical', 'Rock', 'Jazz', 'Hip-Hop'].map((genre) => (
                      <motion.button
                        key={genre}
                        whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.1)" }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => { setSearchQuery(genre); setActiveNav('home'); }}
                        className="h-32 rounded-3xl glass-panel flex flex-col items-center justify-center gap-3 border border-white/10 hover:border-music-accent/50 transition-all group"
                      >
                        <div className="w-12 h-12 rounded-2xl bg-music-accent/10 flex items-center justify-center text-music-accent group-hover:scale-110 transition-transform">
                          <Sparkles className="w-6 h-6" />
                        </div>
                        <span className="font-black uppercase tracking-widest text-[10px]">{genre}</span>
                      </motion.button>
                    ))}
                </CategorySection>

                <CategorySection title="All Songs Vault" icon={LayoutGrid}>
                    {tracks.map((track, i) => (
                      <SongCard 
                        key={track.id}
                        track={track}
                        index={i}
                        isActive={currentTrack?.id === track.id}
                        isPlaying={isPlaying}
                        isFavorite={favorites.includes(track.id)}
                        onPlay={playTrack}
                        onToggleFavorite={toggleFavorite}
                        onArtistClick={setSelectedArtist}
                        onAddToPlaylist={(t) => setTrackToAddToPlaylist(t)}
                      />
                    ))}
                </CategorySection>

                <CategorySection title="By Mood" icon={Sparkles}>
                    {[
                      { name: 'Study Session', color: 'from-blue-500/20' },
                      { name: 'Late Night Chill', color: 'from-purple-500/20' },
                      { name: 'Workout Power', color: 'from-orange-500/20' }
                    ].map((mood) => (
                      <motion.button
                        key={mood.name}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => { setSearchQuery(mood.name.split(' ')[0]); setActiveNav('home'); }}
                        className={`h-40 rounded-[2.5rem] bg-gradient-to-br ${mood.color} to-transparent border border-white/10 flex items-end p-8 transition-all hover:border-white/30`}
                      >
                        <span className="text-2xl font-black text-white">{mood.name}</span>
                      </motion.button>
                    ))}
                </CategorySection>
              </div>
            ) : activeNav === 'artists' ? (
              <CategorySection title="Top Artists" icon={Mic2}>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8">
                  {Array.from(new Set(tracks.map(t => t.artist_name))).slice(0, 12).map((artist, i) => (
                    <motion.button
                      key={artist}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -5 }}
                      onClick={() => setSelectedArtist(artist)}
                      className="flex flex-col items-center gap-4 group"
                    >
                      <div className="w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-2 border-white/5 group-hover:border-music-accent/50 transition-all p-1">
                        <div className="w-full h-full rounded-full bg-gradient-to-br from-music-primary/20 to-music-accent/20 flex items-center justify-center overflow-hidden relative">
                           <User className="w-12 h-12 text-white/10" />
                           {/* Finding some cover image from tracks for this artist */}
                           <img 
                            src={tracks.find(t => t.artist_name === artist)?.image} 
                            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" 
                            alt={artist} 
                           />
                        </div>
                      </div>
                      <span className="font-black text-[10px] md:text-xs uppercase tracking-widest text-center group-hover:text-music-accent transition-colors truncate w-full px-2">
                        {artist}
                      </span>
                    </motion.button>
                  ))}
                </div>
              </CategorySection>
            ) : activeNav === 'search' ? (
              <CategorySection title={searchQuery ? `Results for "${searchQuery}"` : "Global Search"} icon={Search}>
                {isSearching ? (
                  [...Array(12)].map((_, i) => <TrackSkeleton key={i} />)
                ) : searchResults.length > 0 ? (
                  searchResults.map((track, i) => (
                    <SongCard 
                      key={track.id}
                      track={track}
                      index={i}
                      isActive={currentTrack?.id === track.id}
                      isPlaying={isPlaying}
                      isFavorite={favorites.includes(track.id)}
                      onPlay={playTrack}
                      onToggleFavorite={toggleFavorite}
                      onArtistClick={setSelectedArtist}
                      onAddToPlaylist={(t) => setTrackToAddToPlaylist(t)}
                    />
                  ))
                ) : (
                  <div className="col-span-full py-20 text-center glass-panel rounded-[3rem]">
                    <Search className="w-12 h-12 text-white/10 mx-auto mb-4" />
                    <p className="text-white/30 font-bold italic">
                      {searchQuery ? `No results found for "${searchQuery}".` : "Type something to explore the oasis..."}
                    </p>
                  </div>
                )}
              </CategorySection>
            ) : null}
          </div>
        </div>
      </div>

      {/* Persistent Floating Player */}
      <AnimatePresence mode="wait">
        {currentTrack && (
          <FloatingPlayer
            track={currentTrack}
            isPlaying={isPlaying}
            progress={progress}
            volume={volume}
            onTogglePlay={togglePlay}
            onSeek={seek}
            onVolumeChange={setVolume}
            onNext={handleNext}
            onPrev={handlePrev}
            onAddToPlaylist={(t) => setTrackToAddToPlaylist(t)}
          />
        )}
      </AnimatePresence>
      <TrendingSidebar 
        tracks={tracks}
        currentTrackId={currentTrack?.id}
        isPlaying={isPlaying}
        onPlay={playTrack}
        favorites={favorites}
        onToggleFavorite={toggleFavorite}
      />

      {/* Advanced Feature Overlays */}
      <ArtistDetails 
        artistName={selectedArtist} 
        onClose={() => setSelectedArtist(null)}
        onPlayTrack={playTrack}
        topTracks={artistTracks}
      />

      <PlaylistManager 
        isOpen={isPlaylistOpen}
        onClose={() => setIsPlaylistOpen(false)}
        playlists={customPlaylists}
        onCreatePlaylist={createPlaylist}
        onDeletePlaylist={deletePlaylist}
        onPlayTrack={playTrack}
        onRemoveFromPlaylist={removeFromPlaylist}
      />

      {/* Add To Playlist Popup */}
      <AnimatePresence>
        {trackToAddToPlaylist && (
          <>
            <motion.div 
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setTrackToAddToPlaylist(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-md z-[2000]" 
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-sm glass-panel p-8 z-[2001] rounded-[2.5rem]"
            >
               <h3 className="text-xl font-black text-white mb-6 flex items-center gap-3">
                  <Plus className="w-6 h-6 text-music-accent" /> ADD TO PLAYLIST
               </h3>
               <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                  {Object.keys(customPlaylists).length === 0 ? (
                    <div className="text-center py-6 opacity-40 italic text-sm">No playlists created yet.</div>
                  ) : (
                    Object.keys(customPlaylists).map(name => (
                      <button 
                        key={name}
                        onClick={() => {
                          addToPlaylist(name, trackToAddToPlaylist);
                          setTrackToAddToPlaylist(null);
                        }}
                        className="w-full p-4 rounded-xl bg-white/5 hover:bg-music-accent/10 border border-white/5 hover:border-music-accent/20 transition-all text-left font-bold text-white flex items-center justify-between group"
                      >
                         {name}
                         <LayoutGrid className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                       </button>
                    ))
                  )}
               </div>
               <button 
                 onClick={() => {
                   setIsPlaylistOpen(true);
                   setTrackToAddToPlaylist(null);
                 }}
                 className="w-full mt-6 py-4 rounded-2xl bg-white/10 hover:bg-white text-white hover:text-black font-black transition-all flex items-center justify-center gap-2"
               >
                 <FolderPlus className="w-4 h-4" /> MANAGE LIBRARY
               </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </main>
  );
}
