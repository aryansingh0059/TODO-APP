# Testing

This document records all tests performed on the Ziptrrip Todo application.

---

## Backend API Tests

All tests were performed against a live Express server running on `http://localhost:8000`.

### Test Results

| # | Test | Expected | Result |
|---|------|----------|--------|
| 1 | `GET /api/todos` — empty store | `200 { data: [] }` | ✅ Pass |
| 2 | `POST /api/todos` — valid todo | `201 { data: todo }` | ✅ Pass |
| 3 | `GET /api/todos/:id` — existing | `200 { data: todo }` | ✅ Pass |
| 4 | `GET /api/todos/:id` — nonexistent | `404 { message: "Todo not found" }` | ✅ Pass |
| 5 | `POST /api/todos` — empty title | `400 { message: "title must be a non-empty string" }` | ✅ Pass |
| 6 | `POST /api/todos` — invalid priority | `400 { message: "priority must be one of: low, medium, high" }` | ✅ Pass |
| 7 | `POST /api/todos` — invalid completed | `400 { message: "completed must be a boolean" }` | ✅ Pass |
| 8 | `PUT /api/todos/:id` — update title and completed | `200 { data: updatedTodo }` | ✅ Pass |
| 9 | `PUT /api/todos/:id` — nonexistent | `404 { message: "Todo not found" }` | ✅ Pass |
| 10 | `DELETE /api/todos/:id` — existing | `200 { message: "Todo deleted successfully" }` | ✅ Pass |
| 11 | `DELETE /api/todos/:id` — nonexistent | `404 { message: "Todo not found" }` | ✅ Pass |
| 12 | Persistence — create, retrieve | `200` after server still running | ✅ Pass |
| 13 | `GET /api/health` | `200 { success: true }` | ✅ Pass |

---

## Frontend Build Verification

| Check | Result |
|-------|--------|
| `npm run build` completes without errors | ✅ Pass |
| All modules resolved (32 modules) | ✅ Pass |
| CSS bundle generated | ✅ Pass |

---

## Manual End-to-End Flow

| Step | Action | Expected | Result |
|------|--------|----------|--------|
| 1 | Start backend | Server on port 8000 | ✅ |
| 2 | Start frontend | App on port 3000 | ✅ |
| 3 | Open `/todos` | Todo list page loads | ✅ |
| 4 | Create todo | Modal opens, todo appears in list | ✅ |
| 5 | Click todo title | Navigates to `/todo?id=<id>` | ✅ |
| 6 | Verify URL | `?id=` query param present | ✅ |
| 7 | Check details page | Title, description, metadata visible | ✅ |
| 8 | Edit from details page | Modal opens with existing data | ✅ |
| 9 | Mark complete | Status badge changes, strikethrough applied | ✅ |
| 10 | Delete todo | Navigates back, todo removed | ✅ |
| 11 | Search todos | Filters list in real time | ✅ |
| 12 | Filter Active/Completed | List updates correctly | ✅ |
| 13 | Sort by priority | High → Medium → Low order | ✅ |
| 14 | Visit `/todo` (no id) | Shows "No todo ID provided" message | ✅ |
| 15 | Visit `/todo?id=invalid` | Shows "Todo not found" | ✅ |
| 16 | Visit unknown route | 404 Not Found page | ✅ |
| 17 | Empty title submit | Frontend shows field error | ✅ |

---

## Edge Cases Verified

- **No ID in URL**: `/todo` without `?id=` shows informative error
- **Invalid ID**: `/todo?id=does-not-exist` calls API, gets 404, shows "Todo not found"
- **Empty title**: Frontend blocks submit; backend returns 400
- **Persistence**: todos.json is updated and persists across requests
