import { Link } from 'react-router-dom'

export default function CTABanner() {
  return (
    <section className="relative py-24 overflow-hidden border-t border-border">
      <div className="absolute inset-0 bg-grad-glow" />
      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <h2 className="font-display text-4xl md:text-5xl text-ink mb-4 tracking-wide">
          LEVEL UP YOUR TECH TODAY
        </h2>
        <p className="text-muted mb-8 max-w-lg mx-auto">
          Laptops, desktops, gadgets and gaming gear — genuine products, honest prices, delivered fast across Nigeria.
        </p>
        <Link
          to="/shop"
          className="inline-block bg-cyan text-base font-semibold px-8 py-4 rounded shadow-glow hover:shadow-glowStrong transition-shadow"
        >
          Browse Catalog
        </Link>
        <p className="text-muted text-xs mt-5 font-mono-price">FREE DELIVERY OVER ₦150,000 · 12-MONTH WARRANTY · PAY SECURELY WITH PAYSTACK</p>
      </div>
    </section>
  )
}
