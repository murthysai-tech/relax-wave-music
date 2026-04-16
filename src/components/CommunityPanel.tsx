"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, ArrowUpRight, Send, Users, ShieldCheck } from "lucide-react";

export function CommunityPanel() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Toggle Button */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 right-8 z-[110] w-14 h-14 md:w-16 md:h-16 rounded-full bg-white text-[#51bdb2] flex items-center justify-center shadow-2xl shadow-black/20 group overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-white via-white to-gray-200 opacity-0 group-hover:opacity-100 transition-opacity" />
        <MessageSquare className="w-6 h-6 md:w-7 md:h-7 relative z-10" />
        <div className="absolute top-2 right-2 w-3 h-3 bg-music-pink rounded-full border-2 border-white animate-pulse" />
      </motion.button>

      {/* Side Panel Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000]"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-full max-w-md bg-stone-900 z-[1001] shadow-2xl flex flex-col border-l border-white/10"
            >
              {/* Header */}
              <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/20 backdrop-blur-md">
                <div className="flex items-center gap-4">
                   <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                     <Users className="text-white w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="text-xl font-black text-white tracking-tighter">COMMUNITY</h3>
                     <p className="text-xs text-white/40 font-bold uppercase tracking-widest">Connect with RelaxWave</p>
                   </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-3 rounded-2xl hover:bg-white/10 text-white/50 hover:text-white transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Message Feed (Placeholder) */}
              <div className="flex-1 overflow-y-auto p-6 space-y-6 hide-scrollbar">
                <div className="p-6 rounded-[2rem] bg-white/5 border border-white/10 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                    <ShieldCheck className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="text-white font-black mb-2 flex items-center gap-2">
                    RELAXWAVE CONNECT <ArrowUpRight className="w-4 h-4 text-music-accent" />
                  </h4>
                  <p className="text-white/60 text-sm leading-relaxed">
                    You and your friends can communicate directly through the app! Share playlists, discover new waves, and stay connected in the sound.
                  </p>
                </div>

                <div className="space-y-4">
                   {[
                     { user: "Sarah", msg: "This Telugu playlist is fire! 🔥" },
                     { user: "Mike", msg: "Just found a hidden gem in Hindi Trending." },
                     { user: "Dev", msg: "RelaxWave UI is so smooth now." }
                   ].map((item, i) => (
                     <div key={i} className="flex gap-4 items-start">
                        <div className="w-10 h-10 rounded-full bg-white/10 shrink-0" />
                        <div className="flex-1">
                           <p className="text-xs font-black text-music-accent mb-1">{item.user}</p>
                           <div className="p-4 rounded-2xl bg-white/5 border border-white/5 text-sm text-white/80">
                             {item.msg}
                           </div>
                        </div>
                     </div>
                   ))}
                </div>
              </div>

              {/* Footer Input */}
              <div className="p-6 bg-black/40 border-t border-white/10 backdrop-blur-md">
                 <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Type a message..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-6 pr-14 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all text-white placeholder:text-white/20"
                    />
                    <button className="absolute right-2 top-2 w-10 h-10 rounded-xl bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all">
                      <Send className="w-4 h-4" />
                    </button>
                 </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
