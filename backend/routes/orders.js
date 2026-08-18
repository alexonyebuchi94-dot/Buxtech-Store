import express from 'express'
import { nanoid } from 'nanoid'
import { createOrder, getOrder } from '../data/orderStore.js'

const router = express.Router()

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
