import { useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString('en-NG')}`
}

const statusColor = {
  pending: 'text-muted border-border',
  paid: 'text-cyan border-cyan/40',
  failed: 'text-red-400 border-red-400/40',
}

export default function Account() {
  const { user, token, loading: authLoading, logout } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!token) return
    fetch(`${API_BASE}/api/orders/mine`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then(setOrders)
      .catch(() => setOrders([]))
      .finally(() => setLoading(false))
  }, [token])

  if (authLoading) {
    return <div className="max-w-3xl mx-auto px-6 py-24 text-center text-muted">Loading…</div>
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="font-display text-4xl text-ink tracking-wide">MY ACCOUNT</h1>
          <p className="text-muted text-sm mt-1">{user.name} · {user.email}</p>
        </div>
        <button
          onClick={logout}
          className="text-sm text-muted hover:text-red-400 border border-border rounded px-4 py-2"
        >
          Log Out
        </button>
      </div>

      <h2 className="font-display text-xl text-ink mb-4 tracking-wide">ORDER HISTORY</h2>

      {loading ? (
        <p className="text-muted">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="text-muted text-sm">No orders yet — your purchases will show up here.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="border border-border rounded-lg p-5 bg-surface">
              <div className="flex items-center justify-between mb-3">
                <span className="text-muted text-xs">Order #{order.id}</span>
                <span
                  className={`text-xs border rounded-full px-3 py-1 uppercase tracking-wide ${
                    statusColor[order.status] || statusColor.pending
                  }`}
                >
                  {order.status}
                </span>
              </div>
              <div className="space-y-1 mb-3">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-muted">
                    <span>{item.name} × {item.qty}</span>
                    <span className="font-mono-price">{formatNaira(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between text-sm border-t border-border pt-3">
                <span className="text-muted">{new Date(order.createdAt).toLocaleDateString('en-NG')}</span>
                <span className="font-mono-price text-cyan">{formatNaira(order.total)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
