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
      {/* ── Left brand panel ── */}
      <div className="auth-left">
        <div className="auth-left-brand">
          <div className="auth-left-brand-icon">✓</div>
          <span>Todo App</span>
        </div>

        <p className="auth-left-headline">
          Simple tasks.<br />Clear progress.
        </p>
        <p className="auth-left-sub">
          Stay organized and keep track of what matters most, every day.
        </p>

        <div className="auth-left-benefits">
          <div className="auth-benefit-item">
            <div className="auth-benefit-check">✓</div>
            <span>Create and manage tasks easily</span>
          </div>
          <div className="auth-benefit-item">
            <div className="auth-benefit-check">✓</div>
            <span>Track active and completed work</span>
          </div>
          <div className="auth-benefit-item">
            <div className="auth-benefit-check">✓</div>
            <span>Organize by due date and priority</span>
          </div>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-right">
        <div className="auth-right-inner">
          {/* Compact brand */}
          <div className="auth-form-brand">
            <div className="auth-form-brand-icon">✓</div>
            <span>Todo App</span>
          </div>

          <h1 className="auth-form-title">Welcome back</h1>
          <p className="auth-form-subtitle">Log in to manage your tasks and stay productive.</p>

          {/* Alerts */}
          {justRegistered && (
            <div className="auth-alert-wrap">
              <div className="auth-alert-success">
                ✓ Account created successfully. Please sign in to continue.
              </div>
            </div>
          )}
          {error && (
            <div className="auth-alert-wrap">
              <div className="auth-alert-error">{error}</div>
            </div>
          )}

          {/* Login form */}
          <form onSubmit={handleLogin} noValidate>
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
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                      <line x1="1" y1="1" x2="23" y2="23"/>
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="auth-submit"
              disabled={loading}
            >
              {loading ? 'Logging in…' : 'Log in'}
            </button>
          </form>

          {/* Demo / quick login */}
          <div className="auth-demo">
            <div className="auth-demo-divider">
              <span className="auth-demo-label">Quick login</span>
            </div>
            <p className="auth-demo-sub">Use a demo account to explore the app</p>
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

          {/* Footer */}
          <div className="auth-form-footer">
            Don't have an account?{' '}
            <Link to="/register">Sign up</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
