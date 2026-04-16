"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, X, Zap, ArrowRight, Music2, SwitchCamera } from "lucide-react";

interface AuthPanelProps {
  onClose: () => void;
  onSuccess: (user: any) => void;
}

export function AuthPanel({ onClose, onSuccess }: AuthPanelProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

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
        // Successful registration, flip to login
        setIsLogin(true);
        setError("Account created! Please sign in.");
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
      <div className="w-full max-w-lg perspective-[2000px]">
        <motion.div 
          animate={{ rotateX: isLogin ? 0 : 180 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          style={{ transformStyle: "preserve-3d" }}
          className="relative w-full h-[650px]"
        >
          {/* FRONT FACE (LOGIN) */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{ backfaceVisibility: "hidden" }}
          >
            <AuthCard 
              isLogin={true}
              onClose={onClose}
              onToggle={() => { setIsLogin(false); setError(""); }}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
              setFormData={setFormData}
              formData={formData}
            />
          </div>

          {/* BACK FACE (REGISTER) */}
          <div 
            className="absolute inset-0 w-full h-full backface-hidden"
            style={{ 
              backfaceVisibility: "hidden",
              transform: "rotateX(180deg)" 
            }}
          >
            <AuthCard 
              isLogin={false}
              onClose={onClose}
              onToggle={() => { setIsLogin(true); setError(""); }}
              onSubmit={handleSubmit}
              isLoading={isLoading}
              error={error}
              setFormData={setFormData}
              formData={formData}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}

function AuthCard({ 
  isLogin, 
  onClose, 
  onToggle, 
  onSubmit, 
  isLoading, 
  error, 
  setFormData, 
  formData 
}: any) {
  return (
    <div className="w-full h-full relative bg-[#0a0a0a] rounded-[3.5rem] border border-white/10 p-10 overflow-hidden shadow-2xl flex flex-col justify-center">
      {/* Background Accent */}
      <div className={`absolute -top-24 -right-24 w-64 h-64 blur-[100px] rounded-full ${isLogin ? 'bg-music-primary/20' : 'bg-music-accent/20'}`} />
      <div className={`absolute -bottom-24 -left-24 w-64 h-64 blur-[100px] rounded-full ${isLogin ? 'bg-music-accent/20' : 'bg-music-primary/20'}`} />

      <button 
        onClick={onClose}
        className="absolute top-8 right-8 p-3 rounded-2xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all z-20"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="relative z-10">
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-music-primary to-music-accent flex items-center justify-center mb-6 shadow-xl">
            <Music2 className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
            {isLogin ? "Welcome Back" : "Start your Wave"}
          </h1>
          <p className="text-white/40 text-sm font-medium">
            {isLogin ? "Synchronize your library across devices" : "Create your free account to save songs"}
          </p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          {!isLogin && (
            <div className="space-y-2 text-left">
              <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Username</label>
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-music-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Choose a username"
                  required={!isLogin}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-2 focus:ring-music-primary/30 outline-none transition-all"
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="space-y-2 text-left">
            <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Email</label>
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

          <div className="space-y-2 text-left">
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
              className={`text-xs font-bold text-center py-3 rounded-xl ${error.includes("created") ? "text-music-accent bg-music-accent/10" : "text-music-pink bg-music-pink/10"}`}
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

        <div className="mt-6 pt-6 border-t border-white/5 text-center">
          <button 
            onClick={onToggle}
            className="text-white/40 text-sm font-bold hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
          >
            {isLogin ? (
              <>
                <SwitchCamera className="w-4 h-4" /> Create new account
              </>
            ) : (
              "Already have an account? Sign in"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
