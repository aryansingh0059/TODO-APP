# Architecture

## Overview

The application follows a standard client-server architecture with clear separation of concerns.

```
Browser
  └── React (Vite dev server, port 3000)
        ├── React Router → page-level routing
        ├── useTodos hook → state management
        └── todoApi.js → HTTP client (fetch)
              │
              │  HTTP / REST
              ▼
        Express (port 8000)
              ├── CORS middleware
              ├── JSON body parser
              ├── Route handlers (/api/todos)
              ├── validateTodo middleware
              ├── Controller (thin HTTP handler)
              └── Service (business logic)
                    └── todos.json (file persistence)
```

---

## Frontend Architecture

### Pages

| Page | Route | Description |
|------|-------|-------------|
| `TodosPage` | `/todos` | Main list view with CRUD |
| `TodoDetailsPage` | `/todo?id=<id>` | Detail view for a single todo |
| `NotFoundPage` | `/not-found`, `/*` | 404 handler |

### Components

| Component | Purpose |
|-----------|---------|
| `TodoCard` | Renders a single todo row with actions |
| `TodoForm` | Reusable create/edit form (used in both pages) |
| `TodoFilter` | Filter tab bar (All / Active / Completed) |
| `SearchBar` | Search input with icon |
| `EmptyState` | Shown when there are no todos to display |
| `Loading` | Spinner shown during data fetching |
| `ErrorMessage` | Error display with optional retry |
| `PriorityBadge` | Visual pill for priority level |

### State Management

State is managed locally using React hooks:
- `useTodos` — custom hook encapsulating all CRUD operations and list state
- Page-level `useState` for UI concerns (modal open, filter, search, sort)
- No Redux or external state manager; the app is simple enough not to need one

### API Client

All API communication goes through `src/services/todoApi.js`:
- Uses `fetch`
- Reads `VITE_API_BASE_URL` from environment
- Throws typed errors with `status` and `message` fields

---

## Backend Architecture

### Layered Design

```
HTTP Request
    → Route (todoRoutes.js)
        → Middleware (validateTodo.js)
            → Controller (todoController.js)   ← thin HTTP layer
                → Service (todoService.js)     ← business logic
                    → Data (todos.json)        ← persistence
    → Middleware (errorHandler.js)
```

### Layers

| Layer | File | Responsibility |
|-------|------|----------------|
| Routes | `todoRoutes.js` | Map HTTP verbs to controller functions |
| Middleware | `validateTodo.js` | Validate request body fields |
| Controller | `todoController.js` | Handle HTTP req/res, call service |
| Service | `todoService.js` | Business logic, file I/O |
| Data | `todos.json` | Persistent JSON store |
| Error handler | `errorHandler.js` | Centralised error responses |

---

## Data Model

```json
{
  "id": "uuid-v4",
  "title": "string",
  "description": "string",
  "completed": false,
  "priority": "low | medium | high",
  "dueDate": "ISO-8601 date string | null",
  "createdAt": "ISO-8601 datetime",
  "updatedAt": "ISO-8601 datetime"
}
```

---

## Design Decisions

See [DECISIONS.md](DECISIONS.md) for the rationale behind each major decision.
