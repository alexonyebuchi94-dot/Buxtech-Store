import { createContext, useContext, useState, useEffect } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => sessionStorage.getItem('buxtech_customer_token'))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    fetch(`${API_BASE}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((data) => setUser(data.user))
      .catch(() => {
        setToken(null)
        sessionStorage.removeItem('buxtech_customer_token')
      })
      .finally(() => setLoading(false))
  }, [token])

  function handleAuthSuccess(data) {
    setToken(data.token)
    setUser(data.user)
    sessionStorage.setItem('buxtech_customer_token', data.token)
  }

  async function register(name, email, password) {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Could not create account')
    handleAuthSuccess(data)
  }

  async function login(email, password) {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Could not sign in')
    handleAuthSuccess(data)
  }

  async function loginWithGoogle(credential) {
    const res = await fetch(`${API_BASE}/api/auth/google`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credential }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || 'Google sign-in failed')
    handleAuthSuccess(data)
  }

  function logout() {
    setUser(null)
    setToken(null)
    sessionStorage.removeItem('buxtech_customer_token')
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, register, login, loginWithGoogle, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
