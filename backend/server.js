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
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

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
  console.log(`Server running on http://localhost:${PORT}`);
});

app.use((req, res, next) => {
  console.log("Request:", req.method, req.url);
  next();
});