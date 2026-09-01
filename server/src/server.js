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

// Trust reverse proxy (required for Render / Vercel for HTTPS & secure cookies)
app.set('trust proxy', 1);

// ─── Dynamic CORS Configuration ───────────────────────────────────────────────
const defaultOrigins = [
  'https://todo-app-smoky-pi-40.vercel.app',
  'http://localhost:3000',
  'http://localhost:5173',
  'http://localhost:8000',
];

const envOrigins = (process.env.CLIENT_ORIGIN || '')
  .split(',')
  .map((o) => o.trim().replace(/\/+$/, ''))
  .filter(Boolean);

const allowedOrigins = Array.from(new Set([...defaultOrigins, ...envOrigins]));

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl, server-to-server)
      if (!origin) return callback(null, true);
      const cleanedOrigin = origin.trim().replace(/\/+$/, '');
      if (allowedOrigins.includes(cleanedOrigin)) {
        return callback(null, true);
      }
      return callback(
        new Error(`CORS policy does not allow access from origin: ${origin}`)
      );
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(cookieParser());

// ─── Health Check Endpoints ───────────────────────────────────────────────────
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
  console.log(`Server running on port ${PORT}`);
  try {
    await userService.seedDemoUsersAndTodos();
    console.log('Demo user accounts and sample data verified.');
  } catch (err) {
    console.error('Failed to seed demo accounts:', err.message);
  }
});

module.exports = app;
