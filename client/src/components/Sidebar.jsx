import { useNavigate, useLocation } from 'react-router-dom'
import SearchBar from './SearchBar'

export default function Sidebar({
  user,
  activeView = 'todos',
  viewCounts = { todos: 0, active: 0, today: 0, upcoming: 0, completed: 0 },
  search = '',
  onSearchChange,
  onViewChange,
  onOpenCreate,
  onLogout,
  isOpen,
  onToggle,
  onClose,
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const isTodosPage = location.pathname === '/todos'

  function handleViewClick(view) {
    if (!isTodosPage) {
      navigate(`/todos?view=${view}`)
    }
    if (onViewChange) {
      onViewChange(view)
    }
    if (onClose) {
      onClose()
    }
  }

  function handleAddClick() {
    if (!isTodosPage) {
      navigate('/todos')
    }
    if (onOpenCreate) {
      onOpenCreate()
    }
    if (onClose) {
      onClose()
    }
  }

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} aria-hidden="true" />}
      <aside className={`sidebar${isOpen ? ' sidebar--open' : ' sidebar--closed'}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="sidebar-brand-icon">✓</span>
            <span>Todo App</span>
          </div>
          <button
            className="sidebar-toggle-btn"
            onClick={onToggle || onClose}
            aria-label="Toggle sidebar"
            title="Toggle sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
        </div>

        {/* User Profile Block */}
        {user && (
          <div className="sidebar-user-block">
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-email">{user.email}</div>
          </div>
        )}

        <button
          className="sidebar-add-btn"
          onClick={handleAddClick}
          aria-label="Add task"
        >
          <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span>
          <span>Add task</span>
        </button>

        {/* SEARCH SECTION */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">Search</div>
          <SearchBar value={search} onChange={onSearchChange} />
        </div>

        {/* NAVIGATION SECTION */}
        <div className="sidebar-section">
          <div className="sidebar-section-title">Navigation</div>
          
          {/* 1. Todos */}
          <button
            className={`sidebar-nav-item${isTodosPage && activeView === 'todos' ? ' sidebar-nav-item--active' : ''}`}
            onClick={() => handleViewClick('todos')}
          >
            <div className="sidebar-nav-item-left">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
              <span>Todos</span>
            </div>
            {viewCounts.todos > 0 && <span className="sidebar-badge">{viewCounts.todos}</span>}
          </button>

          {/* 2. Active */}
          <button
            className={`sidebar-nav-item${isTodosPage && activeView === 'active' ? ' sidebar-nav-item--active' : ''}`}
            onClick={() => handleViewClick('active')}
          >
            <div className="sidebar-nav-item-left">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
              </svg>
              <span>Active</span>
            </div>
            {viewCounts.active > 0 && <span className="sidebar-badge">{viewCounts.active}</span>}
          </button>

          {/* 3. Today */}
          <button
            className={`sidebar-nav-item${isTodosPage && activeView === 'today' ? ' sidebar-nav-item--active' : ''}`}
            onClick={() => handleViewClick('today')}
          >
            <div className="sidebar-nav-item-left">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span>Today</span>
            </div>
            {viewCounts.today > 0 && <span className="sidebar-badge">{viewCounts.today}</span>}
          </button>

          {/* 4. Upcoming */}
          <button
            className={`sidebar-nav-item${isTodosPage && activeView === 'upcoming' ? ' sidebar-nav-item--active' : ''}`}
            onClick={() => handleViewClick('upcoming')}
          >
            <div className="sidebar-nav-item-left">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
              <span>Upcoming</span>
            </div>
            {viewCounts.upcoming > 0 && <span className="sidebar-badge">{viewCounts.upcoming}</span>}
          </button>

          {/* 5. Completed */}
          <button
            className={`sidebar-nav-item${isTodosPage && activeView === 'completed' ? ' sidebar-nav-item--active' : ''}`}
            onClick={() => handleViewClick('completed')}
          >
            <div className="sidebar-nav-item-left">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>Completed</span>
            </div>
            {viewCounts.completed > 0 && <span className="sidebar-badge">{viewCounts.completed}</span>}
          </button>
        </div>

        {/* LOG OUT BUTTON */}
        {onLogout && (
          <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid var(--color-border)' }}>
            <button
              className="sidebar-nav-item"
              onClick={onLogout}
              style={{ color: 'var(--color-danger)' }}
            >
              <div className="sidebar-nav-item-left">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                  <polyline points="16 17 21 12 16 7" />
                  <line x1="21" y1="12" x2="9" y2="12" />
                </svg>
                <span>Log out</span>
              </div>
            </button>
          </div>
        )}
      </aside>
    </>
  )
}
