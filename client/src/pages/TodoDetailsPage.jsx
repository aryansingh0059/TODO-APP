import { useSearchParams, Link } from 'react-router-dom'

export default function TodoDetailsPage() {
  const [searchParams] = useSearchParams()
  const id = searchParams.get('id')

  return (
    <div className="page-wrapper">
      <header className="detail-header">
        <Link to="/todos" className="detail-back-btn">← Back to Todos</Link>
      </header>
      {!id ? (
        <p className="alert alert-error">No todo ID provided in the URL.</p>
      ) : (
        <p>Loading todo with id: <code>{id}</code></p>
      )}
    </div>
  )
}
