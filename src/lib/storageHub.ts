import dbConnect from './db';
import User from '@/models/User';
import Playlist from '@/models/Playlist';
import * as fileStorage from './fileStorage';

export async function isDbOnline() {
  try {
    const conn = await dbConnect();
    const isOnline = conn.connection.readyState === 1;
    if (isOnline) {
      console.log("✅ Database is ONLINE. Using MongoDB Atlas.");
    }
    return isOnline;
  } catch {
    return false;
  }
}

export async function findUser(query: any) {
  if (await isDbOnline()) {
    try {
      console.log("🔍 Attempting to find user in MongoDB...");
      const user = await User.findOne(query);
      if (user) {
        console.log("✅ User found in MongoDB.");
        return user;
      }
    } catch (e) {
      console.warn("DB Find Error, falling back to local:", e);
    }
  }
  const localUser = await fileStorage.findLocalUser(query);
  if (localUser) {
    console.warn("📁 Found user in Local Offline Storage.");
  }
  return localUser;
}

export async function createUser(userData: any) {
  if (await isDbOnline()) {
    try {
      console.log("✍️ Attempting to create user in MongoDB...");
      const user = await User.create(userData);
      console.log("✅ User created successfully in MongoDB.");
      return user;
    } catch (e) {
      console.warn("DB Create Error, falling back to local:", e);
    }
  }
  console.warn("📁 Saving new user to Local Offline Storage.");
  return await fileStorage.createLocalUser(userData);
}

export async function updateUser(userId: string, update: any) {
  if (await isDbOnline()) {
    try {
      // Find if user exists in DB first
      const dbUser = await User.findById(userId);
      if (dbUser) {
        return await User.findByIdAndUpdate(userId, update, { new: true });
      }
    } catch (e) {
      console.warn("DB Update Error, falling back to local:", e);
    }
  }
  return await fileStorage.updateLocalUser(userId, update);
}

export async function addHistory(userId: string, songId: string) {
  if (await isDbOnline()) {
    try {
      const dbUser = await User.findById(userId);
      if (dbUser) {
        return await User.findByIdAndUpdate(userId, {
          $push: {
            listeningHistory: {
              $each: [{ songId, playedAt: new Date() }],
              $slice: -50,
              $sort: { playedAt: -1 }
            }
          }
        });
      }
    } catch (e) {
      console.warn("DB History Error, falling back to local:", e);
    }
  }
  return await fileStorage.addLocalHistory(userId, songId);
}

export async function getUserPlaylists(userId: string) {
  if (await isDbOnline()) {
    try {
      return await Playlist.find({ userId });
    } catch (e) {
      console.warn("DB Get Playlists Error, falling back to local:", e);
    }
  }
  return await fileStorage.getLocalPlaylists(userId);
}

export async function createPlaylist(playlistData: any) {
  if (await isDbOnline()) {
    try {
      return await Playlist.create(playlistData);
    } catch (e) {
      console.warn("DB Create Playlist Error, falling back to local:", e);
    }
  }
  return await fileStorage.createLocalPlaylist(playlistData);
}

export async function updatePlaylist(name: string, userId: string, tracks: any[]) {
  if (await isDbOnline()) {
    try {
      return await Playlist.findOneAndUpdate(
        { name, userId },
        { tracks },
        { new: true }
      );
    } catch (e) {
      console.warn("DB Update Playlist Error:", e);
    }
  }
  // Local update could be added to fileStorage if needed
  return null;
}
