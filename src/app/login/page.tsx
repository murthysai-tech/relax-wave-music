"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User, Sparkles, ArrowRight, Music2, Phone, Github, Instagram, Chrome } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [needsPhone, setNeedsPhone] = useState(false);
  const [tempUserId, setTempUserId] = useState("");
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
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
        router.push("/");
        router.refresh();
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

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    setError("");
    
    // Simulate social login payload
    const payload = {
      email: `user_${provider}@example.com`,
      name: `${provider.charAt(0).toUpperCase() + provider.slice(1)} User`,
      provider: provider,
      socialId: `social_${Math.random().toString(36).substr(2, 9)}`
    };

    try {
      const res = await fetch("/api/auth/social", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.needsPhone) {
        setNeedsPhone(true);
        setTempUserId(data.user.id);
        return;
      }

      if (!res.ok) {
        throw new Error(data.error || "Social login failed");
      }

      localStorage.setItem("relaxwave_token", data.token);
      localStorage.setItem("relaxwave_user", JSON.stringify(data.user));
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const res = await fetch("/api/user/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: tempUserId, phoneNumber: formData.phoneNumber }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      localStorage.setItem("relaxwave_token", data.token);
      localStorage.setItem("relaxwave_user", JSON.stringify(data.user));
      router.push("/");
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (needsPhone) {
    return (
      <div className="min-h-screen flex items-center justify-center relative p-6 bg-[#050505]">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-music-primary/20 blur-[120px] rounded-full" />
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md relative z-10">
          <div className="glass-panel p-10 rounded-[3rem] border border-white/10 shadow-2xl">
            <div className="flex flex-col items-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-music-primary to-music-accent flex items-center justify-center mb-6">
                <Phone className="text-white w-8 h-8" />
              </div>
              <h1 className="text-2xl font-black text-white tracking-tighter uppercase mb-2 text-center">Almost There!</h1>
              <p className="text-white/40 text-sm font-medium text-center">We need your phone number to complete your registration.</p>
            </div>
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Phone Number</label>
                <div className="relative group">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-music-primary transition-colors" />
                  <input 
                    type="tel" 
                    placeholder="+91 99999 99999"
                    required
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:ring-2 focus:ring-music-primary/30 outline-none transition-all"
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                </div>
              </div>
              <button type="submit" disabled={isLoading} className="w-full py-5 rounded-2xl bg-white text-black font-black flex items-center justify-center gap-3 hover:scale-[1.02] transition-all">
                {isLoading ? "UPDATING..." : "COMPLETE REGISTRATION"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6 bg-[#050505]">
      {/* Background blobs */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-music-primary/20 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-music-accent/20 blur-[120px] rounded-full" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="glass-panel p-10 rounded-[3rem] border border-white/10 shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-music-primary to-music-accent flex items-center justify-center mb-6 shadow-lg shadow-music-primary/20">
              <Music2 className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">
              {isLogin ? "Welcome Back" : "Join RelaxWave"}
            </h1>
            <p className="text-white/40 text-sm font-medium tracking-wide">
              {isLogin ? "Sign in to synchronize your waves" : "Create an account to save your library"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Full Name</label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-music-primary transition-colors" />
                    <input 
                      type="text" 
                      placeholder="John Doe"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-1 focus:ring-music-primary/30 outline-none transition-all"
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Phone Number</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-music-primary transition-colors" />
                    <input 
                      type="tel" 
                      placeholder="+91 99999 99999"
                      required
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-1 focus:ring-music-primary/30 outline-none transition-all"
                      onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            <div className="space-y-2">
              <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-music-primary transition-colors" />
                <input 
                  type="email" 
                  placeholder="name@example.com"
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-1 focus:ring-music-primary/30 outline-none transition-all"
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
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-1 focus:ring-music-primary/30 outline-none transition-all"
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {error && (
              <motion.p 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-music-pink text-[10px] uppercase font-black text-center bg-music-pink/10 py-3 rounded-xl tracking-tighter"
              >
                {error}
              </motion.p>
            )}

            <button 
              type="submit"
              disabled={isLoading}
              className="w-full py-5 rounded-2xl bg-white text-black font-black flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 mt-4"
            >
              {isLoading ? "Thinking..." : (
                <>
                  {isLogin ? "SIGN IN" : "CREATE ACCOUNT"}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8">
            <div className="relative mb-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
              <div className="relative flex justify-center text-xs uppercase font-black tracking-widest"><span className="bg-[#0f0f0f] px-4 text-white/20">Or Continue With</span></div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl transition-all group"
              >
                <Chrome className="w-5 h-5 text-white/40 group-hover:text-music-primary" />
                <span className="text-xs font-black text-white/60">GOOGLE</span>
              </button>
              <button 
                onClick={() => handleSocialLogin("instagram")}
                className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl transition-all group"
              >
                <Instagram className="w-5 h-5 text-white/40 group-hover:text-music-pink" />
                <span className="text-xs font-black text-white/60">INSTAGRAM</span>
              </button>
            </div>
          </div>

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(""); }}
              className="text-white/40 text-xs font-black uppercase tracking-widest hover:text-white transition-colors"
            >
              {isLogin ? "Join the Wave" : "Back to Sign In"}
            </button>
          </div>
        </div>

        <Link 
          href="/"
          className="flex items-center justify-center gap-2 mt-8 text-white/20 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.2em]"
        >
          <Sparkles className="w-4 h-4" /> Back to Explorations
        </Link>
      </motion.div>
    </div>
  );
}
