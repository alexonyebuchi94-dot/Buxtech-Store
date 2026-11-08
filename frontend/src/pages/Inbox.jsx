import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchMyOrders } from '../api/orders.js'
import SEO from '../components/SEO.jsx'

export default function Inbox() {
  const { user, token, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: '/inbox' } })
      return
    }
    if (!token) return
    fetchMyOrders(token)
      .then((orders) => {
        const items = orders.flatMap((order) =>
          (order.history || []).map((entry) => ({
            orderId: order.id,
            note: entry.note,
            at: entry.at,
            status: entry.status,
          }))
        )
        items.sort((a, b) => new Date(b.at) - new Date(a.at))
        setNotifications(items)
      })
      .catch(() => setError('Could not load your notifications'))
      .finally(() => setLoading(false))
  }, [authLoading, user, token, navigate])

  if (authLoading || loading) {
    return <div className="max-w-2xl mx-auto px-6 py-24 text-center text-muted">Loading…</div>
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <SEO title="Inbox — BuxTech" noindex />
      <h1 className="font-display text-3xl text-ink mb-8 tracking-wide">INBOX</h1>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {notifications.length === 0 && !error && (
        <div className="text-center py-16 border border-border rounded-lg">
          <p className="text-muted mb-4">No updates yet — order activity will show up here.</p>
          <Link to="/shop" className="text-cyan hover:underline">Start shopping</Link>
        </div>
      )}

      <div className="space-y-3">
        {notifications.map((n, i) => (
          <Link
            key={i}
            to="/orders"
            className="block border border-border rounded-lg p-4 bg-surface hover:border-cyan transition-colors"
          >
            <div className="flex justify-between items-start gap-3">
              <div>
                <div className="text-ink text-sm">{n.note}</div>
                <div className="text-muted text-xs mt-1">Order #{n.orderId}</div>
              </div>
              <span className="text-muted text-xs whitespace-nowrap">
                {new Date(n.at).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
