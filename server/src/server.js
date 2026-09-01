require('dotenv').config();
const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const errorHandler = require('./middleware/errorHandler');
const todoRoutes = require('./routes/todoRoutes');
const authRoutes = require('./routes/authRoutes');
const userService = require('./services/userService');

const app = express();
const PORT = process.env.PORT || 8000;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(cookieParser());

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/', (_req, res) => {
  res.json({ success: true, message: 'Server is running' });
});
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

// ─── API Routes ───────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// ─── 404 for unknown API routes ───────────────────────────────────────────────
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ─── Centralized Error Handler ────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server & Seed Demo Data ────────────────────────────────────────────
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  try {
    await userService.seedDemoUsersAndTodos();
    console.log('Demo user accounts and sample data verified.');
  } catch (err) {
    console.error('Failed to seed demo accounts:', err.message);
  }
});

module.exports = app;
