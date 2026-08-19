import mongoose from 'mongoose'

const reviewSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  productId: { type: String, required: true, index: true },
  name: { type: String, required: true },
  rating: { type: Number, required: true },
  comment: { type: String, default: '' },
  createdAt: { type: String, default: () => new Date().toISOString() },
})

export default mongoose.models.Review || mongoose.model('Review', reviewSchema)
