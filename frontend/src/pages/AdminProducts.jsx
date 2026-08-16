import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { categories } from '../data/products.js'
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../api/products.js'

function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString('en-NG')}`
}

const emptyForm = {
  name: '',
  category: 'kitchen-appliances',
  price: '',
  stock: '',
  image: '',
  description: '',
  featured: false,
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
      image: product.image,
      description: product.description || '',
      featured: !!product.featured,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function cancelEdit() {
    setEditingId(null)
    setForm(emptyForm)
  }

  async function handleSubmit(e) {
    e.preventDefault()
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
            <label className="text-sm text-muted block mb-1">Image URL</label>
            <input
              required
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://..."
              className="w-full bg-base border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
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
              <img src={p.image} alt={p.name} className="w-16 h-16 object-cover rounded flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="text-ink font-medium truncate">{p.name}</div>
                <div className="text-muted text-xs">
                  {p.category} · Stock: {p.stock} {p.featured && '· Featured'}
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
