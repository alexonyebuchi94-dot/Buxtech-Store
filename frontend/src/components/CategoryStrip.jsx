import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { categories } from '../data/products.js'
import { fetchProducts } from '../api/products.js'

export default function CategoryStrip() {
  const [thumbnails, setThumbnails] = useState({}) // slug -> image url

  useEffect(() => {
    fetchProducts()
      .then((all) => {
        const map = {}
        for (const cat of categories) {
          const match = all.find((p) => p.category === cat.slug && p.images?.[0])
          if (match) map[cat.slug] = match.images[0]
        }
        setThumbnails(map)
      })
      .catch(() => {})
  }, [])

  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="font-display text-3xl text-ink mb-8 tracking-wide">SHOP BY CATEGORY</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            to={`/shop?category=${cat.slug}`}
            className="group relative rounded-lg overflow-hidden aspect-[4/3] border border-border hover:border-cyan hover:shadow-glow transition-all duration-300 bg-surface"
          >
            {thumbnails[cat.slug] ? (
              <img
                src={thumbnails[cat.slug]}
                alt={cat.name}
                className="w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center text-muted text-sm px-6 text-center">
                No products yet in this category
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-base via-transparent to-transparent" />
            <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-cyan opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute bottom-0 left-0 p-5">
              <span className="font-display text-2xl text-ink tracking-wide">{cat.name}</span>
              <div className="text-cyan text-xs font-mono-price mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                BROWSE →
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
