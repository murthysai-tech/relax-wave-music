const express = require('express');
const router = express.Router();
const {
  createPlaylist,
  getMyPlaylists,
  addSongToPlaylist,
  removeSongFromPlaylist
} = require('../controllers/playlistController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .post(protect, createPlaylist)
  .get(protect, getMyPlaylists);

router.route('/:playlistId/songs/:songId')
  .post(protect, addSongToPlaylist)
  .delete(protect, removeSongFromPlaylist);

module.exports = router;
