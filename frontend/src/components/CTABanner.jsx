import { Link } from 'react-router-dom'

export default function CTABanner() {
  return (
    <section className="relative py-24 overflow-hidden border-t border-border">
      <div className="absolute inset-0 bg-grad-glow" />
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl md:text-5xl text-ink mb-4 tracking-wide">
          READY TO UPGRADE?
        </h2>
        <p className="text-muted mb-8 max-w-lg mx-auto">
          Browse the full catalog — kitchen appliances, electronics, and gadgets built for how you actually work and cook.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-cyan text-base font-semibold px-8 py-4 rounded shadow-glow hover:shadow-glowStrong transition-shadow"
        >
          Browse Catalog
        </Link>
      </div>
    </section>
  )
}
