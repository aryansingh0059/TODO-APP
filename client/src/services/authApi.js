function getApiBase() {
  const envUrl =
    import.meta.env.VITE_API_URL ||
    import.meta.env.VITE_API_BASE_URL ||
    'http://localhost:8000';
  let base = envUrl.trim().replace(/\/+$/, '');
  if (!base.endsWith('/api')) {
    base = `${base}/api`;
  }
  return base;
}

async function request(path, options = {}) {
  const url = `${getApiBase()}${path}`
  const res = await fetch(url, {
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  const data = await res.json()
  if (!res.ok) {
    const err = new Error(data.message || 'Authentication failed')
    err.status = res.status
    throw err
  }
  return data
}

export function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export function register({ name, email, password, confirmPassword }) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, confirmPassword }),
  })
}

export function logout() {
  return request('/auth/logout', { method: 'POST' })
}

export function getMe() {
  return request('/auth/me')
}
