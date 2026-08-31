import { useState, useMemo, useEffect, useCallback } from 'react'
import { useTodos } from '../hooks/useTodos'
import TodoCard from '../components/TodoCard'
import TodoFilter from '../components/TodoFilter'
import SearchBar from '../components/SearchBar'
import EmptyState from '../components/EmptyState'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import TodoForm from '../components/TodoForm'

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

function applyFilter(todos, filter) {
  if (filter === 'active') return todos.filter((t) => !t.completed)
  if (filter === 'completed') return todos.filter((t) => t.completed)
  return todos
}

function applySearch(todos, query) {
  if (!query.trim()) return todos
  const q = query.toLowerCase()
  return todos.filter(
    (t) =>
      t.title.toLowerCase().includes(q) ||
      (t.description && t.description.toLowerCase().includes(q))
  )
}

function applySort(todos, sort) {
  const sorted = [...todos]
  switch (sort) {
    case 'oldest':
      return sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    case 'priority':
      return sorted.sort(
        (a, b) => PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority]
      )
    case 'dueDate':
      return sorted.sort((a, b) => {
        if (!a.dueDate && !b.dueDate) return 0
        if (!a.dueDate) return 1
        if (!b.dueDate) return -1
        return new Date(a.dueDate) - new Date(b.dueDate)
      })
    default: // newest
      return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
}

export default function TodosPage() {
  const { todos, loading, error, refetch, toggleComplete, addTodo, editTodo, removeTodo } =
    useTodos()

  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('newest')

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [editingTodo, setEditingTodo] = useState(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  // Listen for edit events dispatched from TodoCard
  const handleEditEvent = useCallback((e) => {
    setEditingTodo(e.detail)
    setModalOpen(true)
    setSubmitError('')
  }, [])

  useEffect(() => {
    window.addEventListener('edit-todo', handleEditEvent)
    return () => window.removeEventListener('edit-todo', handleEditEvent)
  }, [handleEditEvent])

  // Derived list: filter → search → sort
  const visible = useMemo(() => {
    let result = applyFilter(todos, filter)
    result = applySearch(result, search)
    result = applySort(result, sort)
    return result
  }, [todos, filter, search, sort])

  function openCreateModal() {
    setEditingTodo(null)
    setModalOpen(true)
    setSubmitError('')
  }

  function closeModal() {
    setModalOpen(false)
    setEditingTodo(null)
    setSubmitError('')
  }

  async function handleFormSubmit(data) {
    setSubmitting(true)
    setSubmitError('')
    try {
      if (editingTodo) {
        await editTodo(editingTodo.id, data)
      } else {
        await addTodo(data)
      }
      closeModal()
    } catch (err) {
      setSubmitError(err.message || 'Failed to save todo')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleToggle(id, completed) {
    try {
      await toggleComplete(id, completed)
    } catch (err) {
      alert(`Failed to update todo: ${err.message}`)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this todo? This cannot be undone.')) return
    try {
      await removeTodo(id)
    } catch (err) {
      alert(`Failed to delete todo: ${err.message}`)
    }
  }

  function handleEdit(todo) {
    setEditingTodo(todo)
    setModalOpen(true)
    setSubmitError('')
  }

  const activeCount = todos.filter((t) => !t.completed).length

  return (
    <div className="page-wrapper">
      <header className="app-header">
        <h1>My Todos</h1>
        <p>
          {loading ? 'Loading…' : `${activeCount} task${activeCount !== 1 ? 's' : ''} remaining`}
        </p>
      </header>

      {/* Controls */}
      <div className="controls-bar">
        <SearchBar value={search} onChange={setSearch} />
        <TodoFilter filter={filter} onChange={setFilter} />
        <select
          className="sort-select"
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          aria-label="Sort todos"
        >
          <option value="newest">Newest first</option>
          <option value="oldest">Oldest first</option>
          <option value="priority">By priority</option>
          <option value="dueDate">By due date</option>
        </select>
      </div>

      {/* State feedback */}
      {loading && <Loading message="Loading todos…" />}
      {error && <ErrorMessage message={error} onRetry={refetch} />}

      {/* List */}
      {!loading && !error && (
        <>
          <div className="section-toolbar">
            <span className="section-title">
              Tasks
              <span className="todo-count">
                {visible.length} {visible.length === 1 ? 'item' : 'items'}
              </span>
            </span>
            <button
              id="create-todo-btn"
              className="btn btn-primary btn-sm"
              onClick={openCreateModal}
            >
              + New todo
            </button>
          </div>

          {visible.length === 0 ? (
            <EmptyState filter={search ? 'all' : filter} />
          ) : (
            <div className="todo-list-container">
              {visible.map((todo) => (
                <TodoCard
                  key={todo.id}
                  todo={todo}
                  onToggle={handleToggle}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Create / Edit Modal */}
      {modalOpen && (
        <div
          className="modal-overlay"
          onClick={(e) => e.target === e.currentTarget && closeModal()}
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
        >
          <div className="modal">
            <h2 id="modal-title" className="modal-title">
              {editingTodo ? 'Edit todo' : 'New todo'}
            </h2>
            {submitError && (
              <div className="alert alert-error" style={{ marginBottom: '1rem' }}>
                {submitError}
              </div>
            )}
            <TodoForm
              initialData={editingTodo}
              onSubmit={handleFormSubmit}
              onCancel={closeModal}
              submitting={submitting}
            />
          </div>
        </div>
      )}
    </div>
  )
}
