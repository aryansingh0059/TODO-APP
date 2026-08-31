const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const DATA_FILE = path.join(__dirname, '../data/todos.json');

// ─── File Helpers ─────────────────────────────────────────────────────────────

async function readTodos() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      return [];
    }
    throw err;
  }
}

async function writeTodos(todos) {
  await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), 'utf-8');
}

// ─── User-Isolated Service Functions ──────────────────────────────────────────

/**
 * Get all todos owned by a specific user.
 * @param {string} userId
 * @returns {Promise<Array>}
 */
async function getAllTodos(userId) {
  const todos = await readTodos();
  return todos.filter((t) => t.userId === userId);
}

/**
 * Get a single todo by ID owned by a specific user.
 * @param {string} id
 * @param {string} userId
 * @returns {Promise<Object|null>}
 */
async function getTodoById(id, userId) {
  const todos = await readTodos();
  return todos.find((t) => t.id === id && t.userId === userId) || null;
}

/**
 * Create a new todo for a specific user.
 * @param {{ title: string, description?: string, priority?: string, dueDate?: string|null }} data
 * @param {string} userId
 * @returns {Promise<Object>}
 */
async function createTodo(data, userId) {
  const todos = await readTodos();

  const now = new Date().toISOString();
  const todo = {
    id: crypto.randomUUID(),
    userId,
    title: data.title.trim(),
    description: data.description ? data.description.trim() : '',
    completed: false,
    priority: data.priority || 'medium',
    dueDate: data.dueDate || null,
    createdAt: now,
    updatedAt: now,
  };

  todos.push(todo);
  await writeTodos(todos);
  return todo;
}

/**
 * Update an existing todo owned by a specific user.
 * @param {string} id
 * @param {{ title?: string, description?: string, completed?: boolean, priority?: string, dueDate?: string|null }} data
 * @param {string} userId
 * @returns {Promise<Object|null>}
 */
async function updateTodo(id, data, userId) {
  const todos = await readTodos();
  const index = todos.findIndex((t) => t.id === id && t.userId === userId);

  if (index === -1) return null;

  const existing = todos[index];
  const updated = {
    ...existing,
    ...(data.title !== undefined && { title: data.title.trim() }),
    ...(data.description !== undefined && { description: data.description.trim() }),
    ...(data.completed !== undefined && { completed: data.completed }),
    ...(data.priority !== undefined && { priority: data.priority }),
    ...(data.dueDate !== undefined && { dueDate: data.dueDate }),
    updatedAt: new Date().toISOString(),
  };

  todos[index] = updated;
  await writeTodos(todos);
  return updated;
}

/**
 * Delete a todo by ID owned by a specific user.
 * @param {string} id
 * @param {string} userId
 * @returns {Promise<boolean>} true if deleted, false if not found
 */
async function deleteTodo(id, userId) {
  const todos = await readTodos();
  const index = todos.findIndex((t) => t.id === id && t.userId === userId);

  if (index === -1) return false;

  todos.splice(index, 1);
  await writeTodos(todos);
  return true;
}

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};
