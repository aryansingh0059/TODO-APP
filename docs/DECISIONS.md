# Design Decisions

This document explains the rationale behind the major technical decisions made during this assignment.

---

## JSON File Persistence

**Decision:** Use `todos.json` for storage instead of a database.

**Rationale:**
- The assignment explicitly permits file persistence
- Makes the project trivially easy to run — no database setup required
- Reviewers can inspect the data directly
- `fs.promises` with `async/await` keeps the service clean

**Trade-offs:** Not safe for concurrent writes; not suitable for large datasets. A SQLite or PostgreSQL database would be the next step in production.

---

## Service Layer

**Decision:** Separate `todoService.js` from `todoController.js`.

**Rationale:**
- Controller stays thin — only handles HTTP req/res
- Service contains all business logic and data access
- Service has no Express dependency — easier to test in isolation
- Clean separation of concerns

---

## REST API

**Decision:** Implement a standard REST API with resource-based URLs.

**Rationale:**
- Well-understood convention for CRUD operations
- Easy to test with any HTTP client
- Maps naturally to the React frontend's needs

---

## UUIDs for IDs

**Decision:** Use `crypto.randomUUID()` for todo IDs.

**Rationale:**
- Built into Node.js — no dependency required
- RFC 4122 compliant v4 UUIDs
- Universally unique — safe for file-based storage

---

## Query Parameter for Todo Details

**Decision:** Use `/todo?id=<todoId>` for the detail page URL.

**Rationale:**
- This is the exact requirement in the assignment spec
- `useSearchParams()` in React Router makes reading query params clean
- Distinguishable from path parameters while still being RESTful

---

## React Router v6

**Decision:** Use React Router DOM v6 for client-side routing.

**Rationale:**
- Industry standard for React SPAs
- `<BrowserRouter>` with `<Routes>` and `<Route>` is simple and readable
- `useSearchParams` hook makes query parameters easy to read

---

## No Redux

**Decision:** Use local state and a custom `useTodos` hook instead of Redux.

**Rationale:**
- The application has only two pages and one data type
- Custom hooks provide sufficient state sharing
- No prop drilling issues at this scale
- Redux would add unnecessary complexity and boilerplate

---

## Minimal UI

**Decision:** Keep the UI minimal, clean, and typography-forward.

**Rationale:**
- This is a productivity tool, not a marketing page
- Clean interfaces reduce cognitive load
- No glassmorphism, gradients, or animated decorations
- Inter font + neutral colour palette = professional feel

---

## Client-Side Filter/Sort

**Decision:** Do filtering, searching, and sorting on the frontend using `useMemo`.

**Rationale:**
- Todo lists at this scale are small enough to sort client-side
- Avoids extra API roundtrips for each user interaction
- `useMemo` ensures the derived list is recomputed efficiently
