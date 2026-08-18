import { useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { categories } from '../data/products.js'
import Logo from './Logo.jsx'

export default function Navbar() {
  const { itemCount } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [mobileCatOpen, setMobileCatOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `text-sm tracking-wide transition-colors hover:text-cyan ${
      isActive ? 'text-cyan' : 'text-muted'
    }`

  const mobileLinkClass = ({ isActive }) =>
    `block py-3 text-base tracking-wide border-b border-border transition-colors ${
      isActive ? 'text-cyan' : 'text-muted'
    }`

  function handleSearch(e) {
    e.preventDefault()
    if (!query.trim()) return
    navigate(`/shop?search=${encodeURIComponent(query.trim())}`)
    setMobileSearchOpen(false)
    setMenuOpen(false)
    setQuery('')
  }

  function closeMenus() {
    setMenuOpen(false)
    setMobileSearchOpen(false)
  }

  return (
    <header className="sticky top-0 z-50 bg-base/90 backdrop-blur border-b border-border">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4 gap-4">
        <Link to="/" className="flex items-center gap-2 font-display text-2xl text-ink tracking-wider whitespace-nowrap" onClick={closeMenus}>
          <Logo size={28} />
          BUX<span className="text-cyan">TECH</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex items-center gap-8">
          <NavLink to="/" className={linkClass} end>Home</NavLink>

          <div
            className="relative"
            onMouseEnter={() => setCatOpen(true)}
            onMouseLeave={() => setCatOpen(false)}
          >
            <NavLink to="/shop" className={linkClass}>
              Categories ▾
            </NavLink>
            {catOpen && (
              <div className="absolute top-full left-0 pt-3">
                <div className="bg-surface border border-border rounded-lg shadow-glow py-2 w-56">
                  {categories.map((cat) => (
                    <Link
                      key={cat.slug}
                      to={`/shop?category=${cat.slug}`}
                      onClick={() => setCatOpen(false)}
                      className="block px-4 py-2.5 text-sm text-muted hover:text-cyan hover:bg-base transition-colors"
                    >
                      {cat.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          <NavLink to="/about" className={linkClass}>About</NavLink>
          <NavLink to="/contact" className={linkClass}>Contact</NavLink>
        </div>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="hidden md:block w-48">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-surface border border-border rounded px-3 py-2 text-sm text-ink placeholder:text-muted focus:border-cyan outline-none"
          />
        </form>

        <div className="flex items-center gap-3">
          {/* Mobile search icon toggle */}
          <button
            type="button"
            onClick={() => {
              setMobileSearchOpen((v) => !v)
              setMenuOpen(false)
            }}
            className="md:hidden flex items-center justify-center w-9 h-9 border border-border rounded text-ink hover:border-cyan"
            aria-label="Search"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </button>

          <Link
            to="/cart"
            onClick={closeMenus}
            className="relative flex items-center gap-2 border border-border rounded px-4 py-2 text-sm text-ink hover:border-cyan transition-colors whitespace-nowrap"
          >
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-cyan text-base text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </Link>

          <Link
            to={user ? '/account' : '/login'}
            onClick={closeMenus}
            className="hidden sm:flex items-center gap-2 border border-border rounded px-4 py-2 text-sm text-ink hover:border-cyan transition-colors whitespace-nowrap"
          >
            {user ? user.name.split(' ')[0] : 'Log In'}
          </Link>

          {/* Mobile hamburger toggle */}
          <button
            type="button"
            onClick={() => {
              setMenuOpen((v) => !v)
              setMobileSearchOpen(false)
            }}
            className="md:hidden flex items-center justify-center w-9 h-9 border border-border rounded text-ink hover:border-cyan"
            aria-label="Menu"
          >
            {menuOpen ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile search panel */}
      {mobileSearchOpen && (
        <form onSubmit={handleSearch} className="md:hidden px-6 pb-4">
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search products…"
            className="w-full bg-surface border border-border rounded px-4 py-3 text-sm text-ink placeholder:text-muted focus:border-cyan outline-none"
          />
        </form>
      )}

      {/* Mobile nav menu */}
      {menuOpen && (
        <div className="md:hidden px-6 pb-4">
          <NavLink to="/" className={mobileLinkClass} end onClick={closeMenus}>Home</NavLink>

          <div className="border-b border-border">
            <button
              type="button"
              onClick={() => setMobileCatOpen((v) => !v)}
              className="w-full flex items-center justify-between py-3 text-base tracking-wide text-muted"
            >
              Categories
              <span className={`transition-transform ${mobileCatOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {mobileCatOpen && (
              <div className="pb-2 pl-4">
                {categories.map((cat) => (
                  <Link
                    key={cat.slug}
                    to={`/shop?category=${cat.slug}`}
                    onClick={closeMenus}
                    className="block py-2 text-sm text-muted hover:text-cyan"
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            )}
          </div>

          <NavLink to="/about" className={mobileLinkClass} onClick={closeMenus}>About</NavLink>
          <NavLink to="/contact" className={mobileLinkClass} onClick={closeMenus}>
            Contact
          </NavLink>
          <NavLink to={user ? '/account' : '/login'} className={`${mobileLinkClass({ isActive: false })} border-b-0`} onClick={closeMenus}>
            {user ? user.name.split(' ')[0] : 'Log In'}
          </NavLink>
        </div>
      )}
    </header>
  )
}
