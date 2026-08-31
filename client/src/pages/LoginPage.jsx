import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (user) {
    return <Navigate to="/todos" replace />
  }

  async function handleLogin(e) {
    if (e) e.preventDefault()
    if (!email.trim() || !password) {
      setError('Please enter your email and password')
      return
    }

    setLoading(true)
    setError('')
    try {
      await login(email.trim(), password)
      navigate('/todos')
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  async function handleDemoLogin(demoEmail, demoPassword) {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setLoading(true)
    setError('')
    try {
      await login(demoEmail, demoPassword)
      navigate('/todos')
    } catch (err) {
      setError(err.message || 'Failed to authenticate demo account')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <div className="auth-brand">
            <span className="auth-brand-icon">✓</span>
            <span>Todo App</span>
          </div>
          <h1>Welcome back</h1>
          <p>Log in to manage your tasks and stay productive.</p>
        </div>

        {error && <div className="alert alert-error auth-alert">{error}</div>}

        <form onSubmit={handleLogin} noValidate className="auth-form">
          <div className="form-group">
            <label htmlFor="login-email">Email</label>
            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary auth-submit-btn"
            disabled={loading}
          >
            {loading ? 'Logging in…' : 'Log in'}
          </button>
        </form>

        {/* Quick Demo Login Section */}
        <div className="demo-login-box">
          <div className="demo-login-title">Quick Demo Login (for Evaluation)</div>
          <p className="demo-login-sub">Select an account to log in instantly via the real backend API flow:</p>
          <div className="demo-login-buttons">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleDemoLogin('demo@todoapp.local', 'Demo@12345')}
              disabled={loading}
            >
              Demo User (Sample Tasks)
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleDemoLogin('interviewer@todoapp.local', 'Interview@12345')}
              disabled={loading}
            >
              Interviewer Account
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <p>
            Don't have an account?{' '}
            <Link to="/register" className="auth-link">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
