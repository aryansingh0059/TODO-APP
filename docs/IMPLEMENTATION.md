# Implementation Notes

## Backend

### ID Generation
UUIDs are generated using Node.js's built-in `crypto.randomUUID()` — no external library required. This produces RFC 4122 compliant v4 UUIDs.

### File Persistence
`todoService.js` reads and writes `todos.json` using `fs.promises` with `async/await`. The file is rewritten in full on every write. This is appropriate for an assignment but would not scale to concurrent writes in production.

### Validation
`validateTodo.js` is Express middleware that runs before controller functions. It validates:
- `title` — required on POST, must be a non-empty string
- `priority` — must be one of `low`, `medium`, `high`
- `completed` — must be a boolean
- `dueDate` — must be a parseable date or `null`

The middleware returns `400` immediately if validation fails, so the controller receives clean input.

### Error Handling
`errorHandler.js` is a standard Express error-handling middleware (4-argument signature). Controllers pass errors to `next(err)`, and this middleware formats a consistent JSON error response.

### CORS
CORS is configured to allow requests from `CLIENT_ORIGIN` (defaults to `http://localhost:3000`). Allowed methods are `GET`, `POST`, `PUT`, `DELETE`.

---

## Frontend

### Routing
React Router v6 is used with `<BrowserRouter>`. The todo detail page uses `/todo?id=<todoId>` (query parameter) as required by the assignment. `useSearchParams()` reads the `id` from the URL.

### useTodos Hook
This custom hook centralises all todo state and CRUD operations. Pages only call the hook and render — they don't manage fetch logic directly.

### Form Reuse
`TodoForm` handles both create and edit. It receives `initialData` (null for create, todo object for edit). The `useEffect` in the form resets state whenever `initialData` changes, making it safe to mount once and reuse.

### API Client
`todoApi.js` wraps `fetch`. It throws an error object with `status` and `message` fields so calling code can differentiate 404 from 500, etc.

### Client-Side Filter/Sort
All filtering, searching, and sorting happens client-side via `useMemo`. This is simple and fast for a small todo list. The derived visible list is recomputed only when `todos`, `filter`, `search`, or `sort` changes.

---

## Design System
All styles live in `client/src/index.css` using CSS custom properties (variables). No CSS-in-JS, no Tailwind. Components reference class names defined in the design system.
