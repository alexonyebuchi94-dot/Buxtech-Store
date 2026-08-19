import express from 'express'
import { nanoid } from 'nanoid'
import { createOrder, getOrder, getAllOrders, getOrdersByEmail, updateOrderStatus, markOrderSeen } from '../data/orderStore.js'
import { requireAdmin, requireCustomer } from '../middleware/auth.js'
import { findUserById } from '../data/userStore.js'
import { sendOrderConfirmationEmail, sendOrderStatusEmail } from '../lib/email.js'

const router = express.Router()

// GET /api/orders/admin/all — list every order (admin only)
router.get('/admin/all', requireAdmin, async (req, res) => {
  res.json(await getAllOrders())
})

// GET /api/orders/mine — orders belonging to the logged-in customer,
// matched by their account email
router.get('/mine', requireCustomer, async (req, res) => {
  const user = await findUserById(req.userId)
  if (!user) return res.status(404).json({ error: 'User not found' })
  res.json(await getOrdersByEmail(user.email))
})

// POST /api/orders — create a pending order before sending the customer to Paystack
// (or, for pay-on-delivery, an already-confirmed order needing no online payment)
router.post('/', async (req, res) => {
  const { customer, items, subtotal, deliveryFee, total, totalWeight, paymentMethod } = req.body

  if (!customer?.email || !customer?.name || !items?.length) {
    return res.status(400).json({ error: 'Missing required order details' })
  }

  const method = paymentMethod === 'pay-on-delivery' ? 'pay-on-delivery' : 'paystack'

  const order = await createOrder({
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
// (e.g. marking pay-on-delivery as paid, or moving it to shipped/delivered/cancelled)
router.put('/:id/status', requireAdmin, async (req, res) => {
  const { status } = req.body
  const allowed = ['pending', 'pay-on-delivery', 'paid', 'shipped', 'delivered', 'cancelled', 'failed']
  if (!allowed.includes(status)) {
    return res.status(400).json({ error: 'Invalid status' })
  }
  const order = await updateOrderStatus(req.params.id, status)
  if (!order) return res.status(404).json({ error: 'Order not found' })

  // Let the customer know about the statuses that matter to them
  if (['shipped', 'delivered', 'cancelled', 'paid'].includes(status)) {
    sendOrderStatusEmail(order, status)
  }

  res.json(order)
})

// PUT /api/orders/:id/seen — admin marks an order as reviewed
router.put('/:id/seen', requireAdmin, async (req, res) => {
  const seen = req.body.seen !== false
  const order = await markOrderSeen(req.params.id, seen)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  res.json(order)
})

// GET /api/orders/:id
router.get('/:id', async (req, res) => {
  const order = await getOrder(req.params.id)
  if (!order) return res.status(404).json({ error: 'Order not found' })
  res.json(order)
})

export default router
