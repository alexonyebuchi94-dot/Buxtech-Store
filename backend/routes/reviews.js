import express from 'express'
import { getReviews, addReview, getAverageRating } from '../data/reviewStore.js'
import { getProduct } from '../data/productStore.js'

const router = express.Router()

// GET /api/reviews/:productId — list reviews for a product
router.get('/:productId', async (req, res) => {
  const reviews = await getReviews(req.params.productId)
  const rating = await getAverageRating(req.params.productId)
  res.json({ reviews, rating })
})

// POST /api/reviews/:productId — submit a new review
router.post('/:productId', async (req, res) => {
  const { name, rating, comment } = req.body
  const product = await getProduct(req.params.productId)

  if (!product) return res.status(404).json({ error: 'Product not found' })
  if (!name || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Name and a rating between 1 and 5 are required' })
  }

  const review = await addReview(req.params.productId, { name, rating, comment: comment || '' })
  res.status(201).json(review)
})

export default router
