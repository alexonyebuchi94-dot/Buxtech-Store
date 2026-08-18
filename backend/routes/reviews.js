import express from 'express'
import { getReviews, addReview, getAverageRating } from '../data/reviewStore.js'
import { getProduct } from '../data/productStore.js'

const router = express.Router()

// GET /api/reviews/:productId — list reviews for a product
router.get('/:productId', (req, res) => {
  const reviews = getReviews(req.params.productId)
  const rating = getAverageRating(req.params.productId)
  res.json({ reviews, rating })
})

// POST /api/reviews/:productId — submit a new review
router.post('/:productId', (req, res) => {
  const { name, rating, comment } = req.body
  const product = getProduct(req.params.productId)

  if (!product) return res.status(404).json({ error: 'Product not found' })
  if (!name || !rating || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Name and a rating between 1 and 5 are required' })
  }

  const review = addReview(req.params.productId, { name, rating, comment: comment || '' })
  res.status(201).json(review)
})

export default router
