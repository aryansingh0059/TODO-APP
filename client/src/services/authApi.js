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

export function getStoredToken() {
  try {
    return sessionStorage.getItem('auth_token');
  } catch {
    return null;
  }
}

export function setStoredToken(token) {
  try {
    if (token) {
      sessionStorage.setItem('auth_token', token);
    } else {
      sessionStorage.removeItem('auth_token');
    }
  } catch {}
}

async function request(path, options = {}) {
  const url = `${getApiBase()}${path}`
  const token = getStoredToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(url, {
    credentials: 'include',
    ...options,
    headers,
  })
  const data = await res.json()
  if (!res.ok) {
    if (res.status === 401) {
      setStoredToken(null);
    }
    const err = new Error(data.message || 'Authentication failed')
    err.status = res.status
    throw err
  }
  return data
}

export async function login(email, password) {
  const data = await request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
  if (data?.data?.token) {
    setStoredToken(data.data.token)
  }
  return data
}

export function register({ name, email, password, confirmPassword }) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify({ name, email, password, confirmPassword }),
  })
}

export async function logout() {
  try {
    return await request('/auth/logout', { method: 'POST' })
  } finally {
    setStoredToken(null);
  }
}

export function getMe() {
  return request('/auth/me')
}
