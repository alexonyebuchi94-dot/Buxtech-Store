import express from 'express'
import { nanoid } from 'nanoid'
import { createOrder, getOrder, getAllOrders } from '../data/orderStore.js'
import { requireAdmin } from '../middleware/auth.js'

const router = express.Router()

// GET /api/orders/admin/all — list every order (admin only)
router.get('/admin/all', requireAdmin, (req, res) => {
  res.json(getAllOrders())
})

// POST /api/orders — create a pending order before sending the customer to Paystack
router.post('/', (req, res) => {
  const { customer, items, subtotal, deliveryFee, total } = req.body

  if (!customer?.email || !customer?.name || !items?.length) {
    return res.status(400).json({ error: 'Missing required order details' })
  }

  const order = createOrder({
    id: nanoid(10),
    customer,
    items,
    subtotal,
    deliveryFee,
    total,
    status: 'pending',
    createdAt: new Date().toISOString(),
  })

  res.status(201).json(order)
})

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  const order = getOrder(req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  res.json(order)
})

export default router
