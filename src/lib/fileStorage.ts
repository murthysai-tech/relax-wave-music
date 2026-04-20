import fs from 'node:fs/promises';
import path from 'node:path';

const DATA_DIR = path.join(process.cwd(), 'data');

async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

async function readFile(filename: string) {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

async function writeFile(filename: string, data: any) {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// User Operations
export async function getLocalUsers() {
  return await readFile('users.json');
}

export async function findLocalUser(query: any) {
  const users = await getLocalUsers();
  return users.find((u: any) => {
    // Handle $or query (common in login/register)
    if (query.$or) {
      return query.$or.some((subQuery: any) => {
        if (subQuery.email) return u.email.toLowerCase() === subQuery.email.toLowerCase();
        if (subQuery.username) return u.username === subQuery.username;
        return false;
      });
    }

    if (query.email) return u.email.toLowerCase() === query.email.toLowerCase();
    if (query.username) return u.username === query.username;
    if (query.id) return u.id === query.id || u._id === query.id;
    return false;
  });
}

export async function createLocalUser(userData: any) {
  const users = await getLocalUsers();
  const newUser = {
    ...userData,
    _id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    listeningHistory: [],
    provider: 'local',
  };
  users.push(newUser);
  await writeFile('users.json', users);
  return newUser;
}

export async function updateLocalUser(userId: string, update: any) {
  const users = await getLocalUsers();
  const index = users.findIndex((u: any) => u._id === userId || u.id === userId);
  if (index !== -1) {
    users[index] = { ...users[index], ...update };
    await writeFile('users.json', users);
    return users[index];
  }
  return null;
}

// History Operations
export async function addLocalHistory(userId: string, songId: string) {
  const users = await getLocalUsers();
  const index = users.findIndex((u: any) => u._id === userId || u.id === userId);
  if (index !== -1) {
    const historyItem = { songId, playedAt: new Date().toISOString() };
    if (!users[index].listeningHistory) users[index].listeningHistory = [];
    
    // Add to beginning and slice to 50
    users[index].listeningHistory.unshift(historyItem);
    users[index].listeningHistory = users[index].listeningHistory.slice(0, 50);
    
    await writeFile('users.json', users);
    return true;
  }
  return false;
}

// Playlist Operations
export async function getLocalPlaylists(userId: string) {
  const playlists = await readFile('playlists.json');
  return playlists.filter((p: any) => p.userId === userId);
}

export async function createLocalPlaylist(playlistData: any) {
  const playlists = await readFile('playlists.json');
  const newPlaylist = {
    ...playlistData,
    _id: Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
  };
  playlists.push(newPlaylist);
  await writeFile('playlists.json', playlists);
  return newPlaylist;
}
