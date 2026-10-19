import { useState, useEffect, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { getNotifications } from '../services/todoApi'
import '../notifications.css'

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}

function daysUntil(dateStr) {
  if (!dateStr) return null
  const diff = new Date(dateStr) - new Date()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function formatDue(dateStr) {
  const d = daysUntil(dateStr)
  if (d === null) return ''
  if (d < 0) return 'Overdue'
  if (d === 0) return 'Due today'
  if (d === 1) return 'Due tomorrow'
  return `Due in ${d} days`
}

export default function NotificationBell() {
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [data, setData] = useState({ assigned: [], upcoming: [] })
  const [loading, setLoading] = useState(false)
  const panelRef = useRef(null)

  const total = data.assigned.length + data.upcoming.length

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const res = await getNotifications()
      setData(res.data || { assigned: [], upcoming: [] })
    } catch (e) {
      console.error('Notifications fetch failed', e)
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch on mount and every 60s
  useEffect(() => {
    fetchNotifications()
    const interval = setInterval(fetchNotifications, 60_000)
    return () => clearInterval(interval)
  }, [fetchNotifications])

  // Close panel on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (panelRef.current && !panelRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  function handleToggle() {
    setOpen((v) => !v)
    if (!open) fetchNotifications()
  }

  function goToTodo(id) {
    setOpen(false)
    navigate(`/todo?id=${id}`)
  }

  return (
    <div className="notif-wrapper" ref={panelRef}>
      <button
        className="notif-bell-btn"
        onClick={handleToggle}
        aria-label={`Notifications (${total} unread)`}
        title="Notifications"
      >
        <BellIcon />
        {total > 0 && (
          <span className="notif-badge">{total > 99 ? '99+' : total}</span>
        )}
      </button>

      {open && (
        <div className="notif-panel" role="dialog" aria-label="Notifications panel">
          <div className="notif-header">
            <span className="notif-title">Notifications</span>
            {total > 0 && <span className="notif-count">{total} new</span>}
          </div>

          {loading && <div className="notif-empty">Loading…</div>}

          {!loading && total === 0 && (
            <div className="notif-empty">
              <span className="notif-empty-icon">🎉</span>
              <span>You're all caught up!</span>
            </div>
          )}

          {!loading && data.assigned.length > 0 && (
            <section className="notif-section">
              <div className="notif-section-label">
                <span className="notif-dot notif-dot--assigned" />
                Assigned to you
              </div>
              {data.assigned.map((t) => (
                <button
                  key={t.id}
                  className="notif-item"
                  onClick={() => goToTodo(t.id)}
                >
                  <div className="notif-item-top">
                    <span className={`notif-priority notif-priority--${t.priority}`}>
                      {t.priority}
                    </span>
                    <span className="notif-item-title">{t.title}</span>
                  </div>
                  <div className="notif-item-meta">
                    <span className="notif-assigned-by">By {t.assignedByName}</span>
                    {t.dueDate && (
                      <span className={`notif-due ${daysUntil(t.dueDate) < 0 ? 'notif-due--overdue' : ''}`}>
                        {formatDue(t.dueDate)}
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </section>
          )}

          {!loading && data.upcoming.length > 0 && (
            <section className="notif-section">
              <div className="notif-section-label">
                <span className="notif-dot notif-dot--upcoming" />
                Upcoming deadlines
              </div>
              {data.upcoming.map((t) => (
                <button
                  key={t.id}
                  className="notif-item"
                  onClick={() => goToTodo(t.id)}
                >
                  <div className="notif-item-top">
                    <span className={`notif-priority notif-priority--${t.priority}`}>
                      {t.priority}
                    </span>
                    <span className="notif-item-title">{t.title}</span>
                  </div>
                  <div className="notif-item-meta">
                    <span className={`notif-due ${daysUntil(t.dueDate) < 0 ? 'notif-due--overdue' : ''}`}>
                      {formatDue(t.dueDate)}
                    </span>
                  </div>
                </button>
              ))}
            </section>
          )}
        </div>
      )}
    </div>
  )
}
