import express from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { OAuth2Client } from 'google-auth-library'
import {
  findUserByEmail,
  findUserByGoogleId,
  findUserById,
  createUser,
  toPublicUser,
} from '../data/userStore.js'
import { requireCustomer } from '../middleware/auth.js'

const router = express.Router()

const JWT_SECRET = process.env.JWT_SECRET || 'dev-only-insecure-secret'
const googleClient = process.env.GOOGLE_CLIENT_ID ? new OAuth2Client(process.env.GOOGLE_CLIENT_ID) : null

function signToken(user) {
  const id = user.id || user._id
  return jwt.sign({ sub: String(id) }, JWT_SECRET, { expiresIn: '30d' })
}

// POST /api/auth/signup — create an account with name/email/password
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' })
    }
    if (password.length < 8) {
      return res.status(400).json({ error: 'Password must be at least 8 characters' })
    }
    const existing = await findUserByEmail(email)
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' })
    }
    const passwordHash = await bcrypt.hash(password, 10)
    const user = await createUser({ name, email, passwordHash })
    const token = signToken(user)
    res.status(201).json({ token, user: toPublicUser(user) })
  } catch (err) {
    console.error('[auth] signup error:', err.message)
    res.status(500).json({ error: 'Could not create account' })
  }
})

// POST /api/auth/login — email/password login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }
    const user = await findUserByEmail(email)
    if (!user || !user.passwordHash) {
      return res.status(401).json({ error: 'Incorrect email or password' })
    }
    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return res.status(401).json({ error: 'Incorrect email or password' })
    }
    const token = signToken(user)
    res.json({ token, user: toPublicUser(user) })
  } catch (err) {
    console.error('[auth] login error:', err.message)
    res.status(500).json({ error: 'Could not log in' })
  }
})

// POST /api/auth/google — sign up or log in with a Google ID token
// Frontend sends the credential it gets back from Google Identity Services.
router.post('/google', async (req, res) => {
  try {
    if (!googleClient) {
      return res.status(503).json({ error: 'Google sign-in is not configured on the server yet' })
    }
    const { credential } = req.body
    if (!credential) {
      return res.status(400).json({ error: 'Missing Google credential' })
    }
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    })
    const payload = ticket.getPayload()
    const { sub: googleId, email, name } = payload

    let user = await findUserByGoogleId(googleId)
    if (!user) {
      // Link to an existing email/password account, or create a new one
      user = await findUserByEmail(email)
      if (!user) {
        user = await createUser({ name: name || email, email, googleId })
      }
    }

    const token = signToken(user)
    res.json({ token, user: toPublicUser(user) })
  } catch (err) {
    console.error('[auth] google error:', err.message)
    res.status(401).json({ error: 'Google sign-in failed' })
  }
})

// GET /api/auth/me — current logged-in customer
router.get('/me', requireCustomer, async (req, res) => {
  const user = await findUserById(req.userId)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json({ user: toPublicUser(user) })
})

export default router
