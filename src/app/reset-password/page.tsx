"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, Sparkles, ArrowRight, Music2, CheckCircle2, ChevronLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      setError("Invalid or missing reset token.");
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setSuccess("Password updated successfully!");
      setTimeout(() => router.push("/login"), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative p-6 bg-[#050505]">
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-music-primary/20 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md relative z-10">
        <div className="glass-panel p-10 rounded-[3rem] border border-white/10 shadow-2xl">
          <div className="flex flex-col items-center mb-10">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-music-pink to-music-primary flex items-center justify-center mb-6 shadow-lg shadow-music-pink/20">
              <Lock className="text-white w-8 h-8" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase mb-2">New Password</h1>
            <p className="text-white/40 text-sm font-medium tracking-wide">Enter your new signature below</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">New Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-music-primary transition-colors" />
                  <input type="password" required value={newPassword} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-1 focus:ring-music-primary/30 outline-none transition-all" onChange={(e) => setNewPassword(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black text-white/40 uppercase tracking-widest ml-1">Confirm Password</label>
                <div className="relative group">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/20 group-focus-within:text-music-primary transition-colors" />
                  <input type="password" required value={confirmPassword} className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:ring-1 focus:ring-music-primary/30 outline-none transition-all" onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
              </div>
            </div>

            {error && <p className="text-music-pink text-[10px] uppercase font-black text-center bg-music-pink/10 py-3 rounded-xl tracking-tighter">{error}</p>}
            {success && (
              <div className="flex items-center justify-center gap-2 bg-music-primary/10 py-3 rounded-xl">
                <CheckCircle2 className="w-3 h-3 text-music-primary" />
                <p className="text-music-primary text-[10px] uppercase font-black tracking-tighter">{success}</p>
              </div>
            )}

            <button type="submit" disabled={isLoading || !!success} className="w-full py-5 rounded-2xl bg-white text-black font-black flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-95 transition-all shadow-xl disabled:opacity-50 mt-4">
              {isLoading ? "UPDATING..." : "RESET PASSWORD"}
            </button>
          </form>

          <div className="mt-8 text-center pt-8 border-t border-white/5">
            <Link href="/login" className="flex items-center justify-center gap-2 w-full text-white/40 text-xs font-black uppercase tracking-widest hover:text-white transition-colors">
              <ChevronLeft className="w-4 h-4" /> Back to Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
