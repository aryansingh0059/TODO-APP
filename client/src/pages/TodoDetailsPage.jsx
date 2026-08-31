import { useState, useEffect } from 'react'
import { useSearchParams, useNavigate, Link } from 'react-router-dom'
import * as api from '../services/todoApi'
import Layout from '../components/Layout'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import PriorityBadge from '../components/PriorityBadge'
import TodoForm from '../components/TodoForm'

function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function formatDateTime(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function isOverdue(dueDate, completed) {
  if (!dueDate || completed) return false
  return new Date(dueDate) < new Date()
}

export default function TodoDetailsPage() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const id = searchParams.get('id')

  const [todo, setTodo] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Edit modal state
  const [editOpen, setEditOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Delete confirm state
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (!id) return

    let cancelled = false
    async function load() {
      setLoading(true)
      setError(null)
      try {
        const res = await api.getTodo(id)
        if (!cancelled) setTodo(res.data)
      } catch (err) {
        if (!cancelled) {
          setError(err.status === 404 ? 'Todo not found.' : err.message || 'Failed to load todo')
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [id])

  async function handleToggleComplete() {
    try {
      const res = await api.updateTodo(id, { completed: !todo.completed })
      setTodo(res.data)
    } catch (err) {
      alert(`Failed to update: ${err.message}`)
    }
  }

  async function handleEditSubmit(data) {
    setSubmitting(true)
    setSubmitError('')
    try {
      const res = await api.updateTodo(id, data)
      setTodo(res.data)
      setEditOpen(false)
    } catch (err) {
      setSubmitError(err.message || 'Failed to save changes')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete() {
    if (!window.confirm('Delete this todo? This cannot be undone.')) return
    setDeleting(true)
    try {
      await api.deleteTodo(id)
      navigate('/todos')
    } catch (err) {
      alert(`Failed to delete: ${err.message}`)
      setDeleting(false)
    }
  }

  const content = (() => {
    // ── No ID in URL ──────────────────────────────────────────────────
    if (!id) {
      return (
        <div className="page-wrapper">
          <header className="detail-header">
            <Link to="/todos" className="detail-back-btn">
              ← Back to Todos
            </Link>
          </header>
          <div className="alert alert-error">
            No todo ID provided in the URL. Please navigate from the todo list.
          </div>
        </div>
      )
    }

    // ── Loading ───────────────────────────────────────────────────────
    if (loading) {
      return (
        <div className="page-wrapper">
          <header className="detail-header">
            <Link to="/todos" className="detail-back-btn">← Back to Todos</Link>
          </header>
          <Loading message="Loading todo…" />
        </div>
      )
    }

    // ── Error / Not Found ─────────────────────────────────────────────
    if (error) {
      return (
        <div className="page-wrapper">
          <header className="detail-header">
            <Link to="/todos" className="detail-back-btn">← Back to Todos</Link>
          </header>
          <ErrorMessage message={error} />
        </div>
      )
    }

    if (!todo) return null

    const overdue = isOverdue(todo.dueDate, todo.completed)

    return (
      <div className="page-wrapper">
        {/* Back button */}
        <header className="detail-header">
          <Link to="/todos" className="detail-back-btn">
            ← Back to Todos
          </Link>
          <span
            className={`status-badge status-badge--${todo.completed ? 'completed' : 'active'}`}
          >
            {todo.completed ? 'Completed' : 'Active'}
          </span>
        </header>

        {/* Title */}
        <h1 className={`detail-title${todo.completed ? ' detail-title--completed' : ''}`}>
          {todo.title}
        </h1>

        {/* Description */}
        {todo.description && (
          <p className="detail-description">{todo.description}</p>
        )}

        {/* Metadata grid */}
        <div className="detail-meta-grid">
          <div className="detail-meta-item">
            <label>Priority</label>
            <p><PriorityBadge priority={todo.priority} /></p>
          </div>

          <div className="detail-meta-item">
            <label>Status</label>
            <p>{todo.completed ? 'Completed' : 'Active'}</p>
          </div>

          <div className="detail-meta-item">
            <label>Due date</label>
            <p className={overdue ? 'overdue' : ''}>
              {todo.dueDate ? formatDate(todo.dueDate) : 'Not set'}
              {overdue && ' (overdue)'}
            </p>
          </div>

          <div className="detail-meta-item">
            <label>Created</label>
            <p>{formatDateTime(todo.createdAt)}</p>
          </div>

          <div className="detail-meta-item">
            <label>Last updated</label>
            <p>{formatDateTime(todo.updatedAt)}</p>
          </div>

          <div className="detail-meta-item">
            <label>Todo ID</label>
            <p style={{ fontFamily: 'monospace', fontSize: '0.75rem', wordBreak: 'break-all' }}>
              {todo.id}
            </p>
          </div>
        </div>

        <div className="divider" />

        {/* Actions */}
        <div className="detail-actions">
          <button
            id="toggle-complete-btn"
            className="btn btn-primary"
            onClick={handleToggleComplete}
          >
            {todo.completed ? 'Mark as active' : 'Mark as complete'}
          </button>
          <button
            id="edit-todo-btn"
            className="btn btn-secondary"
            onClick={() => { setEditOpen(true); setSubmitError('') }}
          >
            Edit
          </button>
          <button
            id="delete-todo-btn"
            className="btn btn-danger"
            onClick={handleDelete}
            disabled={deleting}
          >
            {deleting ? 'Deleting…' : 'Delete'}
          </button>
        </div>

        {/* Edit modal */}
        {editOpen && (
          <div
            className="modal-overlay"
            onClick={(e) => e.target === e.currentTarget && setEditOpen(false)}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-modal-title"
          >
            <div className="modal">
              <h2 id="edit-modal-title" className="modal-title">Edit todo</h2>
              {submitError && (
                <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                  {submitError}
                </div>
              )}
              <TodoForm
                initialData={todo}
                onSubmit={handleEditSubmit}
                onCancel={() => setEditOpen(false)}
                submitting={submitting}
              />
            </div>
          </div>
        )}
      </div>
    )
  })()

  return (
    <Layout
      onOpenCreate={() => navigate('/todos')}
    >
      {content}
    </Layout>
  )
}
