"use client";

import React, { useEffect, useRef } from "react";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  VolumeX, 
  Repeat, 
  Shuffle,
  Music4
} from "lucide-react";
import { Track } from "@/services/jamendo";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import gsap from "gsap";

interface FloatingPlayerProps {
  track: Track | null;
  isPlaying: boolean;
  progress: number;
  volume: number;
  onTogglePlay: () => void;
  onSeek: (val: number) => void;
  onVolumeChange: (val: number) => void;
  onNext: () => void;
  onPrev: () => void;
}

export function FloatingPlayer({
  track,
  isPlaying,
  progress,
  volume,
  onTogglePlay,
  onSeek,
  onVolumeChange,
  onNext,
  onPrev
}: FloatingPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (track && containerRef.current) {
      gsap.fromTo(containerRef.current, 
        { y: 100, opacity: 0, scale: 0.9 },
        { y: 0, opacity: 1, scale: 1, duration: 0.8, ease: "power4.out" }
      );
    }
  }, [track]);

  if (!track) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[95%] max-w-6xl z-[100]"
    >
      <div className="glass-panel-heavy rounded-[2.5rem] p-3 md:p-5 flex flex-col md:flex-row items-center gap-4 md:gap-8 border-white/20 relative overflow-hidden ring-1 ring-white/10">
        
        {/* Animated Background Accent */}
        <div className="absolute -z-10 w-full h-full inset-0 bg-gradient-to-r from-music-primary/10 via-transparent to-music-accent/10 animate-pulse-glow" />

        {/* Track Info Section */}
        <div className="flex items-center gap-4 w-full md:w-[25%] group">
          <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-2xl overflow-hidden shrink-0 shadow-2xl ring-2 ring-white/10 group-hover:ring-music-primary/50 transition-all duration-500">
            <Image 
              src={track.image} 
              alt={track.name} 
              fill 
              className={`object-cover ${isPlaying ? 'animate-pulse' : ''}`} 
            />
            {isPlaying && (
               <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                 <div className="flex gap-1">
                   {[...Array(3)].map((_, i) => (
                     <motion.div
                       key={i}
                       animate={{ height: [8, 16, 8] }}
                       transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.2 }}
                       className="w-1 bg-music-accent rounded-full"
                     />
                   ))}
                 </div>
               </div>
            )}
          </div>
          <div className="overflow-hidden">
            <h4 className="text-white font-black text-sm md:text-lg truncate tracking-tight">{track.name}</h4>
            <div className="flex items-center gap-2 mt-0.5">
              <Music4 className="w-3 h-3 text-music-primary" />
              <p className="text-white/50 text-xs truncate font-medium">{track.artist_name}</p>
            </div>
          </div>
        </div>

        {/* Main Controls & Progress */}
        <div className="flex-1 flex flex-col items-center gap-3 w-full">
          <div className="flex items-center gap-8 translate-y-1">
            <button className="text-white/30 hover:text-music-pink transition-colors">
              <Shuffle className="w-4 h-4" />
            </button>
            <button onClick={onPrev} className="text-white/60 hover:text-white transition-all transform hover:scale-110 active:scale-90">
              <SkipBack className="w-6 h-6 fill-current" />
            </button>
            <button 
              onClick={onTogglePlay}
              className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-white text-black flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-[0_0_25px_rgba(255,255,255,0.3)] group"
            >
              {isPlaying ? (
                <Pause className="w-7 h-7 fill-black group-hover:scale-90 transition-transform" />
              ) : (
                <Play className="w-7 h-7 fill-black ml-1 group-hover:scale-90 transition-transform" />
              )}
            </button>
            <button onClick={onNext} className="text-white/60 hover:text-white transition-all transform hover:scale-110 active:scale-90">
              <SkipForward className="w-6 h-6 fill-current" />
            </button>
            <button className="text-white/30 hover:text-music-accent transition-colors">
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          <div className="w-full flex items-center gap-4">
            <span className="text-[11px] font-bold text-white/40 w-12 text-right tabular-nums">
              {formatTime((progress / 100) * track.duration)}
            </span>
            <div className="relative flex-1 h-2 bg-white/5 rounded-full cursor-pointer group">
              <input 
                type="range"
                min="0"
                max="100"
                value={progress}
                onChange={(e) => onSeek(parseInt(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div 
                className="absolute left-0 top-0 h-full bg-gradient-to-r from-music-primary via-music-secondary to-music-accent rounded-full group-hover:shadow-[0_0_15px_rgba(45,212,191,0.8)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
              <motion.div 
                className="absolute w-4 h-4 bg-white rounded-full border-2 border-music-primary -top-1 shadow-[0_0_10px_rgba(255,255,255,0.5)] opacity-0 group-hover:opacity-100 transition-opacity"
                animate={{ x: '-50%' }}
                style={{ left: `${progress}%` }}
              />
            </div>
            <span className="text-[11px] font-bold text-white/40 w-12 tabular-nums">
              {formatTime(track.duration)}
            </span>
          </div>
        </div>

        {/* Volume & Shortcuts Section */}
        <div className="hidden lg:flex items-center gap-6 w-[25%] justify-end">
          <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-2xl border border-white/10 group hover:border-white/20 transition-all">
            <button 
              onClick={() => onVolumeChange(volume === 0 ? 0.7 : 0)}
              className="text-white/60 hover:text-white transition-colors"
            >
              {volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <div className="relative w-24 h-1.5 bg-white/10 rounded-full cursor-pointer hide-scrollbar">
              <input 
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div 
                className="absolute left-0 top-0 h-full bg-white/40 rounded-full group-hover:bg-gradient-to-r from-music-secondary to-music-accent transition-all"
                style={{ width: `${volume * 100}%` }}
              />
            </div>
          </div>
          <button className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white/60 hover:text-white hover:bg-white/10 transition-all">
            <Music4 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
