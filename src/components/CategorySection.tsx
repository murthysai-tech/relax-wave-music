"use client";

import React, { useRef } from "react";
import { LucideIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

interface CategorySectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
  horizontal?: boolean;
}

export function CategorySection({ title, icon: Icon, children, horizontal = false }: CategorySectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = window.innerWidth > 768 ? 600 : 300;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-music-primary/10 border border-music-primary/20 text-music-primary shadow-[0_0_15px_rgba(168,85,247,0.1)]">
            <Icon className="w-6 h-6" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">{title}</h2>
        </div>
        <div className="flex items-center gap-4">
          {horizontal && (
            <div className="flex items-center gap-2 hidden md:flex">
              <button 
                onClick={() => scroll('left')} 
                className="p-2 rounded-full bg-white/5 hover:bg-music-primary/20 hover:text-music-primary transition-all text-white/50 border border-white/5 hover:border-music-primary/30"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button 
                onClick={() => scroll('right')} 
                className="p-2 rounded-full bg-white/5 hover:bg-music-primary/20 hover:text-music-primary transition-all text-white/50 border border-white/5 hover:border-music-primary/30"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
          <button className="text-sm font-bold text-music-secondary hover:text-music-accent transition-colors uppercase tracking-widest hidden sm:block">
            View All
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className={
        horizontal 
          ? "flex overflow-x-auto gap-6 md:gap-8 pb-8 hide-scrollbar snap-x px-2 scroll-smooth"
          : "grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8"
      }>
        {horizontal ? React.Children.map(children, child => (
          <div className="shrink-0 w-[160px] md:w-[200px] lg:w-[220px] snap-start">
            {child}
          </div>
        )) : children}
      </div>
    </section>
  );
}
