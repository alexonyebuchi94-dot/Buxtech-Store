import { useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { categories, products, brands } from '../data/products.js'
import { naira } from '../lib/config.js'
import ProductCard from '../components/ProductCard.jsx'
import QuickView from '../components/QuickView.jsx'
import SEO from '../components/SEO.jsx'

const MAX_PRICE = Math.ceil(Math.max(...products.map((p) => p.price)) / 100000) * 100000
const SORTS = [
  ['random', 'Random mix'],
  ['popular', 'Most popular'],
  ['newest', 'Newest'],
  ['price-asc', 'Price: low to high'],
  ['price-desc', 'Price: high to low'],
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]] }
  return a
}

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const activeCategory = params.get('category') || 'all'
  const activeSub = params.get('sub') || ''
  const searchQuery = params.get('search') || ''

  const [sort, setSort] = useState('random')
  const [maxPrice, setMaxPrice] = useState(MAX_PRICE)
  const [minPrice, setMinPrice] = useState(0)
  const [brandSel, setBrandSel] = useState([])
  const [inStock, setInStock] = useState(false)
  const [minRating, setMinRating] = useState(0)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [qv, setQv] = useState(null)
  const [shuffled] = useState(() => shuffle(products)) // random order, once per visit

  const cat = categories.find((c) => c.slug === activeCategory)

  function setParam(key, value) {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value); else next.delete(key)
    if (key === 'category') next.delete('sub')
    setParams(next)
  }

  const filtered = useMemo(() => {
    let list = shuffled
    if (activeCategory !== 'all') list = list.filter((p) => p.category === activeCategory)
    if (activeSub) list = list.filter((p) => p.sub === activeSub)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter((p) => p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.keywords.some((k) => k.toLowerCase().includes(q)))
    }
    list = list.filter((p) => p.price >= minPrice && p.price <= maxPrice)
    if (brandSel.length) list = list.filter((p) => brandSel.includes(p.brand))
    if (inStock) list = list.filter((p) => p.stock > 0)
    if (minRating) list = list.filter((p) => p.rating >= minRating)
    const s = [...list]
    if (sort === 'price-asc') s.sort((a, b) => a.price - b.price)
    if (sort === 'price-desc') s.sort((a, b) => b.price - a.price)
    if (sort === 'newest') s.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    if (sort === 'popular') s.sort((a, b) => b.popularity - a.popularity)
    return s
  }, [shuffled, activeCategory, activeSub, searchQuery, minPrice, maxPrice, brandSel, inStock, minRating, sort])

  const activeCount = (activeCategory !== 'all') + !!activeSub + (minPrice > 0 || maxPrice < MAX_PRICE) + (brandSel.length > 0) + inStock + (minRating > 0)
  function clearAll() {
    setParams(searchQuery ? { search: searchQuery } : {})
    setMinPrice(0); setMaxPrice(MAX_PRICE); setBrandSel([]); setInStock(false); setMinRating(0)
  }
  const toggleBrand = (b) => setBrandSel((s) => (s.includes(b) ? s.filter((x) => x !== b) : [...s, b]))

  const pill = (on) => `px-3 py-1.5 rounded text-sm border transition-colors ${on ? 'border-cyan text-cyan bg-cyan/10' : 'border-border text-muted hover:text-ink'}`

  const Filters = (
    <div className="space-y-6">
      <div>
        <h3 className="font-display text-sm text-ink mb-3 tracking-wide">CATEGORY</h3>
        <div className="flex flex-wrap gap-2">
          <button onClick={() => setParam('category', '')} className={pill(activeCategory === 'all')}>All</button>
          {categories.map((c) => <button key={c.slug} onClick={() => setParam('category', c.slug)} className={pill(activeCategory === c.slug)}>{c.name}</button>)}
        </div>
        {cat?.subs.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3 pl-3 border-l border-border">
            <button onClick={() => setParam('sub', '')} className={pill(!activeSub)}>All {cat.name}</button>
            {cat.subs.map((s) => <button key={s.slug} onClick={() => setParam('sub', s.slug)} className={pill(activeSub === s.slug)}>{s.name}</button>)}
          </div>
        )}
      </div>
      <div>
        <h3 className="font-display text-sm text-ink mb-3 tracking-wide">PRICE RANGE</h3>
        <div className="flex items-center gap-2 mb-2">
          <input type="number" min="0" value={minPrice} onChange={(e) => setMinPrice(Math.max(0, Number(e.target.value) || 0))} aria-label="Minimum price" className="w-full bg-base border border-border rounded px-2 py-1.5 text-sm text-ink focus:border-cyan outline-none" />
          <span className="text-muted">–</span>
          <input type="number" min="0" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value) || 0)} aria-label="Maximum price" className="w-full bg-base border border-border rounded px-2 py-1.5 text-sm text-ink focus:border-cyan outline-none" />
        </div>
        <input type="range" min="0" max={MAX_PRICE} step="5000" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} aria-label="Max price slider" className="w-full accent-cyan" />
        <div className="text-xs text-muted font-mono-price">{naira(minPrice)} – {naira(maxPrice)}</div>
      </div>
      <div>
        <h3 className="font-display text-sm text-ink mb-3 tracking-wide">BRAND</h3>
        <div className="flex flex-wrap gap-2">{brands.map((b) => <button key={b} onClick={() => toggleBrand(b)} className={pill(brandSel.includes(b))}>{b}</button>)}</div>
      </div>
      <div>
        <h3 className="font-display text-sm text-ink mb-3 tracking-wide">RATING</h3>
        <div className="flex flex-wrap gap-2">
          {[0, 4.5, 4, 3].map((r) => <button key={r} onClick={() => setMinRating(r)} className={pill(minRating === r)}>{r === 0 ? 'Any' : `${r}★ & up`}</button>)}
        </div>
      </div>
      <label className="flex items-center gap-3 text-sm text-ink cursor-pointer">
        <input type="checkbox" checked={inStock} onChange={(e) => setInStock(e.target.checked)} className="accent-cyan w-4 h-4" /> In-stock only
      </label>
      {activeCount > 0 && <button onClick={clearAll} className="text-sm text-cyan hover:underline">Clear all filters</button>}
    </div>
  )

  return (
    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 py-10">
      <SEO
        title={`${cat ? cat.name + ' — ' : ''}Shop All — BuxTech`}
        description="Shop laptops, desktops, tech gadgets and gaming gear at BuxTech, delivered across Nigeria."
        path="/shop"
        jsonLd={{ '@context': 'https://schema.org', '@type': 'ItemList', itemListElement: products.slice(0, 10).map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name })) }}
      />
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-3xl sm:text-4xl text-ink tracking-wide">{cat ? cat.name.toUpperCase() : 'SHOP ALL'}{activeSub && cat ? ` · ${cat.subs.find((s) => s.slug === activeSub)?.name}` : ''}</h1>
          <p className="text-muted text-sm mt-1">{filtered.length} product{filtered.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      {/* Search + sort bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="search" value={searchQuery} onChange={(e) => setParam('search', e.target.value)} placeholder="Search all products…" aria-label="Search products"
          className="flex-1 bg-surface border border-border rounded px-4 py-2.5 text-sm text-ink placeholder:text-muted focus:border-cyan outline-none"
        />
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort products" className="bg-surface border border-border rounded px-3 py-2.5 text-sm text-ink focus:border-cyan outline-none">
          {SORTS.map(([v, l]) => <option key={v} value={v}>Sort: {l}</option>)}
        </select>
        <button onClick={() => setFiltersOpen(true)} className="lg:hidden border border-border rounded px-4 py-2.5 text-sm text-ink hover:border-cyan">Filters{activeCount ? ` (${activeCount})` : ''}</button>
      </div>

      <div className="grid lg:grid-cols-[17rem_1fr] gap-8">
        <aside className="hidden lg:block sticky top-24 self-start max-h-[calc(100vh-7rem)] overflow-y-auto pr-2 no-scrollbar">{Filters}</aside>

        <div>
          {filtered.length === 0 ? (
            <div className="text-center py-20 border border-border rounded-xl">
              <p className="text-ink mb-2">No products match those filters.</p>
              <button onClick={clearAll} className="text-cyan hover:underline text-sm">Clear all filters</button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
              {filtered.map((p) => <ProductCard key={p.id} product={p} onQuickView={setQv} />)}
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {filtersOpen && (
        <div className="fixed inset-0 z-[80] bg-black/60 lg:hidden" onClick={() => setFiltersOpen(false)}>
          <div className="absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-surface p-5 overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-5">
              <h2 className="font-display text-xl text-ink">FILTERS</h2>
              <button onClick={() => setFiltersOpen(false)} className="text-muted hover:text-cyan" aria-label="Close filters">✕</button>
            </div>
            {Filters}
            <button onClick={() => setFiltersOpen(false)} className="w-full mt-6 bg-cyan text-base font-semibold py-3 rounded">Show {filtered.length} products</button>
          </div>
        </div>
      )}
      {qv && <QuickView product={qv} onClose={() => setQv(null)} />}
    </div>
  )
}
