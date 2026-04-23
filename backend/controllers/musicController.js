const Song = require('../models/Song');
const User = require('../models/User');

// @desc    Get all songs with pagination and filtering
// @route   GET /api/music/songs
// @access  Public
const getSongs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Filtering
    let query = {};
    if (req.query.genre) {
      query.genre = req.query.genre;
    }
    
    // Search by title or artist
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: 'i' } },
        { artist: { $regex: req.query.search, $options: 'i' } }
      ];
    }

    const songs = await Song.find(query).skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Song.countDocuments(query);

    res.status(200).json({
      success: true,
      count: songs.length,
      total,
      page,
      pages: Math.ceil(total / limit),
      data: songs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get a single song
// @route   GET /api/music/songs/:id
// @access  Public
const getSongById = async (req, res, next) => {
  try {
    const song = await Song.findById(req.params.id);
    if (!song) {
      res.status(404);
      throw new Error('Song not found');
    }
    res.status(200).json(song);
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle favorite song
// @route   POST /api/music/favorites/:id
// @access  Private
const toggleFavorite = async (req, res, next) => {
  try {
    const songId = req.params.id;
    const user = await User.findById(req.user.id);

    // Check if already favorited
    const isFavorited = user.favorites.includes(songId);

    if (isFavorited) {
      user.favorites = user.favorites.filter(id => id.toString() !== songId);
    } else {
      user.favorites.push(songId);
    }

    await user.save();
    res.status(200).json({ success: true, favorites: user.favorites });
  } catch (error) {
    next(error);
  }
};

// @desc    Record song play (adds to recently played and increments play count)
// @route   POST /api/music/play/:id
// @access  Private
const recordPlay = async (req, res, next) => {
  try {
    const songId = req.params.id;
    
    // Increment global play count
    await Song.findByIdAndUpdate(songId, { $inc: { plays: 1 } });

    // Update user's recently played
    const user = await User.findById(req.user.id);
    
    // Remove if it exists to put it at the start
    user.recentlyPlayed = user.recentlyPlayed.filter(id => id.toString() !== songId);
    
    // Add to beginning of array
    user.recentlyPlayed.unshift(songId);
    
    // Limit history to 50 songs
    if (user.recentlyPlayed.length > 50) {
      user.recentlyPlayed.pop();
    }

    await user.save();
    res.status(200).json({ success: true });
  } catch (error) {
    next(error);
  }
};

// @desc    Get basic recommendations based on favorites
// @route   GET /api/music/recommendations
// @access  Private
const getRecommendations = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).populate('favorites');
    
    // Basic logic: Find genres of favorited songs and suggest others
    const favoriteGenres = [...new Set(user.favorites.map(song => song.genre))];
    
    let recommendations = [];
    if (favoriteGenres.length > 0) {
      recommendations = await Song.find({
        genre: { $in: favoriteGenres },
        _id: { $nin: user.favorites.map(f => f._id) }
      }).limit(10);
    } else {
      // Fallback to most played songs
      recommendations = await Song.find().sort({ plays: -1 }).limit(10);
    }

    res.status(200).json(recommendations);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getSongs,
  getSongById,
  toggleFavorite,
  recordPlay,
  getRecommendations
};
