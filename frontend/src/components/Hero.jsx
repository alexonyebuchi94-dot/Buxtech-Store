import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center bg-grad-glow overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center w-full">
        <div>
          <div className="text-cyan font-mono-price text-sm tracking-widest mb-4">
            KITCHEN · ELECTRONICS · GADGETS
          </div>
          <h1 className="font-display text-6xl md:text-8xl text-ink leading-[0.9] mb-6">
            POWER<br />YOUR<br /><span className="text-cyan">WORLD</span>
          </h1>
          <p className="text-muted text-lg max-w-md mb-8">
            Appliances that make cooking effortless. Gadgets that keep your setup sharp.
            All in one place, delivered across Nigeria.
          </p>
          <Link
            to="/shop"
            className="inline-block bg-cyan text-base font-semibold px-8 py-4 rounded shadow-glow hover:shadow-glowStrong transition-shadow"
          >
            Shop Now
          </Link>
        </div>
        <div className="relative hidden md:block">
          <div className="absolute inset-0 bg-cyan/10 blur-3xl rounded-full" />
          <img
            src="https://images.unsplash.com/photo-1648301037182-9dd1ad3c4d90?w=900"
            alt="Featured product"
            className="relative rounded-lg shadow-2xl"
          />
        </div>
      </div>
    </section>
  )
}
