const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function req(path, options = {}) {
  const token = localStorage.getItem('nova_token')
  const res = await fetch(`${BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers
    },
    ...options
  })
  if (res.status === 401) {
    localStorage.clear()
    window.location.href = '/login'
    return
  }
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Request failed' }))
    throw new Error(err.detail || 'Request failed')
  }
  return res.json()
}

export const api = {
  login: (email, password) => req('/auth/login', { method: 'POST', body: JSON.stringify({ email, password }) }),
  register: (data) => req('/auth/register', { method: 'POST', body: JSON.stringify(data) }),
  me: () => req('/auth/me'),
  analyze: (data) => req('/analyze', { method: 'POST', body: JSON.stringify(data) }),
  clearSession: (session_id) => req('/session/clear', { method: 'POST', body: JSON.stringify({ session_id }) }),
  history: () => req('/history'),
  contact: (data) => req('/contact', { method: 'POST', body: JSON.stringify(data) }),
}
