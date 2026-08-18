import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'

const slides = [
  {
    tag: 'KITCHEN · ELECTRONICS · GADGETS',
    heading: ['POWER', 'YOUR', 'WORLD'],
    text: 'Appliances that make cooking effortless. Gadgets that keep your setup sharp. All in one place, delivered across Nigeria.',
    cta: { label: 'Shop Now', to: '/shop' },
    image: 'https://images.unsplash.com/photo-1648301037182-9dd1ad3c4d90?w=900',
    badge: 'LIVE STOCK',
  },
  {
    tag: 'NEW DEALS · THIS WEEK',
    heading: ['SHOP', 'SMARTER', 'TODAY'],
    text: 'Fresh price drops across kitchen appliances and tech gadgets. Limited stock on featured items.',
    cta: { label: 'View Deals', to: '/shop' },
    image: 'https://images.unsplash.com/photo-1585237672814-8f97e97ae7d5?w=900',
    badge: 'DEALS LIVE',
  },
  {
    tag: 'LAPTOP · DESKTOP · GADGETS',
    heading: ['UPGRADE', 'YOUR', 'SETUP'],
    text: 'Docking stations, mechanical keyboards, and everything your desk needs to feel professional.',
    cta: { label: 'Shop Gadgets', to: '/shop?category=laptop-desktop-gadgets' },
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=900',
    badge: 'IN STOCK',
  },
]

export default function Hero() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % slides.length)
    }, 6000)
    return () => clearInterval(timer)
  }, [])

  const slide = slides[index]

  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-base">
      <div className="absolute inset-0 circuit-grid" />
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan/10 rounded-full blur-3xl orb-drift-1" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet/10 rounded-full blur-3xl orb-drift-2" />

      <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center w-full py-20">
        <div key={index} className="reveal-up">
          <div className="inline-flex items-center gap-2 text-cyan font-mono-price text-xs tracking-widest mb-6 border border-cyan/30 rounded-full px-4 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan pulse-dot" />
            {slide.tag}
          </div>
          <h1 className="font-display text-6xl md:text-8xl text-ink leading-[0.9] mb-6">
            {slide.heading[0]}<br />{slide.heading[1]}<br />
            <span className="text-cyan text-glow">{slide.heading[2]}</span>
          </h1>
          <p className="text-muted text-lg max-w-md mb-8">{slide.text}</p>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              to={slide.cta.to}
              className="inline-block bg-cyan text-base font-semibold px-8 py-4 rounded shadow-glow hover:shadow-glowStrong hover:-translate-y-0.5 transition-all"
            >
              {slide.cta.label}
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

          {/* Slide indicators */}
          <div className="flex gap-2 mt-10">
            {slides.map((_, i) => (
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
        </div>

        <div key={`img-${index}`} className="relative hidden md:block float-slow bounce-in">
          <div className="absolute -inset-8 bg-cyan/10 blur-3xl rounded-full pulse-glow" />
          <div className="absolute -inset-px rounded-lg bg-grad-line opacity-40 blur-sm" />
          <img
            src={slide.image}
            alt="Featured product"
            className="relative rounded-lg shadow-2xl border border-cyan/20 aspect-[4/3] object-cover w-full"
          />
          <div className="absolute -bottom-4 -left-4 bg-surface border border-cyan/40 rounded px-4 py-2 shadow-glow">
            <span className="text-cyan font-mono-price text-xs">● {slide.badge}</span>
          </div>
        </div>
      </div>
    </section>
  )
}
