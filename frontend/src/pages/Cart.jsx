import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { naira, VAT_RATE } from '../lib/config.js'
import { NIGERIAN_STATES, getDeliveryFee, deliveryEstimate, FREE_SHIPPING_OVER, HEAVY_ORDER_KG } from '../lib/shipping.js'
import SEO from '../components/SEO.jsx'

export default function Cart() {
  const { items, updateQty, removeFromCart, subtotal, discount, promo, applyPromo, removePromo, freeShip, shipState, setShipState, totalWeight } = useCart()
  const navigate = useNavigate()
  const [code, setCode] = useState('')
  const [msg, setMsg] = useState(null)

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <SEO title="Your Cart — BuxTech" noindex />
        <h1 className="font-display text-4xl text-ink mb-4 tracking-wide">YOUR CART IS EMPTY</h1>
        <p className="text-muted mb-8">Browse the catalog and find something worth adding.</p>
        <Link to="/shop" className="inline-block bg-cyan text-base font-semibold px-8 py-3 rounded shadow-glow">Shop Now</Link>
      </div>
    )
  }

  const taxable = subtotal - discount
  const vat = Math.round(taxable * VAT_RATE)
  const delivery = shipState ? getDeliveryFee(shipState, totalWeight, subtotal, freeShip) : null
  const total = taxable + vat + (delivery ?? 0)
  const toFree = Math.max(0, FREE_SHIPPING_OVER - subtotal)

  function submitPromo(e) {
    e.preventDefault()
    setMsg(applyPromo(code)); setCode('')
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <SEO title="Your Cart — BuxTech" noindex />
      <h1 className="font-display text-3xl sm:text-4xl text-ink mb-8 tracking-wide">YOUR CART</h1>

      <div className="grid lg:grid-cols-[1fr_24rem] gap-8">
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.key} className="flex flex-wrap sm:flex-nowrap items-center gap-3 sm:gap-4 border border-border rounded-lg p-3 sm:p-4 bg-surface">
              <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
              <div className="flex-1 min-w-[10rem]">
                <Link to={`/product/${item.id}`} className="text-ink font-medium hover:text-cyan">{item.name}</Link>
                <div className="font-mono-price text-cyan text-sm mt-1">{naira(item.price)}</div>
              </div>
              <div className="flex items-center border border-border rounded">
                <button onClick={() => updateQty(item.key, item.qty - 1)} className="px-3 py-1 text-ink hover:text-cyan" aria-label="Decrease quantity">−</button>
                <span className="px-3 font-mono-price text-ink">{item.qty}</span>
                <button onClick={() => updateQty(item.key, item.qty + 1)} className="px-3 py-1 text-ink hover:text-cyan" aria-label="Increase quantity">+</button>
              </div>
              <div className="font-mono-price text-ink w-28 text-right">{naira(item.price * item.qty)}</div>
              <button onClick={() => removeFromCart(item.key)} className="text-muted hover:text-red-400 text-sm">Remove</button>
            </div>
          ))}
          <Link to="/shop" className="inline-block text-sm text-cyan hover:underline">← Continue shopping</Link>
        </div>

        <aside className="border border-border rounded-lg p-5 bg-surface h-fit space-y-5 lg:sticky lg:top-24">
          {/* Promo */}
          <div>
            <label className="text-sm text-muted block mb-2">Promo / discount code</label>
            {promo ? (
              <div className="flex items-center justify-between border border-cyan/40 bg-cyan/10 rounded px-3 py-2 text-sm">
                <span className="text-cyan">{promo.code} · {promo.label}</span>
                <button onClick={() => { removePromo(); setMsg(null) }} className="text-muted hover:text-ink text-xs">Remove</button>
              </div>
            ) : (
              <form onSubmit={submitPromo} className="flex gap-2">
                <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. BUX10" className="flex-1 min-w-0 bg-base border border-border rounded px-3 py-2 text-sm text-ink focus:border-cyan outline-none uppercase" />
                <button className="border border-cyan text-cyan rounded px-4 text-sm hover:bg-cyan/10">Apply</button>
              </form>
            )}
            {msg && !promo && <p className={`text-xs mt-1 ${msg.ok ? 'text-cyan' : 'text-red-400'}`}>{msg.msg}</p>}
          </div>

          {/* Shipping calculator */}
          <div>
            <label className="text-sm text-muted block mb-2" htmlFor="ship-state">Shipping calculator — your location</label>
            <select id="ship-state" value={shipState} onChange={(e) => setShipState(e.target.value)} className="w-full bg-base border border-border rounded px-3 py-2 text-sm text-ink focus:border-cyan outline-none">
              <option value="">Select state…</option>
              {NIGERIAN_STATES.map((s) => <option key={s}>{s}</option>)}
            </select>
            {shipState && <p className="text-xs text-cyan mt-1">Delivery to {shipState}: {delivery === 0 ? 'FREE' : naira(delivery)} · arrives {deliveryEstimate(shipState)}</p>}
            {totalWeight > HEAVY_ORDER_KG && <p className="text-xs text-amber-400 mt-1">Heavy order ({totalWeight.toFixed(1)}kg) — we may call to confirm delivery arrangements.</p>}
            {toFree > 0 && !freeShip && <p className="text-xs text-muted mt-1">Add {naira(toFree)} more for free delivery.</p>}
          </div>

          <div className="border-t border-border pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-muted"><span>Subtotal</span><span className="font-mono-price text-ink">{naira(subtotal)}</span></div>
            {discount > 0 && <div className="flex justify-between text-cyan"><span>Discount ({promo.code})</span><span className="font-mono-price">−{naira(discount)}</span></div>}
            <div className="flex justify-between text-muted"><span>VAT (7.5%)</span><span className="font-mono-price text-ink">{naira(vat)}</span></div>
            <div className="flex justify-between text-muted"><span>Delivery</span><span className="font-mono-price text-ink">{delivery == null ? 'Select state' : delivery === 0 ? 'FREE' : naira(delivery)}</span></div>
            <div className="flex justify-between text-ink font-medium pt-2 border-t border-border text-base"><span>{delivery == null ? 'Total (excl. delivery)' : 'Total'}</span><span className="font-mono-price text-cyan">{naira(total)}</span></div>
          </div>
          <button onClick={() => navigate('/checkout')} className="w-full bg-cyan text-base font-semibold py-3 rounded shadow-glow hover:shadow-glowStrong transition-shadow">
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </div>
  )
}
