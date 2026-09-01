import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function RegisterPage() {
  const { user, register } = useAuth()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user) {
    return <Navigate to="/todos" replace />
  }

  async function handleRegister(e) {
    e.preventDefault()

    if (!name.trim()) {
      setError('Name is required.')
      return
    }
    if (!email.trim() || !email.includes('@')) {
      setError('Please enter a valid email address.')
      return
    }
    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.')
      return
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)
    setError('')
    try {
      await register({
        name: name.trim(),
        email: email.trim(),
        password,
        confirmPassword,
      })
      navigate('/login?registered=true')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      {/* ── Left 50% Auth Form Panel ── */}
      <div className="auth-form-panel">
        <div className="auth-form-container">
          {/* Logo / Branding */}
          <div className="auth-brand">
            <div className="auth-brand-icon">✓</div>
            <span>Todo App</span>
          </div>

          <h1 className="auth-title">Create your account</h1>
          <p className="auth-subtitle">Start organizing your tasks.</p>

          {/* Error Alert */}
          {error && (
            <div className="auth-alert-wrap">
              <div className="auth-alert-error">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} noValidate className="auth-form">
            <div className="auth-field">
              <label htmlFor="reg-name">Name</label>
              <input
                id="reg-name"
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
                autoFocus
                autoComplete="name"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="reg-email">Email</label>
              <input
                id="reg-email"
                type="email"
                placeholder="Your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="reg-password">Password</label>
              <div className="auth-password-wrap">
                <input
                  id="reg-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  tabIndex={0}
                >
                  {showPassword ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="reg-confirm">Confirm password</label>
              <div className="auth-password-wrap">
                <input
                  id="reg-confirm"
                  type={showConfirm ? 'text' : 'password'}
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="auth-eye-btn"
                  onClick={() => setShowConfirm((v) => !v)}
                  aria-label={showConfirm ? 'Hide confirm password' : 'Show confirm password'}
                  tabIndex={0}
                >
                  {showConfirm ? (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Creating account…' : 'Create account'}
            </button>
          </form>

          {/* Footer link */}
          <div className="auth-footer-link">
            Already have an account?{' '}
            <Link to="/login">Log in</Link>
          </div>
        </div>
      </div>

      {/* ── Right 50% Productivity Visual Panel ── */}
      <div className="auth-visual-panel">
        <div className="auth-visual-content">
          <div className="auth-visual-header">
            <span className="auth-visual-tag">YOUR DAY</span>
            <h2>Organize your day.<br />One task at a time.</h2>
            <p>Stay focused on what matters most and track your progress effortlessly.</p>
          </div>

          {/* Task Showcase Stack */}
          <div className="auth-task-showcase">
            {/* Task 1 (Completed) */}
            <div className="auth-task-card auth-task-card--completed">
              <div className="auth-task-check">✓</div>
              <div className="auth-task-body">
                <span className="auth-task-title">Read system design notes</span>
                <div className="auth-task-meta">
                  <span className="auth-badge auth-badge--success">Completed</span>
                </div>
              </div>
            </div>

            {/* Task 2 (Active - High Priority) */}
            <div className="auth-task-card auth-task-card--active">
              <div className="auth-task-radio auth-task-radio--high"></div>
              <div className="auth-task-body">
                <span className="auth-task-title">Prepare interview preparation</span>
                <div className="auth-task-meta">
                  <span className="auth-badge auth-badge--high">High priority</span>
                  <span className="auth-task-date">Today</span>
                </div>
              </div>
            </div>

            {/* Task 3 (Upcoming) */}
            <div className="auth-task-card auth-task-card--upcoming">
              <div className="auth-task-radio"></div>
              <div className="auth-task-body">
                <span className="auth-task-title">Complete project milestone</span>
                <div className="auth-task-meta">
                  <span className="auth-badge auth-badge--medium">Medium priority</span>
                  <span className="auth-task-date">Due tomorrow</span>
                </div>
              </div>
            </div>

            {/* Progress Card */}
            <div className="auth-progress-card">
              <div className="auth-progress-header">
                <span>Progress</span>
                <span className="auth-progress-count">2 / 3 completed</span>
              </div>
              <div className="auth-progress-bar">
                <div className="auth-progress-fill" style={{ width: '67%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
