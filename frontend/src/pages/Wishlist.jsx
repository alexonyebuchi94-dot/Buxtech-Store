import { useState } from 'react'
import { Link } from 'react-router-dom'
import { products } from '../data/products.js'
import { useStore } from '../context/StoreContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import ProductCard from '../components/ProductCard.jsx'
import QuickView from '../components/QuickView.jsx'
import SEO from '../components/SEO.jsx'

export default function Wishlist() {
  const { wishlist, toggleWishlist, notify } = useStore()
  const { addToCart } = useCart()
  const [qv, setQv] = useState(null)
  const items = wishlist.map((id) => products.find((p) => p.id === id)).filter(Boolean)

  function moveAll() {
    items.filter((p) => p.stock > 0).forEach((p) => addToCart(p))
    notify('In-stock items added to cart 🛒')
  }

  return (
    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 py-12">
      <SEO title="My Wishlist — BuxTech" noindex />
      <div className="flex flex-wrap items-end justify-between gap-3 mb-8">
        <h1 className="font-display text-3xl sm:text-4xl text-ink tracking-wide">MY WISHLIST <span className="text-cyan text-xl">({items.length})</span></h1>
        {items.length > 0 && <button onClick={moveAll} className="border border-cyan text-cyan rounded px-4 py-2 text-sm hover:bg-cyan/10">Add all in-stock to cart</button>}
      </div>
      {items.length === 0 ? (
        <div className="text-center py-20 border border-border rounded-xl">
          <p className="text-muted mb-2">Nothing saved yet.</p>
          <p className="text-muted text-sm mb-6">Tap the heart on any product to save it for later.</p>
          <Link to="/shop" className="inline-block bg-cyan text-base font-semibold px-8 py-3 rounded shadow-glow">Browse products</Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {items.map((p) => (
            <div key={p.id} className="flex flex-col gap-2">
              <ProductCard product={p} onQuickView={setQv} />
              <button onClick={() => toggleWishlist(p.id)} className="text-xs text-muted hover:text-red-400">Remove from wishlist</button>
            </div>
          ))}
        </div>
      )}
      {qv && <QuickView product={qv} onClose={() => setQv(null)} />}
    </div>
  )
}
