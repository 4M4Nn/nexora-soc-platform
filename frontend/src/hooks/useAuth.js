import { useState, useEffect, useCallback } from 'react'
import { api } from '../utils/api'

export function useAuth() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('nova_token')
    if (!token) { setLoading(false); return }
    api.me()
      .then(data => setUser(data))
      .catch(() => { localStorage.clear() })
      .finally(() => setLoading(false))
  }, [])

  const login = useCallback(async (email, password) => {
    const data = await api.login(email, password)
    localStorage.setItem('nova_token', data.token)
    setUser({ sub: null, email: data.email, name: data.name, org: data.org, role: data.role })
    return data
  }, [])

  const register = useCallback(async (formData) => {
    const data = await api.register(formData)
    localStorage.setItem('nova_token', data.token)
    setUser({ email: data.email, name: data.name, org: data.org, role: data.role })
    return data
  }, [])

  const logout = useCallback(() => {
    localStorage.clear()
    setUser(null)
    window.location.href = '/login'
  }, [])

  return { user, loading, login, register, logout }
}
