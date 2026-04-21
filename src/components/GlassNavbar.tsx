"use client";

import React, { useState, useEffect } from "react";
import { Search, Music2, Bell, User, Menu, X, Home as HomeIcon, Compass, Library, Mic2, Globe, ChevronDown, LogOut, PlusSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface GlassNavbarProps {
  currentLanguage: string;
  onLanguageChange: (lang: string) => void;
  activeNav?: string;
  onNavChange?: (id: string) => void;
  onAuthClick?: () => void;
  onHomeClick?: () => void;
}

export function GlassNavbar({ currentLanguage, onLanguageChange, activeNav, onNavChange, onAuthClick, onHomeClick }: GlassNavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [user, setUser] = useState<{ name: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    
    // Check for user session
    const savedUser = localStorage.getItem("relaxwave_user");
    if (savedUser) setUser(JSON.parse(savedUser));

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("relaxwave_token");
    localStorage.removeItem("relaxwave_user");
    setUser(null);
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
    router.push("/login"); // This will now lead to the landing gateway
    router.refresh();
  };

  const languages = [
    { id: 'telugu', label: 'Telugu' },
    { id: 'hindi', label: 'Hindi' },
    { id: 'english', label: 'English' }
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-[1000] transition-all duration-500 px-4 py-4 md:px-8 ${
      isScrolled ? "pt-2" : "pt-6"
    }`}>
      <div className={`mx-auto max-w-7xl transition-all duration-500 ${
        isScrolled ? "bg-black/40 backdrop-blur-2xl rounded-[2rem] px-6 py-3 shadow-2xl border-none" : "bg-transparent px-0 border-none"
      }`}>
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" onClick={(e) => { e.preventDefault(); onHomeClick?.(); }} className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-white/10 rounded-2xl flex items-center justify-center shadow-lg group-hover:rotate-12 transition-transform duration-500 backdrop-blur-md border-none">
              <Music2 className="text-white w-6 h-6 md:w-7 md:h-7" />
            </div>
            <span className="text-xl md:text-2xl font-black tracking-tighter text-white hidden sm:block uppercase">
              RELAX<span className="text-music-accent">WAVE</span>
            </span>
          </Link>

          {/* Desktop Nav - Symbols Only */}
          <div className="hidden md:flex items-center gap-8">
            {[
              { id: 'home', icon: HomeIcon, label: 'Home' },
              { id: 'browse', icon: Compass, label: 'Browse' },
              { id: 'playlists', icon: Library, label: 'Playlists' },
              { id: 'artists', icon: Mic2, label: 'Artists' },
              { id: 'search', icon: Search, label: 'Search' }
            ].map((item) => (
              <button 
                key={item.id} 
                title={item.label}
                onClick={() => onNavChange?.(item.id)}
                className={`transition-all duration-300 transform hover:scale-110 relative group p-3 rounded-2xl ${
                  activeNav === item.id 
                    ? "bg-[#51bdb2] text-white shadow-[inset_0_2px_4px_rgba(0,0,0,0.2)]" 
                    : "text-white/70 hover:text-white"
                }`}
              >
                <item.icon className="w-5 h-5" />
                <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 bg-white transition-all duration-300 ${
                  activeNav === item.id ? "w-0" : "w-0 group-hover:w-full"
                }`} />
              </button>
            ))}

            {/* Language Selector */}
            <div className="relative">
              <button 
                onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
                className="flex items-center gap-2 text-white/70 hover:text-white transition-all transform hover:scale-110 p-2 group"
                title="Select Language"
              >
                <Globe className="w-5 h-5" />
                <ChevronDown className={`w-3 h-3 transition-transform duration-300 ${isLangMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute top-full right-0 mt-4 w-40 bg-black/60 backdrop-blur-2xl rounded-2xl border border-white/10 p-2 shadow-2xl"
                  >
                    {languages.map((lang) => (
                      <button
                        key={lang.id}
                        onClick={() => {
                          onLanguageChange(lang.id);
                          setIsLangMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-bold transition-all ${
                          currentLanguage === lang.id 
                            ? "bg-white/20 text-white" 
                            : "text-white/60 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {lang.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            {user ? (
              <div className="relative">
                <div 
                  onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                  className="w-10 h-10 md:w-11 md:h-11 rounded-2xl bg-white/10 p-0.5 group cursor-pointer overflow-hidden border border-white/5 hover:border-music-accent/50 transition-all shadow-lg"
                >
                   <div className="w-full h-full rounded-[0.8rem] bg-gradient-to-br from-music-primary to-music-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                     <User className="text-white w-5 h-5" />
                   </div>
                </div>

                <AnimatePresence>
                  {isUserDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-4 w-56 bg-black/80 backdrop-blur-2xl rounded-3xl border border-white/10 p-3 shadow-2xl z-[1001]"
                    >
                      <div className="px-4 py-4 mb-2 border-b border-white/5">
                        <p className="text-[10px] font-black text-white/30 uppercase tracking-[0.2em] mb-1">Authenticated As</p>
                        <p className="text-sm font-bold text-white truncate">{user.name || 'Explorer'}</p>
                      </div>
                      
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-music-pink hover:bg-music-pink/10 transition-all group"
                      >
                        <LogOut className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        <span className="text-xs font-black uppercase tracking-widest">Sign Out</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link 
                href="/login"
                className="flex items-center gap-2 group p-1 pr-4 rounded-full bg-white/5 hover:bg-white hover:text-black transition-all border border-white/10"
              >
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:bg-black/20 transition-colors">
                  <User className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-black tracking-widest uppercase text-white group-hover:text-black">Join</span>
              </Link>
            )}
            <button 
              className="md:hidden p-2.5 rounded-xl bg-white/5 text-white"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-24 left-4 right-4 glass-panel-heavy rounded-[2.5rem] p-8 md:hidden shadow-2xl z-[999]"
          >
            <div className="flex flex-col gap-6">
              {['Home', 'Browse', 'Playlists', 'Artists'].map((item) => (
                <button 
                  key={item} 
                  onClick={() => {
                    onNavChange?.(item.toLowerCase());
                    setIsMobileMenuOpen(false);
                  }} 
                  className="text-2xl font-black text-white text-left hover:text-music-accent transition-colors"
                >
                  {item}
                </button>
              ))}
              {user && (
                <button 
                  onClick={handleLogout}
                  className="mt-4 flex items-center gap-3 text-music-pink font-black uppercase tracking-widest text-sm"
                >
                  <LogOut className="w-5 h-5" /> Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
