import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  customer: { type: mongoose.Schema.Types.Mixed, required: true },
  items: { type: mongoose.Schema.Types.Mixed, required: true },
  subtotal: Number,
  deliveryFee: Number,
  total: Number,
  totalWeight: { type: Number, default: 0 },
  paymentMethod: { type: String, default: 'paystack' },
  status: { type: String, default: 'pending' },
  seen: { type: Boolean, default: false },
  paystackReference: String,
  history: { type: mongoose.Schema.Types.Mixed, default: [] },
  createdAt: { type: String, default: () => new Date().toISOString() },
})

export default mongoose.models.Order || mongoose.model('Order', orderSchema)
