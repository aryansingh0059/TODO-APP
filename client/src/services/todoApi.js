const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed')
    err.status = res.status
    throw err
  }
  return data
}

export function getTodos() {
  return request('/todos')
}

export function getTodo(id) {
  return request(`/todos/${id}`)
}

export function createTodo(todo) {
  return request('/todos', {
    method: 'POST',
    body: JSON.stringify(todo),
  })
}

export function updateTodo(id, data) {
  return request(`/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })
}

export function deleteTodo(id) {
  return request(`/todos/${id}`, { method: 'DELETE' })
}
