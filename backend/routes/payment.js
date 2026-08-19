import express from 'express'
import fetch from 'node-fetch'
import { getOrder, setOrderReference, findOrderByReference, updateOrderStatus } from '../data/orderStore.js'
import { sendOrderConfirmationEmail } from '../lib/email.js'

const router = express.Router()

const PAYSTACK_BASE = 'https://api.paystack.co'

// POST /api/payment/initialize — start a Paystack transaction for an order
router.post('/initialize', async (req, res) => {
  const { email, amount, orderId } = req.body

  if (!email || !amount || !orderId) {
    return res.status(400).json({ error: 'Missing email, amount, or orderId' })
  }

  const order = await getOrder(orderId)
  if (!order) return res.status(404).json({ error: 'Order not found' })

  try {
    const response = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Paystack expects kobo
        currency: 'NGN',
        callback_url: `${process.env.FRONTEND_URL}/order-confirmation`,
        metadata: { orderId },
      }),
    })

    const data = await response.json()

    if (!data.status) {
      return res.status(502).json({ error: data.message || 'Paystack initialization failed' })
    }

    await setOrderReference(orderId, data.data.reference)

    res.json({
      authorizationUrl: data.data.authorization_url,
      reference: data.data.reference,
    })
  } catch (err) {
    console.error('Paystack init error:', err)
    res.status(500).json({ error: 'Could not reach Paystack' })
  }
})

// GET /api/payment/verify/:reference — confirm payment status after redirect
router.get('/verify/:reference', async (req, res) => {
  const { reference } = req.params

  try {
    const response = await fetch(`${PAYSTACK_BASE}/transaction/verify/${reference}`, {
      headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}` },
    })
    const data = await response.json()

    const success = data.status && data.data?.status === 'success'

    const order = await findOrderByReference(reference)
    let updatedOrder = order
    if (order) {
      const alreadyPaid = order.status === 'paid'
      updatedOrder = await updateOrderStatus(order.id, success ? 'paid' : 'failed')
      if (success && !alreadyPaid) {
        sendOrderConfirmationEmail(updatedOrder)
      }
    }

    res.json({ success, order: updatedOrder || null })
  } catch (err) {
    console.error('Paystack verify error:', err)
    res.status(500).json({ error: 'Could not verify payment' })
  }
})

export default router
