import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { slideArt } from '../lib/placeholder.js'
import { Play } from './Icons.jsx'

// 5 video slides + 2 flyer slides. These are PLACEHOLDERS.
// To use real media: set `src` on a slide (video file URL / image URL).
const SLIDES = [
  { type: 'video', title: 'Laptop Launch Week', sub: 'VIDEO 1 · PLACEHOLDER', hue: 200, src: '', to: '/shop?category=laptop' },
  { type: 'video', title: 'Build Your Dream Desktop', sub: 'VIDEO 2 · PLACEHOLDER', hue: 255, src: '', to: '/shop?category=desktop' },
  { type: 'flyer', title: 'Flash Sale · Up to 25% Off', sub: 'FLYER 1 · PLACEHOLDER', hue: 190, src: '', to: '/home#flash-sale' },
  { type: 'video', title: 'Gadgets That Do More', sub: 'VIDEO 3 · PLACEHOLDER', hue: 175, src: '', to: '/shop?category=tech-gadgets' },
  { type: 'video', title: 'Level Up Your Setup', sub: 'VIDEO 4 · PLACEHOLDER', hue: 285, src: '', to: '/shop?category=gaming-gadgets' },
  { type: 'flyer', title: 'Free Delivery Over ₦150,000', sub: 'FLYER 2 · PLACEHOLDER', hue: 215, src: '', to: '/shipping-policy' },
  { type: 'video', title: 'Unboxing: What’s New', sub: 'VIDEO 5 · PLACEHOLDER', hue: 230, src: '', to: '/shop' },
]

export default function HomeSlider() {
  const [i, setI] = useState(0)
  const [paused, setPaused] = useState(false)
  const touch = useRef(null)
  useEffect(() => {
    if (paused) return
    const t = setInterval(() => setI((n) => (n + 1) % SLIDES.length), 5500)
    return () => clearInterval(t)
  }, [paused])
  const go = (n) => setI((n + SLIDES.length) % SLIDES.length)
  const s = SLIDES[i]

  return (
    <section
      className="relative max-w-[90rem] mx-auto px-4 sm:px-6 pt-6"
      onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}
      onTouchStart={(e) => { touch.current = e.touches[0].clientX }}
      onTouchEnd={(e) => { const d = e.changedTouches[0].clientX - (touch.current ?? 0); if (Math.abs(d) > 50) go(i + (d < 0 ? 1 : -1)) }}
      aria-roledescription="carousel" aria-label="Featured videos and promotions"
    >
      <div className="relative rounded-xl overflow-hidden border border-border aspect-[16/9] sm:aspect-[21/8] bg-surface">
        {SLIDES.map((sl, idx) => (
          <Link key={idx} to={sl.to} tabIndex={idx === i ? 0 : -1} className={`absolute inset-0 transition-opacity duration-700 ${idx === i ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
            {sl.src && sl.type === 'video' ? (
              <video src={sl.src} muted loop playsInline autoPlay className="w-full h-full object-cover" />
            ) : (
              <img src={sl.src || slideArt(sl.title, sl.sub, sl.hue, sl.type)} alt={sl.title} className="w-full h-full object-cover" />
            )}
          </Link>
        ))}
        <div className="absolute top-3 left-3 bg-base/80 backdrop-blur border border-border rounded-full px-3 py-1 text-[11px] font-mono-price text-cyan flex items-center gap-1.5">
          {s.type === 'video' ? <><Play width={11} height={11} /> VIDEO</> : 'PROMO'}
        </div>
        <button onClick={() => go(i - 1)} aria-label="Previous slide" className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-base/70 border border-border text-ink hover:text-cyan">‹</button>
        <button onClick={() => go(i + 1)} aria-label="Next slide" className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-base/70 border border-border text-ink hover:text-cyan">›</button>
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
          {SLIDES.map((_, n) => (
            <button key={n} onClick={() => setI(n)} aria-label={`Go to slide ${n + 1}`} className={`h-1.5 rounded-full transition-all ${n === i ? 'w-7 bg-cyan' : 'w-2.5 bg-ink/40 hover:bg-ink/70'}`} />
          ))}
        </div>
      </div>
    </section>
  )
}
