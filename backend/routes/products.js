import express from 'express'
import { requireAdmin } from '../middleware/auth.js'
import {
  getAllProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../data/productStore.js'

const router = express.Router()

// GET /api/products — list all, optionally filtered by ?category=
router.get('/', (req, res) => {
  const { category } = req.query
  const all = getAllProducts()
  const result = category ? all.filter((p) => p.category === category) : all
  res.json(result)
})

// POST /api/products — create a new product (admin only)
router.post('/', requireAdmin, (req, res) => {
  const { name, category, price, stock, images, description, featured, keywords, weight } = req.body
  if (!name || !category || price == null) {
    return res.status(400).json({ error: 'Missing required fields: name, category, price' })
  }
  const product = createProduct({
    name,
    category,
    price: Number(price),
    stock: Number(stock) || 0,
    images: Array.isArray(images) ? images : [],
    description: description || '',
    keywords: keywords || '',
    weight: weight ? Number(weight) : null,
    featured: Boolean(featured),
  })
  res.status(201).json(product)
})

// PUT /api/products/:id — update a product (admin only)
router.put('/:id', requireAdmin, (req, res) => {
  const updated = updateProduct(req.params.id, req.body)
  if (!updated) return res.status(404).json({ error: 'Product not found' })
  res.json(updated)
})

// DELETE /api/products/:id — remove a product (admin only)
router.delete('/:id', requireAdmin, (req, res) => {
  const deleted = deleteProduct(req.params.id)
  if (!deleted) return res.status(404).json({ error: 'Product not found' })
  res.json({ deleted: true })
})

// GET /api/products/:id
router.get('/:id', (req, res) => {
  const product = getProduct(req.params.id)
  if (!product) return res.status(404).json({ error: 'Product not found' })
  res.json(product)
})

export default router
