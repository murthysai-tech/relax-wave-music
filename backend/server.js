const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { errorHandler } = require('./middleware/errorMiddleware');

// Load env vars
// We'll load the .env from the root directory
dotenv.config({ path: '../.env' });

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Enable CORS
app.use(cors());

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// Mount routers
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/music', require('./routes/musicRoutes'));
app.use('/api/playlists', require('./routes/playlistRoutes'));

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Spotify Clone API' });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
