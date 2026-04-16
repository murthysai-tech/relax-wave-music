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
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import gsap from "gsap";

import { getTrendingTracks, searchTracks, Track } from "@/services/jamendo";
import { useAudio } from "@/hooks/useAudio";
import { SongCard } from "@/components/SongCard";
import { FloatingPlayer } from "@/components/FloatingPlayer";
import { MusicVisualizer } from "@/components/MusicVisualizer";
import { ParticleBackground } from "@/components/ParticleBackground";
import { GlassNavbar } from "@/components/GlassNavbar";
import { CategorySection } from "@/components/CategorySection";
import { TrackSkeleton, HeroSkeleton } from "@/components/SkeletonLoader";
import { CommunityPanel } from "@/components/CommunityPanel";
import { ArtistDetails } from "@/components/ArtistDetails";
import { PlaylistManager } from "@/components/PlaylistManager";
import { AuthPanel } from "@/components/AuthPanel";
import { ListMusic, Plus, LayoutGrid, FolderPlus, User as UserIcon } from "lucide-react";

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
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  const heroRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    // Initial user check
    const savedUser = localStorage.getItem("relaxwave_user");
    if (savedUser) setCurrentUser(JSON.parse(savedUser));
  }, []);

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

  // Load initial trending tracks
  useEffect(() => {
    async function init() {
      const data = await getTrendingTracks(24);
      setTracks(data);
      setIsLoading(false);
      
      // GSAP Entrance Animation
      const tl = gsap.timeline();
      tl.fromTo(heroRef.current, 
        { opacity: 0, y: 50, scale: 0.95 }, 
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: "expo.out", delay: 0.5 }
      )
      .fromTo(contentRef.current,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
        "-=0.6"
      );
    }
    init();
  }, []);

  // Fetch songs by language
  useEffect(() => {
    if (!selectedLanguage) return;
    
    async function fetchLang() {
      setIsLangLoading(true);
      const data = await searchTracks(selectedLanguage, 12);
      setLanguageTracks(data);
      setIsLangLoading(false);
    }
    fetchLang();
  }, [selectedLanguage]);

  // Live Filter Logic
  const filteredTracks = useMemo(() => {
    if (activeTab === 'favorites') {
      return tracks.filter(t => favorites.includes(t.id));
    }
    if (activeTab === 'recent') {
      return recentlyPlayed;
    }
    if (searchQuery) {
      return tracks.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        t.artist_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return tracks;
  }, [tracks, searchQuery, activeTab, favorites, recentlyPlayed]);

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

  return (
    <main className="min-h-screen relative flex flex-col selection:bg-music-primary/30">
      <ParticleBackground />
      <GlassNavbar 
        currentLanguage={selectedLanguage} 
        onLanguageChange={setSelectedLanguage} 
        activeNav={activeNav}
        onNavChange={setActiveNav}
        onAuthClick={() => setIsAuthOpen(true)}
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

      <div className="relative z-10 flex-grow pt-32 pb-48 container mx-auto px-6 max-w-7xl">
        <AnimatePresence mode="wait">
          {!isAuthOpen ? (
            <motion.div
              key="main-content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              {/* Floating Search Bar (Top Right) */}
              <div className="absolute top-0 right-0 hidden xl:block z-50">
                <div className="relative group">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-music-accent transition-colors" />
                  <input
                    type="text"
                    placeholder="Search music..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl py-3 pl-12 pr-4 w-72 focus:outline-none focus:ring-2 focus:ring-music-accent/30 focus:border-music-accent/50 transition-all text-sm font-medium"
                  />
                </div>
              </div>

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
                          onClick={() => tracks[0] && playTrack(tracks[0])}
                          className="bg-white text-black px-10 py-5 rounded-full font-black flex items-center gap-3 hover:scale-105 active:scale-95 transition-all shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                        >
                          <Play className="w-5 h-5 fill-black" /> LISTEN NOW
                        </button>
                        <button className="bg-white/10 backdrop-blur-md border border-white/20 text-white px-10 py-5 rounded-full font-black hover:bg-white/20 transition-all flex items-center gap-3">
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
              <div ref={contentRef}>
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

                {/* Grid Section */}
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
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="auth-panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="w-full flex justify-center py-20"
            >
              <AuthPanel 
                onClose={() => setIsAuthOpen(false)}
                onSuccess={(user) => {
                  setCurrentUser(user);
                  window.location.reload();
                }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Persistent Floating Player */}
      <AnimatePresence>
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
          />
        )}
      </AnimatePresence>
      <CommunityPanel />

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
