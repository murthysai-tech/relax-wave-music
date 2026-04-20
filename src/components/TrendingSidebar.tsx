"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TrendingUp, Play, Pause, Music, Heart } from "lucide-react";
import { Track } from "@/services/jamendo";
import Image from "next/image";

interface TrendingSidebarProps {
  tracks: Track[];
  currentTrackId?: string;
  isPlaying: boolean;
  onPlay: (track: Track) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
}

export function TrendingSidebar({
  tracks,
  currentTrackId,
  isPlaying,
  onPlay,
  favorites,
  onToggleFavorite,
}: TrendingSidebarProps) {
  const trendingTracks = tracks.slice(0, 4);

  return (
    <motion.aside
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className="hidden xl:flex fixed right-8 top-32 bottom-32 w-80 flex-col z-40"
    >
      <div className="glass-panel-heavy rounded-[2.5rem] p-6 flex flex-col h-full overflow-hidden border-white/10">
        <div className="flex items-center gap-3 mb-8 px-2">
          <div className="p-2.5 rounded-2xl bg-music-primary/20 text-music-primary shadow-lg shadow-music-primary/10">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-black text-white tracking-tight">TRENDING NOW</h3>
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Global Top Picks</p>
          </div>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
          {trendingTracks.length > 0 ? (
            trendingTracks.map((track, i) => {
              const isActive = currentTrackId === track.id;
              const isFav = favorites.includes(track.id);

              return (
                <motion.div
                  key={track.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ x: 5 }}
                  className={`group relative p-3 rounded-2xl transition-all duration-300 border ${
                    isActive 
                      ? "bg-white/10 border-white/20 shadow-xl" 
                      : "bg-white/5 border-transparent hover:bg-white/10 hover:border-white/10"
                  }`}
                >
                  <div className="flex gap-4 items-center">
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden shadow-lg shrink-0">
                      <Image
                        src={track.image}
                        alt={track.name}
                        fill
                        className={`object-cover transition-transform duration-500 group-hover:scale-110 ${
                          isActive && isPlaying ? "animate-pulse" : ""
                        }`}
                      />
                      <button
                        onClick={() => onPlay(track)}
                        className={`absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-[2px] transition-opacity ${
                          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {isActive && isPlaying ? (
                          <Pause className="w-5 h-5 text-white fill-current" />
                        ) : (
                          <Play className="w-5 h-5 text-white fill-current ml-0.5" />
                        )}
                      </button>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h4 className={`text-sm font-bold truncate transition-colors ${
                        isActive ? "text-music-accent" : "text-white/90"
                      }`}>
                        {track.name}
                      </h4>
                      <p className="text-[11px] text-white/40 truncate font-medium mt-0.5">
                        {track.artist_name}
                      </p>
                    </div>

                    <button
                      onClick={() => onToggleFavorite(track.id)}
                      className={`p-2 rounded-lg transition-all ${
                        isFav ? "text-music-pink" : "text-white/20 hover:text-white/50"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isFav ? "fill-current" : ""}`} />
                    </button>
                  </div>

                  {isActive && isPlaying && (
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-1 h-8 bg-music-primary rounded-full shadow-[0_0_10px_rgba(45,212,191,0.5)]" />
                  )}
                </motion.div>
              );
            })
          ) : (
            [...Array(4)].map((_, i) => (
              <div key={i} className="flex gap-4 items-center p-3 rounded-2xl bg-white/5 animate-pulse">
                <div className="w-14 h-14 rounded-xl bg-white/5" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-2/3 bg-white/5 rounded" />
                  <div className="h-2 w-1/3 bg-white/5 rounded" />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="mt-6 p-4 rounded-2xl bg-music-primary/5 border border-music-primary/10">
          <div className="flex items-center gap-3 text-music-primary mb-2">
            <Music className="w-4 h-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">System Status</span>
          </div>
          <p className="text-[11px] text-white/40 font-medium leading-relaxed">
            Discover the hottest tracks updated in real-time. Direct from Jamendo API.
          </p>
        </div>
      </div>
    </motion.aside>
  );
}
