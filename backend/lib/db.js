import mongoose from 'mongoose'

// Connects to MongoDB Atlas if MONGODB_URI is set. If it isn't set yet,
// the app still boots — customer accounts just won't persist across
// restarts until you add a connection string (see README).

let connected = false

export async function connectDB() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.log('[db] MONGODB_URI not set — customer accounts will not persist. See README.')
    return
  }
  try {
    await mongoose.connect(uri)
    connected = true
    console.log('[db] Connected to MongoDB')
  } catch (err) {
    console.error('[db] MongoDB connection failed:', err.message)
  }
}

export function isDBConnected() {
  return connected
}
