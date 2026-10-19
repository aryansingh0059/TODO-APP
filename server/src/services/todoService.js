const mongoose = require('mongoose');
const Todo = require('../models/Todo');
const User = require('../models/User');

// ─── Shape helper ─────────────────────────────────────────────────────────────
function normalizeTodo(todo, extraFields = {}) {
  if (!todo) return null;
  return {
    id:             todo._id.toString(),
    userId:         todo.userId      ? todo.userId.toString()      : null,
    assignedTo:     todo.assignedTo  ? todo.assignedTo.toString()  : null,
    title:          todo.title,
    description:    todo.description || '',
    completed:      todo.completed,
    priority:       todo.priority,
    dueDate:        todo.dueDate || null,
    createdAt:      todo.createdAt,
    updatedAt:      todo.updatedAt,
    ...extraFields,
  };
}

// ─── Service Functions ────────────────────────────────────────────────────────

/**
 * Get the current user's own todos PLUS todos assigned to them by others.
 * Each todo carries:
 *   isOwn        – true if the logged-in user created it
 *   isAssignedToMe – true if someone else created it and assigned it to this user
 *   assignedByName – name of the creator when isAssignedToMe is true
 */
async function getAllTodos(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) return [];

  const uid = new mongoose.Types.ObjectId(userId);

  // Fetch: own todos OR todos assigned to me by others
  const todos = await Todo.find({
    $or: [
      { userId: uid },
      { assignedTo: uid, userId: { $ne: uid } },
    ],
  })
    .sort({ createdAt: -1 })
    .lean();

  if (!todos.length) return [];

  // Collect creator IDs for assigned-to-me todos so we can display "Assigned by X"
  const creatorIds = [
    ...new Set(
      todos
        .filter((t) => t.assignedTo?.toString() === userId && t.userId?.toString() !== userId)
        .map((t) => t.userId?.toString())
        .filter(Boolean)
    ),
  ];

  // Fetch creator names in one round-trip
  const creatorMap = {};
  if (creatorIds.length) {
    const creators = await User.find(
      { _id: { $in: creatorIds } },
      { name: 1 }
    ).lean();
    creators.forEach((c) => { creatorMap[c._id.toString()] = c.name; });
  }

  return todos.map((t) => {
    const isOwn         = t.userId?.toString() === userId;
    const isAssignedToMe = !isOwn && t.assignedTo?.toString() === userId;
    return normalizeTodo(t, {
      isOwn,
      isAssignedToMe,
      assignedByName: isAssignedToMe ? (creatorMap[t.userId?.toString()] || 'Someone') : null,
    });
  });
}

/**
 * Get a single todo by ID — visible if the user owns it OR is assigned to it.
 */
async function getTodoById(id, userId) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;
  const uid = new mongoose.Types.ObjectId(userId);
  const todo = await Todo.findOne({
    _id: id,
    $or: [{ userId: uid }, { assignedTo: uid }],
  }).lean();
  return normalizeTodo(todo);
}

/**
 * Create a new todo owned by the current user.
 */
async function createTodo(data, userId) {
  const todo = await Todo.create({
    userId,
    assignedTo: data.assignedTo || userId,
    title: data.title.trim(),
    description: data.description ? data.description.trim() : '',
    completed: false,
    priority: data.priority || 'medium',
    dueDate: data.dueDate || null,
  });
  return normalizeTodo(todo.toObject(), { isOwn: true, isAssignedToMe: false, assignedByName: null });
}

/**
 * Update a todo — only the owner can edit.
 */
async function updateTodo(id, data, userId) {
  if (!mongoose.Types.ObjectId.isValid(id)) return null;
  if (!mongoose.Types.ObjectId.isValid(userId)) return null;

  const updateFields = {};
  if (data.title !== undefined)       updateFields.title       = data.title.trim();
  if (data.description !== undefined) updateFields.description = data.description.trim();
  if (data.completed !== undefined)   updateFields.completed   = data.completed;
  if (data.priority !== undefined)    updateFields.priority    = data.priority;
  if (data.dueDate !== undefined)     updateFields.dueDate     = data.dueDate;
  if (data.assignedTo !== undefined)  updateFields.assignedTo  = data.assignedTo;

  const updated = await Todo.findOneAndUpdate(
    { _id: id, userId },           // only owner can update
    { $set: updateFields },
    { new: true, runValidators: true }
  ).lean();

  return normalizeTodo(updated);
}

/**
 * Delete a todo — only the owner can delete.
 */
async function deleteTodo(id, userId) {
  if (!mongoose.Types.ObjectId.isValid(id)) return false;
  if (!mongoose.Types.ObjectId.isValid(userId)) return false;
  const result = await Todo.findOneAndDelete({ _id: id, userId });
  return result !== null;
}

/**
 * Notifications for the current user:
 *   assigned  – todos assigned to me by someone else (not yet completed)
 *   upcoming  – my own todos due within the next 7 days (not completed)
 */
async function getNotifications(userId) {
  if (!mongoose.Types.ObjectId.isValid(userId)) return { assigned: [], upcoming: [] };

  const uid  = new mongoose.Types.ObjectId(userId);
  const now  = new Date();
  const in7d = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

  const [assignedRaw, upcomingRaw] = await Promise.all([
    // Tasks assigned TO me by someone else, incomplete
    Todo.find({ assignedTo: uid, userId: { $ne: uid }, completed: false })
      .sort({ createdAt: -1 })
      .lean(),
    // My own todos due within 7 days, incomplete
    Todo.find({ userId: uid, completed: false, dueDate: { $gte: now, $lte: in7d } })
      .sort({ dueDate: 1 })
      .lean(),
  ]);

  // Fetch creator names for assigned todos
  const creatorIds = [...new Set(assignedRaw.map((t) => t.userId?.toString()).filter(Boolean))];
  const creatorMap = {};
  if (creatorIds.length) {
    const creators = await User.find({ _id: { $in: creatorIds } }, { name: 1 }).lean();
    creators.forEach((c) => { creatorMap[c._id.toString()] = c.name; });
  }

  const assigned = assignedRaw.map((t) =>
    normalizeTodo(t, {
      isAssignedToMe: true,
      assignedByName: creatorMap[t.userId?.toString()] || 'Someone',
    })
  );

  const upcoming = upcomingRaw.map((t) => normalizeTodo(t));

  return { assigned, upcoming };
}

module.exports = {
  getAllTodos,
  getTodoById,
  createTodo,
  updateTodo,
  deleteTodo,
  getNotifications,
};
