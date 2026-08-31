# Features

This document describes all features implemented in the Ziptrrip Todo application.

---

## Core Features

### Todo Management

| Feature | Description |
|---------|-------------|
| Create todo | Add a new todo with title, description, priority, and optional due date |
| Read todos | View all todos in a list with metadata |
| Update todo | Edit any field of an existing todo |
| Delete todo | Remove a todo with a confirmation prompt |
| Complete/uncomplete | Toggle completion status inline or from the detail page |

### Todo Fields

| Field | Type | Required | Default |
|-------|------|----------|---------|
| `title` | string | Yes | — |
| `description` | string | No | `""` |
| `priority` | `low` / `medium` / `high` | No | `medium` |
| `dueDate` | ISO date string | No | `null` |
| `completed` | boolean | No | `false` |

---

## Todo List Page (`/todos`)

### Search
- Real-time search across todo title and description
- Case-insensitive

### Filter
- **All** — show every todo
- **Active** — show only incomplete todos
- **Completed** — show only completed todos

### Sort
- **Newest first** — sorted by `createdAt` descending
- **Oldest first** — sorted by `createdAt` ascending
- **By priority** — High → Medium → Low
- **By due date** — earliest first, todos without due dates last

### States
- Loading spinner while fetching todos from the API
- Error message with a Retry button if the API fails
- Empty state with contextual message based on active filter
- No-results message when search finds nothing

---

## Todo Details Page (`/todo?id=<todoId>`)

- Reads `id` from URL query parameter as required by the assignment
- Loads todo from `GET /api/todos/:id`
- Displays: title, description, status, priority, due date, created at, updated at, todo ID
- Actions available: Mark complete / Mark active, Edit, Delete
- Edit opens a modal with the same reusable form
- Handles: missing `id` in URL, nonexistent todo (404), API errors
- Navigates back to `/todos` after deletion

---

## Validation

### Frontend
- Title is required and must be non-empty
- Shows inline field error if title is missing

### Backend
- `title`: required on POST, non-empty string
- `priority`: must be `low`, `medium`, or `high` if provided
- `completed`: must be a boolean if provided
- `dueDate`: must be a valid date string if provided (null is allowed)

---

## UI/UX

- Clean, minimal design with neutral background and readable typography
- Inter font from Google Fonts
- Responsive layout — works on mobile and desktop
- Overdue todos visually indicated in red
- Completed todos show strikethrough
- Keyboard accessible — focus states visible, buttons labeled
- Semantic HTML with ARIA attributes
- Modal closes on backdrop click or Cancel button
- Disable buttons during in-flight requests
