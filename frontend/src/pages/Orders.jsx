import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { DEMO, naira } from '../lib/config.js'
import { listMyOrders, getOrder, cancelOrder, requestReturn, downloadInvoice, printInvoice, demoAdvance, STAGES, stageIndex, stageLabel } from '../lib/orders.js'
import SEO from '../components/SEO.jsx'

const badge = (o) => {
  const l = stageLabel(o)
  if (l === 'Delivered') return 'text-green-400 border-green-400/40'
  if (l === 'Shipped') return 'text-violet border-violet/40'
  if (l === 'Processing') return 'text-cyan border-cyan/40'
  if (l === 'Cancelled' || l === 'Payment Failed') return 'text-red-400 border-red-400/40'
  return 'text-amber-400 border-amber-400/40'
}

function Tracker({ order }) {
  const idx = stageIndex(order)
  if (order.status === 'cancelled') return <div className="text-red-400 text-sm border border-red-400/30 rounded p-3">This order was cancelled.</div>
  return (
    <ol className="flex items-start" aria-label="Order progress">
      {STAGES.map((s, i) => (
        <li key={s} className="flex-1 text-center relative">
          <div className={`mx-auto w-7 h-7 rounded-full border-2 flex items-center justify-center text-xs ${i <= idx ? 'bg-cyan border-cyan text-base' : 'border-border text-muted'}`}>{i < idx ? '✓' : i + 1}</div>
          {i < STAGES.length - 1 && <div className={`absolute top-3.5 left-1/2 w-full h-0.5 ${i < idx ? 'bg-cyan' : 'bg-border'}`} />}
          <div className={`text-[11px] sm:text-xs mt-2 ${i <= idx ? 'text-ink' : 'text-muted'}`}>{s}</div>
        </li>
      ))}
    </ol>
  )
}

