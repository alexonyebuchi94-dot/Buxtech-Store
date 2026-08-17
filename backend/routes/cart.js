const express = require('express');
const db = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// Simple approach: cart lives in the browser (localStorage/React state) for guests,
// and only gets validated/priced server-side here — avoids needing a cart table.

// POST /api/cart/validate — client sends [{productId, quantity}], server returns
// live prices + stock so the frontend cart is always accurate before checkout.
router.post('/validate', async (req, res) => {
  const { items } = req.body; // [{ productId, quantity }]
  if (!Array.isArray(items) || !items.length) {
    return res.status(400).json({ error: 'No items provided' });
  }
  try {
    const ids = items.map((i) => i.productId);
    const result = await db.query(
      `SELECT id, name, price, stock, images FROM products WHERE id = ANY($1)`,
      [ids]
    );
    const products = result.rows;

    const validated = items.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      if (!product) return { ...item, error: 'Product no longer available' };
      if (item.quantity > product.stock) {
        return { ...item, error: `Only ${product.stock} left in stock`, product };
      }
      return { ...item, product, subtotal: product.price * item.quantity };
    });

    const total = validated.reduce((sum, i) => sum + (i.subtotal || 0), 0);
    res.json({ items: validated, total });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Cart validation failed' });
  }
});

module.exports = router;
