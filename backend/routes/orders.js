import express from 'express'
import { nanoid } from 'nanoid'
import { createOrder, getOrder, getAllOrders, updateOrderStatus } from '../data/orderStore.js'
import { requireAdmin } from '../middleware/auth.js'
import { sendOrderConfirmationEmail } from '../lib/email.js'

const router = express.Router()

// GET /api/orders/admin/all — list every order (admin only)
router.get('/admin/all', requireAdmin, (req, res) => {
  res.json(getAllOrders())
})

// POST /api/orders — create a pending order before sending the customer to Paystack
// (or, for pay-on-delivery, an already-confirmed order needing no online payment)
router.post('/', (req, res) => {
  const { customer, items, subtotal, deliveryFee, total, totalWeight, paymentMethod } = req.body

  if (!customer?.email || !customer?.name || !items?.length) {
    return res.status(400).json({ error: 'Missing required order details' })
  }

  const method = paymentMethod === 'pay-on-delivery' ? 'pay-on-delivery' : 'paystack'

  const order = createOrder({
    id: nanoid(10),
    customer,
    items,
    subtotal,
    deliveryFee,
    total,
    totalWeight: totalWeight || 0,
    paymentMethod: method,
    status: method === 'pay-on-delivery' ? 'pay-on-delivery' : 'pending',
    createdAt: new Date().toISOString(),
  })

  if (method === 'pay-on-delivery') {
    sendOrderConfirmationEmail(order)
  }

  res.status(201).json(order)
})

// PUT /api/orders/:id/status — admin updates an order's status
// (e.g. marking a pay-on-delivery order as paid once cash is collected)
router.put('/:id/status', requireAdmin, (req, res) => {
  const { status } = req.body
  const allowed = ['pending', 'pay-on-delivery', 'paid', 'failed', 'delivered']
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }
  const order = updateOrderStatus(req.params.id, status)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  res.json(order)
})

// GET /api/orders/:id
router.get('/:id', (req, res) => {
  const order = getOrder(req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  res.json(order)
})

export default router
