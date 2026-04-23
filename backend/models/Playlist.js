const mongoose = require('mongoose');

const playlistSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a playlist name']
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User'
  },
  description: {
    type: String,
    default: ''
  },
  isPublic: {
    type: Boolean,
    default: true
  },
  songs: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Song'
  }],
  coverImage: {
    type: String,
    default: 'https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Playlist', playlistSchema);
