const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// ─── User Service Functions ───────────────────────────────────────────────────

async function findByEmail(email) {
  const normalized = (email || '').toLowerCase().trim();
  return User.findOne({ email: normalized });
}

async function findById(id) {
  return User.findById(id);
}

async function createUser({ name, email, password }) {
  const normalizedEmail = (email || '').toLowerCase().trim();

  const existing = await User.findOne({ email: normalizedEmail });
  if (existing) {
    throw new Error('Email is already registered');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = await User.create({
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
  });

  return user.toSafeObject();
}

async function validatePassword(user, password) {
  return bcrypt.compare(password, user.passwordHash);
}

// Emails belonging to legacy test/demo accounts that should not appear in UI dropdowns
const SYSTEM_EMAILS = new Set([
  'demo@todoapp.local',
  'interviewer@todoapp.local',
  'alice@example.com',
  'bob@example.com',
]);

async function getAllUsers() {
  const users = await User.find({}, { passwordHash: 0 });
  return users
    .filter((u) => !SYSTEM_EMAILS.has(u.email))
    .map((u) => ({
      id: u._id.toString(),
      name: u.name,
      email: u.email,
      createdAt: u.createdAt,
    }));
}

// ─── Demo Account & Todo Seeding ──────────────────────────────────────────────

async function seedDemoUsersAndTodos() {
  const demoAccounts = [
    { name: 'Aryan Singh',  email: 'aryan@todoapp.local',  password: 'Aryan@12345' },
    { name: 'Rahul Sharma', email: 'rahul@todoapp.local',  password: 'Rahul@12345' },
  ];

  for (const account of demoAccounts) {
    let user = await User.findOne({ email: account.email });
    if (!user) {
      const salt = await bcrypt.genSalt(10);
      user = await User.create({
        name: account.name,
        email: account.email,
        passwordHash: await bcrypt.hash(account.password, salt),
      });
      console.log(`Seeded user: ${account.email}`);
    }
  }
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  validatePassword,
  getAllUsers,
  seedDemoUsersAndTodos,
};
