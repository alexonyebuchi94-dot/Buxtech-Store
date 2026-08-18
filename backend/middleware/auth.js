// Simple shared-secret auth for admin-only routes.
// Set ADMIN_PASSWORD in your environment variables.
export function requireAdmin(req, res, next) {
  const key = req.headers['x-admin-key']
  if (!process.env.ADMIN_PASSWORD || key !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Unauthorized' })
  }
  next()
}
