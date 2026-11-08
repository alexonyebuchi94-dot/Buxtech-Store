import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { useCart } from '../context/CartContext.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { naira } from '../lib/config.js'
import { Heart, Eye, Scale } from './Icons.jsx'
import StarRating from './StarRating.jsx'

export default function ProductCard({ product, onQuickView }) {
  const { addToCart } = useCart()
  const { wishlist, toggleWishlist, compare, toggleCompare, notify } = useStore()
  const cardRef = useRef(null)
  const wished = wishlist.includes(product.id)
  const comparing = compare.includes(product.id)
  const out = product.stock <= 0
  const off = product.oldPrice ? Math.round((1 - product.price / product.oldPrice) * 100) : 0

  function handleMouseMove(e) {
    const card = cardRef.current
    if (!card || window.matchMedia('(hover: none)').matches) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotateX = ((y - rect.height / 2) / rect.height) * -8
    const rotateY = ((x - rect.width / 2) / rect.width) * 8
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`
  }
  function handleMouseLeave() {
    const card = cardRef.current
    if (card) card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)'
  }

  const chip = 'w-8 h-8 rounded-full bg-base/80 backdrop-blur border border-border flex items-center justify-center transition-colors'

  return (
    <div ref={cardRef} onMouseMove={handleMouseMove} onMouseLeave={handleMouseLeave} className="glow-card tilt-card flex flex-col">
      <div className="relative">
        <Link to={`/product/${product.id}`} className="block">
          <div className="aspect-square overflow-hidden bg-base">
            <img src={product.images?.[0] || product.image} alt={product.name} className={`w-full h-full object-cover ${out ? 'opacity-50' : ''}`} loading="lazy" />
          </div>
        </Link>
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
          {off > 0 && <span className="bg-cyan text-base text-[10px] font-bold px-2 py-0.5 rounded">-{off}%</span>}
          {out && <span className="bg-red-500/90 text-white text-[10px] font-bold px-2 py-0.5 rounded">OUT OF STOCK</span>}
        </div>
        <div className="absolute top-2 right-2 flex flex-col gap-1.5">
          <button type="button" onClick={() => toggleWishlist(product.id)} aria-label={wished ? 'Remove from wishlist' : 'Add to wishlist'} aria-pressed={wished} className={`${chip} ${wished ? 'text-red-400 border-red-400/50' : 'text-ink hover:text-cyan hover:border-cyan'}`}>
            <Heart width={15} height={15} filled={wished} />
          </button>
          {onQuickView && (
            <button type="button" onClick={() => onQuickView(product)} aria-label="Quick view" className={`${chip} text-ink hover:text-cyan hover:border-cyan`}>
              <Eye width={15} height={15} />
            </button>
          )}
          <button type="button" onClick={() => toggleCompare(product.id)} aria-label="Compare" aria-pressed={comparing} className={`${chip} ${comparing ? 'text-cyan border-cyan' : 'text-ink hover:text-cyan hover:border-cyan'}`}>
            <Scale width={15} height={15} />
          </button>
        </div>
      </div>
      <div className="p-3 sm:p-4 flex flex-col gap-1.5 flex-1">
        <div className="text-[11px] text-muted font-mono-price uppercase tracking-wider">{product.brand}</div>
        <Link to={`/product/${product.id}`}>
          <h3 className="text-ink font-medium leading-snug hover:text-cyan transition-colors text-sm sm:text-base line-clamp-2">{product.name}</h3>
        </Link>
        {product.rating != null && (
          <div className="flex items-center gap-1.5">
            <StarRating value={Math.round(product.rating)} size={12} />
            <span className="text-[11px] text-muted">({product.reviewCount})</span>
          </div>
        )}
        <div className="mt-auto flex items-baseline gap-2 flex-wrap">
          <span className="font-mono-price text-cyan text-base sm:text-lg">{naira(product.price)}</span>
          {product.oldPrice && <span className="font-mono-price text-muted text-xs line-through">{naira(product.oldPrice)}</span>}
        </div>
        <button
          onClick={() => { addToCart(product); notify('Added to cart 🛒') }}
          disabled={out}
          className="mt-2 w-full border border-border rounded py-2 text-sm text-ink hover:border-cyan hover:text-cyan transition-colors disabled:opacity-40 disabled:hover:border-border disabled:hover:text-ink"
        >
          {out ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}
