/**
 * Request validation middleware for Todo creation and update operations.
 * Validates title, priority, completed, and dueDate fields.
 */

const VALID_PRIORITIES = ['low', 'medium', 'high'];

function validateTodo(req, res, next) {
  const errors = [];
  const { title, priority, completed, dueDate } = req.body;

  // title: required on create (POST), optional on update (PUT)
  if (req.method === 'POST') {
    if (title === undefined || title === null) {
      errors.push('title is required');
    } else if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push('title must be a non-empty string');
    }
  } else if (title !== undefined) {
    if (typeof title !== 'string' || title.trim().length === 0) {
      errors.push('title must be a non-empty string');
    }
  }

  // priority: must be one of the valid values if provided
  if (priority !== undefined) {
    if (!VALID_PRIORITIES.includes(priority)) {
      errors.push(`priority must be one of: ${VALID_PRIORITIES.join(', ')}`);
    }
  }

  // completed: must be boolean if provided
  if (completed !== undefined && typeof completed !== 'boolean') {
    errors.push('completed must be a boolean');
  }

  // dueDate: must be a valid date string if provided (null is allowed to clear)
  if (dueDate !== undefined && dueDate !== null) {
    const date = new Date(dueDate);
    if (isNaN(date.getTime())) {
      errors.push('dueDate must be a valid date string or null');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({ success: false, message: errors.join('; ') });
  }

  next();
}

module.exports = validateTodo;
