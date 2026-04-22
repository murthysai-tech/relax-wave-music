"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Music2, 
  Plus, 
  Trash2, 
  LayoutGrid, 
  Image as ImageIcon, 
  Headphones, 
  Globe, 
  Sparkles, 
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronLeft
} from "lucide-react";
import Link from "next/link";

interface Song {
  _id: string;
  name: string;
  artist_name: string;
  image: string;
  audio: string;
  language: string;
  genre: string;
}

export function AdminDashboard() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showForm, setShowForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    artist_name: "",
    image: "",
    audio: "",
    language: "English",
    genre: "Pop",
    album_name: ""
  });

  useEffect(() => {
    fetchSongs();
  }, []);

  const fetchSongs = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/songs");
      const data = await res.json();
      setSongs(data);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/songs", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer admin-token" // Placeholder as required by API
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to add song");
      }

      setSuccess("Song added to Oasis successfully!");
      setFormData({
        name: "",
        artist_name: "",
        image: "",
        audio: "",
        language: "English",
        genre: "Pop",
        album_name: ""
      });
      fetchSongs();
      setTimeout(() => setShowForm(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this masterpiece?")) return;

    try {
      const res = await fetch(`/api/songs?id=${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete");
      
      setSongs(songs.filter(s => s._id !== id));
    } catch (err) {
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 selection:bg-music-primary/30">
      {/* Background elements */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-music-primary/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-music-accent/10 blur-[150px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-6">
            <Link href="/">
              <motion.button 
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>
            </Link>
            <div>
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter uppercase mb-2">
                Oasis <span className="text-music-accent">Studio</span>
              </h1>
              <p className="text-white/40 font-bold uppercase tracking-[0.3em] text-[10px]">Curation Management Dashboard</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(34,211,238,0.2)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowForm(!showForm)}
            className="px-8 py-4 bg-white text-black rounded-2xl font-black flex items-center gap-3 transition-all"
          >
            {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {showForm ? "CANCEL CURATION" : "ADD NEW MASTERPIECE"}
          </motion.button>
        </header>

        <AnimatePresence>
          {showForm && (
            <motion.section
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="mb-16 overflow-hidden"
            >
              <div className="glass-panel p-8 md:p-12 rounded-[3rem] border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-music-accent/5 blur-3xl rounded-full" />
                
                <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-music-accent" /> SONG DETAILS
                </h2>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Song Name</label>
                      <div className="relative group">
                        <Music2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-music-accent transition-colors" />
                        <input 
                          type="text" required placeholder="Midnight Echoes"
                          value={formData.name}
                          onChange={e => setFormData({...formData, name: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-music-accent/20 transition-all font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Artist Name</label>
                      <div className="relative group">
                        <LayoutGrid className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-music-accent transition-colors" />
                        <input 
                          type="text" required placeholder="Synthetic Waves"
                          value={formData.artist_name}
                          onChange={e => setFormData({...formData, artist_name: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-music-accent/20 transition-all font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Language</label>
                        <select 
                          value={formData.language}
                          onChange={e => setFormData({...formData, language: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-music-accent/20 transition-all font-bold appearance-none"
                        >
                          <option value="English">English</option>
                          <option value="Hindi">Hindi</option>
                          <option value="Telugu">Telugu</option>
                          <option value="Spanish">Spanish</option>
                          <option value="Japanese">Japanese</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Genre</label>
                        <input 
                          type="text" placeholder="Lofi / Pop"
                          value={formData.genre}
                          onChange={e => setFormData({...formData, genre: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-music-accent/20 transition-all font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Audio URL (Stream Link)</label>
                      <div className="relative group">
                        <Headphones className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-music-accent transition-colors" />
                        <input 
                          type="url" required placeholder="https://example.com/song.mp3"
                          value={formData.audio}
                          onChange={e => setFormData({...formData, audio: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-music-accent/20 transition-all font-bold"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Cover Image URL</label>
                      <div className="relative group">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-music-accent transition-colors" />
                        <input 
                          type="url" required placeholder="https://images.unsplash.com/..."
                          value={formData.image}
                          onChange={e => setFormData({...formData, image: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-music-accent/20 transition-all font-bold"
                        />
                      </div>
                    </div>

                    <div className="pt-2">
                       <AnimatePresence>
                        {error && (
                          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 text-music-pink mb-4 bg-music-pink/10 p-3 rounded-xl border border-music-pink/20">
                            <AlertCircle className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase">{error}</span>
                          </motion.div>
                        )}
                        {success && (
                          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-2 text-music-accent mb-4 bg-music-accent/10 p-3 rounded-xl border border-music-accent/20">
                            <CheckCircle2 className="w-4 h-4" />
                            <span className="text-[10px] font-black uppercase">{success}</span>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full py-5 rounded-2xl bg-white text-black font-black hover:scale-[1.02] active:scale-98 transition-all shadow-xl disabled:opacity-50"
                      >
                        {isSubmitting ? "SYNCHRONIZING..." : "UPLOAD TO OASIS"}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* Songs List */}
        <section>
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-black flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-music-primary/20 flex items-center justify-center text-music-primary">
                <LayoutGrid className="w-5 h-5" />
              </div>
              VAULT CONTENTS
            </h2>
            <div className="relative group hidden md:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <input type="text" placeholder="Search the vault..." className="bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs font-bold outline-none focus:ring-1 focus:ring-white/20 w-48" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-white/5 rounded-3xl animate-pulse border border-white/5" />
              ))
            ) : songs.length > 0 ? (
              songs.map((song) => (
                <motion.div
                  key={song._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="group glass-panel p-4 rounded-3xl border border-white/10 hover:border-white/20 transition-all flex items-center gap-4"
                >
                  <div className="relative w-16 h-16 shrink-0">
                    <img src={song.image} className="w-full h-full object-cover rounded-2xl" alt={song.name} />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl flex items-center justify-center">
                      <Music2 className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  
                  <div className="flex-grow min-w-0">
                    <h3 className="font-black text-sm truncate">{song.name}</h3>
                    <p className="text-[10px] font-bold text-white/40 uppercase tracking-wider truncate">{song.artist_name}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[8px] font-black bg-white/10 px-2 py-0.5 rounded-md uppercase tracking-tighter text-white/60">{song.language}</span>
                      <span className="text-[8px] font-black bg-music-accent/10 text-music-accent px-2 py-0.5 rounded-md uppercase tracking-tighter">{song.genre}</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.1, color: "#f472b6" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleDelete(song._id)}
                    className="p-3 text-white/20 hover:text-music-pink transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </motion.button>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-20 text-center glass-panel rounded-[3rem] border border-white/5">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-white/20">
                  <Music2 className="w-8 h-8" />
                </div>
                <p className="text-white/30 font-bold uppercase tracking-widest text-xs">The vault is currently empty</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
