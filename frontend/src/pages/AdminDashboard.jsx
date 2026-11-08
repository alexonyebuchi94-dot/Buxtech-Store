import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

function formatNaira(amount) {
  return `₦${amount.toLocaleString('en-NG')}`
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
  pending: 'Pending',
  'pay-on-delivery': 'Pay on Delivery',
  paid: 'Paid',
  shipped: 'Shipped',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
  failed: 'Failed',
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [showUnseenOnly, setShowUnseenOnly] = useState(false)
  const navigate = useNavigate()

  const adminKey = sessionStorage.getItem('buxtech_admin_key')

  useEffect(() => {
    if (!adminKey) {
      navigate('/admin')
      return
    }
    fetchOrders()
  }, [])

  async function fetchOrders() {
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/api/orders/admin/all`, {
        headers: { 'x-admin-key': adminKey },
      })
      if (!res.ok) throw new Error('Session expired')
      const data = await res.json()
      setOrders(data)
    } catch (err) {
      setError(err.message)
      sessionStorage.removeItem('buxtech_admin_key')
      navigate('/admin')
    } finally {
      setLoading(false)
    }
  }

  function logout() {
    sessionStorage.removeItem('buxtech_admin_key')
    navigate('/admin')
  }

  async function updateStatus(orderId, status) {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({ status }),
      })
      if (!res.ok) throw new Error('Failed to update')
      await fetchOrders()
    } catch {
      setError('Could not update order status')
    }
  }

  async function toggleSeen(orderId, seen) {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/seen`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({ seen }),
      })
      if (!res.ok) throw new Error('Failed to update')
      await fetchOrders()
    } catch {
      setError('Could not update order')
    }
  }

  function cancelOrder(orderId) {
    if (!window.confirm('Cancel this order? The customer will be notified by email.')) return
    updateStatus(orderId, 'cancelled')
  }

  const totalRevenue = orders
    .filter((o) => o.status === 'paid' || o.status === 'delivered')
    .reduce((sum, o) => sum + o.total, 0)

  const unseenCount = orders.filter((o) => !o.seen).length
  const visibleOrders = showUnseenOnly ? orders.filter((o) => !o.seen) : orders

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10 flex-wrap gap-4">
        <h1 className="font-display text-4xl text-ink tracking-wide">ORDERS</h1>
        <div className="flex items-center gap-4">
          <Link
            to="/admin/products"
            className="text-sm text-muted hover:text-cyan border border-border rounded px-4 py-2"
          >
            Manage Products
          </Link>
          <button
            onClick={fetchOrders}
            className="text-sm text-muted hover:text-cyan border border-border rounded px-4 py-2"
          >
            Refresh
          </button>
          <button
            onClick={logout}
            className="text-sm text-muted hover:text-red-400 border border-border rounded px-4 py-2"
          >
            Log Out
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div className="border border-border rounded-lg p-5 bg-surface">
          <div className="text-muted text-xs mb-1">Total Orders</div>
          <div className="font-mono-price text-2xl text-ink">{orders.length}</div>
        </div>
        <div className="border border-border rounded-lg p-5 bg-surface">
          <div className="text-muted text-xs mb-1">Paid Orders</div>
          <div className="font-mono-price text-2xl text-cyan">
            {orders.filter((o) => o.status === 'paid' || o.status === 'delivered').length}
          </div>
        </div>
        <div className="border border-border rounded-lg p-5 bg-surface">
          <div className="text-muted text-xs mb-1">Revenue (paid)</div>
          <div className="font-mono-price text-2xl text-ink">{formatNaira(totalRevenue)}</div>
        </div>
        <button
          onClick={() => setShowUnseenOnly((v) => !v)}
          className={`border rounded-lg p-5 text-left transition-colors ${
            showUnseenOnly ? 'border-cyan bg-cyan/10' : 'border-border bg-surface hover:border-cyan'
          }`}
        >
          <div className="text-muted text-xs mb-1">Unseen Orders</div>
          <div className="font-mono-price text-2xl text-amber-400">{unseenCount}</div>
        </button>
      </div>

      {loading ? (
        <p className="text-muted">Loading orders…</p>
      ) : visibleOrders.length === 0 ? (
        <p className="text-muted">{showUnseenOnly ? 'No unseen orders.' : 'No orders yet.'}</p>
      ) : (
        <div className="space-y-3">
          {visibleOrders.map((order) => (
            <div
              key={order.id}
              className={`border rounded-lg p-5 bg-surface ${!order.seen ? 'border-amber-400/50' : 'border-border'}`}
            >
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    {!order.seen && (
                      <span className="text-[10px] bg-amber-400 text-base font-bold px-1.5 py-0.5 rounded">NEW</span>
                    )}
                    <div className="text-ink font-medium">{order.customer.name}</div>
                  </div>
                  <div className="text-muted text-xs">{order.customer.email} · {order.customer.phone}</div>
                  <div className="text-muted text-xs mt-1">
                    {order.customer.address}, {order.customer.city}, {order.customer.state}
                  </div>
                  {order.totalWeight > 0 && (
                    <div className="text-muted text-xs mt-1">
                      Package weight: <span className="text-ink">{order.totalWeight.toFixed(1)}kg</span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <span
                    className={`text-xs border rounded-full px-3 py-1 uppercase tracking-wide ${
                      statusColor[order.status] || statusColor.pending
                    }`}
                  >
                    {statusLabel[order.status] || order.status}
                  </span>
                  <div className="text-muted text-[11px] mt-1">
                    {order.paymentMethod === 'pay-on-delivery' ? 'Pays on delivery' : 'Paid via Paystack'}
                  </div>
                  <div className="font-mono-price text-cyan mt-2">{formatNaira(order.total)}</div>
                </div>
              </div>

              <div className="border-t border-border pt-3 space-y-1">
                {order.items.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm text-muted">
                    <span>{item.name} × {item.qty}</span>
                    <span className="font-mono-price">{formatNaira(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between flex-wrap gap-3 mt-4 pt-4 border-t border-border">
                <div className="text-xs text-muted">
                  {new Date(order.createdAt).toLocaleString('en-NG')} · Order #{order.id}
                </div>

                {!['delivered', 'cancelled'].includes(order.status) && (
                  <div className="flex flex-wrap gap-2">
                    {order.status === 'pay-on-delivery' && (
                      <button
                        onClick={() => updateStatus(order.id, 'paid')}
                        className="text-xs border border-cyan/40 text-cyan rounded px-3 py-1.5 hover:bg-cyan/10"
                      >
                        Mark as Paid
                      </button>
                    )}
                    {['paid', 'pay-on-delivery'].includes(order.status) && (
                      <button
                        onClick={() => updateStatus(order.id, 'shipped')}
                        className="text-xs border border-violet-400/40 text-violet-400 rounded px-3 py-1.5 hover:bg-violet-400/10"
                      >
                        Mark as Shipped
                      </button>
                    )}
                    {order.status === 'shipped' && (
                      <button
                        onClick={() => updateStatus(order.id, 'delivered')}
                        className="text-xs border border-green-400/40 text-green-400 rounded px-3 py-1.5 hover:bg-green-400/10"
                      >
                        Mark as Delivered
                      </button>
                    )}
                    <button
                      onClick={() => cancelOrder(order.id)}
                      className="text-xs border border-red-400/40 text-red-400 rounded px-3 py-1.5 hover:bg-red-400/10"
                    >
                      Cancel Order
                    </button>
                  </div>
                )}

                <button
                  onClick={() => toggleSeen(order.id, !order.seen)}
                  className="text-xs text-muted hover:text-ink border border-border rounded px-3 py-1.5"
                >
                  {order.seen ? 'Mark as Unseen' : 'Mark as Seen'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
