import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categories } from '../data/products.js'
import { fetchProducts } from '../api/products.js'
import ProductCard from '../components/ProductCard.jsx'

export default function Shop() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeCategory = searchParams.get('category') || 'all'
  const searchQuery = searchParams.get('search') || ''
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchProducts(activeCategory === 'all' ? undefined : activeCategory)
      .then(setProducts)
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [activeCategory])

  let filtered = products
  if (searchQuery) {
    const q = searchQuery.toLowerCase()
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        (p.description || '').toLowerCase().includes(q)
    )
  }

  function setCategory(slug) {
    if (slug === 'all') {
      searchParams.delete('category')
    } else {
      searchParams.set('category', slug)
    }
    setSearchParams(searchParams)
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-ink mb-8 tracking-wide">SHOP</h1>

      {searchQuery && (
        <div className="flex items-center gap-3 mb-6 text-sm text-muted">
          <span>Results for "<span className="text-cyan">{searchQuery}</span>"</span>
          <button
            onClick={() => {
              searchParams.delete('search')
              setSearchParams(searchParams)
            }}
            className="text-cyan hover:underline"
          >
            Clear
          </button>
        </div>
      )}

      <div className="flex flex-wrap gap-3 mb-10">
        <button
          onClick={() => setCategory('all')}
          className={`px-4 py-2 rounded text-sm border transition-colors ${
            activeCategory === 'all'
              ? 'border-cyan text-cyan'
              : 'border-border text-muted hover:text-ink'
          }`}
        >
          All
        </button>
        {categories.map((cat) => (
          <button
            key={cat.slug}
            onClick={() => setCategory(cat.slug)}
            className={`px-4 py-2 rounded text-sm border transition-colors ${
              activeCategory === cat.slug
                ? 'border-cyan text-cyan'
                : 'border-border text-muted hover:text-ink'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-muted">Loading products…</p>
      ) : filtered.length === 0 ? (
        <p className="text-muted">No products in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  )
}
