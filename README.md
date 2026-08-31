# Ziptrrip Todo App

A full-stack Todo application built as part of the Ziptrrip take-home assignment. The application allows users to create, manage, and track todos with priorities, due dates, and completion status.

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
| CRUD APIs | ✅ |
| Persistent storage | ✅ |
| Documentation in `.md` files | ✅ |

---

## Features

- **Create todos** with title, description, priority, and due date
- **View todo list** with search, filter (All / Active / Completed), and sort (Newest, Oldest, Priority, Due date)
- **View todo details** via `/todo?id=<todoId>` (query parameter as required)
- **Edit todos** using a reusable form modal
- **Delete todos** with confirmation
- **Complete/uncomplete todos** with a single click
- **Persistent storage** — todos survive server restarts via JSON file
- **Responsive design** — works on mobile and desktop
- **Loading, error, and empty states** throughout

See [docs/FEATURES.md](docs/FEATURES.md) for full feature documentation.

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
| cors | 2.x | Cross-origin requests |
| nodemon | 3.x | Development auto-reload |

### Storage
- JSON file (`server/src/data/todos.json`)
- Native Node.js `fs/promises`

---

## Architecture

```
Browser
  └── React (port 3000)
        └── React Router → Pages
              └── todoApi.js (fetch)
                    └── Express (port 8000)
                          └── Routes → Controller → Service → todos.json
```

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for details.

---

## Project Structure

```
ziptrrip-todo-app/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   ├── TodoCard.jsx
│   │   │   ├── TodoForm.jsx
│   │   │   ├── TodoFilter.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── EmptyState.jsx
│   │   │   ├── Loading.jsx
│   │   │   ├── ErrorMessage.jsx
│   │   │   └── PriorityBadge.jsx
│   │   ├── pages/
│   │   │   ├── TodosPage.jsx
│   │   │   ├── TodoDetailsPage.jsx
│   │   │   └── NotFoundPage.jsx
│   │   ├── services/
│   │   │   └── todoApi.js
│   │   ├── hooks/
│   │   │   └── useTodos.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env.example
│   ├── index.html
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── todoController.js
│   │   ├── routes/
│   │   │   └── todoRoutes.js
│   │   ├── services/
│   │   │   └── todoService.js
│   │   ├── middleware/
│   │   │   ├── validateTodo.js
│   │   │   └── errorHandler.js
│   │   ├── data/
│   │   │   └── todos.json
│   │   └── server.js
│   ├── .env.example
│   └── package.json
│
├── docs/
│   ├── FEATURES.md
│   ├── API.md
│   ├── ARCHITECTURE.md
│   ├── IMPLEMENTATION.md
│   ├── TESTING.md
│   ├── DECISIONS.md
│   └── SUBMISSION.md
│
├── .gitignore
└── README.md
```

---

## Setup

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher

### 1. Clone the repository

```bash
git clone https://github.com/aryansingh0059/TODO-APP.git
cd TODO-APP
```

### 2. Start the backend

```bash
cd server
npm install
npm run dev
```

Backend runs on **http://localhost:8000**

### 3. Start the frontend

Open a new terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs on **http://localhost:3000**

### 4. Open the app

Visit **http://localhost:3000** in your browser.

---

## Environment Variables

### Backend (`server/.env`)

```
PORT=8000
NODE_ENV=development
CLIENT_ORIGIN=http://localhost:3000
```

Copy `server/.env.example` to `server/.env`.

### Frontend (`client/.env`)

```
VITE_API_BASE_URL=http://localhost:8000/api
```

Copy `client/.env.example` to `client/.env`.

---

## API Overview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Server health check |
| GET | `/api/todos` | List all todos |
| GET | `/api/todos/:id` | Get a single todo |
| POST | `/api/todos` | Create a new todo |
| PUT | `/api/todos/:id` | Update an existing todo |
| DELETE | `/api/todos/:id` | Delete a todo |

See [docs/API.md](docs/API.md) for full API documentation.

---

## Frontend Routes

| Route | Description |
|-------|-------------|
| `/` | Redirects to `/todos` |
| `/todos` | Todo list page |
| `/todo?id=<todoId>` | Todo details page (query parameter) |
| `/not-found` | Explicit 404 page |
| `/*` | Unknown routes → 404 |

---

## Testing

See [docs/TESTING.md](docs/TESTING.md) for documented test results.

---

## Known Limitations

- No authentication — todos are shared by all users
- JSON file is not safe for concurrent write access under high load
- No pagination — all todos are loaded at once
- Search/filter/sort is done client-side

---

## Future Improvements

- Add user authentication
- Replace JSON file with SQLite or PostgreSQL for concurrency safety
- Add server-side search and pagination
- Add due-date reminder notifications
- Add tags/labels for better categorisation