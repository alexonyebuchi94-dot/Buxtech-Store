import mongoose from 'mongoose'

const productSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, default: 0 },
  images: { type: [String], default: [] },
  description: { type: String, default: '' },
  featured: { type: Boolean, default: false },
  keywords: { type: [String], default: [] },
  weight: { type: Number, default: null },
  sku: { type: String, default: '' },
  brand: { type: String, default: '' },
  keyFeatures: { type: [String], default: [] },
})

export default mongoose.models.Product || mongoose.model('Product', productSchema)
