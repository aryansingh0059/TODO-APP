const todoService = require('../services/todoService');

// ─── GET /api/todos ───────────────────────────────────────────────────────────
async function getAllTodos(req, res, next) {
  try {
    const todos = await todoService.getAllTodos(req.user.id);
    res.status(200).json({ success: true, data: todos });
  } catch (err) {
    next(err);
  }
}

// ─── GET /api/todos/:id ────────────────────────────────────────────────────────
async function getTodoById(req, res, next) {
  try {
    const todo = await todoService.getTodoById(req.params.id, req.user.id);
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.status(200).json({ success: true, data: todo });
  } catch (err) {
    next(err);
  }
}

// ─── POST /api/todos ──────────────────────────────────────────────────────────
async function createTodo(req, res, next) {
  try {
    const todo = await todoService.createTodo(req.body, req.user.id);
    res.status(201).json({ success: true, data: todo });
  } catch (err) {
    next(err);
  }
}

// ─── PUT /api/todos/:id ────────────────────────────────────────────────────────
async function updateTodo(req, res, next) {
  try {
    const todo = await todoService.updateTodo(req.params.id, req.body, req.user.id);
    if (!todo) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.status(200).json({ success: true, data: todo });
  } catch (err) {
    next(err);
  }
}

// ─── DELETE /api/todos/:id ─────────────────────────────────────────────────────
async function deleteTodo(req, res, next) {
  try {
    const deleted = await todoService.deleteTodo(req.params.id, req.user.id);
    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Todo not found' });
    }
    res.status(200).json({ success: true, message: 'Todo deleted successfully' });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
};
