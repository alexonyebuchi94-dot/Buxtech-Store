import { createContext, useContext, useState, useEffect } from 'react'
import * as authApi from '../api/auth.js'

const AuthContext = createContext(null)
const TOKEN_KEY = 'buxtech_customer_token'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY))
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) {
      setLoading(false)
      return
    }
    authApi
      .fetchMe(token)
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem(TOKEN_KEY)
        setToken(null)
      })
      .finally(() => setLoading(false))
  }, [token])

  function applySession(data) {
    localStorage.setItem(TOKEN_KEY, data.token)
    setToken(data.token)
    setUser(data.user)
  }

  async function signup(form) {
    const data = await authApi.signup(form)
    applySession(data)
    return data.user
  }

  async function login(form) {
    const data = await authApi.login(form)
    applySession(data)
    return data.user
  }

  async function loginWithGoogle(credential) {
    const data = await authApi.googleLogin(credential)
    applySession(data)
    return data.user
  }

  function logout() {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider
      value={{ user, token, loading, signup, login, loginWithGoogle, logout }}
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
