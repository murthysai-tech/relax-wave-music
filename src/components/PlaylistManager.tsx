"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ListMusic, Plus, Trash2, Play, Music2, FolderPlus } from "lucide-react";
import { Track } from "@/services/jamendo";

interface PlaylistManagerProps {
  isOpen: boolean;
  onClose: () => void;
  playlists: Record<string, Track[]>;
  onCreatePlaylist: (name: string) => void;
  onDeletePlaylist: (name: string) => void;
  onPlayTrack: (track: Track) => void;
  onRemoveFromPlaylist: (name: string, trackId: string) => void;
}

export function PlaylistManager({ 
  isOpen, 
  onClose, 
  playlists, 
  onCreatePlaylist, 
  onDeletePlaylist,
  onPlayTrack,
  onRemoveFromPlaylist
}: PlaylistManagerProps) {
  const [newPlaylistName, setNewPlaylistName] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPlaylistName.trim()) {
      onCreatePlaylist(newPlaylistName.trim());
      setNewPlaylistName("");
      setIsCreating(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-md z-[1200]"
          />
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 h-full w-full max-w-md bg-[#0f0f0f] z-[1201] shadow-2xl flex flex-col border-l border-white/10"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/10 flex items-center justify-between bg-black/40 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-music-accent/10 flex items-center justify-center text-music-accent">
                   <ListMusic className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white tracking-tighter">PLAYLISTS</h3>
                  <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Library Management</p>
                </div>
              </div>
              <button onClick={onClose} className="p-3 rounded-xl hover:bg-white/5 text-white/50 transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-8 space-y-8 hide-scrollbar">
               
               {/* Create New Section */}
               {!isCreating ? (
                 <button 
                   onClick={() => setIsCreating(true)}
                   className="w-full py-4 rounded-2xl border-2 border-dashed border-white/10 text-white/40 hover:text-white hover:border-music-accent/50 hover:bg-music-accent/5 transition-all flex items-center justify-center gap-3 font-bold text-sm"
                 >
                   <FolderPlus className="w-5 h-5" /> CREATE NEW PLAYLIST
                 </button>
               ) : (
                 <motion.form 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleCreate} 
                  className="space-y-4 p-6 rounded-2xl bg-white/5 border border-white/10"
                 >
                    <input 
                      autoFocus
                      type="text"
                      placeholder="Enter playlist name..."
                      value={newPlaylistName}
                      onChange={(e) => setNewPlaylistName(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-white focus:ring-2 focus:ring-music-accent/50 outline-none transition-all"
                    />
                    <div className="flex gap-2">
                       <button type="submit" className="flex-1 bg-white text-black py-2.5 rounded-xl font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Create</button>
                       <button type="button" onClick={() => setIsCreating(false)} className="flex-1 bg-white/5 text-white py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-white/10 transition-all">Cancel</button>
                    </div>
                 </motion.form>
               )}

               {/* Playlists List */}
               <div className="space-y-6">
                 {Object.entries(playlists).map(([name, tracks]) => (
                   <div key={name} className="space-y-3">
                      <div className="flex items-center justify-between text-white/30 group">
                         <div className="flex items-center gap-2">
                           <span className="text-xs font-black uppercase tracking-widest text-white/90">{name}</span>
                           <span className="text-[10px] font-mono">({tracks.length})</span>
                         </div>
                         <button onClick={() => onDeletePlaylist(name)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:text-music-pink transition-all">
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>

                      <div className="space-y-2">
                        {tracks.length === 0 ? (
                          <div className="py-8 text-center border border-white/5 rounded-2xl">
                             <p className="text-[10px] text-white/20 font-bold uppercase tracking-widest">No tracks yet</p>
                          </div>
                        ) : (
                          tracks.map((track) => (
                            <div key={track.id} className="group/track flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all">
                               <div className="w-8 h-8 rounded-lg overflow-hidden shrink-0">
                                 <img src={track.image} className="w-full h-full object-cover" />
                               </div>
                               <div className="flex-1 min-w-0">
                                 <p className="text-xs font-bold text-white line-clamp-1">{track.name}</p>
                                 <p className="text-[9px] text-white/40 line-clamp-1">{track.artist_name}</p>
                               </div>
                               <div className="flex items-center gap-1 opacity-0 group-hover/track:opacity-100 transition-opacity">
                                  <button onClick={() => onPlayTrack(track)} className="p-1.5 text-white/40 hover:text-white"><Play className="w-4 h-4 fill-current" /></button>
                                  <button onClick={() => onRemoveFromPlaylist(name, track.id)} className="p-1.5 text-white/40 hover:text-music-pink"><Trash2 className="w-4 h-4" /></button>
                               </div>
                            </div>
                          ))
                        )}
                      </div>
                   </div>
                 ))}
                 
                 {Object.keys(playlists).length === 0 && !isCreating && (
                   <div className="py-20 text-center">
                     <Music2 className="w-12 h-12 text-white/5 mx-auto mb-4" />
                     <p className="text-sm text-white/20 font-bold">Your library is empty.</p>
                   </div>
                 )}
               </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
