"use client";

import React from "react";
import { LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

interface CategorySectionProps {
  title: string;
  icon: LucideIcon;
  children: React.ReactNode;
}

export function CategorySection({ title, icon: Icon, children }: CategorySectionProps) {
  return (
    <section className="mb-16">
      <div className="flex items-center justify-between mb-8 px-2">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-music-primary/10 border border-music-primary/20 text-music-primary shadow-[0_0_15px_rgba(168,85,247,0.1)]">
            <Icon className="w-6 h-6" />
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">{title}</h2>
        </div>
        <button className="text-sm font-bold text-music-secondary hover:text-music-accent transition-colors uppercase tracking-widest">
          View All
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6 md:gap-8">
        {children}
      </div>
    </section>
  );
}
