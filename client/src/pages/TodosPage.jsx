import { useState, useMemo, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useTodos } from '../hooks/useTodos'
import Layout from '../components/Layout'
import TodoCard from '../components/TodoCard'
import EmptyState from '../components/EmptyState'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'
import TodoForm from '../components/TodoForm'

const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 }

function getLocalDateString(d = new Date()) {
  const year = d.getFullYear()
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function applyView(todos, view) {
  const todayStr = getLocalDateString()
  switch (view) {
    case 'active':
      return todos.filter((t) => !t.completed)
    case 'today':
      return todos.filter((t) => t.dueDate && t.dueDate.slice(0, 10) === todayStr)
    case 'upcoming':
      return todos.filter((t) => t.dueDate && t.dueDate.slice(0, 10) > todayStr)
    case 'completed':
      return todos.filter((t) => t.completed)
    case 'todos':
    default:
      return todos
  }
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

  const [searchParams, setSearchParams] = useSearchParams()
  const activeView = searchParams.get('view') || 'todos'

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

  // View Counts for Sidebar Navigation Badges & Header Subtitles
  const viewCounts = useMemo(() => {
    const todayStr = getLocalDateString()
    return {
      todos: todos.length,
      active: todos.filter((t) => !t.completed).length,
      today: todos.filter((t) => t.dueDate && t.dueDate.slice(0, 10) === todayStr).length,
      upcoming: todos.filter((t) => t.dueDate && t.dueDate.slice(0, 10) > todayStr).length,
      completed: todos.filter((t) => t.completed).length,
    }
  }, [todos])

  // Derived list: view → search → sort
  const visible = useMemo(() => {
    let result = applyView(todos, activeView)
    
    // For upcoming view, default sort is due date ascending if not explicitly overridden
    if (activeView === 'upcoming' && sort === 'newest') {
      result = applySearch(result, search)
      return result.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    }

    result = applySearch(result, search)
    result = applySort(result, sort)
    return result
  }, [todos, activeView, search, sort])

  function handleViewChange(newView) {
    setSearchParams({ view: newView })
  }

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

  // Header Title & Subtitle based on View
  const viewTitles = {
    todos: { title: 'My Todos', sub: `${viewCounts.active} task${viewCounts.active !== 1 ? 's' : ''} remaining` },
    active: { title: 'Active', sub: `${viewCounts.active} task${viewCounts.active !== 1 ? 's' : ''} remaining` },
    today: { title: 'Today', sub: `${viewCounts.today} task${viewCounts.today !== 1 ? 's' : ''}` },
    upcoming: { title: 'Upcoming', sub: `${viewCounts.upcoming} task${viewCounts.upcoming !== 1 ? 's' : ''}` },
    completed: { title: 'Completed', sub: `${viewCounts.completed} completed` },
  }
  const currentTitle = viewTitles[activeView] || viewTitles.todos

  return (
    <Layout
      activeView={activeView}
      viewCounts={viewCounts}
      search={search}
      onSearchChange={setSearch}
      onViewChange={handleViewChange}
      onOpenCreate={openCreateModal}
    >
      <div className="page-wrapper">
        <header className="app-header">
          <h1>{currentTitle.title}</h1>
          <p>{loading ? 'Loading…' : currentTitle.sub}</p>
        </header>

        {/* State Feedback */}
        {loading && <Loading message="Loading todos…" />}
        {error && <ErrorMessage message={error} onRetry={refetch} />}

        {/* Clean Main Content Section */}
        {!loading && !error && (
          <>
            <div className="section-toolbar">
              <span className="section-title">
                Tasks
                <span className="todo-count">
                  {visible.length} {visible.length === 1 ? 'item' : 'items'}
                </span>
              </span>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <select
                  className="sort-select"
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  aria-label="Sort todos"
                >
                  <option value="newest">Sort: Newest first</option>
                  <option value="oldest">Sort: Oldest first</option>
                  <option value="priority">Sort: By priority</option>
                  <option value="dueDate">Sort: By due date</option>
                </select>

                <button
                  id="create-todo-btn"
                  className="btn btn-primary btn-sm"
                  onClick={openCreateModal}
                >
                  + Add task
                </button>
              </div>
            </div>

            {visible.length === 0 ? (
              <EmptyState view={activeView} />
            ) : (
              <>
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

                {/* Inline Add Task Action (shown below task items) */}
                <button
                  className="inline-add-task-btn"
                  onClick={openCreateModal}
                  aria-label="Add task"
                >
                  <span className="inline-add-icon">+</span>
                  <span>Add task</span>
                </button>
              </>
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
    </Layout>
  )
}
