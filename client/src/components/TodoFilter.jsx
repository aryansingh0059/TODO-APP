const FILTERS = ['all', 'active', 'completed']

export default function TodoFilter({ filter, onChange }) {
  return (
    <div className="filter-tabs" role="group" aria-label="Filter todos">
      {FILTERS.map((f) => (
        <button
          key={f}
          className={`filter-tab${filter === f ? ' filter-tab--active' : ''}`}
          onClick={() => onChange(f)}
          aria-pressed={filter === f}
        >
          {f.charAt(0).toUpperCase() + f.slice(1)}
        </button>
      ))}
    </div>
  )
}
