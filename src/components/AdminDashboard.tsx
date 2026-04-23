"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Music2, 
  Plus, 
  Trash2, 
  Edit,
  Upload,
  LayoutGrid, 
  Image as ImageIcon, 
  Headphones, 
  Globe, 
  Sparkles, 
  Search,
  CheckCircle2,
  AlertCircle,
  X,
  ChevronLeft,
  User
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
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterLanguage, setFilterLanguage] = useState("All");

  const [formData, setFormData] = useState({
    name: "",
    artist_name: "",
    image: "",
    audio: "",
    language: "English",
    genre: "Pop",
    album_name: ""
  });

  const [showBulkForm, setShowBulkForm] = useState(false);
  const [bulkFiles, setBulkFiles] = useState<File[]>([]);
  const [bulkProgress, setBulkProgress] = useState("");
  const [bulkFormData, setBulkFormData] = useState({
    artist_name: "",
    image: "",
    language: "English",
    genre: "Pop",
    album_name: ""
  });

  const languages = ["English", "Hindi", "Telugu", "Tamil", "Spanish", "Japanese"];

  useEffect(() => {
    fetchSongs();
  }, []);

  const filteredSongs = songs.filter(song => 
    filterLanguage === "All" || song.language === filterLanguage
  );

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

  const handleEdit = (song: Song) => {
    setEditingId(song._id);
    setFormData({
      name: song.name,
      artist_name: song.artist_name,
      image: song.image,
      audio: song.audio,
      language: song.language || "English",
      genre: song.genre || "Pop",
      album_name: (song as any).album_name || ""
    });
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: "audio" | "image") => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSubmitting(true);
    setError("");

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!res.ok) throw new Error("Upload failed");
      
      const data = await res.json();
      setFormData({ ...formData, [type]: data.url });
      setSuccess(`${type === "audio" ? "Audio" : "Image"} uploaded successfully!`);
    } catch (err: any) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");
    setSuccess("");

    const endpoint = editingId ? `/api/songs?id=${editingId}` : "/api/songs";
    const method = editingId ? "PUT" : "POST";

    try {
      const res = await fetch(endpoint, {
        method: method,
        headers: { 
          "Content-Type": "application/json",
          "Authorization": "Bearer admin-token"
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save song");
      }

      setSuccess(editingId ? "Masterpiece updated successfully!" : "Song added to Oasis successfully!");
      setFormData({
        name: "",
        artist_name: "",
        image: "",
        audio: "",
        language: "English",
        genre: "Pop",
        album_name: ""
      });
      setEditingId(null);
      fetchSongs();
      setTimeout(() => setShowForm(false), 2000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsSubmitting(true);
    setError("");

    const uploadFormData = new FormData();
    uploadFormData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: uploadFormData,
      });

      if (!res.ok) throw new Error("Upload failed");
      
      const data = await res.json();
      setBulkFormData({ ...bulkFormData, image: data.url });
      setSuccess("Album cover uploaded successfully!");
    } catch (err: any) {
      setError(`Upload failed: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (bulkFiles.length === 0) {
      setError("Please select at least one audio file.");
      return;
    }
    if (!bulkFormData.image) {
      setError("Please provide a cover image for the bulk upload.");
      return;
    }
    
    setIsSubmitting(true);
    setError("");
    setSuccess("");
    
    try {
      let successCount = 0;
      for (let i = 0; i < bulkFiles.length; i++) {
        const file = bulkFiles[i];
        setBulkProgress(`Uploading ${i + 1} of ${bulkFiles.length}: ${file.name}...`);
        
        // 1. Upload audio
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadFormData });
        
        if (!uploadRes.ok) throw new Error(`Failed to upload ${file.name}`);
        const uploadData = await uploadRes.json();
        
        // 2. Clean Name
        const rawName = file.name.replace(/\.[^/.]+$/, "");
        const cleanName = rawName.replace(/[_-]/g, " ");
        
        // 3. Create Song
        const songData = {
          name: cleanName,
          artist_name: bulkFormData.artist_name,
          image: bulkFormData.image,
          audio: uploadData.url,
          language: bulkFormData.language,
          genre: bulkFormData.genre,
          album_name: bulkFormData.album_name
        };
        
        const res = await fetch("/api/songs", {
          method: "POST",
          headers: { "Content-Type": "application/json", "Authorization": "Bearer admin-token" },
          body: JSON.stringify(songData),
        });
        
        if (!res.ok) throw new Error(`Failed to save ${cleanName}`);
        successCount++;
      }
      
      setSuccess(`Successfully uploaded ${successCount} songs!`);
      setBulkProgress("");
      setBulkFiles([]);
      setBulkFormData({ artist_name: "", image: "", language: "English", genre: "Pop", album_name: "" });
      fetchSongs();
      setTimeout(() => setShowBulkForm(false), 2000);
      
    } catch (err: any) {
      setError(err.message);
      setBulkProgress("");
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

          <div className="flex flex-col md:flex-row gap-4">
            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(168,85,247,0.2)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowForm(false);
                setShowBulkForm(!showBulkForm);
              }}
              className="px-8 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-black flex items-center justify-center gap-3 transition-all hover:bg-white/10"
            >
              <LayoutGrid className="w-5 h-5" />
              {showBulkForm ? "CANCEL BULK" : "BULK UPLOAD"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, boxShadow: "0 0 30px rgba(34,211,238,0.2)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                setShowBulkForm(false);
                if (showForm) {
                  setShowForm(false);
                  setEditingId(null);
                  setFormData({ name: "", artist_name: "", image: "", audio: "", language: "English", genre: "Pop", album_name: "" });
                } else {
                  setShowForm(true);
                }
              }}
              className="px-8 py-4 bg-white text-black rounded-2xl font-black flex items-center justify-center gap-3 transition-all"
            >
              {showForm ? <X className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
              {showForm ? "CANCEL" : "ADD NEW MASTERPIECE"}
            </motion.button>
          </div>
        </header>

        <AnimatePresence mode="wait">
          {showBulkForm && (
            <motion.section
              key="bulkForm"
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="mb-16 overflow-hidden"
            >
              <div className="glass-panel p-8 md:p-12 rounded-[3rem] border border-white/10 relative overflow-hidden bg-gradient-to-br from-music-primary/10 to-transparent">
                <div className="absolute top-0 right-0 w-64 h-64 bg-music-primary/10 blur-3xl rounded-full" />
                
                <h2 className="text-2xl font-black mb-8 flex items-center gap-3 text-music-primary">
                  <LayoutGrid className="w-6 h-6" /> BULK ALBUM UPLOAD
                </h2>
                <p className="text-sm font-bold text-white/50 mb-8 max-w-2xl">
                  Upload an entire album at once. Enter the shared artist, genre, and cover image below. Then select multiple audio files. The system will use the filenames as the song titles automatically!
                </p>

                <form onSubmit={handleBulkSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Shared Artist Name</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-music-primary transition-colors" />
                        <input 
                          type="text" required placeholder="e.g. Arijit Singh"
                          value={bulkFormData.artist_name}
                          onChange={e => setBulkFormData({...bulkFormData, artist_name: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-music-primary/50 transition-all font-bold"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Language</label>
                        <select 
                          value={bulkFormData.language}
                          onChange={e => setBulkFormData({...bulkFormData, language: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-music-primary/50 transition-all font-bold appearance-none"
                        >
                          {languages.map(lang => (
                            <option key={lang} value={lang}>{lang}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Genre</label>
                        <input 
                          type="text" placeholder="Lofi / Pop"
                          value={bulkFormData.genre}
                          onChange={e => setBulkFormData({...bulkFormData, genre: e.target.value})}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 px-4 outline-none focus:ring-2 focus:ring-music-primary/50 transition-all font-bold"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Select Multiple Audio Files</label>
                      <div className="flex gap-2">
                        <div className="flex-grow bg-white/5 border border-white/10 rounded-2xl py-4 px-4 font-bold text-sm text-white/70 flex items-center overflow-hidden whitespace-nowrap">
                          {bulkFiles.length > 0 ? `${bulkFiles.length} files selected for upload` : "No files selected yet"}
                        </div>
                        <label className="shrink-0 flex items-center justify-center w-14 h-14 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-music-primary/20 transition-colors text-white/40 hover:text-music-primary">
                          <Upload className="w-5 h-5" />
                          <input type="file" multiple accept="audio/*" className="hidden" onChange={e => {
                            if (e.target.files) setBulkFiles(Array.from(e.target.files));
                          }} />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Shared Cover Image</label>
                      <div className="flex gap-2">
                        <div className="relative group flex-grow">
                          <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-music-primary transition-colors" />
                          <input 
                            type="text" required placeholder="Image URL or upload"
                            value={bulkFormData.image}
                            onChange={e => setBulkFormData({...bulkFormData, image: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-music-primary/50 transition-all font-bold"
                          />
                        </div>
                        <label className="shrink-0 flex items-center justify-center w-14 h-14 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors text-white/40 hover:text-music-primary">
                          <Upload className="w-5 h-5" />
                          <input type="file" accept="image/*" className="hidden" onChange={handleBulkImageUpload} />
                        </label>
                      </div>
                    </div>

                    <div className="pt-2">
                       <AnimatePresence>
                        {bulkProgress && (
                          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center justify-center gap-2 text-music-primary mb-4 bg-music-primary/10 p-4 rounded-xl border border-music-primary/20 font-black">
                            <div className="w-4 h-4 border-2 border-music-primary border-t-transparent rounded-full animate-spin" />
                            {bulkProgress}
                          </motion.div>
                        )}
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
                        disabled={isSubmitting || bulkFiles.length === 0}
                        className="w-full py-5 rounded-2xl bg-music-primary text-white font-black hover:scale-[1.02] active:scale-98 transition-all shadow-xl shadow-music-primary/20 disabled:opacity-50 disabled:hover:scale-100"
                      >
                        {isSubmitting ? "UPLOADING TO OASIS..." : `UPLOAD ${bulkFiles.length} SONGS`}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </motion.section>
          )}

          {showForm && !showBulkForm && (
            <motion.section
              initial={{ opacity: 0, y: -20, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -20, height: 0 }}
              className="mb-16 overflow-hidden"
            >
              <div className="glass-panel p-8 md:p-12 rounded-[3rem] border border-white/10 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-music-accent/5 blur-3xl rounded-full" />
                
                <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                  <Sparkles className="w-6 h-6 text-music-accent" /> 
                  {editingId ? "EDIT MASTERPIECE" : "SONG DETAILS"}
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
                          {languages.map(lang => (
                            <option key={lang} value={lang}>{lang}</option>
                          ))}
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
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Audio Source</label>
                      <div className="flex gap-2">
                        <div className="relative group flex-grow">
                          <Headphones className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-music-accent transition-colors" />
                          <input 
                            type="text" required placeholder="URL or uploaded file"
                            value={formData.audio}
                            onChange={e => setFormData({...formData, audio: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-music-accent/20 transition-all font-bold"
                          />
                        </div>
                        <label className="shrink-0 flex items-center justify-center w-14 h-14 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors text-white/40 hover:text-music-accent">
                          <Upload className="w-5 h-5" />
                          <input type="file" accept="audio/*" className="hidden" onChange={e => handleFileUpload(e, "audio")} />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-white/40 ml-1">Cover Image Source</label>
                      <div className="flex gap-2">
                        <div className="relative group flex-grow">
                          <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-music-accent transition-colors" />
                          <input 
                            type="text" required placeholder="URL or uploaded file"
                            value={formData.image}
                            onChange={e => setFormData({...formData, image: e.target.value})}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 outline-none focus:ring-2 focus:ring-music-accent/20 transition-all font-bold"
                          />
                        </div>
                        <label className="shrink-0 flex items-center justify-center w-14 h-14 bg-white/5 border border-white/10 rounded-2xl cursor-pointer hover:bg-white/10 transition-colors text-white/40 hover:text-music-accent">
                          <Upload className="w-5 h-5" />
                          <input type="file" accept="image/*" className="hidden" onChange={e => handleFileUpload(e, "image")} />
                        </label>
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
                        {isSubmitting ? "SYNCHRONIZING..." : (editingId ? "SAVE CHANGES" : "UPLOAD TO OASIS")}
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
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-6">
            <h2 className="text-2xl font-black flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-music-primary/20 flex items-center justify-center text-music-primary">
                <LayoutGrid className="w-5 h-5" />
              </div>
              VAULT CONTENTS
            </h2>
            
            {/* Language Filter */}
            <div className="flex flex-wrap gap-2">
              {["All", ...languages].map(lang => (
                <button
                  key={lang}
                  onClick={() => setFilterLanguage(lang)}
                  className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                    filterLanguage === lang 
                    ? "bg-music-accent text-black" 
                    : "bg-white/5 border border-white/10 text-white/40 hover:bg-white/10"
                  }`}
                >
                  {lang}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              [...Array(6)].map((_, i) => (
                <div key={i} className="h-24 bg-white/5 rounded-3xl animate-pulse border border-white/5" />
              ))
            ) : filteredSongs.length > 0 ? (
              filteredSongs.map((song) => (
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

                  <div className="flex items-center gap-1">
                    <motion.button
                      whileHover={{ scale: 1.1, color: "#22d3ee" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleEdit(song)}
                      className="p-2 text-white/20 hover:text-music-accent transition-colors"
                      title="Edit masterpiece"
                    >
                      <Edit className="w-4 h-4" />
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.1, color: "#f472b6" }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(song._id)}
                      className="p-2 text-white/20 hover:text-music-pink transition-colors"
                      title="Remove masterpiece"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
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
