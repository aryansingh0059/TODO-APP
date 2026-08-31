# Submission

## Repository

**GitHub:** https://github.com/aryansingh0059/TODO-APP

---

## Setup Instructions

### Prerequisites
- Node.js 18 or higher
- npm 9 or higher
- Git

### 1. Clone

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

Server runs on: **http://localhost:8000**

Verify: `GET http://localhost:8000/api/health` → `{ success: true }`

### 3. Start the frontend

In a new terminal:

```bash
cd client
npm install
npm run dev
```

Frontend runs on: **http://localhost:3000**

### 4. Open the app

Visit **http://localhost:3000** in your browser.

---

## Commands Reference

| Command | Directory | Description |
|---------|-----------|-------------|
| `npm install` | `server/` | Install backend dependencies |
| `npm run dev` | `server/` | Start backend with auto-reload |
| `npm start` | `server/` | Start backend without auto-reload |
| `npm install` | `client/` | Install frontend dependencies |
| `npm run dev` | `client/` | Start Vite dev server |
| `npm run build` | `client/` | Build production bundle |

---

## Git Workflow

Commits follow this sequence:

1. `chore: initialize project structure`
2. `feat: setup express backend`
3. `feat: add todo persistence layer`
4. `feat: implement todo crud apis`
5. `test: validate todo api`
6. `feat: setup react routing`
7. `feat: implement todo list page`
8. `feat: add todo mutations`
9. `feat: implement todo details page`
10. `feat: improve todo ui and responsive states`
11. `docs: add project documentation`
12. `test: complete assignment validation`
13. `fix: address final review issues` (if applicable)

---

## Assignment Checklist

### Frontend
- [x] React application
- [x] Multiple pages
- [x] Todo list page (`/todos`)
- [x] Single todo page (`/todo?id=<todoId>`)
- [x] Query parameter used for ID
- [x] Todo details displayed
- [x] Todo CRUD operations

### Backend
- [x] Node.js
- [x] Express.js
- [x] `GET /api/todos`
- [x] `GET /api/todos/:id`
- [x] `POST /api/todos`
- [x] `PUT /api/todos/:id`
- [x] `DELETE /api/todos/:id`
- [x] Persistent storage (JSON file)

### Quality
- [x] Input validation
- [x] Error handling
- [x] Loading states
- [x] Empty state
- [x] Responsive design
- [x] CORS configured
- [x] Environment variables

### Documentation
- [x] README.md
- [x] docs/FEATURES.md
- [x] docs/API.md
- [x] docs/ARCHITECTURE.md
- [x] docs/IMPLEMENTATION.md
- [x] docs/TESTING.md
- [x] docs/DECISIONS.md
- [x] docs/SUBMISSION.md
