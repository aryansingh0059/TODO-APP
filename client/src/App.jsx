import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import TodosPage from './pages/TodosPage'
import TodoDetailsPage from './pages/TodoDetailsPage'
import NotFoundPage from './pages/NotFoundPage'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/todos" replace />} />

          {/* Authentication Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/signup" element={<Navigate to="/register" replace />} />

          {/* Protected Todo Routes */}
          <Route
            path="/todos"
            element={
              <ProtectedRoute>
                <TodosPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/todo"
            element={
              <ProtectedRoute>
                <TodoDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/today" element={<Navigate to="/todos?view=today" replace />} />
          <Route path="/upcoming" element={<Navigate to="/todos?view=upcoming" replace />} />
          <Route path="/completed" element={<Navigate to="/todos?view=completed" replace />} />
          <Route path="/filters" element={<Navigate to="/todos" replace />} />
          <Route path="/reporting" element={<Navigate to="/todos" replace />} />

          {/* 404 Routes */}
          <Route path="/not-found" element={<NotFoundPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
