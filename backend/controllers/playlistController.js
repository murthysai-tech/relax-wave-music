const Playlist = require('../models/Playlist');

// @desc    Create a playlist
// @route   POST /api/playlists
// @access  Private
const createPlaylist = async (req, res, next) => {
  try {
    const { name, description, isPublic } = req.body;

    const playlist = await Playlist.create({
      name,
      description,
      isPublic,
      user: req.user.id
    });

    res.status(201).json(playlist);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's playlists
// @route   GET /api/playlists
// @access  Private
const getMyPlaylists = async (req, res, next) => {
  try {
    const playlists = await Playlist.find({ user: req.user.id }).populate('songs');
    res.status(200).json(playlists);
  } catch (error) {
    next(error);
  }
};

// @desc    Add song to playlist
// @route   POST /api/playlists/:playlistId/songs/:songId
// @access  Private
const addSongToPlaylist = async (req, res, next) => {
  try {
    const { playlistId, songId } = req.params;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      res.status(404);
      throw new Error('Playlist not found');
    }

    // Check ownership
    if (playlist.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }

    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

// @desc    Remove song from playlist
// @route   DELETE /api/playlists/:playlistId/songs/:songId
// @access  Private
const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { playlistId, songId } = req.params;

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
      res.status(404);
      throw new Error('Playlist not found');
    }

    // Check ownership
    if (playlist.user.toString() !== req.user.id) {
      res.status(401);
      throw new Error('User not authorized');
    }

    playlist.songs = playlist.songs.filter(id => id.toString() !== songId);
    await playlist.save();

    res.status(200).json(playlist);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createPlaylist,
  getMyPlaylists,
  addSongToPlaylist,
  removeSongFromPlaylist
};
