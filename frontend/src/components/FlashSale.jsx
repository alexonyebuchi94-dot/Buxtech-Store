import { useEffect, useState } from 'react'
import { products } from '../data/products.js'
import ProductCard from './ProductCard.jsx'

function msToMidnight() {
  const n = new Date(); const e = new Date(n); e.setHours(24, 0, 0, 0)
  return e - n
}
const pad = (n) => String(n).padStart(2, '0')

// Flash sale + Deal of the Day. Timer resets at midnight each day.
export default function FlashSale({ onQuickView }) {
  const [ms, setMs] = useState(msToMidnight())
  useEffect(() => {
    const t = setInterval(() => setMs(msToMidnight()), 1000)
    return () => clearInterval(t)
  }, [])
  const deals = products.filter((p) => p.oldPrice && p.stock > 0)
    .sort((a, b) => (1 - b.price / b.oldPrice) - (1 - a.price / a.oldPrice))
  // Deal of the day rotates by date
  const day = Math.floor(Date.now() / 86400000)
  const dotd = deals[day % deals.length]
  const flash = deals.filter((p) => p.id !== dotd.id).slice(0, 4)
  const h = Math.floor(ms / 3600000), m = Math.floor((ms % 3600000) / 60000), s = Math.floor((ms % 60000) / 1000)

  return (
    <section id="flash-sale" className="max-w-[90rem] mx-auto px-4 sm:px-6 py-12">
      <div className="relative border border-cyan/30 rounded-xl p-4 sm:p-8 overflow-hidden bg-surface">
        <div className="absolute inset-0 bg-grad-glow opacity-60 pointer-events-none" />
        <div className="relative flex flex-wrap items-end justify-between gap-4 mb-6">
          <div>
            <div className="text-cyan font-mono-price text-xs tracking-widest mb-1 flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-cyan pulse-dot" />FLASH SALE · DEAL OF THE DAY</div>
            <h2 className="font-display text-2xl sm:text-4xl text-ink">ENDS IN</h2>
          </div>
          <div className="flex gap-2 font-mono-price" role="timer" aria-label="Time left on the flash sale">
            {[['HRS', h], ['MIN', m], ['SEC', s]].map(([l, v]) => (
              <div key={l} className="bg-base border border-border rounded-lg px-3 sm:px-4 py-2 text-center min-w-[3.5rem]">
                <div className="text-cyan text-xl sm:text-3xl">{pad(v)}</div>
                <div className="text-[10px] text-muted">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative grid lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-1">
            <div className="text-xs text-muted mb-2 font-mono-price">★ DEAL OF THE DAY</div>
            <ProductCard product={dotd} onQuickView={onQuickView} />
          </div>
          <div className="lg:col-span-2 grid grid-cols-2 gap-4 sm:gap-6">
            {flash.map((p) => <ProductCard key={p.id} product={p} onQuickView={onQuickView} />)}
          </div>
        </div>
      </div>
    </section>
  )
}
