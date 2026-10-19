import { useState, useEffect, useCallback } from 'react'
import * as api from '../services/todoApi'
import { useAuth } from '../context/AuthContext'

export function useTodos() {
  const { logout } = useAuth()
  const [todos, setTodos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchTodos = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await api.getTodos()
      setTodos(res.data)
    } catch (err) {
      if (err.status === 401) {
        logout()
        return
      }
      setError(err.message || 'Failed to load todos')
    } finally {
      setLoading(false)
    }
  }, [logout])

  useEffect(() => {
    fetchTodos()
  }, [fetchTodos])

  const addTodo = useCallback(async (data) => {
    const res = await api.createTodo(data)
    setTodos((prev) => [...prev, res.data])
    return res.data
  }, [])

  const editTodo = useCallback(async (id, data) => {
    const res = await api.updateTodo(id, data)
    setTodos((prev) => prev.map((t) => (t.id === id ? res.data : t)))
    return res.data
  }, [])

  const removeTodo = useCallback(async (id) => {
    await api.deleteTodo(id)
    setTodos((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toggleComplete = useCallback(async (id, completed) => {
    const res = await api.updateTodo(id, { completed })
    setTodos((prev) => prev.map((t) => (t.id === id ? res.data : t)))
    return res.data
  }, [])

  return {
    todos,
    loading,
    error,
    refetch: fetchTodos,
    addTodo,
    editTodo,
    removeTodo,
    toggleComplete,
  }
}
