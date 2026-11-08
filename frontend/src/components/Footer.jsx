import { Link } from 'react-router-dom'
import Logo from './Logo.jsx'
import TrustBadges from './TrustBadges.jsx'
import { EMAIL, PHONE, WHATSAPP } from '../lib/config.js'

const socials = [
  { n: 'Instagram', h: 'https://www.instagram.com/' },
  { n: 'Facebook', h: 'https://www.facebook.com/' },
  { n: 'X / Twitter', h: 'https://x.com/' },
  { n: 'TikTok', h: 'https://www.tiktok.com/' },
  { n: 'WhatsApp', h: `https://wa.me/${WHATSAPP}` },
]

export default function Footer() {
  return (
    <footer className="bg-surface border-t border-border mt-24">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 pt-10"><TrustBadges /></div>
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 lg:grid-cols-5 gap-10">
        <div className="col-span-2 lg:col-span-2">
          <div className="flex items-center gap-2 font-display text-2xl text-ink tracking-wider mb-3">
            <Logo size={28} />
            BUX<span className="text-cyan">TECH</span>
          </div>
          <p className="text-muted text-sm leading-relaxed mb-3 max-w-sm">
            Your trusted home for laptops, desktops, tech gadgets and gaming gear. Genuine products, honest prices and support that actually answers — delivered across Nigeria.
          </p>
          <div className="text-muted text-xs space-y-1 mb-4">
            <div><a href={`mailto:${EMAIL}`} className="hover:text-cyan">{EMAIL}</a></div>
            <div><a href={`tel:${PHONE}`} className="hover:text-cyan">0812 359 0484</a></div>
          </div>
          <div className="flex flex-wrap gap-2">
            {socials.map((s) => (
              <a key={s.n} href={s.h} target="_blank" rel="noopener noreferrer" className="border border-border rounded px-3 py-1.5 text-xs text-muted hover:text-cyan hover:border-cyan transition-colors">{s.n}</a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg text-ink tracking-wide mb-3">Shop</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link to="/shop?category=laptop" className="hover:text-cyan">Laptop</Link></li>
            <li><Link to="/shop?category=desktop" className="hover:text-cyan">Desktop</Link></li>
            <li><Link to="/shop?category=tech-gadgets" className="hover:text-cyan">Tech Gadgets</Link></li>
            <li><Link to="/shop?category=gaming-gadgets" className="hover:text-cyan">Gaming Gadgets</Link></li>
            <li><Link to="/wishlist" className="hover:text-cyan">Wishlist</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-ink tracking-wide mb-3">Help</h4>
          <ul className="space-y-2 text-sm text-muted">
            <li><Link to="/about" className="hover:text-cyan">About</Link></li>
            <li><Link to="/customer-service" className="hover:text-cyan">Customer Service</Link></li>
            <li><Link to="/faq" className="hover:text-cyan">FAQ</Link></li>
            <li><Link to="/reviews" className="hover:text-cyan">Reviews</Link></li>
            <li><Link to="/orders" className="hover:text-cyan">Track Order</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-ink tracking-wide mb-3">Policies</h4>
          <ul className="space-y-2 text-sm text-muted mb-4">
            <li><Link to="/shipping-policy" className="hover:text-cyan">Shipping &amp; Delivery</Link></li>
            <li><Link to="/returns-policy" className="hover:text-cyan">Return &amp; Refund</Link></li>
            <li><Link to="/terms" className="hover:text-cyan">Terms &amp; Conditions</Link></li>
            <li><Link to="/privacy-policy" className="hover:text-cyan">Privacy Policy</Link></li>
            <li><Link to="/warranty" className="hover:text-cyan">Warranty</Link></li>
          </ul>
          <p className="text-muted text-xs mb-2">Payments processed via Paystack</p>
          <div className="flex flex-wrap gap-2 text-xs text-muted font-mono-price">
            <span className="border border-border rounded px-2 py-1">CARD</span>
            <span className="border border-border rounded px-2 py-1">TRANSFER</span>
            <span className="border border-border rounded px-2 py-1">USSD</span>
          </div>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted px-4">
        © {new Date().getFullYear()} BuxTech. All rights reserved. · Power your world.
      </div>
    </footer>
  )
}
