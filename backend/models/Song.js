const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  artist: {
    type: String,
    required: true
  },
  album: {
    type: String,
    default: 'Single'
  },
  duration: {
    type: Number, // In seconds
    default: 0
  },
  audioUrl: {
    type: String,
    required: true
  },
  coverImage: {
    type: String,
    required: true
  },
  genre: {
    type: String,
    default: 'Pop'
  },
  plays: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Song', songSchema);
