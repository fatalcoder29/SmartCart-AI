import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

const STORAGE_KEY = 'maren_user'
const USERS_KEY = 'maren_users'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) setUser(JSON.parse(saved))
    } catch {
      localStorage.removeItem(STORAGE_KEY)
    }
  }, [])

  function register({ name, email, password }) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    if (users.some((u) => u.email.toLowerCase() === email.toLowerCase())) {
      return { ok: false, error: 'An account with this email already exists.' }
    }
    const newUser = { name, email, password }
    users.push(newUser)
    localStorage.setItem(USERS_KEY, JSON.stringify(users))

    const session = { name, email }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    setUser(session)
    return { ok: true }
  }

  function login({ email, password }) {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]')
    const found = users.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password,
    )
    if (!found) {
      return { ok: false, error: 'Invalid email or password.' }
    }
    const session = { name: found.name, email: found.email }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session))
    setUser(session)
    return { ok: true }
  }

  function logout() {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
