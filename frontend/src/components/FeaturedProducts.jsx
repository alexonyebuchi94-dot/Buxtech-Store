import { useEffect, useState } from 'react'
import { fetchProducts } from '../api/products.js'
import ProductCard from './ProductCard.jsx'

export default function FeaturedProducts() {
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    fetchProducts()
      .then((all) => setFeatured(all.filter((p) => p.featured).slice(0, 4)))
      .catch(() => setFeatured([]))
  }, [])

  if (featured.length === 0) return null

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <div className="flex items-end justify-between mb-8">
        <h2 className="font-display text-3xl text-ink tracking-wide">FEATURED PRODUCTS</h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {featured.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}
