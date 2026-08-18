import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { categories } from '../data/products.js'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../api/products.js'
import ImageUploader from '../components/ImageUploader.jsx'

function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString('en-NG')}`
}

const emptyForm = {
  name: '',
  category: 'kitchen-appliances',
  price: '',
  stock: '',
  images: [],
  description: '',
  featured: false,
  keywords: '',
  weight: '',
  sku: '',
  brand: '',
  keyFeatures: '',
}

export default function AdminProducts() {
  const navigate = useNavigate()
  const adminKey = sessionStorage.getItem('buxtech_admin_key')

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [form, setForm] = useState(emptyForm)
  const [editingId, setEditingId] = useState(null)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (!adminKey) {
      navigate('/admin')
      return
    }
    loadProducts()
  }, [])

  async function loadProducts() {
    setLoading(true)
    try {
      const data = await fetchProducts()
      setProducts(data)
    } catch {
      setError('Could not load products')
    } finally {
      setLoading(false)
    }
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value })
  }

  function startEdit(product) {
    setEditingId(product.id)
    setForm({
      name: product.name,
      category: product.category,
      price: product.price,
      stock: product.stock,
      images: product.images || (product.image ? [product.image] : []),
      description: product.description || '',
      featured: !!product.featured,
      keywords: Array.isArray(product.keywords) ? product.keywords.join(', ') : '',
      weight: product.weight ?? '',
      sku: product.sku || '',
      brand: product.brand || '',
      keyFeatures: Array.isArray(product.keyFeatures) ? product.keyFeatures.join('\n') : '',
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (form.images.length === 0) {
      setError('Add at least one product photo')
      return
    }
    setSaving(true)
    setError('')
    try {
      if (editingId) {
        await updateProduct(adminKey, editingId, form)
      } else {
        await createProduct(adminKey, form)
      }
      setForm(emptyForm)
      setEditingId(null)
      await loadProducts()
    } catch {
      setError('Failed to save product')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return
    try {
      await deleteProduct(adminKey, id)
      await loadProducts()
    } catch {
      setError('Failed to delete product')
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <h1 className="font-display text-4xl text-ink tracking-wide">PRODUCTS</h1>
        <Link to="/admin/dashboard" className="text-sm text-muted hover:text-cyan border border-border rounded px-4 py-2">
          ← Orders
        </Link>
      </div>

      {error && (
        <div className="border border-red-500/40 bg-red-500/10 text-red-300 text-sm rounded p-3 mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="border border-border rounded-lg p-6 bg-surface mb-10 space-y-4">
        <h2 className="font-display text-xl text-ink tracking-wide mb-2">
          {editingId ? 'EDIT PRODUCT' : 'ADD NEW PRODUCT'}
        </h2>

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-sm text-muted block mb-1">Product Name</label>
            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-base border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Category</label>
            <select
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full bg-base border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
            >
              {categories.map((c) => (
                <option key={c.slug} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Price (₦)</label>
            <input
              required
              type="number"
              min="0"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full bg-base border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Stock</label>
            <input
              required
              type="number"
              min="0"
              name="stock"
              value={form.stock}
              onChange={handleChange}
              className="w-full bg-base border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Weight (kg)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              name="weight"
              value={form.weight}
              onChange={handleChange}
              placeholder="e.g. 1.5"
              className="w-full bg-base border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">SKU</label>
            <input
              type="text"
              name="sku"
              value={form.sku}
              onChange={handleChange}
              placeholder="e.g. BX-AF-5500"
              className="w-full bg-base border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Brand</label>
            <input
              type="text"
              name="brand"
              value={form.brand}
              onChange={handleChange}
              className="w-full bg-base border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm text-muted block mb-1">
              SEO Keywords <span className="text-xs">(comma-separated)</span>
            </label>
            <input
              type="text"
              name="keywords"
              value={form.keywords}
              onChange={handleChange}
              placeholder="e.g. air fryer, oil-free frying, kitchen appliance Nigeria"
              className="w-full bg-base border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
            />
            <p className="text-xs text-muted mt-1">
              Used in this product's page title, meta description, and search engine tags.
            </p>
          </div>
          <div>
            <label className="text-sm text-muted block mb-1 flex items-center gap-2">
              <input
                type="checkbox"
                name="featured"
                checked={form.featured}
                onChange={handleChange}
              />
              Show on homepage (featured)
            </label>
          </div>
          <div className="col-span-2">
            <ImageUploader
              images={form.images}
              onChange={(images) => setForm({ ...form, images })}
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm text-muted block mb-1">Description</label>
            <textarea
              rows={3}
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full bg-base border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm text-muted block mb-1">
              Key Features <span className="text-xs">(one per line)</span>
            </label>
            <textarea
              rows={4}
              name="keyFeatures"
              value={form.keyFeatures}
              onChange={handleChange}
              placeholder={'e.g.\n1200W high-torque motor\n8 preset cooking programs\nDishwasher-safe basket'}
              className="w-full bg-base border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
            />
            <p className="text-xs text-muted mt-1">
              Shown as a bullet list on the product page, separate from the description.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="bg-cyan text-base font-semibold px-6 py-3 rounded shadow-glow disabled:opacity-50"
          >
            {saving ? 'Saving…' : editingId ? 'Save Changes' : 'Add Product'}
          </button>
          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="border border-border text-muted px-6 py-3 rounded hover:text-ink"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <p className="text-muted">Loading products…</p>
      ) : (
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p.id} className="flex items-center gap-4 border border-border rounded-lg p-4 bg-surface">
              <img src={p.images?.[0] || p.image} alt={p.name} className="w-16 h-16 object-cover rounded flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-ink font-medium truncate">{p.name}</div>
                <div className="text-muted text-xs">
                  {p.category} · Stock: <span className={p.stock <= 2 ? 'text-red-400 font-medium' : ''}>{p.stock}</span>
                  {p.stock <= 2 && p.stock > 0 && <span className="text-red-400 ml-1">⚠ Low stock</span>}
                  {p.stock === 0 && <span className="text-red-400 ml-1">⚠ Out of stock</span>}
                  {p.featured && ' · Featured'}
                </div>
              </div>
              <div className="font-mono-price text-cyan">{formatNaira(p.price)}</div>
              <button
                onClick={() => startEdit(p)}
                className="text-sm text-muted hover:text-cyan border border-border rounded px-3 py-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-sm text-muted hover:text-red-400 border border-border rounded px-3 py-2"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
