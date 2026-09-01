import { useState } from 'react'
import { Link, useNavigate, Navigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const justRegistered = searchParams.get('registered') === 'true'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user) {
    return <Navigate to="/todos" replace />
  }

  async function handleLogin(e) {
    if (e) e.preventDefault()
    if (!email.trim() || !password) {
      setError('Please enter your email and password.')
      return
    }
    setLoading(true)
    setError('')
    try {
      await login(email.trim(), password)
      navigate('/todos')
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  async function handleDemoLogin(demoEmail, demoPassword) {
    setLoading(true)
    setError('')
    try {
      await login(demoEmail, demoPassword)
      navigate('/todos')
    } catch (err) {
      setError(err.message || 'Failed to sign in with demo account.')
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

          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Log in to manage your tasks and stay productive.</p>

          {/* Success message when coming from registration */}
          {justRegistered && (
            <div className="auth-alert-wrap">
              <div className="auth-alert-success">
                ✓ Account created successfully. Please sign in to continue.
              </div>
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="auth-alert-wrap">
              <div className="auth-alert-error">{error}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} noValidate className="auth-form">
            <div className="auth-field">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                autoFocus
                autoComplete="email"
              />
            </div>

            <div className="auth-field">
              <label htmlFor="login-password">Password</label>
              <div className="auth-password-wrap">
                <input
                  id="login-password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  autoComplete="current-password"
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

            <button
              type="submit"
              className="auth-submit-btn"
              disabled={loading}
            >
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          {/* Quick Login Section */}
          <div className="auth-demo-section">
            <div className="auth-demo-divider">
              <span className="auth-demo-label">QUICK LOGIN</span>
            </div>
            <p className="auth-demo-sub">Use a demo account to explore the app.</p>
            <div className="auth-demo-btns">
              <button
                type="button"
                className="auth-demo-btn"
                onClick={() => handleDemoLogin('demo@todoapp.local', 'Demo@12345')}
                disabled={loading}
              >
                Demo User
              </button>
              <button
                type="button"
                className="auth-demo-btn"
                onClick={() => handleDemoLogin('interviewer@todoapp.local', 'Interview@12345')}
                disabled={loading}
              >
                Interviewer
              </button>
            </div>
          </div>

          {/* Footer link */}
          <div className="auth-footer-link">
            Don't have an account?{' '}
            <Link to="/register">Sign up</Link>
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
