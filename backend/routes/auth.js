import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import { getUserByEmail, createUser, getUserById, linkGoogleId } from '../data/userStore.js'

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me'
const googleClient = process.env.GOOGLE_CLIENT_ID ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID) : null

function signToken(user) {
  return jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, {
    expiresIn: '30d',
  })
}

function publicUser(user) {
  return { id: user.id, name: user.name, email: user.email }
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' })
  }
  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' })
  }
  if (getUserByEmail(email)) {
    return res.status(409).json({ error: 'An account with this email already exists' })
  }

  const passwordHash = await bcrypt.hash(password, 10)
  const user = createUser({ name, email, passwordHash })
  const token = signToken(user)
  res.status(201).json({ token, user: publicUser(user) })
})

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' })
  }

  const user = getUserByEmail(email)
  if (!user || !user.passwordHash) {
    return res.status(401).json({ error: 'Incorrect email or password' })
  }

  const valid = await bcrypt.compare(password, user.passwordHash)
  if (!valid) {
    return res.status(401).json({ error: 'Incorrect email or password' })
  }

  const token = signToken(user)
  res.json({ token, user: publicUser(user) })
})

// POST /api/auth/google — sign in or sign up using a Google ID token
router.post('/google', async (req, res) => {
  const { credential } = req.body
  if (!credential) return res.status(400).json({ error: 'Missing Google credential' })
  if (!googleClient) {
    return res.status(501).json({ error: 'Google sign-in is not configured on this server yet' })
  }

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    const { email, name, sub: googleId } = payload

    let user = getUserByEmail(email)
    if (!user) {
      user = createUser({ name, email, googleId })
    } else if (!user.googleId) {
      linkGoogleId(email, googleId)
    }

    const token = signToken(user)
    res.json({ token, user: publicUser(user) })
  } catch (err) {
    console.error('[auth] Google verification failed:', err.message)
    res.status(401).json({ error: 'Google sign-in failed' })
  }
})

// GET /api/auth/me — check current session from token
router.get('/me', (req, res) => {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Not signed in' })

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    const user = getUserById(decoded.id)
    if (!user) return res.status(401).json({ error: 'Session invalid' })
    res.json({ user: publicUser(user) })
  } catch {
    res.status(401).json({ error: 'Session expired' })
  }
})

// Middleware other routes can use to require a signed-in customer
export function requireCustomer(req, res, next) {
  const authHeader = req.headers.authorization || ''
  const token = authHeader.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Sign in required' })

  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    req.customer = decoded
    next()
  } catch {
    res.status(401).json({ error: 'Session expired' })
  }
}

export default router
