"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, User, Sparkles, ArrowRight, Music2, Phone, Camera, Globe, CheckCircle2, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ParticleBackground } from "@/components/ParticleBackground";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isForgot, setIsForgot] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [needsPhone, setNeedsPhone] = useState(false);
  const [tempUserId, setTempUserId] = useState("");
  const [showLanding, setShowLanding] = useState(true);
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phoneNumber: "",
    identifier: "", // for login (email or username)
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    if (isForgot) {
      handleForgotPassword();
      return;
    }

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin 
      ? { identifier: formData.identifier, password: formData.password }
      : formData;
    
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
        // Automatic login after registration
        if (data.user) {
          // If the backend returns a token or if we just want to show success first
          // Actually, let's just show success but allow them to click 'Sign In' with pre-filled data
          setIsLogin(true);
          setSuccess("Account created successfully!");
          setFormData({ ...formData, identifier: formData.username });
          
          // Optionally auto-redirect or auto-fill
          setTimeout(() => {
            setSuccess("Please click SIGN IN to enter!");
          }, 2000);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSuccess("Reset link sent! Please check your email.");
      setIsForgot(false);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true);
    setError("");
    
    const payload = {
      email: `user_${provider}@example.com`,
      username: `${provider.charAt(0).toUpperCase() + provider.slice(1)}_User`,
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

  if (showLanding) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-6 relative overflow-hidden selection:bg-music-primary/30">
        <ParticleBackground />
        
        {/* Background Glows */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-music-primary/20 blur-[150px] rounded-full pointer-events-none animate-pulse" />
        <div className="absolute top-1/4 right-1/4 w-[400px] h-[400px] bg-music-accent/10 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-10 flex flex-col items-center text-center max-w-4xl"
        >
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-24 h-24 md:w-32 md:h-32 bg-white/10 rounded-[2.5rem] flex items-center justify-center mb-12 backdrop-blur-xl border border-white/20 shadow-2xl"
          >
            <Music2 className="text-white w-12 h-12 md:w-16 md:h-16" />
          </motion.div>

          <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 tracking-tighter leading-none uppercase select-none">
            Your Personal <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-music-primary to-music-accent">Oasis</span> of Sound
          </h1>
          
          <p className="text-white/40 text-lg md:text-xl font-medium mb-12 max-w-lg leading-relaxed">
            Experience serene soundscapes in a stunning glassmorphism interface. Discover the future of music streaming.
          </p>

          <motion.button
            whileHover={{ scale: 1.05, boxShadow: "0 0 50px rgba(34,211,238,0.2)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowLanding(false)}
            className="group relative px-12 py-6 bg-white rounded-full flex items-center gap-4 transition-all"
          >
            <span className="text-black font-black uppercase tracking-widest text-sm">Start Your Journey</span>
            <div className="w-8 h-8 rounded-full bg-black/5 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="text-black w-5 h-5" />
            </div>
          </motion.button>
        </motion.div>

        {/* Floating Icons for decoration */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-1/4 text-white/5 pointer-events-none"
        >
          <Sparkles className="w-12 h-12" />
        </motion.div>
        <motion.div 
          animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-1/4 right-1/4 text-white/5 pointer-events-none"
        >
          <Globe className="w-16 h-16" />
        </motion.div>
      </div>
    );
  }

  if (needsPhone) {
    return (
      <div className="min-h-screen flex items-center justify-center relative p-6 bg-[#050505]">
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-music-primary/20 blur-[120px] rounded-full pointer-events-none" />
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
                    value={formData.phoneNumber}
                    autoComplete="tel"
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
    <div className="min-h-screen flex items-center justify-center relative p-6 bg-[#050505] overflow-hidden selection:bg-music-primary/30">
      <ParticleBackground />
      
      {/* Back to Landing Button */}
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => setShowLanding(true)}
        className="absolute top-8 left-8 z-50 flex items-center gap-2 text-white/30 hover:text-white transition-colors group px-4 py-2 rounded-full hover:bg-white/5"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span className="text-[10px] font-black uppercase tracking-widest">Back</span>
      </motion.button>

      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-music-primary/20 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-music-accent/20 blur-[120px] rounded-full pointer-events-none" />

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
              {isForgot ? "Reset Access" : (isLogin ? "Welcome Back" : "Join RelaxWave")}
            </h1>
            <p className="text-white/40 text-sm font-medium tracking-wide">
              {isForgot ? "We'll send a wave to your inbox" : (isLogin ? "Sign in with your signature" : "Claim your unique username")}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isForgot ? (
              <div className="space-y-2">
                <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Email Address</label>
                <div className="relative group">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-music-primary transition-colors" />
                  <input 
                    type="email" 
                    placeholder="name@example.com"
                    required
                    value={formData.email}
                    autoComplete="email"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-1 focus:ring-music-primary/30 outline-none transition-all"
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>
            ) : (
              <>
                {!isLogin && (
                  <>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Username</label>
                      <div className="relative group">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-music-primary transition-colors" />
                        <input 
                          type="text" 
                          placeholder="vincenzo_vikings"
                          required
                          value={formData.username}
                          autoComplete="username"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-1 focus:ring-music-primary/30 outline-none transition-all"
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
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
                          value={formData.phoneNumber}
                          autoComplete="tel"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-1 focus:ring-music-primary/30 outline-none transition-all"
                          onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Email Address</label>
                      <div className="relative group">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-music-primary transition-colors" />
                        <input 
                          type="email" 
                          placeholder="name@example.com"
                          required
                          value={formData.email}
                          autoComplete="email"
                          className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-1 focus:ring-music-primary/30 outline-none transition-all"
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>
                    </div>
                  </>
                )}

                {isLogin && (
                  <div className="space-y-2">
                    <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Email or Username</label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-music-primary transition-colors" />
                      <input 
                        type="text" 
                        placeholder="vincenzo or name@example.com"
                        required
                        value={formData.identifier}
                        autoComplete="username"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-1 focus:ring-music-primary/30 outline-none transition-all"
                        onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-black text-white/40 uppercase tracking-widest">Password</label>
                    {isLogin && (
                      <button 
                        type="button" 
                        onClick={() => { setIsForgot(true); setError(""); setSuccess(""); }}
                        className="text-[10px] font-black text-music-primary uppercase tracking-tighter hover:text-white transition-colors"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-music-primary transition-colors" />
                    <input 
                      type="password" 
                      placeholder="••••••••"
                      required
                      value={formData.password}
                      autoComplete={isLogin ? "current-password" : "new-password"}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-1 focus:ring-music-primary/30 outline-none transition-all"
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            <AnimatePresence>
              {error && (
                <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="text-music-pink text-[10px] uppercase font-black text-center bg-music-pink/10 py-3 rounded-xl tracking-tighter">
                  {error}
                </motion.p>
              )}
              {success && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex items-center justify-center gap-2 bg-music-primary/10 py-3 rounded-xl">
                  <CheckCircle2 className="w-3 h-3 text-music-primary" />
                  <p className="text-music-primary text-[10px] uppercase font-black tracking-tighter">{success}</p>
                </motion.div>
              )}
            </AnimatePresence>

            <button type="submit" disabled={isLoading} className="w-full py-5 rounded-2xl bg-white text-black font-black flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 mt-4">
              {isLoading ? "SYCHRONIZING..." : (
                <>
                  {isForgot ? "SEND RESET LINK" : (isLogin ? "SIGN IN" : "CREATE ACCOUNT")}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {!isForgot && (
            <div className="mt-8">
              <div className="relative mb-8">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                <div className="relative flex justify-center text-xs uppercase font-black tracking-widest"><span className="bg-[#0f0f0f] px-4 text-white/20">Or</span></div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button onClick={() => handleSocialLogin("google")} className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl transition-all group">
                  <Globe className="w-5 h-5 text-white/40 group-hover:text-music-primary" />
                  <span className="text-xs font-black text-white/60">GOOGLE</span>
                </button>
                <button onClick={() => handleSocialLogin("instagram")} className="flex items-center justify-center gap-3 bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl transition-all group">
                  <Camera className="w-5 h-5 text-white/40 group-hover:text-music-pink" />
                  <span className="text-xs font-black text-white/60">INSTA</span>
                </button>
              </div>
            </div>
          )}

          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            {isForgot ? (
              <button onClick={() => { setIsForgot(false); setError(""); setSuccess(""); }} className="flex items-center justify-center gap-2 w-full text-white/40 text-xs font-black uppercase tracking-widest hover:text-white transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back to Sign In
              </button>
            ) : (
              <button onClick={() => { setIsLogin(!isLogin); setError(""); setSuccess(""); }} className="text-white/40 text-xs font-black uppercase tracking-widest hover:text-white transition-colors">
                {isLogin ? "Join the Wave" : "Back to Sign In"}
              </button>
            )}
          </div>
        </div>

        <Link href="/" className="flex items-center justify-center gap-2 mt-8 text-white/20 hover:text-white transition-colors text-xs font-black uppercase tracking-[0.2em]">
          <Sparkles className="w-4 h-4" /> Back to Explorations
        </Link>
      </motion.div>
    </div>
  );
}
