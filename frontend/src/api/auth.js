import { API_BASE, DEMO } from '../lib/config.js'

// DEMO builds keep accounts in the browser so the preview works without a server.
const USERS = 'bx_demo_users'
const demoUsers = () => { try { return JSON.parse(localStorage.getItem(USERS)) || [] } catch { return [] } }
const demoSession = (u) => ({ token: `demo.${btoa(u.email)}`, user: { id: u.email, name: u.name, email: u.email } })

async function handle(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Something went wrong')
  return data
}

export async function signup({ name, email, password }) {
  if (DEMO) {
    const list = demoUsers()
    if (list.some((u) => u.email === email.toLowerCase())) throw new Error('An account with that email already exists')
    const u = { name, email: email.toLowerCase(), password }
    localStorage.setItem(USERS, JSON.stringify([...list, u]))
    return demoSession(u)
  }
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  })
  return handle(res)
}

export async function login({ email, password }) {
  if (DEMO) {
    const u = demoUsers().find((x) => x.email === email.toLowerCase() && x.password === password)
    if (!u) throw new Error('Wrong email or password — in the preview, register first')
    return demoSession(u)
  }
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  return handle(res)
}

export async function googleLogin(credential) {
  const res = await fetch(`${API_BASE}/api/auth/google`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ credential }),
  })
  return handle(res)
}

export async function fetchMe(token) {
  if (DEMO) {
    const email = atob(String(token).replace('demo.', ''))
    const u = demoUsers().find((x) => x.email === email)
    if (!u) throw new Error('Session expired')
    return { user: demoSession(u).user }
  }
  const res = await fetch(`${API_BASE}/api/auth/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  return handle(res)
}
