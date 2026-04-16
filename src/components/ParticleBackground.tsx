"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ParticleBackground() {
  const [blobs, setBlobs] = useState<{ id: number; x: number; y: number; size: number; color: string; delay: number }[]>([]);

  useEffect(() => {
    const colors = ["rgba(255, 255, 255, 0.1)", "rgba(20, 184, 166, 0.2)", "rgba(45, 212, 191, 0.2)", "rgba(255, 255, 255, 0.05)"];
    const newBlobs = Array.from({ length: 8 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 400 + 200,
      color: colors[i % colors.length],
      delay: Math.random() * 10,
    }));
    setBlobs(newBlobs);
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-[#050505]">
      {/* Mesh Gradient / Blobs */}
      {blobs.map((blob) => (
        <motion.div
          key={blob.id}
          initial={{ x: `${blob.x}%`, y: `${blob.y}%`, opacity: 0 }}
          animate={{ 
            x: [`${blob.x}%`, `${(blob.x + 20) % 100}%`, `${blob.x}%`],
            y: [`${blob.y}%`, `${(blob.y + 20) % 100}%`, `${blob.y}%`],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            repeat: Infinity, 
            duration: 20 + blob.id * 2, 
            ease: "linear",
            delay: blob.delay 
          }}
          style={{
            position: "absolute",
            width: blob.size,
            height: blob.size,
            backgroundColor: blob.color,
            borderRadius: "50%",
            filter: "blur(100px)",
          }}
        />
      ))}

      {/* Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]" 
        style={{ 
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)`,
          backgroundSize: '40px 40px' 
        }} 
      />

      {/* Grain / Noise Filter */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none mix-blend-overlay"
           style={{ backgroundImage: `url("https://grainy-gradients.vercel.app/noise.svg")` }} />
    </div>
  );
}
