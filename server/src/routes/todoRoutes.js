const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const validateTodo = require('../middleware/validateTodo');

// GET all todos
router.get('/', todoController.getAllTodos);

// GET single todo by ID
router.get('/:id', todoController.getTodoById);

// POST create new todo
router.post('/', validateTodo, todoController.createTodo);

// PUT update existing todo
router.put('/:id', validateTodo, todoController.updateTodo);

// DELETE remove todo
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
