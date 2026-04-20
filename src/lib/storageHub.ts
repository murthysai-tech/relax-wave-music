import dbConnect from './db';
import User from '@/models/User';
import Playlist from '@/models/Playlist';
import * as fileStorage from './fileStorage';

export async function isDbOnline() {
  try {
    const conn = await dbConnect();
    return conn.readyState === 1;
  } catch {
    return false;
  }
}

export async function findUser(query: any) {
  if (await isDbOnline()) {
    try {
      const user = await User.findOne(query);
      if (user) return user;
    } catch (e) {
      console.warn("DB Find Error, falling back to local:", e);
    }
  }
  return await fileStorage.findLocalUser(query);
}

export async function createUser(userData: any) {
  if (await isDbOnline()) {
    try {
      return await User.create(userData);
    } catch (e) {
      console.warn("DB Create Error, falling back to local:", e);
    }
  }
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
