const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const USERS_FILE = path.join(__dirname, '../data/users.json');
const TODOS_FILE = path.join(__dirname, '../data/todos.json');

// ─── File Helpers ─────────────────────────────────────────────────────────────

async function readUsers() {
  try {
    const raw = await fs.readFile(USERS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    }
    throw err;
  }
}

async function writeUsers(users) {
  await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2), 'utf-8');
}

async function readTodos() {
  try {
    const raw = await fs.readFile(TODOS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    }
    throw err;
  }
}

async function writeTodos(todos) {
  await fs.writeFile(TODOS_FILE, JSON.stringify(todos, null, 2), 'utf-8');
}

// ─── User Service Functions ───────────────────────────────────────────────────

async function findByEmail(email) {
  const users = await readUsers();
  const normalized = (email || '').toLowerCase().trim();
  return users.find((u) => u.email.toLowerCase() === normalized) || null;
}

async function findById(id) {
  const users = await readUsers();
  return users.find((u) => u.id === id) || null;
}

async function createUser({ name, email, password }) {
  const users = await readUsers();
  const normalizedEmail = (email || '').toLowerCase().trim();

  const existing = users.find((u) => u.email.toLowerCase() === normalizedEmail);
  if (existing) {
    throw new Error('Email is already registered');
  }

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  const user = {
    id: crypto.randomUUID(),
    name: name.trim(),
    email: normalizedEmail,
    passwordHash,
    createdAt: new Date().toISOString(),
  };

  users.push(user);
  await writeUsers(users);

  // Return user without passwordHash
  const { passwordHash: _, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async function validatePassword(user, password) {
  return bcrypt.compare(password, user.passwordHash);
}

// ─── Demo Account & Todo Seeding + Data Migration ─────────────────────────────

async function seedDemoUsersAndTodos() {
  let users = await readUsers();
  let todos = await readTodos();

  const demoEmail = 'demo@todoapp.local';
  const interviewerEmail = 'interviewer@todoapp.local';

  let demoUser = users.find((u) => u.email.toLowerCase() === demoEmail);
  let interviewerUser = users.find((u) => u.email.toLowerCase() === interviewerEmail);

  let usersUpdated = false;

  // 1. Seed Demo User if missing
  if (!demoUser) {
    const salt = await bcrypt.genSalt(10);
    demoUser = {
      id: crypto.randomUUID(),
      name: 'Demo User',
      email: demoEmail,
      passwordHash: await bcrypt.hash('Demo@12345', salt),
      createdAt: new Date().toISOString(),
    };
    users.push(demoUser);
    usersUpdated = true;
  }

  // 2. Seed Interviewer if missing
  if (!interviewerUser) {
    const salt = await bcrypt.genSalt(10);
    interviewerUser = {
      id: crypto.randomUUID(),
      name: 'Interviewer',
      email: interviewerEmail,
      passwordHash: await bcrypt.hash('Interview@12345', salt),
      createdAt: new Date().toISOString(),
    };
    users.push(interviewerUser);
    usersUpdated = true;
  }

  if (usersUpdated) {
    await writeUsers(users);
  }

  // 3. Migrate existing unowned Todos safely to Demo User
  let todosUpdated = false;
  todos = todos.map((t) => {
    if (!t.userId) {
      todosUpdated = true;
      return { ...t, userId: demoUser.id };
    }
    return t;
  });

  // 4. Seed sample tasks for Demo User if Demo User has no tasks
  const demoTodos = todos.filter((t) => t.userId === demoUser.id);
  if (demoTodos.length === 0) {
    const now = new Date();
    const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const nextWeek = new Date(now);
    nextWeek.setDate(now.getDate() + 5);
    const nextWeekStr = `${nextWeek.getFullYear()}-${String(nextWeek.getMonth() + 1).padStart(2, '0')}-${String(nextWeek.getDate()).padStart(2, '0')}`;

    const sampleTasks = [
      {
        id: crypto.randomUUID(),
        userId: demoUser.id,
        title: 'Prepare interview presentation',
        description: 'Review system architecture and project documentation',
        completed: false,
        priority: 'high',
        dueDate: todayStr,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: crypto.randomUUID(),
        userId: demoUser.id,
        title: 'Complete React full-stack assignment',
        description: 'Implement authentication and multi-view task navigation',
        completed: true,
        priority: 'high',
        dueDate: todayStr,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: crypto.randomUUID(),
        userId: demoUser.id,
        title: 'Study system design principles',
        description: 'Review database scaling, caching strategies, and load balancing',
        completed: false,
        priority: 'medium',
        dueDate: nextWeekStr,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      {
        id: crypto.randomUUID(),
        userId: demoUser.id,
        title: 'Review SQL & NOSQL queries',
        description: 'Practice optimization techniques and index analysis',
        completed: false,
        priority: 'low',
        dueDate: null,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
    ];

    todos.push(...sampleTasks);
    todosUpdated = true;
  }

  if (todosUpdated) {
    await writeTodos(todos);
  }
}

module.exports = {
  findByEmail,
  findById,
  createUser,
  validatePassword,
  seedDemoUsersAndTodos,
};
