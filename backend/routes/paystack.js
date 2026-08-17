const express = require('express');
const crypto = require('crypto');
const axios = require('axios');
const db = require('../db/pool');
const { requireAuth } = require('../middleware/auth');
const { sendOrderConfirmedEmail } = require('../services/email');

const router = express.Router();
const PAYSTACK_SECRET = process.env.PAYSTACK_SECRET_KEY;

// POST /api/paystack/initialize — call this from the checkout page
router.post('/initialize', requireAuth, async (req, res) => {
  const { orderId, email, amount } = req.body; // amount in Naira
  try {
    const response = await axios.post(
      'https://api.paystack.co/transaction/initialize',
      {
        email,
        amount: Math.round(amount * 100), // Paystack expects kobo
        metadata: { orderId },
        callback_url: `${process.env.FRONTEND_URL}/order-confirmation`,
      },
      { headers: { Authorization: `Bearer ${PAYSTACK_SECRET}` } }
    );
    res.json(response.data.data); // { authorization_url, access_code, reference }
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).json({ error: 'Could not initialize payment' });
  }
});

// POST /api/paystack/webhook — Paystack calls this server-to-server on payment events.
// Register this exact URL in your Paystack dashboard: https://yourapi.onrender.com/api/paystack/webhook
// IMPORTANT: mount this route with express.raw({type:'application/json'}) in server.js
// so the signature check below works — see server.js comment.
router.post('/webhook', async (req, res) => {
  const signature = req.headers['x-paystack-signature'];
  const hash = crypto
    .createHmac('sha512', PAYSTACK_SECRET)
    .update(req.body) // raw buffer
    .digest('hex');

  if (hash !== signature) {
    return res.status(401).send('Invalid signature');
  }

  const event = JSON.parse(req.body.toString());

  if (event.event === 'charge.success') {
    const { orderId } = event.data.metadata;
    try {
      const result = await db.query(
        `UPDATE orders SET payment_status = 'paid', status = 'paid',
         payment_reference = $1 WHERE id = $2 RETURNING *`,
        [event.data.reference, orderId]
      );
      const order = result.rows[0];
      if (order) await sendOrderConfirmedEmail(order);
    } catch (err) {
      console.error('Webhook DB update failed:', err);
    }
  }

  res.sendStatus(200); // always 200 quickly, or Paystack will retry/flag your webhook
});

module.exports = router;
