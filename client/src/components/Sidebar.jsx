import { useNavigate, useLocation } from 'react-router-dom'

export default function Sidebar({
  activeCount = 0,
  activeFilter = 'all',
  onFilterChange,
  onOpenCreate,
  isOpen,
  onClose,
}) {
  const navigate = useNavigate()
  const location = useLocation()
  const isTodosPage = location.pathname === '/todos'

  function handleFilterClick(filter) {
    if (!isTodosPage) {
      navigate('/todos')
    }
    if (onFilterChange) {
      onFilterChange(filter)
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
      <aside className={`sidebar${isOpen ? ' sidebar--open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-brand">
            <span className="sidebar-brand-icon">✓</span>
            <span>Todo App</span>
          </div>
        </div>

        <button
          className="sidebar-add-btn"
          onClick={handleAddClick}
          aria-label="Add task"
        >
          <span style={{ fontSize: '1.1rem', lineHeight: 1 }}>+</span>
          <span>Add task</span>
        </button>

        <div className="sidebar-section">
          <div className="sidebar-section-title">Navigation</div>
          
          <button
            className={`sidebar-nav-item${isTodosPage && activeFilter === 'all' ? ' sidebar-nav-item--active' : ''}`}
            onClick={() => handleFilterClick('all')}
          >
            <div className="sidebar-nav-item-left">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 6h18M3 12h18M3 18h18" />
              </svg>
              <span>Todos</span>
            </div>
            {activeCount > 0 && <span className="sidebar-badge">{activeCount}</span>}
          </button>

          <button
            className={`sidebar-nav-item${isTodosPage && activeFilter === 'active' ? ' sidebar-nav-item--active' : ''}`}
            onClick={() => handleFilterClick('active')}
          >
            <div className="sidebar-nav-item-left">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
              </svg>
              <span>Active</span>
            </div>
          </button>

          <button
            className={`sidebar-nav-item${isTodosPage && activeFilter === 'completed' ? ' sidebar-nav-item--active' : ''}`}
            onClick={() => handleFilterClick('completed')}
          >
            <div className="sidebar-nav-item-left">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              <span>Completed</span>
            </div>
          </button>
        </div>
      </aside>
    </>
  )
}
