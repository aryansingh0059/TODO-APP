import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import TodosPage from './pages/TodosPage'
import TodoDetailsPage from './pages/TodoDetailsPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to /todos */}
        <Route path="/" element={<Navigate to="/todos" replace />} />
        {/* Todo list page */}
        <Route path="/todos" element={<TodosPage />} />
        {/* Single todo details page — uses query param ?id=<todoId> */}
        <Route path="/todo" element={<TodoDetailsPage />} />
        {/* Explicit not-found route */}
        <Route path="/not-found" element={<NotFoundPage />} />
        {/* Catch-all → 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
