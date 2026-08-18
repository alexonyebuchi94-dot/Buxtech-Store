import { Outlet } from 'react-router-dom'
import Logo from './Logo.jsx'

// Admin pages get this instead of the storefront Navbar/Footer — no Home,
// Categories, Cart, or customer login links. Each admin page (Dashboard,
// Products) has its own Log Out button and internal nav between the two.
export default function AdminLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-base">
      <header className="border-b border-border">
        <div className="max-w-6xl mx-auto flex items-center gap-2 px-6 py-4 font-display text-xl text-ink tracking-wider">
          <Logo size={22} />
          BUX<span className="text-cyan">TECH</span>
          <span className="text-muted text-sm font-sans tracking-normal ml-1">Admin</span>
        </div>
      </header>
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  )
}
