import jwt from 'jsonwebtoken'

// Simple shared-secret auth for admin-only routes.
// Set ADMIN_PASSWORD in your environment variables.
export function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key']
  if (!process.env.ADMIN_PASSWORD || key !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}

// JWT-based auth for logged-in customers (email/password or Google signup).
// Expects: Authorization: Bearer <token>
export function requireCustomer(req, res, next) {
  const header = req.headers['authorization'] || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null
  if (!token) return res.status(401).json({ error: 'Not logged in' })
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-only-insecure-secret')
    req.userId = payload.sub
    next()
  } catch {
    return res.status(401).json({ error: 'Invalid or expired session' })
  }
}
