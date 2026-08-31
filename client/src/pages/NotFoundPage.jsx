import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="page-wrapper">
      <div className="empty-state">
        <p className="empty-title">404 — Page not found</p>
        <p>The page you are looking for does not exist.</p>
        <Link to="/todos" className="btn btn-primary" style={{ marginTop: '1rem', display: 'inline-flex' }}>
          Back to Todos
        </Link>
      </div>
    </div>
  )
}
