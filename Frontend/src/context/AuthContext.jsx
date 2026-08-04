import { createContext, useContext, useState, useEffect } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)
const SESSION_KEY = 'maren_session'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function restoreSession() {
      try {
        const saved = localStorage.getItem(SESSION_KEY)
        if (saved) {
          const parsed = JSON.parse(saved)
          try {
            const res = await api.getProfile()
            setUser(res?.user || parsed)
          } catch {
            setUser(parsed)
          }
        }
      } catch {
        localStorage.removeItem(SESSION_KEY)
      } finally {
        setLoading(false)
      }
    }
    restoreSession()
  }, [])

  async function register({ name, email, password }) {
    try {
      const res = await api.register({ name, email, password })
      if (res?.user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(res.user))
        setUser(res.user)
        return { ok: true }
      }
      return { ok: false, error: 'Registration failed. Please try again.' }
    } catch (err) {
      return { ok: false, error: err.message || 'Registration failed. Check your connection.' }
    }
  }

  async function login({ email, password }) {
    try {
      const res = await api.login({ email, password })
      if (res?.user) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(res.user))
        setUser(res.user)
        return { ok: true }
      }
      return { ok: false, error: 'Login failed. Please try again.' }
    } catch (err) {
      return { ok: false, error: err.message || 'Invalid email or password.' }
    }
  }

  async function logout() {
    try { await api.logout() } catch { /* no-op */ }
    localStorage.removeItem(SESSION_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
