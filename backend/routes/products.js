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
router.get('/', async (req, res) => {
  const { category } = req.query
  const all = await getAllProducts()
  const result = category ? all.filter((p) => p.category === category) : all
  res.json(result)
})

// POST /api/products — create a new product (admin only)
router.post('/', requireAdmin, async (req, res) => {
  const { name, category, price, stock, images, description, featured, keywords, weight, sku, brand, keyFeatures } = req.body
  if (!name || !category || price == null) {
    return res.status(400).json({ error: 'Missing required fields: name, category, price' })
  }
  const product = await createProduct({
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
    keyFeatures: parseLines(keyFeatures),
  })
  res.status(201).json(product)
})

// Accepts either an array of keywords or a comma-separated string (from the admin form)
function parseKeywords(keywords) {
  if (Array.isArray(keywords)) return keywords.map((k) => k.trim()).filter(Boolean)
  if (typeof keywords === 'string') return keywords.split(',').map((k) => k.trim()).filter(Boolean)
  return []
}

// Accepts either an array of lines or a newline-separated string (key features, one per line)
function parseLines(value) {
  if (Array.isArray(value)) return value.map((v) => v.trim()).filter(Boolean)
  if (typeof value === 'string') return value.split('\n').map((v) => v.trim()).filter(Boolean)
  return []
}

// PUT /api/products/:id — update a product (admin only)
router.put('/:id', requireAdmin, async (req, res) => {
  const data = { ...req.body }
  if ('keywords' in data) data.keywords = parseKeywords(data.keywords)
  if ('keyFeatures' in data) data.keyFeatures = parseLines(data.keyFeatures)
  if ('weight' in data) data.weight = data.weight === '' || data.weight == null ? null : Number(data.weight)
  const updated = await updateProduct(req.params.id, data)
  if (!updated) return res.status(404).json({ error: 'Product not found' })
  res.json(updated)
})

// DELETE /api/products/:id — remove a product (admin only)
router.delete('/:id', requireAdmin, async (req, res) => {
  const deleted = await deleteProduct(req.params.id)
  if (!deleted) return res.status(404).json({ error: 'Product not found' })
  res.json({ deleted: true })
})

// GET /api/products/:id
router.get('/:id', async (req, res) => {
  const product = await getProduct(req.params.id)
  if (!product) return res.status(404).json({ error: 'Product not found' })
  res.json(product)
})

export default router
