import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function Navbar() {
  const { itemCount } = useCart()

  const linkClass = ({ isActive }) =>
    `text-sm tracking-wide transition-colors hover:text-cyan ${
      isActive ? 'text-cyan' : 'text-muted'
    }`

  return (
    <header className="sticky top-0 z-50 bg-base/90 backdrop-blur border-b border-border">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="font-display text-2xl text-ink tracking-wider">
          BUX<span className="text-cyan">TECH</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/shop" className={linkClass}>Shop</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </div>
        <Link
          to="/cart"
          className="relative flex items-center gap-2 border border-border rounded px-4 py-2 text-sm text-ink hover:border-cyan transition-colors"
        >
          Cart
          {itemCount > 0 && (
            <span className="absolute -top-2 -right-2 bg-cyan text-base text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
              {itemCount}
            </span>
          )}
        </Link>
      </nav>
    </header>
  )
}
