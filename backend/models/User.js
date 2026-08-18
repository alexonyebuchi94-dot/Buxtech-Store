import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  passwordHash: { type: String }, // absent for Google-only accounts
  googleId: { type: String }, // absent for email/password accounts
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.User || mongoose.model('User', userSchema)
