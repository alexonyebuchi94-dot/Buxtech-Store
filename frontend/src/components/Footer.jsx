import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-24">
      <div className="max-w-7xl mx-auto px-6 py-14 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="font-display text-2xl text-ink tracking-wider mb-3">
            BUX<span className="text-cyan">TECH</span>
          </div>
          <p className="text-muted text-sm leading-relaxed">
            Kitchen appliances, electronics, and laptop &amp; desktop gadgets — delivered across Nigeria.
          </p>
        </div>

        <div>
          <h4 className="font-display text-lg text-ink tracking-wide mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link to="/shop?category=kitchen-appliances" className="hover:text-cyan">Kitchen Appliances</Link></li>
            <li><Link to="/shop?category=electronics" className="hover:text-cyan">Electronics</Link></li>
            <li><Link to="/shop?category=laptop-desktop-gadgets" className="hover:text-cyan">Laptop &amp; Desktop Gadgets</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-ink tracking-wide mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link to="/about" className="hover:text-cyan">About</Link></li>
            <li><Link to="/contact" className="hover:text-cyan">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-ink tracking-wide mb-3">Secure Payment</h4>
          <p className="text-muted text-sm mb-2">Payments processed via Paystack</p>
          <div className="flex gap-2 text-xs text-muted font-mono-price">
            <span className="border border-border rounded px-2 py-1">VISA</span>
            <span className="border border-border rounded px-2 py-1">MC</span>
            <span className="border border-border rounded px-2 py-1">VERVE</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} BuxTech. All rights reserved.
      </div>
    </footer>
  )
}
