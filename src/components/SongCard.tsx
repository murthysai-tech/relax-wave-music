import React, { useState } from "react";
import Image from "next/image";
import { Play, Pause, Heart, Music2, Share2, Plus, Check } from "lucide-react";
import { Track } from "@/services/jamendo";
import { motion, AnimatePresence } from "framer-motion";

interface SongCardProps {
  track: Track;
  isActive: boolean;
  isPlaying: boolean;
  isFavorite: boolean;
  onPlay: (track: Track) => void;
  onToggleFavorite: (id: string) => void;
  onAddToPlaylist: (track: Track) => void;
  onArtistClick: (artistName: string) => void;
  index: number;
}

export function SongCard({ 
  track, 
  isActive, 
  isPlaying, 
  isFavorite, 
  onPlay, 
  onToggleFavorite,
  onAddToPlaylist,
  onArtistClick,
  index 
}: SongCardProps) {
  const [isShared, setIsShared] = useState(false);

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const shareUrl = `${window.location.origin}/track/${track.id}`;
    navigator.clipboard.writeText(shareUrl);
    setIsShared(true);
    setTimeout(() => setIsShared(false), 2000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`group relative glass-panel rounded-[2rem] p-3 transition-all duration-500 hover:border-white/30 ${
        isActive ? "ring-2 ring-white shadow-2xl shadow-white/10" : ""
      }`}
    >
      <div className="aspect-square relative overflow-hidden rounded-[1.5rem] bg-slate-900 shadow-2xl">
        <Image 
          src={track.image} 
          alt={track.name} 
          fill 
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover transition-transform duration-700 group-hover:scale-110 ${
            isPlaying && isActive ? "animate-pulse brightness-75" : ""
          }`}
        />
        
        {/* Play Overlay */}
        <div className={`absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 ${isActive && isPlaying ? "opacity-100" : ""}`}>
          <button 
            onClick={() => onPlay(track)}
            className="w-14 h-14 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.4)] transform translate-y-4 group-hover:translate-y-0 transition-all duration-500 hover:scale-110 active:scale-95"
          >
            {isActive && isPlaying ? (
              <Pause className="w-6 h-6 fill-black" />
            ) : (
              <Play className="w-6 h-6 fill-black ml-1" />
            )}
          </button>
        </div>

        {/* Action Buttons Overlays */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 transform translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
          <button 
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(track.id); }}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
              isFavorite ? "bg-music-pink text-white" : "bg-black/30 text-white/70 hover:bg-black/50"
            }`}
            title="Favorite"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? "fill-current" : ""}`} />
          </button>
          
          <button 
            onClick={(e) => { e.stopPropagation(); onAddToPlaylist(track); }}
            className="p-2.5 rounded-full bg-black/30 backdrop-blur-md text-white/70 hover:bg-black/50 hover:text-white transition-all"
            title="Add to Playlist"
          >
            <Plus className="w-4 h-4" />
          </button>

          <button 
            onClick={handleShare}
            className={`p-2.5 rounded-full backdrop-blur-md transition-all ${
              isShared ? "bg-music-accent text-white" : "bg-black/30 text-white/70 hover:bg-black/50"
            }`}
            title="Share"
          >
            {isShared ? <Check className="w-4 h-4" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      <div className="mt-4 px-2 pb-2 text-left">
        <h3 className={`font-bold text-sm md:text-base line-clamp-1 transition-colors ${
          isActive ? "text-gradient-neon" : "text-white/90"
        }`}>
          {track.name}
        </h3>
        <button 
          onClick={(e) => { e.stopPropagation(); onArtistClick(track.artist_name); }}
          className="text-xs text-white/50 mt-1 flex items-center gap-1.5 font-medium hover:text-music-accent transition-colors"
        >
          <span className="w-1.5 h-1.5 bg-music-secondary rounded-full" /> {track.artist_name}
        </button>
      </div>

      {/* Playing Indicator Pill */}
      {isActive && isPlaying && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-music-primary px-3 py-1 rounded-full flex items-center gap-2 shadow-lg shadow-music-primary/40 animate-bounce">
          <Music2 className="w-3 h-3 text-white" />
          <span className="text-[10px] font-bold uppercase tracking-tighter text-white">Playing</span>
        </div>
      )}
    </motion.div>
  );
}
