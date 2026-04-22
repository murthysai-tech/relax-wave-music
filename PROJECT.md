# 🏜️ RelaxWave Music Platform - Project Documentation

This document provides a complete map of the RelaxWave architecture, explaining exactly what each file does and how the system works.

---

## 📂 Project Structure Map

### 🌐 Core Frontend (UI & Pages)
*   **`src/app/page.tsx`**: The heart of the website. Handles navigation (Home, Browse, Search, Artists), music filtering, and the main layout.
*   **`src/app/layout.tsx`**: Main wrapper that includes fonts and global styles.
*   **`src/app/admin/page.tsx`**: The restricted Admin Studio where you manage your song library.
*   **`src/app/login/page.tsx`**: Premium 3D flip-card login and registration gateway.

### 🧩 Components (Building Blocks)
*   **`src/components/GlassNavbar.tsx`**: The floating top navigation bar. Handles language switching and user sessions.
*   **`src/components/FloatingPlayer.tsx`**: The music control bar at the bottom. Includes Play/Pause, Seek, Volume, and the **"+" Playlist button**.
*   **`src/components/AdminDashboard.tsx`**: The logic and UI for the Admin panel (Add/Edit/Delete songs).
*   **`src/components/SongCard.tsx`**: The individual music tiles you see on the grid.
*   **`src/components/MusicVisualizer.tsx`**: The real-time animated audio spectrum.
*   **`src/components/PlaylistManager.tsx`**: The popup window for creating and managing your custom song collections.
*   **`src/components/CategorySection.tsx`**: A reusable grid layout for Genres, Moods, and Vaults.

### 🧠 Backend & APIs (The Brain)
*   **`src/app/api/songs/route.ts`**: Handles fetching, adding, updating, and deleting songs in MongoDB.
*   **`src/app/api/upload/route.ts`**: Handles saving `.mp3` and `.jpg` files from your PC to the server.
*   **`src/app/api/library/playlists/route.ts`**: Manages creating and fetching your playlists from the database.
*   **`src/app/api/library/playlists/update/route.ts`**: Specifically handles adding or removing songs from an existing playlist.
*   **`src/app/api/auth/login/route.ts`**: Verifies users and generates secure access tokens (JWT).
*   **`src/app/api/auth/register/route.ts`**: Handles new user sign-ups.

### 🗄️ Database & Storage (The Memory)
*   **`src/lib/db.ts`**: Establishes the connection to **MongoDB Atlas**.
*   **`src/lib/storageHub.ts`**: A "Smart Hub" that decides whether to use the Cloud Database or local files (offline fallback).
*   **`src/lib/fileStorage.ts`**: Handles local JSON storage for when the database is unavailable.
*   **`src/models/Song.ts`**: The database schema for songs (Name, Artist, Language, etc.).
*   **`src/models/User.ts`**: The database schema for user profiles and credentials.
*   **`src/models/Playlist.ts`**: The database schema for playlists (User, Name, Tracks).
*   **`public/uploads/`**: The folder on your PC where all your uploaded music and images are actually stored.

### 🛠️ Configuration & Environment
*   **`.env`**: **CRITICAL FILE.** Contains your MongoDB connection string, Email passwords, and Secret Keys.
*   **`next.config.ts`**: Configures the website settings and allowed image domains.
*   **`tailwind.config.ts`**: Defines the "Neon-Dark" color palette and custom animations.

---

## 🚀 Key Features Recap
1.  **Universal Search**: Searches your DB + YouTube to find any song in existence.
2.  **Auto-Sync Deletion**: Deleting a song from Admin also removes the physical file from your PC.
3.  **Cloud Playlists**: Your music collections are saved in MongoDB, not just your browser.
4.  **Admin Studio**: Full control over your music library without touching code.

---
*Created by Antigravity for RelaxWave (April 2026)*
