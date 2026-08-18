import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { fetchProducts } from '../api/products.js'

// Static copy for each slide — the image now comes from your real featured
// products instead of hardcoded stock photos, so it never breaks and
// always shows what you actually sell.
const slideCopy = [
  {
    tag: 'KITCHEN · ELECTRONICS · GADGETS',
    heading: ['POWER', 'YOUR', 'WORLD'],
    text: 'Appliances that make cooking effortless. Gadgets that keep your setup sharp. All in one place, delivered across Nigeria.',
    cta: { label: 'Shop Now', to: '/shop' },
    badge: 'LIVE STOCK',
  },
  {
    tag: 'NEW DEALS · THIS WEEK',
    heading: ['SHOP', 'SMARTER', 'TODAY'],
    text: 'Fresh price drops across kitchen appliances and tech gadgets. Limited stock on featured items.',
    cta: { label: 'View Deals', to: '/shop' },
    badge: 'DEALS LIVE',
  },
  {
    tag: 'LAPTOP · DESKTOP · GADGETS',
    heading: ['UPGRADE', 'YOUR', 'SETUP'],
    text: 'Docking stations, mechanical keyboards, and everything your desk needs to feel professional.',
    cta: { label: 'Shop Gadgets', to: '/shop?category=laptop-desktop-gadgets' },
    badge: 'IN STOCK',
  },
]

export default function Hero() {
  const [index, setIndex] = useState(0)
  const [featured, setFeatured] = useState([])

  useEffect(() => {
    fetchProducts()
      .then((all) => setFeatured(all.filter((p) => p.featured && p.images?.[0]).slice(0, slideCopy.length)))
      .catch(() => setFeatured([]))
  }, [])

  const slideCount = Math.max(featured.length, 1)

  useEffect(() => {
    if (slideCount <= 1) return
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slideCount)
    }, 6000)
    return () => clearInterval(timer)
  }, [slideCount])

  const copy = slideCopy[index % slideCopy.length]
  const product = featured[index]

  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-base">
      <div className="absolute inset-0 circuit-grid" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan/10 rounded-full blur-3xl orb-drift-1" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet/10 rounded-full blur-3xl orb-drift-2" />

      <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center w-full py-20">
        <div key={index} className="reveal-up">
          <div className="inline-flex items-center gap-2 text-cyan font-mono-price text-xs tracking-widest mb-6 border border-cyan/30 rounded-full px-4 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan pulse-dot" />
            {copy.tag}
          </div>
          <h1 className="font-display text-6xl md:text-8xl text-ink leading-[0.9] mb-6">
            {copy.heading[0]}<br />{copy.heading[1]}<br />
            <span className="text-cyan text-glow">{copy.heading[2]}</span>
          </h1>
          <p className="text-muted text-lg max-w-md mb-8">{copy.text}</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              to={copy.cta.to}
              className="inline-block bg-cyan text-base font-semibold px-8 py-4 rounded shadow-glow hover:shadow-glowStrong hover:-translate-y-0.5 transition-all"
            >
              {copy.cta.label}
            </Link>
            <div className="flex gap-6 font-mono-price text-sm">
              <div>
                <div className="text-cyan text-xl">12+</div>
                <div className="text-muted text-xs">Products</div>
              </div>
              <div>
                <div className="text-cyan text-xl">3</div>
                <div className="text-muted text-xs">Categories</div>
              </div>
              <div>
                <div className="text-cyan text-xl">24hr</div>
                <div className="text-muted text-xs">Dispatch</div>
              </div>
            </div>
          </div>

          {slideCount > 1 && (
            <div className="flex gap-2 mt-10">
              {Array.from({ length: slideCount }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index ? 'w-8 bg-cyan' : 'w-3 bg-border hover:bg-muted'
                  }`}
                />
              ))}
            </div>
          )}
        </div>

        <div key={`img-${index}`} className="relative hidden md:block float-slow bounce-in">
          <div className="absolute -inset-8 bg-cyan/10 blur-3xl rounded-full pulse-glow" />
          <div className="absolute -inset-px rounded-lg bg-grad-line opacity-40 blur-sm" />
          {product ? (
            <Link to={`/product/${product.id}`}>
              <img
                src={product.images[0]}
                alt={product.name}
                className="relative rounded-lg shadow-2xl border border-cyan/20 aspect-[4/3] object-cover w-full"
              />
            </Link>
          ) : (
            <div className="relative rounded-lg shadow-2xl border border-cyan/20 aspect-[4/3] w-full bg-surface flex items-center justify-center">
              <span className="text-muted text-sm">Mark a product "Featured" in Admin to show it here</span>
            </div>
          )}
          <div className="absolute -bottom-4 -left-4 bg-surface border border-cyan/40 rounded px-4 py-2 shadow-glow">
            <span className="text-cyan font-mono-price text-xs">● {product ? copy.badge : 'ADD PRODUCTS'}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
