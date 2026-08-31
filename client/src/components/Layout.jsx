import { useState } from 'react'
import Sidebar from './Sidebar'

export default function Layout({
  children,
  activeCount = 0,
  activeFilter = 'all',
  onFilterChange,
  onOpenCreate,
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="app-layout">
      {/* Mobile Top Header */}
      <header className="mobile-header">
        <button
          className="mobile-menu-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M3 12h18M3 6h18M3 18h18" />
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
        activeCount={activeCount}
        activeFilter={activeFilter}
        onFilterChange={onFilterChange}
        onOpenCreate={onOpenCreate}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <main className="main-content">
        {children}
      </main>
    </div>
  )
}
