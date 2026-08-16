import express from 'express'
import { products } from '../data/products.js'

const router = express.Router()

// GET /api/products — list all, optionally filtered by ?category=
router.get('/', (req, res) => {
  const { category } = req.query
  const result = category ? products.filter((p) => p.category === category) : products
  res.json(result)
})

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = products.find((p) => p.id === req.params.id)
  if (!product) return res.status(404).json({ error: 'Product not found' })
  res.json(product)
})

export default router
