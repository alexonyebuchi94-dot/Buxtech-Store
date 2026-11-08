import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { naira } from '../lib/config.js'
import StarRating from './StarRating.jsx'
import { Close, Heart } from './Icons.jsx'

export default function QuickView({ product, onClose }) {
  const { addToCart } = useCart()
  const { wishlist, toggleWishlist, notify } = useStore()
  const [img, setImg] = useState(0)
  const [qty, setQty] = useState(1)
  useEffect(() => {
    const k = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', k)
    document.body.style.overflow = 'hidden'
    return () => { document.removeEventListener('keydown', k); document.body.style.overflow = '' }
  }, [onClose])
  if (!product) return null
  const out = product.stock <= 0
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm" onClick={onClose} role="dialog" aria-modal="true" aria-label={`Quick view: ${product.name}`}>
      <div className="bg-surface border border-border rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto grid md:grid-cols-2 gap-6 p-5 relative" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close" className="absolute top-3 right-3 text-muted hover:text-cyan"><Close /></button>
        <div>
          <img src={product.images[img]} alt={product.name} className="w-full aspect-square object-cover rounded-lg border border-border" />
          <div className="flex gap-2 mt-2">
            {product.images.map((s, i) => (
              <button key={i} onClick={() => setImg(i)} className={`w-14 h-14 rounded overflow-hidden border-2 ${i === img ? 'border-cyan' : 'border-border'}`}><img src={s} alt="" className="w-full h-full object-cover" /></button>
            ))}
          </div>
        </div>
        <div className="flex flex-col">
          <div className="text-xs text-muted font-mono-price uppercase">{product.brand}</div>
          <h2 className="font-display text-xl text-ink mt-1 mb-2 pr-6">{product.name}</h2>
          <div className="flex items-center gap-2 mb-3"><StarRating value={Math.round(product.rating)} size={14} /><span className="text-xs text-muted">{product.rating} ({product.reviewCount})</span></div>
          <div className="flex items-baseline gap-2 mb-3">
            <span className="font-mono-price text-cyan text-2xl">{naira(product.price)}</span>
            {product.oldPrice && <span className="font-mono-price text-muted text-sm line-through">{naira(product.oldPrice)}</span>}
          </div>
          <p className="text-muted text-sm leading-relaxed mb-3">{product.description}</p>
          <div className={`text-sm mb-4 ${out ? 'text-red-400' : 'text-cyan'}`}>{out ? 'Out of Stock' : 'In Stock'}</div>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center border border-border rounded">
              <button onClick={() => setQty((q) => Math.max(1, q - 1))} className="px-3 py-1.5 text-ink hover:text-cyan" aria-label="Decrease">−</button>
              <span className="px-3 font-mono-price text-ink">{qty}</span>
              <button onClick={() => setQty((q) => Math.min(Math.max(product.stock, 1), q + 1))} className="px-3 py-1.5 text-ink hover:text-cyan" aria-label="Increase">+</button>
            </div>
            <button onClick={() => toggleWishlist(product.id)} className={`w-10 h-10 border rounded flex items-center justify-center ${wishlist.includes(product.id) ? 'text-red-400 border-red-400/50' : 'text-ink border-border hover:border-cyan'}`} aria-label="Wishlist"><Heart filled={wishlist.includes(product.id)} /></button>
          </div>
          <button disabled={out} onClick={() => { addToCart(product, qty); notify('Added to cart 🛒'); onClose() }} className="bg-cyan text-base font-semibold py-3 rounded shadow-glow disabled:opacity-40">Add to Cart</button>
          <Link to={`/product/${product.id}`} onClick={onClose} className="text-center text-sm text-cyan hover:underline mt-3">View full details →</Link>
        </div>
      </div>
    </div>
  )
}
