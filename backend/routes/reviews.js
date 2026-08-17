const express = require('express');
const db = require('../db/pool');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

// POST /api/reviews — leave a review (must be logged in)
router.post('/', requireAuth, async (req, res) => {
  const { productId, rating, comment } = req.body;
  if (!productId || !rating) {
    return res.status(400).json({ error: 'productId and rating are required' });
  }
  try {
    const result = await db.query(
      `INSERT INTO reviews (product_id, user_id, rating, comment)
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [productId, req.user.id, rating, comment]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});

module.exports = router;
