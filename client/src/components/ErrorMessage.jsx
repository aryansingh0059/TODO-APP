export default function ErrorMessage({ message, onRetry }) {
  return (
    <div className="alert alert-error" role="alert">
      <strong>Error: </strong>{message}
      {onRetry && (
        <button
          className="btn btn-secondary btn-sm"
          onClick={onRetry}
          style={{ marginLeft: '0.75rem' }}
        >
          Retry
        </button>
      )}
    </div>
  )
}
