"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Music, Users, Star, Play, PlayCircle, Heart } from "lucide-react";
import { Track } from "@/services/jamendo";

interface ArtistDetailsProps {
  artistName: string | null;
  onClose: () => void;
  onPlayTrack: (track: Track) => void;
  topTracks: Track[];
}

export function ArtistDetails({ artistName, onClose, onPlayTrack, topTracks }: ArtistDetailsProps) {
  if (!artistName) return null;

  return (
    <AnimatePresence>
      {artistName && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1100]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-2xl bg-[#0a0a0a] z-[1101] shadow-2xl flex flex-col border-l border-white/10"
          >
            {/* Artist Header */}
            <div className="relative h-72 w-full overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-[#0a0a0a] z-10" />
               <img 
                 src="https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop" 
                 className="w-full h-full object-cover"
                 alt={artistName}
               />
               <button 
                  onClick={onClose}
                  className="absolute top-6 right-6 z-20 p-3 rounded-full bg-black/40 text-white/70 hover:text-white hover:bg-black/60 backdrop-blur-md transition-all"
               >
                 <X className="w-6 h-6" />
               </button>

               <div className="absolute bottom-8 left-8 z-20">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-3 text-music-accent mb-2"
                  >
                    <Star className="w-5 h-5 fill-current" />
                    <span className="text-xs font-black uppercase tracking-widest">{topTracks.length} Global Hits</span>
                  </motion.div>
                  <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase leading-none">
                    {artistName}
                  </h2>
               </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-10 hide-scrollbar">
               
               {/* Popular Tracks Section */}
               <section>
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-black text-white flex items-center gap-3">
                      <Music className="text-music-accent w-5 h-5" /> POPULAR TRACKS
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {topTracks.map((track, i) => (
                      <motion.div
                        key={track.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="group flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                        onClick={() => onPlayTrack(track)}
                      >
                         <span className="text-white/20 font-black w-4">{i + 1}</span>
                         <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                           <img src={track.image} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <PlayCircle className="text-white w-6 h-6" />
                           </div>
                         </div>
                         <div className="flex-1">
                           <h4 className="text-sm font-bold text-white line-clamp-1">{track.name}</h4>
                           <p className="text-[10px] text-white/40 uppercase tracking-widest font-mono">{track.album_name}</p>
                         </div>
                         <button className="text-white/20 hover:text-music-pink transition-colors">
                            <Heart className="w-4 h-4" />
                         </button>
                      </motion.div>
                    ))}
                  </div>
               </section>

               {/* Bio/Info Section */}
               <section className="p-8 rounded-[2rem] bg-gradient-to-br from-music-secondary/10 to-transparent border border-white/5">
                  <div className="flex items-center gap-4 mb-4 text-white/40">
                    <Users className="w-5 h-5" />
                    <span className="text-xs font-bold tracking-widest uppercase">Artist Background</span>
                  </div>
                  <p className="text-white/60 text-sm leading-relaxed italic">
                    {artistName} is a visionary artist known for blending deep melodic textures with modern electronic rhythms. Their unique sound signature has captivated thousands of listeners across RelaxWave.
                  </p>
               </section>
            </div>

            {/* Footer Action */}
            <div className="p-8 border-t border-white/10 bg-black/40 backdrop-blur-md">
               <button 
                 onClick={() => topTracks[0] && onPlayTrack(topTracks[0])}
                 className="w-full py-5 rounded-2xl bg-white text-black font-black flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
               >
                 <Play className="w-5 h-5 fill-black" /> PLAY TOP HITS
               </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
