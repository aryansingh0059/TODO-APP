import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Sidebar from './Sidebar'

export default function Layout({
  children,
  activeView = 'todos',
  viewCounts = { todos: 0, active: 0, today: 0, upcoming: 0, completed: 0 },
  search = '',
  onSearchChange,
  onViewChange,
  onOpenCreate,
}) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(true)

  function toggleSidebar() {
    setSidebarOpen((prev) => !prev)
  }

  async function handleLogout() {
    await logout()
    navigate('/login')
  }

  return (
    <div className="app-layout">
      {/* Mobile Top Header */}
      <header className="mobile-header">
        <button
          className="sidebar-toggle-btn"
          onClick={toggleSidebar}
          aria-label="Toggle navigation sidebar"
          title="Toggle sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
            <line x1="9" y1="3" x2="9" y2="21" />
          </svg>
        </button>
        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Todo App</span>
        <button
          className="btn btn-primary btn-sm"
          onClick={onOpenCreate}
          aria-label="Add task"
        >
          + Add
        </button>
      </header>

      {/* Sidebar */}
      <Sidebar
        user={user}
        activeView={activeView}
        viewCounts={viewCounts}
        search={search}
        onSearchChange={onSearchChange}
        onViewChange={onViewChange}
        onOpenCreate={onOpenCreate}
        onLogout={handleLogout}
        isOpen={sidebarOpen}
        onToggle={toggleSidebar}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {!sidebarOpen && (
          <button
            className="sidebar-toggle-btn sidebar-floating-toggle"
            onClick={toggleSidebar}
            aria-label="Open sidebar"
            title="Open sidebar"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
              <line x1="9" y1="3" x2="9" y2="21" />
            </svg>
          </button>
        )}
        {children}
      </main>
    </div>
  )
}
