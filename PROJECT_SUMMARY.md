# Nebula Sound - Premium Music Platform Summary

## Project Overview
Nebula Sound is a standalone, production-ready music platform built with Next.js, Tailwind CSS, and GSAP. It features a stunning glassmorphism UI, a dark neon aesthetic, and interactive features designed to provide an immersive music experience.

## Key Features
- **Premium Glassmorphism UI**: Multi-layered glass panels with `backdrop-blur` and neon borders.
- **Advanced Animations**: GSAP entrance timelines and Framer Motion micro-interactions.
- **Dynamic Background**: Animated neon blobs with a grid and noise overlay.
- **Interactive Music Visualizer**: High-resolution, real-time Audio API canvas visualizer.
- **State Management**: Persistent "Favorites" and "Recently Played" tracks using `localStorage`.
- **Music Service**: Integrated with Jamendo API for a seamless, auth-free music library.
- **Floating Control Bar**: Premium playback control with progress tracking and volume adjustment.

## Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4 (Custom Neon Theme)
- **Animations**: GSAP (Timeline), Framer Motion (Components)
- **Icons**: Lucide React
- **Audio Logic**: Web Audio API (Analyzer Node)

## Setup and Run
1. Install dependencies: `npm install`
2. Run development server: `npm run dev`
3. Build for production: `npm run build`

## Project Structure
- `src/app/page.tsx`: Main platform orchestrator.
- `src/components/`: Modular glassmorphism components (Navbar, Player, Visualizer, etc).
- `src/hooks/useAudio.ts`: Core audio playback and persistence logic.
- `src/services/jamendo.ts`: API integration layer.
