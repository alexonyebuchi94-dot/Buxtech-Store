import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { products, categories } from '../data/products.js'
import { naira } from '../lib/config.js'
import { SearchIcon } from './Icons.jsx'

// Search bar with live suggestions (products, brands, categories).
export default function SearchBox({ className = '', autoFocus = false, onDone }) {
  const [q, setQ] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const ref = useRef(null)
  const navigate = useNavigate()

  const results = useMemo(() => {
    const s = q.trim().toLowerCase()
    if (s.length < 1) return { prods: [], cats: [] }
    const prods = products
      .filter((p) => p.name.toLowerCase().includes(s) || p.brand.toLowerCase().includes(s) || (p.keywords || []).some((k) => k.includes(s)))
      .slice(0, 5)
    const cats = categories.filter((c) => c.name.toLowerCase().includes(s)).slice(0, 2)
    return { prods, cats }
  }, [q])

  useEffect(() => {
    const close = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', close)
    return () => document.removeEventListener('mousedown', close)
  }, [])

  const flat = [...results.cats.map((c) => ({ t: 'cat', c })), ...results.prods.map((p) => ({ t: 'p', p }))]

  function go(path) {
    navigate(path); setQ(''); setOpen(false); setActive(-1); onDone?.()
  }
  function submit(e) {
    e.preventDefault()
    const item = flat[active]
    if (item?.t === 'p') return go(`/product/${item.p.id}`)
    if (item?.t === 'cat') return go(`/shop?category=${item.c.slug}`)
    if (q.trim()) go(`/shop?search=${encodeURIComponent(q.trim())}`)
  }
  function onKey(e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(flat.length - 1, a + 1)) }
    if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(-1, a - 1)) }
    if (e.key === 'Escape') setOpen(false)
  }

  return (
    <form ref={ref} onSubmit={submit} className={`relative ${className}`} role="search">
      <input
        type="text" autoFocus={autoFocus} value={q} autoComplete="off"
        onChange={(e) => { setQ(e.target.value); setOpen(true); setActive(-1) }}
        onFocus={() => setOpen(true)} onKeyDown={onKey}
        placeholder="Search laptops, gadgets, brands…"
        aria-label="Search products"
        className="w-full bg-surface border border-border rounded pl-9 pr-3 py-2 text-sm text-ink placeholder:text-muted focus:border-cyan outline-none"
      />
      <SearchIcon width={15} height={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
      {open && q.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-lg shadow-glow overflow-hidden z-50 min-w-[280px]">
          {flat.length === 0 ? (
            <div className="px-4 py-3 text-sm text-muted">No matches — press Enter to search “{q}”</div>
          ) : (
            <ul>
              {flat.map((it, i) => (
                <li key={it.t + (it.c?.slug || it.p?.id)}>
                  <button
                    type="button" onMouseEnter={() => setActive(i)}
                    onClick={() => go(it.t === 'p' ? `/product/${it.p.id}` : `/shop?category=${it.c.slug}`)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left text-sm ${active === i ? 'bg-base' : ''}`}
                  >
                    {it.t === 'p' ? (
                      <>
                        <img src={it.p.image} alt="" className="w-9 h-9 rounded object-cover" />
                        <span className="flex-1 min-w-0"><span className="block text-ink truncate">{it.p.name}</span><span className="text-xs text-muted">{it.p.brand}</span></span>
                        <span className="font-mono-price text-cyan text-xs">{naira(it.p.price)}</span>
                      </>
                    ) : (
                      <span className="text-cyan">Category: <span className="text-ink">{it.c.name}</span> →</span>
                    )}
                  </button>
                </li>
              ))}
              <li><button type="submit" className="w-full text-left px-4 py-2.5 text-xs text-cyan border-t border-border hover:bg-base">See all results for “{q}” →</button></li>
            </ul>
          )}
        </div>
      )}
    </form>
  )
}
