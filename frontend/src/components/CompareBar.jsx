import { useState } from 'react'
import { Link } from 'react-router-dom'
import { products } from '../data/products.js'
import { useStore } from '../context/StoreContext.jsx'
import { useCart } from '../context/CartContext.jsx'
import { naira } from '../lib/config.js'
import { Close, Scale } from './Icons.jsx'
import StarRating from './StarRating.jsx'

// Floating tray + side-by-side comparison table (up to 4 products)
export default function CompareBar() {
  const { compare, toggleCompare, clearCompare } = useStore()
  const { addToCart } = useCart()
  const [open, setOpen] = useState(false)
  const items = compare.map((id) => products.find((p) => p.id === id)).filter(Boolean)
  if (items.length === 0) return null

  const rows = [
    ['Price', (p) => <span className="font-mono-price text-cyan">{naira(p.price)}</span>],
    ['Brand', (p) => p.brand],
    ['Rating', (p) => <span className="inline-flex items-center gap-1"><StarRating value={Math.round(p.rating)} size={12} /> {p.rating}</span>],
    ['Availability', (p) => (p.stock > 0 ? <span className="text-cyan">In stock</span> : <span className="text-red-400">Out of stock</span>)],
    ['Warranty', (p) => p.warranty],
    ['Weight', (p) => `${p.weight} kg`],
    ['Highlights', (p) => <span className="text-xs text-muted">{p.description}</span>],
  ]

  return (
    <>
      <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-[70] bg-surface border border-cyan/40 rounded-xl shadow-glow px-3 py-2.5 flex items-center gap-3 max-w-[95vw]">
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {items.map((p) => (
            <div key={p.id} className="relative shrink-0">
              <img src={p.image} alt={p.name} className="w-10 h-10 rounded object-cover border border-border" />
              <button onClick={() => toggleCompare(p.id)} aria-label={`Remove ${p.name}`} className="absolute -top-1.5 -right-1.5 bg-base border border-border rounded-full w-4 h-4 flex items-center justify-center text-muted hover:text-red-400"><Close width={10} height={10} /></button>
            </div>
          ))}
        </div>
        <button onClick={() => setOpen(true)} disabled={items.length < 2} className="bg-cyan text-base text-sm font-semibold px-4 py-2 rounded whitespace-nowrap disabled:opacity-50 flex items-center gap-1.5"><Scale width={15} height={15} />Compare ({items.length})</button>
        <button onClick={clearCompare} className="text-xs text-muted hover:text-ink">Clear</button>
      </div>

      {open && (
        <div className="fixed inset-0 z-[85] bg-black/70 backdrop-blur-sm flex items-center justify-center p-3" onClick={() => setOpen(false)} role="dialog" aria-modal="true" aria-label="Compare products">
          <div className="bg-surface border border-border rounded-xl w-full max-w-5xl max-h-[90vh] overflow-auto p-4 sm:p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-display text-2xl text-ink">COMPARE PRODUCTS</h2>
              <button onClick={() => setOpen(false)} aria-label="Close" className="text-muted hover:text-cyan"><Close /></button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-sm text-left">
                <thead>
                  <tr>
                    <th className="w-28" />
                    {items.map((p) => (
                      <th key={p.id} className="p-2 align-top font-normal">
                        <img src={p.image} alt={p.name} className="w-full max-w-[140px] aspect-square object-cover rounded border border-border mb-2" />
                        <Link to={`/product/${p.id}`} onClick={() => setOpen(false)} className="text-ink hover:text-cyan block leading-snug">{p.name}</Link>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map(([label, fn]) => (
                    <tr key={label} className="border-t border-border">
                      <td className="py-3 pr-2 text-muted align-top">{label}</td>
                      {items.map((p) => <td key={p.id} className="p-2 align-top text-ink">{fn(p)}</td>)}
                    </tr>
                  ))}
                  <tr className="border-t border-border">
                    <td />
                    {items.map((p) => (
                      <td key={p.id} className="p-2"><button disabled={p.stock <= 0} onClick={() => addToCart(p)} className="border border-cyan text-cyan rounded px-3 py-1.5 text-xs hover:bg-cyan/10 disabled:opacity-40">Add to Cart</button></td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
