const express = require('express');
const db = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

function generateOrderRef() {
  return 'BUX' + Math.floor(10000 + Math.random() * 90000);
}

// POST /api/orders/create — called after cart is validated, before payment.
// Order starts as 'pending' / 'unpaid' until the Paystack webhook confirms payment.
router.post('/create', requireAuth, async (req, res) => {
  const { items, address, phone } = req.body; // items: [{productId, quantity, price}]
  if (!items?.length || !address || !phone) {
    return res.status(400).json({ error: 'Missing items, address, or phone' });
  }
  const client = await db.connect();
  try {
    await client.query('BEGIN');
    const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const orderRef = generateOrderRef();

    const orderResult = await client.query(
      `INSERT INTO orders (order_ref, user_id, total, address, phone)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [orderRef, req.user.id, total, address, phone]
    );
    const order = orderResult.rows[0];

    for (const item of items) {
      await client.query(
        `INSERT INTO order_items (order_id, product_id, quantity, price)
         VALUES ($1, $2, $3, $4)`,
        [order.id, item.productId, item.quantity, item.price]
      );
    }
    await client.query('COMMIT');
    res.status(201).json(order);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'Failed to create order' });
  } finally {
    client.release();
  }
});

// GET /api/orders/:id — order detail + tracking
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const order = await db.query(
      `SELECT * FROM orders WHERE id = $1 AND (user_id = $2 OR $3 = TRUE)`,
      [req.params.id, req.user.id, req.user.is_admin]
    );
    if (!order.rows.length) return res.status(404).json({ error: 'Order not found' });

    const items = await db.query(
      `SELECT oi.*, p.name, p.images FROM order_items oi
       JOIN products p ON oi.product_id = p.id WHERE order_id = $1`,
      [req.params.id]
    );
    res.json({ ...order.rows[0], items: items.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch order' });
  }
});

// GET /api/orders — logged-in user's own order history
router.get('/', requireAuth, async (req, res) => {
  try {
    const result = await db.query(
      `SELECT * FROM orders WHERE user_id = $1 ORDER BY created_at DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

module.exports = router;
