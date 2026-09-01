const jwt = require('jsonwebtoken');
const userService = require('../services/userService');

const JWT_SECRET = process.env.JWT_SECRET || 'ziptrrip-todo-dev-secret-key-change-in-production';
const isProduction = process.env.NODE_ENV === 'production';

const COOKIE_OPTIONS = {
  httpOnly: true,
  path: '/',
  sameSite: isProduction ? 'none' : 'lax',
  secure: isProduction,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

// Options used when clearing — must match the set options attributes (except maxAge)
const COOKIE_CLEAR_OPTIONS = {
  httpOnly: true,
  path: '/',
  sameSite: isProduction ? 'none' : 'lax',
  secure: isProduction,
};

function generateToken(user) {
  return jwt.sign(
    { id: user.id, email: user.email, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// ─── POST /api/auth/register ──────────────────────────────────────────────────
async function register(req, res, next) {
  try {
    const { name, email, password, confirmPassword } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: 'Name is required' });
    }

    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please enter a valid email address' });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters long' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    const existing = await userService.findByEmail(email);
    if (existing) {
      return res.status(400).json({ success: false, message: 'An account with this email already exists' });
    }

    await userService.createUser({ name, email, password });

    // Registration does NOT create a session.
    // The user must explicitly log in after registering.
    res.status(201).json({
      success: true,
      message: 'Account created successfully',
    });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/auth/login ─────────────────────────────────────────────────────
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await userService.findByEmail(email);
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isValid = await userService.validatePassword(user, password);
    if (!isValid) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user);

    res.cookie('token', token, COOKIE_OPTIONS);
    res.status(200).json({
      success: true,
      data: { id: user.id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/auth/logout ────────────────────────────────────────────────────
async function logout(_req, res) {
  res.clearCookie('token', COOKIE_CLEAR_OPTIONS);
  res.status(200).json({ success: true, message: 'Logged out successfully' });
}

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────
async function me(req, res) {
  if (!req.user) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  const user = await userService.findById(req.user.id);
  if (!user) {
    return res.status(401).json({ success: false, message: 'User not found' });
  }
  res.status(200).json({
    success: true,
    data: { id: user.id, name: user.name, email: user.email },
  });
}

module.exports = {
  register,
  login,
  logout,
  me,
};
