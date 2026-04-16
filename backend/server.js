// backend/server.js

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');

// Routes
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const adminRoutes = require('./routes/admin.routes');

const app = express();

// ── DB CONNECTION ───────────────────────────────
connectDB();

// ── MIDDLEWARE ──────────────────────────────────

// ✅ UPDATED CORS (PRODUCTION READY)
app.use(
  cors({
    origin: [
      'http://localhost:3000',
      'https://thefolio.vercel.app' // replace with your real Vercel URL
    ],
    credentials: true
  })
);

// If testing only, you can temporarily use:
// app.use(cors());

app.use(express.json());

// Serve uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── ROUTES ───────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);

// ── TEST ROUTE ───────────────────────────────────
app.get('/api', (req, res) => {
  res.send('API is running...');
});

// ── START SERVER ────────────────────────────────
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// ── DEBUG MIDDLEWARE (optional) ──────────────────
app.use((req, res, next) => {
  console.log("Request:", req.method, req.url);
  next();
});