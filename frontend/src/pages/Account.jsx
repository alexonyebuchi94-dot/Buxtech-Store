import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { useStore, NAIRA_PER_POINT } from '../context/StoreContext.jsx'
import { products } from '../data/products.js'
import { listMyOrders, stageLabel } from '../lib/orders.js'
import { naira } from '../lib/config.js'
import ProductCard from '../components/ProductCard.jsx'
import SEO from '../components/SEO.jsx'

const TABS = [['overview', 'Overview'], ['orders', 'Order History'], ['wishlist', 'Wishlist'], ['addresses', 'Address Book'], ['rewards', 'Loyalty Points']]

export default function Account() {
  const { user, token, loading, logout } = useAuth()
  const { wishlist, addresses, saveAddress, removeAddress, points } = useStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState('overview')
  const [orders, setOrders] = useState([])
  const [addr, setAddr] = useState({ address: '', city: '', state: '', phone: '' })

  useEffect(() => { if (!loading && !user) navigate('/login', { state: { from: '/account' } }) }, [loading, user, navigate])
  useEffect(() => { if (user) listMyOrders(token).then(setOrders).catch(() => {}) }, [user, token])

  if (loading || !user) return <div className="max-w-sm mx-auto px-6 py-24 text-center text-muted">Loading…</div>
  const wished = wishlist.map((id) => products.find((p) => p.id === id)).filter(Boolean)
  const tier = points >= 500 ? 'Platinum' : points >= 200 ? 'Gold' : points >= 50 ? 'Silver' : 'Member'
  const next = points >= 500 ? null : points >= 200 ? 500 : points >= 50 ? 200 : 50
  const input = 'w-full bg-base border border-border rounded px-3 py-2 text-sm text-ink focus:border-cyan outline-none'

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-12">
      <SEO title="My Account — BuxTech" noindex />
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display text-3xl text-ink tracking-wide">MY ACCOUNT</h1>
          <p className="text-muted text-sm">{user.name} · {user.email}</p>
        </div>
        <button onClick={() => { logout(); navigate('/') }} className="border border-border text-muted px-4 py-2 rounded text-sm hover:text-ink hover:border-cyan">Log Out</button>
      </div>

      <div className="flex gap-1 overflow-x-auto no-scrollbar border-b border-border mb-6">
        {TABS.map(([k, l]) => <button key={k} onClick={() => setTab(k)} className={`px-4 py-2.5 text-sm whitespace-nowrap ${tab === k ? 'text-cyan border-b-2 border-cyan' : 'text-muted hover:text-ink'}`}>{l}</button>)}
      </div>

      {tab === 'overview' && (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[['Orders', orders.length, 'orders'], ['Wishlist', wished.length, 'wishlist'], ['Saved addresses', addresses.length, 'addresses'], ['Loyalty points', points, 'rewards']].map(([l, v, t]) => (
            <button key={l} onClick={() => setTab(t)} className="text-left border border-border rounded-lg p-5 bg-surface hover:border-cyan transition-colors">
              <div className="font-mono-price text-cyan text-3xl">{v}</div><div className="text-muted text-sm">{l}</div>
            </button>
          ))}
          <Link to="/inbox" className="sm:col-span-2 lg:col-span-4 flex justify-between border border-border rounded-lg px-5 py-3 text-sm text-ink hover:border-cyan">Inbox <span className="text-muted">→</span></Link>
        </div>
      )}

      {tab === 'orders' && (orders.length === 0 ? <p className="text-muted">No orders yet. <Link to="/shop" className="text-cyan hover:underline">Start shopping</Link></p> : (
        <div className="space-y-3">
          {orders.map((o) => (
            <Link key={o.id} to={`/orders?track=${o.id}`} className="flex flex-wrap items-center justify-between gap-2 border border-border rounded-lg p-4 bg-surface hover:border-cyan">
              <div><div className="font-mono-price text-ink text-sm">#{o.id}</div><div className="text-muted text-xs">{new Date(o.createdAt).toLocaleDateString('en-NG')} · {(o.items || []).length} item(s)</div></div>
              <div className="text-right"><div className="font-mono-price text-cyan">{naira(o.total)}</div><div className="text-xs text-muted">{stageLabel(o)}</div></div>
            </Link>
          ))}
        </div>
      ))}

      {tab === 'wishlist' && (wished.length === 0 ? <p className="text-muted">Your wishlist is empty.</p> : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">{wished.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      ))}

      {tab === 'addresses' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-3">
            {addresses.length === 0 && <p className="text-muted text-sm">No saved addresses yet. Add one, or tick “save address” at checkout.</p>}
            {addresses.map((a) => (
              <div key={a.id} className="border border-border rounded-lg p-4 bg-surface flex justify-between gap-3">
                <div className="text-sm text-ink">{a.address}<div className="text-muted text-xs">{a.city}, {a.state}{a.phone ? ` · ${a.phone}` : ''}</div></div>
                <button onClick={() => removeAddress(a.id)} className="text-xs text-muted hover:text-red-400">Remove</button>
              </div>
            ))}
          </div>
          <form onSubmit={(e) => { e.preventDefault(); saveAddress({ ...addr, name: user.name }); setAddr({ address: '', city: '', state: '', phone: '' }) }} className="border border-border rounded-lg p-4 bg-surface space-y-3 h-fit">
            <h3 className="text-ink font-medium">Add an address</h3>
            <input required className={input} placeholder="Street address" value={addr.address} onChange={(e) => setAddr({ ...addr, address: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <input required className={input} placeholder="City" value={addr.city} onChange={(e) => setAddr({ ...addr, city: e.target.value })} />
              <input required className={input} placeholder="State" value={addr.state} onChange={(e) => setAddr({ ...addr, state: e.target.value })} />
            </div>
            <input className={input} placeholder="Phone (optional)" value={addr.phone} onChange={(e) => setAddr({ ...addr, phone: e.target.value })} />
            <button className="bg-cyan text-base text-sm font-semibold px-5 py-2 rounded">Save address</button>
          </form>
        </div>
      )}

      {tab === 'rewards' && (
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border border-cyan/30 rounded-xl p-6 bg-surface">
            <div className="text-muted text-sm mb-1">Your balance</div>
            <div className="font-mono-price text-cyan text-5xl">{points}<span className="text-lg text-muted"> pts</span></div>
            <div className="text-ink text-sm mt-2">Worth {naira(points * NAIRA_PER_POINT)} off your next order</div>
            <div className="mt-4 text-xs text-muted">Tier: <span className="text-cyan">{tier}</span>{next && ` · ${next - points} pts to next tier`}</div>
            <div className="h-1.5 bg-border rounded mt-2 overflow-hidden"><div className="h-full bg-cyan" style={{ width: `${next ? Math.min(100, (points / next) * 100) : 100}%` }} /></div>
          </div>
          <div className="border border-border rounded-xl p-6 bg-surface text-sm text-muted space-y-2">
            <h3 className="text-ink font-medium text-base">How rewards work</h3>
            <p>• Earn <span className="text-cyan">1 point for every ₦1,000</span> you spend.</p>
            <p>• Each point is worth <span className="text-cyan">₦10</span> off at checkout.</p>
            <p>• Tick “Use my loyalty points” on the checkout page to redeem.</p>
          </div>
        </div>
      )}
    </div>
  )
}
