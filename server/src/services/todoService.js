const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const DATA_FILE = path.join(__dirname, '../data/todos.json');

// ─── File Helpers ─────────────────────────────────────────────────────────────

/**
 * Read all todos from the JSON file.
 * @returns {Promise<Array>}
 */
async function readTodos() {
  try {
    const raw = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    if (err.code === 'ENOENT') {
      // File doesn't exist yet; return empty list
      return [];
    }
    throw err;
  }
}

/**
 * Write todos array back to the JSON file.
 * @param {Array} todos
 */
async function writeTodos(todos) {
  await fs.writeFile(DATA_FILE, JSON.stringify(todos, null, 2), 'utf-8');
}

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * Get all todos.
 * @returns {Promise<Array>}
 */
async function getAllTodos() {
  return readTodos();
}

/**
 * Get a single todo by ID.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
async function getTodoById(id) {
  const todos = await readTodos();
  return todos.find((t) => t.id === id) || null;
}

/**
 * Create a new todo.
 * @param {{ title: string, description?: string, priority?: string, dueDate?: string|null }} data
 * @returns {Promise<Object>}
 */
async function createTodo(data) {
  const todos = await readTodos();

  const now = new Date().toISOString();
  const todo = {
    id: crypto.randomUUID(),
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
 * Update an existing todo.
 * @param {string} id
 * @param {{ title?: string, description?: string, completed?: boolean, priority?: string, dueDate?: string|null }} data
 * @returns {Promise<Object|null>}
 */
async function updateTodo(id, data) {
  const todos = await readTodos();
  const index = todos.findIndex((t) => t.id === id);

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
 * Delete a todo by ID.
 * @param {string} id
 * @returns {Promise<boolean>} true if deleted, false if not found
 */
async function deleteTodo(id) {
  const todos = await readTodos();
  const index = todos.findIndex((t) => t.id === id);

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
