import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { fetchMyOrders } from '../api/orders.js'
import SEO from '../components/SEO.jsx'

function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString('en-NG')}`
}

const statusColor = {
  pending: 'text-muted border-border',
  'pay-on-delivery': 'text-amber-400 border-amber-400/40',
  paid: 'text-cyan border-cyan/40',
  shipped: 'text-violet-400 border-violet-400/40',
  delivered: 'text-green-400 border-green-400/40',
  cancelled: 'text-red-400 border-red-400/40',
  failed: 'text-red-400 border-red-400/40',
}

const statusLabel = {
  pending: 'Awaiting Payment',
  'pay-on-delivery': 'Pay on Delivery',
  paid: 'Paid',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  failed: 'Payment Failed',
}

export default function Orders() {
  const { user, token, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [expanded, setExpanded] = useState(null)

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login', { state: { from: '/orders' } })
      return
    }
    if (!token) return
    fetchMyOrders(token)
      .then(setOrders)
      .catch(() => setError('Could not load your orders'))
      .finally(() => setLoading(false))
  }, [authLoading, user, token, navigate])

  if (authLoading || loading) {
    return <div className="max-w-3xl mx-auto px-6 py-24 text-center text-muted">Loading…</div>
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <SEO title="My Orders — BuxTech" noindex />
      <h1 className="font-display text-3xl text-ink mb-8 tracking-wide">MY ORDERS</h1>

      {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

      {orders.length === 0 && !error && (
        <div className="text-center py-16 border border-border rounded-lg">
          <p className="text-muted mb-4">You haven't placed any orders yet.</p>
          <Link to="/shop" className="text-cyan hover:underline">Start shopping</Link>
        </div>
      )}

      <div className="space-y-4">
        {orders.map((order) => (
          <div key={order.id} className="border border-border rounded-lg p-5 bg-surface">
            <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
              <div>
                <div className="font-mono-price text-ink text-sm">#{order.id}</div>
                <div className="text-muted text-xs mt-0.5">
                  {new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
              </div>
              <span className={`text-xs border rounded-full px-3 py-1 uppercase tracking-wide ${statusColor[order.status] || statusColor.pending}`}>
                {statusLabel[order.status] || order.status}
              </span>
            </div>

            <div className="text-sm text-muted mb-3">
              {order.items.map((i) => i.name).join(', ')}
            </div>

            <div className="flex justify-between items-center">
              <span className="font-mono-price text-cyan">{formatNaira(order.total)}</span>
              <button
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                className="text-xs text-muted hover:text-cyan"
              >
                {expanded === order.id ? 'Hide details' : 'View timeline'}
              </button>
            </div>

            {expanded === order.id && (
              <div className="mt-4 pt-4 border-t border-border space-y-3">
                {(order.history || []).map((entry, i) => (
                  <div key={i} className="flex gap-3 text-sm">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan mt-1.5 shrink-0" />
                    <div>
                      <div className="text-ink">{entry.note}</div>
                      <div className="text-muted text-xs">
                        {new Date(entry.at).toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="pt-2 text-xs text-muted">
                  Delivering to: {order.customer.address}, {order.customer.city}, {order.customer.state}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
