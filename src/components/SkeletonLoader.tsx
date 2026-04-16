"use client";

import React from "react";
import { motion } from "framer-motion";

export function TrackSkeleton() {
  return (
    <div className="glass-panel rounded-[2rem] p-3 animate-pulse">
      <div className="aspect-square bg-white/5 rounded-[1.5rem] mb-4" />
      <div className="px-2">
        <div className="h-4 bg-white/10 rounded-full w-3/4 mb-2" />
        <div className="h-3 bg-white/5 rounded-full w-1/2" />
      </div>
    </div>
  );
}

export function HeroSkeleton() {
  return (
    <div className="w-full h-[400px] glass-panel-heavy rounded-[3rem] p-10 animate-pulse flex flex-col justify-end">
      <div className="h-12 bg-white/10 rounded-full w-1/3 mb-4" />
      <div className="h-6 bg-white/5 rounded-full w-2/3 mb-8" />
      <div className="h-14 bg-white/10 rounded-full w-40" />
    </div>
  );
}
