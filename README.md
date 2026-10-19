# Ziptrrip Todo App

A full-stack Todo application built as part of the Ziptrrip take-home assignment. The application allows users to register, log in, manage user-isolated todos with priorities, due dates, and completion status across 5 task views.

---

## Demo Accounts for Quick Evaluation

The application includes two pre-seeded demo user accounts for rapid testing and interview evaluation:

### 1. Demo User (Contains Sample Tasks)
- **Email:** `demo@todoapp.local`
- **Password:** `Demo@12345`

### 2. Interviewer Account
- **Email:** `interviewer@todoapp.local`
- **Password:** `Interview@12345`

*Note: Clicking the **Quick Demo Login** buttons on the `/login` page executes real authentication API calls (`POST /api/auth/login`) through the backend flow.*

---

## Assignment Requirements

| Requirement | Status |
|-------------|--------|
| React frontend | ✅ |
| Multiple pages | ✅ |
| Todo list page | ✅ |
| Single todo page with query parameter (`?id=`) | ✅ |
| Node.js backend | ✅ |
| Express.js | ✅ |
| Authentication & User Isolation | ✅ |
| CRUD APIs | ✅ |
| Persistent storage | ✅ |
| Documentation in `.md` files | ✅ |

---

## Features

- **User Authentication:** Registration (`/register`), Login (`/login`), Logout, and Protected Routes (`/todos`, `/todo?id=<todoId>`).
- **User Data Isolation:** Every user sees and manages only their own todos.
- **5 Navigation Task Views:**
  - **Todos:** All user tasks
  - **Active:** Incomplete tasks
  - **Today:** Tasks due on local calendar date today
  - **Upcoming:** Tasks due after today (sorted by nearest date)
  - **Completed:** Completed tasks
- **Search, Filter & Sort:** Contextual search within active views and multi-criteria sorting (Newest, Oldest, Priority, Due date).
- **Single todo details page** via `/todo?id=<todoId>` (query parameter as required).
- **Persistent storage** — users (`users.json`) and todos (`todos.json`) persist across server restarts.
- **Collapsible Sidebar:** Toggle sidebar open/close via `[| ]` button.

---

## Technology Stack

### Frontend
| Package | Version | Purpose |
|---------|---------|---------|
| React | 19.x | UI framework |
| Vite | 8.x | Build tool / dev server |
| React Router DOM | 6.x | Client-side routing |

### Backend
| Package | Version | Purpose |
|---------|---------|---------|
| Node.js | ≥18 | Runtime |
| Express | 4.x | HTTP server |
| bcryptjs | 2.x | Password hashing |
| jsonwebtoken | 9.x | Session tokens |
| cookie-parser | 1.x | HTTP-only cookie parsing |
| cors | 2.x | Cross-origin requests |

---

## Environment Variables

### Backend (`server/.env`)

```
PORT=8000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:3000
JWT_SECRET=ziptrrip-todo-dev-secret-key-change-in-production
```

Copy `server/.env.example` to `server/.env`.

### Frontend (`client/.env`)

```
VITE_API_BASE_URL=http://localhost:8000/api
```

Copy `client/.env.example` to `client/.env`.

---

## API Overview

### Authentication APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user account |
| POST | `/api/auth/login` | Log in user (issues HTTP-only cookie) |
| POST | `/api/auth/logout` | Log out user (clears session cookie) |
| GET | `/api/auth/me` | Fetch active user session |

### Todo APIs (Protected — Require Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/todos` | List authenticated user's todos |
| GET | `/api/todos/:id` | Get single todo by ID (404 if owned by another user) |
| POST | `/api/todos` | Create todo for authenticated user |
| PUT | `/api/todos/:id` | Update todo owned by authenticated user |
| DELETE | `/api/todos/:id` | Delete todo owned by authenticated user |

---

## Setup & Running

### 1. Start the backend

```bash
cd server
npm install
npm run dev
```

Backend runs on **http://localhost:8000**

### 2. Start the frontend

```bash
cd client
npm install
npm run dev
```

Frontend runs on **http://localhost:3000**