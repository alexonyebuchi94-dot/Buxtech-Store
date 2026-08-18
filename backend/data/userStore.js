import { nanoid } from 'nanoid'

// In-memory customer account store, keyed by email.
// Passwords are hashed before being stored (see routes/auth.js).
const users = new Map()

export function getUserByEmail(email) {
  return users.get(email.toLowerCase())
}

export function getUserById(id) {
  return [...users.values()].find((u) => u.id === id)
}

export function createUser({ name, email, passwordHash, googleId }) {
  const user = {
    id: nanoid(10),
    name,
    email: email.toLowerCase(),
    passwordHash: passwordHash || null,
    googleId: googleId || null,
    createdAt: new Date().toISOString(),
  }
  users.set(user.email, user)
  return user
}

export function linkGoogleId(email, googleId) {
  const user = users.get(email.toLowerCase())
  if (!user) return null
  user.googleId = googleId
  return user
}
