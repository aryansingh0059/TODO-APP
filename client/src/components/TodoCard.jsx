import { useNavigate } from 'react-router-dom'
import PriorityBadge from './PriorityBadge'

function formatDate(dateStr) {
  if (!dateStr) return null
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function isOverdue(dueDate, completed) {
  if (!dueDate || completed) return false
  return new Date(dueDate) < new Date()
}

export default function TodoCard({ todo, onToggle, onEdit, onDelete }) {
  const navigate = useNavigate()
  const overdue = isOverdue(todo.dueDate, todo.completed)

  function handleTitleClick() {
    navigate(`/todo?id=${todo.id}`)
  }

  function handleToggle(e) {
    e.stopPropagation()
    onToggle(todo.id, !todo.completed)
  }

  function handleEdit(e) {
    e.stopPropagation()
    onEdit(todo)
  }

  function handleDelete(e) {
    e.stopPropagation()
    onDelete(todo.id)
  }

  return (
    <div className={`todo-item${todo.completed ? ' todo-item--completed' : ''}`}>
      <input
        type="checkbox"
        className="todo-checkbox"
        checked={todo.completed}
        onChange={handleToggle}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />

      <div className="todo-content">
        <div
          className="todo-title"
          onClick={handleTitleClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => e.key === 'Enter' && handleTitleClick()}
          aria-label={`View details for ${todo.title}`}
        >
          {todo.title}
        </div>

        {todo.description && (
          <p className="todo-description" title={todo.description}>
            {todo.description}
          </p>
        )}

        <div className="todo-meta">
          <PriorityBadge priority={todo.priority} />
          {todo.dueDate && (
            <span className={`todo-meta-text${overdue ? ' overdue' : ''}`}>
              {overdue ? '⚠ ' : ''}Due {formatDate(todo.dueDate)}
            </span>
          )}
          <span className="todo-meta-text">
            Created {formatDate(todo.createdAt)}
          </span>
        </div>
      </div>

      <div className="todo-actions">
        <button
          className="btn btn-ghost btn-icon btn-sm"
          onClick={handleEdit}
          aria-label={`Edit "${todo.title}"`}
          title="Edit"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
          </svg>
        </button>
        <button
          className="btn btn-ghost btn-icon btn-sm"
          onClick={handleDelete}
          aria-label={`Delete "${todo.title}"`}
          title="Delete"
          style={{ color: 'var(--color-danger)' }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
          </svg>
        </button>
      </div>
    </div>
  )
}
