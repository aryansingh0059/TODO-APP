export default function SearchBar({ value, onChange }) {
  return (
    <div className="search-input-wrap">
      <svg
        className="search-icon"
        width="15"
        height="15"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="8" />
        <path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        id="todo-search"
        type="text"
        placeholder="Search todos…"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search todos by title or description"
      />
    </div>
  )
}
