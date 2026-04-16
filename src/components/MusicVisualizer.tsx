import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MusicVisualizerProps {
  getAnalyzerData: () => Uint8Array;
  isPlaying: boolean;
}

export function MusicVisualizer({ getAnalyzerData, isPlaying }: MusicVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);

  const moodTexts = [
    "RELAXING WAVE",
    "SERENE SOUND",
    "DEEP COMFORT",
    "GENTLE BEAT",
    "PURE PEACE"
  ];

  const currentMood = moodTexts[0]; // For demo, can be randomized

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const render = () => {
      const data = getAnalyzerData();
      const width = canvas.width;
      const height = canvas.height;
      
      ctx.clearRect(0, 0, width, height);

      if (data.length === 0) {
        ctx.fillStyle = "rgba(81, 189, 178, 0.2)";
        const barWidth = (width / 64) - 2;
        for (let i = 0; i < 64; i++) {
          ctx.fillRect(i * (barWidth + 2), height - 2, barWidth, 2);
        }
      } else {
        const barWidth = (width / data.length) * 2.5;
        let x = 0;

        for (let i = 0; i < data.length; i++) {
          const barHeight = (data[i] / 255) * height;
          const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
          gradient.addColorStop(0, "rgba(81, 189, 178, 0.8)"); 
          gradient.addColorStop(0.5, "rgba(45, 212, 191, 0.8)");
          gradient.addColorStop(1, "rgba(153, 246, 228, 0.8)");

          ctx.fillStyle = gradient;
          ctx.shadowBlur = 15;
          ctx.shadowColor = "rgba(81, 189, 178, 0.5)";

          ctx.beginPath();
          ctx.roundRect(x, height - barHeight, barWidth, barHeight, [4, 4, 0, 0]);
          ctx.fill();

          x += barWidth + 2;
        }
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [getAnalyzerData, isPlaying]);

  return (
    <div className="w-full h-48 relative overflow-hidden rounded-[3rem] bg-black/40 backdrop-blur-3xl border border-white/10 shadow-2xl">
      <canvas 
        ref={canvasRef} 
        width={1200} 
        height={192} 
        className="w-full h-full object-cover opacity-80"
      />
      
      {/* Visual Overlays */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black/80 via-transparent to-black/20" />
      
      {/* Animated Mood Text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <AnimatePresence mode="wait">
          {isPlaying ? (
            <motion.h3
              key="playing"
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ 
                opacity: [0.3, 0.6, 0.3], 
                scale: [1, 1.05, 1],
                y: 0 
              }}
              transition={{ 
                duration: 4, 
                repeat: Infinity,
                ease: "easeInOut" 
              }}
              className="text-4xl md:text-6xl font-black text-white/20 tracking-[1em] select-none"
            >
              {currentMood}
            </motion.h3>
          ) : (
            <motion.h3
              key="paused"
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              className="text-2xl md:text-4xl font-black text-white/10 tracking-[0.5em] select-none uppercase"
            >
              System Paused
            </motion.h3>
          )}
        </AnimatePresence>
      </div>
      
      {/* Floating Blobs (Decoration) */}
      <div className="absolute -top-10 -left-10 w-32 h-32 bg-music-primary/20 blur-3xl rounded-full animate-float" />
      <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-music-accent/20 blur-3xl rounded-full animate-float" style={{ animationDelay: '2s' }} />
    </div>
  );
}