function OrderCard({ order, onChange, defaultOpen = false }) {
  const [open, setOpen] = useState(defaultOpen)
  const [panel, setPanel] = useState(null) // cancel | return
  const [reason, setReason] = useState('')
  const [busy, setBusy] = useState(false)
  const [note, setNote] = useState('')
  const canCancel = ['pending', 'pay-on-delivery', 'paid'].includes(order.status)
  const canReturn = order.status === 'delivered' && !order.returnRequested

  async function submit() {
    setBusy(true); setNote('')
    try {
      if (panel === 'cancel') await cancelOrder(order.id, reason)
      else await requestReturn(order.id, reason || 'No reason given')
      setPanel(null); setReason(''); onChange?.()
    } catch (e) { setNote(e.message || 'Could not submit — please contact support.') }
    setBusy(false)
  }

  return (
    <div className="border border-border rounded-lg p-4 sm:p-5 bg-surface">
      <div className="flex justify-between items-start flex-wrap gap-2 mb-3">
        <div>
          <div className="font-mono-price text-ink text-sm">#{order.id}</div>
          <div className="text-muted text-xs mt-0.5">{new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</div>
        </div>
        <span className={`text-xs border rounded-full px-3 py-1 uppercase tracking-wide ${badge(order)}`}>{stageLabel(order)}</span>
      </div>
      <div className="text-sm text-muted mb-3">{(order.items || []).map((i) => `${i.name} × ${i.qty}`).join(', ')}</div>
      <div className="flex justify-between items-center mb-4">
        <span className="text-xs text-muted">Amount {order.paymentMethod === 'pay-on-delivery' && order.status === 'pay-on-delivery' ? 'due on delivery' : 'paid'}: <span className="font-mono-price text-cyan text-base">{naira(order.total)}</span></span>
        <button onClick={() => setOpen(!open)} className="text-xs text-muted hover:text-cyan">{open ? 'Hide tracking' : 'Track order'}</button>
      </div>

      {open && (
        <div className="space-y-5 pt-4 border-t border-border">
          <Tracker order={order} />
          <div className="space-y-3">
            {[...(order.history || [])].reverse().map((e, i) => (
              <div key={i} className="flex gap-3 text-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan mt-1.5 shrink-0" />
                <div><div className="text-ink">{e.note}</div><div className="text-muted text-xs">{new Date(e.at).toLocaleString('en-NG', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</div></div>
              </div>
            ))}
          </div>
          {order.customer && <div className="text-xs text-muted">Delivering to: {order.customer.address}, {order.customer.city}, {order.customer.state}</div>}
          {order.returnRequested && <div className="text-xs text-amber-400">Return requested — our team will contact you within 24 hours.</div>}
        </div>
      )}

      <div className="flex flex-wrap gap-2 mt-4">
        <button onClick={() => downloadInvoice(order)} className="border border-border rounded px-3 py-1.5 text-xs text-ink hover:border-cyan hover:text-cyan">Download Invoice</button>
        <button onClick={() => printInvoice(order)} className="border border-border rounded px-3 py-1.5 text-xs text-ink hover:border-cyan hover:text-cyan">Print</button>
        {canCancel && <button onClick={() => setPanel(panel === 'cancel' ? null : 'cancel')} className="border border-red-400/40 rounded px-3 py-1.5 text-xs text-red-400 hover:bg-red-400/10">Cancel Order</button>}
        {canReturn && <button onClick={() => setPanel(panel === 'return' ? null : 'return')} className="border border-amber-400/40 rounded px-3 py-1.5 text-xs text-amber-400 hover:bg-amber-400/10">Return Request</button>}
        {DEMO && ['pay-on-delivery', 'paid', 'shipped'].includes(order.status) && <button onClick={() => { demoAdvance(order.id); onChange?.() }} className="border border-dashed border-cyan/50 rounded px-3 py-1.5 text-xs text-cyan">Demo: advance status →</button>}
      </div>

      {panel && (
        <div className="mt-3 space-y-2">
          <textarea rows={2} value={reason} onChange={(e) => setReason(e.target.value)} placeholder={panel === 'cancel' ? 'Reason for cancelling (optional)' : 'What’s wrong with the item?'} className="w-full bg-base border border-border rounded px-3 py-2 text-sm text-ink focus:border-cyan outline-none" />
          <button disabled={busy || (panel === 'return' && !reason.trim())} onClick={submit} className="bg-cyan text-base text-sm font-semibold px-5 py-2 rounded disabled:opacity-50">{busy ? 'Submitting…' : panel === 'cancel' ? 'Confirm cancellation' : 'Submit return request'}</button>
          {note && <p className="text-red-400 text-xs">{note}</p>}
        </div>
      )}
    </div>
  )
}

export default function Orders() {
  const { user, token, loading: authLoading } = useAuth()
  const [params] = useSearchParams()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [tick, setTick] = useState(0)
  const [trackId, setTrackId] = useState(params.get('track') || '')
  const [tracked, setTracked] = useState(null)
  const [trackErr, setTrackErr] = useState('')

  useEffect(() => {
    if (authLoading) return
    listMyOrders(token).then(setOrders).catch(() => setOrders([])).finally(() => setLoading(false))
  }, [authLoading, token, tick])

  async function track(e, id = trackId) {
    e?.preventDefault(); setTrackErr(''); setTracked(null)
    if (!id.trim()) return
    try { setTracked(await getOrder(id)) } catch (err) { setTrackErr(err.message || 'We couldn’t find that order.') }
  }
  useEffect(() => { if (params.get('track')) track(null, params.get('track')) }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const refresh = () => { setTick((t) => t + 1); if (tracked) getOrder(tracked.id).then(setTracked).catch(() => {}) }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <SEO title="Orders & Tracking — BuxTech" description="Track your BuxTech order by ID, view order history, download invoices, cancel or request a return." path="/orders" />
      <h1 className="font-display text-3xl sm:text-4xl text-ink mb-8 tracking-wide">ORDERS</h1>

      {/* Track without login */}
      <section className="border border-border rounded-lg p-5 bg-surface mb-10">
        <h2 className="font-display text-lg text-ink mb-1">TRACK AN ORDER</h2>
        <p className="text-muted text-sm mb-4">No login needed — enter the Order ID from your confirmation email or SMS.</p>
        <form onSubmit={track} className="flex gap-2">
          <input value={trackId} onChange={(e) => setTrackId(e.target.value)} placeholder="Order ID" aria-label="Order ID" className="flex-1 min-w-0 bg-base border border-border rounded px-4 py-2.5 text-ink font-mono-price focus:border-cyan outline-none" />
          <button className="bg-cyan text-base font-semibold px-6 rounded">Track</button>
        </form>
        {trackErr && <p className="text-red-400 text-sm mt-3">{trackErr}</p>}
        {tracked && <div className="mt-4"><OrderCard order={tracked} onChange={refresh} defaultOpen /></div>}
      </section>

      <h2 className="font-display text-xl text-ink mb-4 tracking-wide">{user ? 'MY ORDER HISTORY' : 'ORDERS ON THIS DEVICE'}</h2>
      {!user && !DEMO && (
        <p className="text-sm text-muted mb-4"><Link to="/login" state={{ from: '/orders' }} className="text-cyan hover:underline">Log in</Link> to see all your orders across devices.</p>
      )}
      {loading || authLoading ? <p className="text-muted">Loading…</p> : orders.length === 0 ? (
        <div className="text-center py-14 border border-border rounded-lg">
          <p className="text-muted mb-4">No orders yet.</p>
          <Link to="/shop" className="text-cyan hover:underline">Start shopping</Link>
        </div>
      ) : (
        <div className="space-y-4">{orders.map((o) => <OrderCard key={o.id} order={o} onChange={refresh} />)}</div>
      )}
    </div>
  )
}
