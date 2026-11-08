import { Link } from 'react-router-dom'
import ProductCard from './ProductCard.jsx'

export default function ProductRail({ title, items, link, onQuickView, cols = 'grid-cols-2 md:grid-cols-4' }) {
  if (!items || items.length === 0) return null
  return (
    <section className="max-w-[90rem] mx-auto px-4 sm:px-6 py-12">
      <div className="flex items-end justify-between mb-6">
        <h2 className="font-display text-2xl sm:text-3xl text-ink tracking-wide">{title}</h2>
        {link && <Link to={link} className="text-sm text-cyan hover:underline">View all →</Link>}
      </div>
      <div className={`grid ${cols} gap-4 sm:gap-6`}>
        {items.map((p) => <ProductCard key={p.id} product={p} onQuickView={onQuickView} />)}
      </div>
    </section>
  )
}
