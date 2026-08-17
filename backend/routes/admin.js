const express = require('express');
const db = require('../db/pool');
const { requireAuth, requireAdmin } = require('../middleware/auth');

const router = express.Router();
router.use(requireAuth, requireAdmin); // every route below is admin-only

function slugify(name) {
  return name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// GET /api/admin/dashboard — totals for the dashboard cards + chart
router.get('/dashboard', async (req, res) => {
  try {
    const sales = await db.query(
      `SELECT COALESCE(SUM(total),0) AS revenue, COUNT(*) AS order_count
       FROM orders WHERE payment_status = 'paid'`
    );
    const lowStock = await db.query(`SELECT id, name, stock FROM products WHERE stock <= 3`);
    const chart = await db.query(`
      SELECT DATE(created_at) AS day, SUM(total) AS revenue
      FROM orders WHERE payment_status = 'paid'
      GROUP BY DATE(created_at) ORDER BY day DESC LIMIT 30
    `);
    res.json({ ...sales.rows[0], lowStock: lowStock.rows, chart: chart.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load dashboard' });
  }
});

// POST /api/admin/products — create
router.post('/products', async (req, res) => {
  const { name, price, stock, category_id, description, images, specs, featured } = req.body;
  try {
    const result = await db.query(
      `INSERT INTO products (name, slug, price, stock, category_id, description, images, specs, featured)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [name, slugify(name), price, stock, category_id, description, images || [], specs || {}, !!featured]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// PUT /api/admin/products/:id — this powers your existing "Edit Product" form
router.put('/products/:id', async (req, res) => {
  const { name, price, stock, category_id, description, images, specs, featured } = req.body;
  try {
    const result = await db.query(
      `UPDATE products SET name=$1, price=$2, stock=$3, category_id=$4,
       description=$5, images=$6, specs=$7, featured=$8 WHERE id=$9 RETURNING *`,
      [name, price, stock, category_id, description, images, specs, !!featured, req.params.id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Product not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// DELETE /api/admin/products/:id
router.delete('/products/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM products WHERE id = $1', [req.params.id]);
    res.json({ message: 'Product deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

// GET /api/admin/orders?status=pending
router.get('/orders', async (req, res) => {
  const { status } = req.query;
  try {
    const result = await db.query(
      status
        ? `SELECT * FROM orders WHERE status = $1 ORDER BY created_at DESC`
        : `SELECT * FROM orders ORDER BY created_at DESC`,
      status ? [status] : []
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
});

// PATCH /api/admin/orders/:id/status — move an order through New -> Shipped -> Delivered
router.patch('/orders/:id/status', async (req, res) => {
  const { status } = req.body; // pending | paid | shipped | delivered | cancelled
  try {
    const result = await db.query(
      `UPDATE orders SET status = $1 WHERE id = $2 RETURNING *`,
      [status, req.params.id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update order status' });
  }
});

// GET /api/admin/users
router.get('/users', async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, name, email, phone, created_at FROM users ORDER BY created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

module.exports = router;
