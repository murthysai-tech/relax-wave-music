const express = require('express');
const router = express.Router();
const {
  getSongs,
  getSongById,
  toggleFavorite,
  recordPlay,
  getRecommendations
} = require('../controllers/musicController');
const { protect } = require('../middleware/authMiddleware');

router.route('/songs').get(getSongs);
router.route('/songs/:id').get(getSongById);

// Protected routes
router.route('/favorites/:id').post(protect, toggleFavorite);
router.route('/play/:id').post(protect, recordPlay);
router.route('/recommendations').get(protect, getRecommendations);

module.exports = router;
