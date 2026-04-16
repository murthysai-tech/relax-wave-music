"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, X, Zap, ArrowRight, Music2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface AuthPanelProps {
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export function AuthPanel({ onClose, onSuccess }: AuthPanelProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      if (isLogin) {
        localStorage.setItem("relaxwave_token", data.token);
        localStorage.setItem("relaxwave_user", JSON.stringify(data.user));
        onSuccess(data.user);
        onClose();
      } else {
        setIsLogin(true);
        setError("Registration successful! Please login.");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[2000] flex items-center justify-center p-6 bg-black/80 backdrop-blur-xl"
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-lg relative bg-[#0a0a0a] rounded-[3.5rem] border border-white/10 p-10 overflow-hidden shadow-2xl"
      >
        {/* Background Accent */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-music-primary/20 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-music-accent/20 blur-[100px] rounded-full" />

        <button 
          onClick={onClose}
          className="absolute top-8 right-8 p-3 rounded-2xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all z-20"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="relative z-10">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-music-primary to-music-accent flex items-center justify-center mb-6 shadow-xl shadow-music-primary/20">
              <Music2 className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
              {isLogin ? "Welcome Back" : "Start your Wave"}
            </h1>
            <p className="text-white/40 text-sm font-medium">
              {isLogin ? "Synchronize your library across devices" : "Create your free RelaxWave account"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-music-primary transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Enter your name"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-music-primary/30 outline-none transition-all"
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-music-primary transition-colors" />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-music-primary/30 outline-none transition-all"
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-music-primary transition-colors" />
                <input 
                  type="password" 
                  placeholder="••••••••"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-music-primary/30 outline-none transition-all"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-music-pink text-xs font-bold text-center bg-music-pink/10 py-3 rounded-xl"
              >
                {error}
              </motion.p>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 rounded-2xl bg-white text-black font-black flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50"
            >
              {isLoading ? (
                <Zap className="w-5 h-5 animate-pulse" />
              ) : (
                <>
                  {isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="text-white/40 text-sm font-bold hover:text-white transition-colors"
            >
              {isLogin ? "Don't have an account? Join the Wave" : "Already have an account? Sign in"}
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
