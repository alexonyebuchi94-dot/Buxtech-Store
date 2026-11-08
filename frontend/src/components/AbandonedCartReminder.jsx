import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { naira } from '../lib/config.js'

// Reminds visitors who left items behind: shows when they return after 30 minutes,
// or if they sit on the store for 3 minutes with a full cart and haven't checked out.
export default function AbandonedCartReminder() {
  const { items, subtotal, updatedAt } = useCart()
  const { pathname } = useLocation()
  const [show, setShow] = useState(false)
  const [dismissed, setDismissed] = useState(false)
  const hidden = pathname.startsWith('/cart') || pathname.startsWith('/checkout') || pathname.startsWith('/order')

  useEffect(() => {
    if (items.length && updatedAt && Date.now() - updatedAt > 30 * 60 * 1000) setShow(true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (!items.length) { setShow(false); return }
    const t = setTimeout(() => setShow(true), 3 * 60 * 1000)
    return () => clearTimeout(t)
  }, [items.length, updatedAt])

  if (!show || dismissed || hidden || !items.length) return null
  return (
    <div className="fixed bottom-20 right-4 z-[75] max-w-xs bg-surface border border-cyan/40 rounded-xl shadow-glow p-4 reveal-up">
      <button onClick={() => setDismissed(true)} aria-label="Dismiss reminder" className="absolute top-2 right-3 text-muted hover:text-ink">✕</button>
      <div className="text-ink font-medium mb-1">You left something behind 👀</div>
      <p className="text-muted text-sm mb-3">{items.length} item{items.length > 1 ? 's' : ''} ({naira(subtotal)}) waiting in your cart. Use <span className="text-cyan font-mono-price">BUX10</span> to save 10%.</p>
      <Link to="/cart" onClick={() => setDismissed(true)} className="inline-block bg-cyan text-base text-sm font-semibold px-4 py-2 rounded">Complete my order</Link>
    </div>
  )
}
