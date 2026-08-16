import { Link } from 'react-router-dom'

export default function Hero() {
  return (
    <section className="relative min-h-[95vh] flex items-center overflow-hidden bg-base">
      {/* Animated circuit grid background */}
      <div className="absolute inset-0 circuit-grid" />
      {/* Drifting glow orbs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-cyan/10 rounded-full blur-3xl orb-drift-1" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet/10 rounded-full blur-3xl orb-drift-2" />
      {/* Scanning line */}
      <div className="absolute inset-x-0 top-0 h-px bg-grad-line scan-line" />

      <div className="relative max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center w-full py-20">
        <div>
          <div className="inline-flex items-center gap-2 text-cyan font-mono-price text-xs tracking-widest mb-6 border border-cyan/30 rounded-full px-4 py-2">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan pulse-dot" />
            KITCHEN · ELECTRONICS · GADGETS
          </div>
          <h1 className="font-display text-6xl md:text-8xl text-ink leading-[0.9] mb-6 reveal-up">
            POWER<br />YOUR<br /><span className="text-cyan text-glow">WORLD</span>
          </h1>
          <p className="text-muted text-lg max-w-md mb-8">
            Appliances that make cooking effortless. Gadgets that keep your setup sharp.
            All in one place, delivered across Nigeria.
          </p>
          <div className="flex flex-wrap items-center gap-6">
            <Link
              to="/shop"
              className="inline-block bg-cyan text-base font-semibold px-8 py-4 rounded shadow-glow hover:shadow-glowStrong hover:-translate-y-0.5 transition-all"
            >
              Shop Now
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
        </div>

        <div className="relative hidden md:block float-slow bounce-in">
          <div className="absolute -inset-8 bg-cyan/10 blur-3xl rounded-full pulse-glow" />
          <div className="absolute -inset-px rounded-lg bg-grad-line opacity-40 blur-sm" />
          <img
            src="https://images.unsplash.com/photo-1648301037182-9dd1ad3c4d90?w=900"
            alt="Featured product"
            className="relative rounded-lg shadow-2xl border border-cyan/20"
          />
          <div className="absolute -bottom-4 -left-4 bg-surface border border-cyan/40 rounded px-4 py-2 shadow-glow">
            <span className="text-cyan font-mono-price text-xs">● LIVE STOCK</span>
          </div>
        </div>
      </div>
    </section>
  )
}
