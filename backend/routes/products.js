const express = require('express');
const db = require('../db/pool');

const router = express.Router();

// GET /api/products?category=kitchen&featured=true&page=1
router.get('/', async (req, res) => {
  const { category, featured, page = 1, limit = 20 } = req.query;
  const offset = (page - 1) * limit;
  const conditions = [];
  const values = [];

  if (category) {
    values.push(category);
    conditions.push(`c.slug = $${values.length}`);
  }
  if (featured === 'true') {
    conditions.push('p.featured = TRUE');
  }
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  values.push(limit, offset);
  const query = `
    SELECT p.*, c.name AS category_name
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ${where}
    ORDER BY p.created_at DESC
    LIMIT $${values.length - 1} OFFSET $${values.length}
  `;
  try {
    const result = await db.query(query, values);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// GET /api/products/:id — accepts numeric id or slug
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const isNumeric = /^\d+$/.test(id);
  try {
    const result = await db.query(
      `SELECT p.*, c.name AS category_name FROM products p
       LEFT JOIN categories c ON p.category_id = c.id
       WHERE ${isNumeric ? 'p.id = $1' : 'p.slug = $1'}`,
      [id]
    );
    if (!result.rows.length) return res.status(404).json({ error: 'Product not found' });

    const reviews = await db.query(
      `SELECT r.*, u.name AS user_name FROM reviews r
       JOIN users u ON r.user_id = u.id WHERE product_id = $1 ORDER BY created_at DESC`,
      [result.rows[0].id]
    );
    res.json({ ...result.rows[0], reviews: reviews.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// GET /api/search?q=blender
router.get('/search/query', async (req, res) => {
  const { q } = req.query;
  if (!q) return res.json([]);
  try {
    const result = await db.query(
      `SELECT id, name, slug, price, images FROM products
       WHERE name ILIKE $1 OR description ILIKE $1 LIMIT 20`,
      [`%${q}%`]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Search failed' });
  }
});

module.exports = router;
