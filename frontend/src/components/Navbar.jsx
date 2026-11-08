import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { categories } from '../data/products.js'
import Logo from './Logo.jsx'
import InstallAppButton from './InstallAppButton.jsx'
import SearchBox from './SearchBox.jsx'
import { Heart, CartIcon, UserIcon, Sun, Moon, SearchIcon, Close } from './Icons.jsx'

const LINKS = [
  { to: '/home', label: 'Home' },
  { to: '/shop', label: 'Shop All' },
  { to: '/orders', label: 'Orders' },
  { to: '/about', label: 'About' },
  { to: '/customer-service', label: 'Customer Service' },
  { to: '/reviews', label: 'Reviews' },
]

export default function Navbar() {
  const { itemCount } = useCart()
  const { user } = useAuth()
  const { wishlist, theme, setTheme } = useStore()
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [catOpen, setCatOpen] = useState(false)
  const [mobileCatOpen, setMobileCatOpen] = useState(false)

  const linkClass = ({ isActive }) =>
    `text-sm tracking-wide whitespace-nowrap transition-colors hover:text-cyan ${isActive ? 'text-cyan' : 'text-muted'}`
  const mobileLinkClass = ({ isActive }) =>
    `block py-3 text-base tracking-wide border-b border-border transition-colors ${isActive ? 'text-cyan' : 'text-muted'}`
  const iconBtn = 'relative flex items-center justify-center w-9 h-9 border border-border rounded text-ink hover:border-cyan hover:text-cyan transition-colors'
  const badge = 'absolute -top-2 -right-2 bg-cyan text-base text-[10px] font-bold rounded-full h-5 min-w-5 px-1 flex items-center justify-center'

  function closeMenus() { setMenuOpen(false); setMobileSearchOpen(false); setCatOpen(false) }

  return (
    <header className="sticky top-0 z-50 bg-base/90 backdrop-blur border-b border-border">
      <nav className="max-w-[90rem] mx-auto flex items-center justify-between px-4 sm:px-6 py-3 gap-3">
        <Link to="/" className="flex items-center gap-2 font-display text-xl sm:text-2xl text-ink tracking-wider whitespace-nowrap" onClick={closeMenus}>
          <Logo size={28} />
          BUX<span className="text-cyan">TECH</span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden xl:flex items-center gap-6">
          <NavLink to="/home" className={linkClass} end>Home</NavLink>
          <NavLink to="/shop" className={linkClass} end>Shop All</NavLink>

          <div className="relative" onMouseEnter={() => setCatOpen(true)} onMouseLeave={() => setCatOpen(false)}>
            <button type="button" onClick={() => setCatOpen((v) => !v)} aria-expanded={catOpen} className="text-sm tracking-wide text-muted hover:text-cyan transition-colors">
              Categories ▾
            </button>
            {catOpen && (
              <div className="absolute top-full left-0 pt-3 z-50">
                <div className="bg-surface border border-border rounded-lg shadow-glow py-2 w-64">
                  {categories.map((cat) => (
                    <div key={cat.slug}>
                      <Link to={`/shop?category=${cat.slug}`} onClick={closeMenus} className="block px-4 py-2.5 text-sm text-ink hover:text-cyan hover:bg-base transition-colors">
                        {cat.name}
                      </Link>
                      {cat.subs.map((s) => (
                        <Link key={s.slug} to={`/shop?category=${cat.slug}&sub=${s.slug}`} onClick={closeMenus} className="block pl-8 pr-4 py-1.5 text-xs text-muted hover:text-cyan hover:bg-base transition-colors">
                          {s.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {LINKS.slice(2).map((l) => (
            <NavLink key={l.to} to={l.to} className={linkClass}>{l.label}</NavLink>
          ))}
        </div>

        {/* Desktop search with suggestions */}
        <SearchBox className="hidden xl:block w-64 2xl:w-80" />

        <div className="flex items-center gap-2 sm:gap-3">
          <button type="button" onClick={() => { setMobileSearchOpen((v) => !v); setMenuOpen(false) }} className={`xl:hidden ${iconBtn}`} aria-label="Search">
            <SearchIcon width={16} height={16} />
          </button>

          <button type="button" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={iconBtn} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'} title="Toggle dark / light mode">
            {theme === 'dark' ? <Sun /> : <Moon />}
          </button>

          <InstallAppButton className="hidden 2xl:inline-flex items-center border border-border rounded px-4 py-2 text-sm text-ink hover:border-cyan transition-colors whitespace-nowrap" />

          <Link to="/wishlist" onClick={closeMenus} className={iconBtn} aria-label="Wishlist">
            <Heart />
            {wishlist.length > 0 && <span className={badge}>{wishlist.length}</span>}
          </Link>

          <Link to="/cart" onClick={closeMenus} className={iconBtn} aria-label="Cart">
            <CartIcon />
            {itemCount > 0 && <span className={badge}>{itemCount}</span>}
          </Link>

          <Link to={user ? '/account' : '/login'} onClick={closeMenus} className={iconBtn} aria-label={user ? 'Account' : 'Log in'} title={user ? user.name : 'Log in'}>
            <UserIcon />
          </Link>

          <button type="button" onClick={() => { setMenuOpen((v) => !v); setMobileSearchOpen(false) }} className={`xl:hidden ${iconBtn}`} aria-label="Menu" aria-expanded={menuOpen}>
            {menuOpen ? <Close /> : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
            )}
          </button>
        </div>
      </nav>

      {mobileSearchOpen && (
        <div className="xl:hidden px-4 sm:px-6 pb-4">
          <SearchBox autoFocus onDone={closeMenus} />
        </div>
      )}

      {/* Mobile / tablet menu */}
      {menuOpen && (
        <div className="xl:hidden px-4 sm:px-6 pb-4 max-h-[80vh] overflow-y-auto">
          <NavLink to="/home" className={mobileLinkClass} end onClick={closeMenus}>Home</NavLink>
          <NavLink to="/shop" className={mobileLinkClass} end onClick={closeMenus}>Shop All</NavLink>

          <div className="border-b border-border">
            <button type="button" onClick={() => setMobileCatOpen((v) => !v)} className="w-full flex items-center justify-between py-3 text-base tracking-wide text-muted">
              Categories
              <span className={`transition-transform ${mobileCatOpen ? 'rotate-180' : ''}`}>▾</span>
            </button>
            {mobileCatOpen && (
              <div className="pb-2 pl-4">
                {categories.map((cat) => (
                  <div key={cat.slug}>
                    <Link to={`/shop?category=${cat.slug}`} onClick={closeMenus} className="block py-2 text-sm text-ink hover:text-cyan">{cat.name}</Link>
                    {cat.subs.map((s) => (
                      <Link key={s.slug} to={`/shop?category=${cat.slug}&sub=${s.slug}`} onClick={closeMenus} className="block py-1.5 pl-4 text-xs text-muted hover:text-cyan">{s.name}</Link>
                    ))}
                  </div>
                ))}
              </div>
            )}
          </div>

          {LINKS.slice(2).map((l) => (
            <NavLink key={l.to} to={l.to} className={mobileLinkClass} onClick={closeMenus}>{l.label}</NavLink>
          ))}
          <NavLink to="/wishlist" className={mobileLinkClass} onClick={closeMenus}>Wishlist ({wishlist.length})</NavLink>
          <NavLink to={user ? '/account' : '/login'} className={mobileLinkClass} onClick={closeMenus}>{user ? `Account · ${user.name.split(' ')[0]}` : 'Log In / Register'}</NavLink>
          <div className="pt-3">
            <InstallAppButton className="w-full text-center border border-border rounded px-4 py-2.5 text-sm text-ink hover:border-cyan transition-colors" />
          </div>
        </div>
      )}
    </header>
  )
}
