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
  const { name, category, price, stock, images, description, featured, keywords, weight, sku, brand } = req.body
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
    featured: Boolean(featured),
    keywords: parseKeywords(keywords),
    weight: weight === '' || weight == null ? null : Number(weight),
    sku: sku || '',
    brand: brand || '',
  })
  res.status(201).json(product)
})

// Accepts either an array of keywords or a comma-separated string (from the admin form)
function parseKeywords(keywords) {
  if (Array.isArray(keywords)) return keywords.map((k) => k.trim()).filter(Boolean)
  if (typeof keywords === 'string') return keywords.split(',').map((k) => k.trim()).filter(Boolean)
  return []
}

// PUT /api/products/:id — update a product (admin only)
router.put('/:id', requireAdmin, (req, res) => {
  const data = { ...req.body }
  if ('keywords' in data) data.keywords = parseKeywords(data.keywords)
  if ('weight' in data) data.weight = data.weight === '' || data.weight == null ? null : Number(data.weight)
  const updated = updateProduct(req.params.id, data)
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
