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
  delivered: 'text-green-400 border-green-400/40',
  failed: 'text-red-400 border-red-400/40',
}

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
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

  async function markAsPaid(orderId) {
    try {
      const res = await fetch(`${API_BASE}/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
        body: JSON.stringify({ status: 'paid' }),
      })
      if (!res.ok) throw new Error('Failed to update')
      await fetchOrders()
    } catch {
      setError('Could not update order status')
    }
  }

  const totalRevenue = orders
    .filter((o) => o.status === 'paid')
    .reduce((sum, o) => sum + o.total, 0)

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="flex items-center justify-between mb-10">
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

      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="border border-border rounded-lg p-5 bg-surface">
          <div className="text-muted text-xs mb-1">Total Orders</div>
          <div className="font-mono-price text-2xl text-ink">{orders.length}</div>
        </div>
        <div className="border border-border rounded-lg p-5 bg-surface">
          <div className="text-muted text-xs mb-1">Paid Orders</div>
          <div className="font-mono-price text-2xl text-cyan">
            {orders.filter((o) => o.status === 'paid').length}
          </div>
        </div>
        <div className="border border-border rounded-lg p-5 bg-surface">
          <div className="text-muted text-xs mb-1">Revenue (paid)</div>
          <div className="font-mono-price text-2xl text-ink">{formatNaira(totalRevenue)}</div>
        </div>
      </div>

      {loading ? (
        <p className="text-muted">Loading orders…</p>
      ) : orders.length === 0 ? (
        <p className="text-muted">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div key={order.id} className="border border-border rounded-lg p-5 bg-surface">
              <div className="flex flex-wrap items-start justify-between gap-4 mb-3">
                <div>
                  <div className="text-ink font-medium">{order.customer.name}</div>
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
                    {order.status === 'pay-on-delivery' ? 'Pay on Delivery' : order.status}
                  </span>
                  <div className="text-muted text-[11px] mt-1">
                    {order.paymentMethod === 'pay-on-delivery' ? 'Pays on delivery' : 'Paid via Paystack'}
                  </div>
                  <div className="font-mono-price text-cyan mt-2">{formatNaira(order.total)}</div>
                  {order.status === 'pay-on-delivery' && (
                    <button
                      onClick={() => markAsPaid(order.id)}
                      className="mt-2 text-xs border border-cyan/40 text-cyan rounded px-3 py-1 hover:bg-cyan/10"
                    >
                      Mark as Paid
                    </button>
                  )}
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
              <div className="text-xs text-muted mt-3">
                {new Date(order.createdAt).toLocaleString('en-NG')} · Order #{order.id}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
