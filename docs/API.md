# API Documentation

Base URL: `http://localhost:8000/api`

All responses use the following envelope:

**Success:**
```json
{ "success": true, "data": <payload> }
```

**Error:**
```json
{ "success": false, "message": "<error description>" }
```

---

## GET /api/health

Server health check.

**Response `200`:**
```json
{
  "success": true,
  "message": "Server is running"
}
```

---

## GET /api/todos

List all todos.

**Response `200`:**
```json
{
  "success": true,
  "data": [
    {
      "id": "550be34a-6c8e-4187-a47a-5226bc179891",
      "title": "Prepare interview",
      "description": "Review JavaScript and system design",
      "completed": false,
      "priority": "high",
      "dueDate": "2026-09-15T00:00:00.000Z",
      "createdAt": "2026-09-01T00:00:00.000Z",
      "updatedAt": "2026-09-01T00:00:00.000Z"
    }
  ]
}
```

---

## GET /api/todos/:id

Get a single todo by ID.

**Params:**
- `id` (string) — UUID of the todo

**Response `200`:**
```json
{
  "success": true,
  "data": { ...todo }
}
```

**Response `404`:**
```json
{ "success": false, "message": "Todo not found" }
```

---

## POST /api/todos

Create a new todo.

**Request body:**
```json
{
  "title": "Prepare interview",
  "description": "Review JavaScript and system design",
  "priority": "high",
  "dueDate": "2026-09-15"
}
```

| Field | Required | Constraints |
|-------|----------|-------------|
| `title` | Yes | Non-empty string |
| `description` | No | String |
| `priority` | No | `low` / `medium` / `high` — default `medium` |
| `dueDate` | No | Valid date string or `null` |

**Response `201`:**
```json
{
  "success": true,
  "data": { ...createdTodo }
}
```

**Response `400` (validation error):**
```json
{ "success": false, "message": "title must be a non-empty string" }
```

---

## PUT /api/todos/:id

Update an existing todo. All fields are optional — only provided fields are updated.

**Params:**
- `id` (string) — UUID of the todo

**Request body (all fields optional):**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true,
  "priority": "low",
  "dueDate": "2026-10-01"
}
```

**Response `200`:**
```json
{
  "success": true,
  "data": { ...updatedTodo }
}
```

**Response `400`:** Validation error.

**Response `404`:** Todo not found.

---

## DELETE /api/todos/:id

Delete a todo.

**Params:**
- `id` (string) — UUID of the todo

**Response `200`:**
```json
{
  "success": true,
  "message": "Todo deleted successfully"
}
```

**Response `404`:**
```json
{ "success": false, "message": "Todo not found" }
```

---

## Status Code Summary

| Code | Meaning |
|------|---------|
| 200 | Success |
| 201 | Created |
| 400 | Validation error |
| 404 | Not found |
| 500 | Unexpected server error |
