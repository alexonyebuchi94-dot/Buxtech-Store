import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

export default function Navbar() {
  const { itemCount } = useCart()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `text-sm tracking-wide transition-colors hover:text-cyan ${
      isActive ? 'text-cyan' : 'text-muted'
    }`

  function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`)
    setSearchOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-base/90 backdrop-blur border-b border-border">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 gap-4">
        <Link to="/" className="font-display text-2xl text-ink tracking-wider whitespace-nowrap">
          BUX<span className="text-cyan">TECH</span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={linkClass} end>Home</NavLink>
          <NavLink to="/shop" className={linkClass}>Shop</NavLink>
          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </div>

        <div className="flex items-center gap-3 flex-1 md:flex-none justify-end">
          <form
            onSubmit={handleSearch}
            className={`transition-all duration-300 ${searchOpen ? 'flex-1 md:w-64' : 'w-0 md:w-40'} overflow-hidden`}
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
              onBlur={() => setSearchOpen(false)}
              placeholder="Search products…"
              className="w-full bg-surface border border-border rounded px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-cyan outline-none"
            />
          </form>

          <Link
            to="/cart"
            className="relative flex items-center gap-2 border border-border rounded px-4 py-2 text-sm text-ink hover:border-cyan transition-colors whitespace-nowrap"
          >
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-cyan text-base text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
    </header>
  )
}
