import { nanoid } from 'nanoid'
import User from '../models/User.js'
import { isDBConnected } from '../lib/db.js'

// Works two ways:
//  - MONGODB_URI set + connected -> accounts persist in MongoDB Atlas.
//  - not set -> falls back to an in-memory store so signup/login still
//    work immediately for local dev, but accounts are lost on restart
//    (same tradeoff as the in-memory product store).
// Add MONGODB_URI in your Render environment variables to switch this on.

const memUsers = new Map() // email -> user

export async function findUserByEmail(email) {
  const lower = email.toLowerCase().trim()
  if (isDBConnected()) return User.findOne({ email: lower })
  return memUsers.get(lower) || null
}

export async function findUserById(id) {
  if (isDBConnected()) return User.findById(id)
  return [...memUsers.values()].find((u) => u.id === id) || null
}

export async function findUserByGoogleId(googleId) {
  if (isDBConnected()) return User.findOne({ googleId })
  return [...memUsers.values()].find((u) => u.googleId === googleId) || null
}

export async function createUser({ name, email, passwordHash, googleId }) {
  const lower = email.toLowerCase().trim()
  if (isDBConnected()) {
    const user = await User.create({ name, email: lower, passwordHash, googleId })
    return user
  }
  const user = { id: nanoid(12), name, email: lower, passwordHash, googleId, createdAt: new Date().toISOString() }
  memUsers.set(lower, user)
  return user
}

export function toPublicUser(user) {
  return {
    id: user.id || user._id,
    name: user.name,
    email: user.email,
    hasPassword: !!user.passwordHash,
  }
}
