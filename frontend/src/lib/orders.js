import { API_BASE, DEMO, naira, VAT_RATE } from './config.js'
import { fetchMyOrders } from '../api/orders.js'

const KEY = 'bx_orders'
const readLocal = () => { try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] } }
const writeLocal = (list) => { try { localStorage.setItem(KEY, JSON.stringify(list)) } catch { /* storage unavailable */ } }
const id10 = () => Math.random().toString(36).slice(2, 12).toUpperCase().padEnd(10, 'X')

async function json(res) {
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export async function createOrder(payload) {
  if (DEMO) {
    const now = new Date().toISOString()
    const paid = payload.paymentMethod === 'paystack'
    const order = {
      ...payload, id: id10(), createdAt: now, status: paid ? 'paid' : 'pay-on-delivery',
      history: [{ status: 'placed', at: now, note: 'Order placed' }, ...(paid ? [{ status: 'paid', at: now, note: 'Payment confirmed' }] : [])],
    }
    writeLocal([order, ...readLocal()])
    return order
  }
  return json(await fetch(`${API_BASE}/api/orders`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) }))
}

export async function getOrder(id) {
  const local = readLocal().find((o) => o.id === id.trim())
  if (local) return local
  if (DEMO) throw new Error('We couldn’t find an order with that ID.')
  return json(await fetch(`${API_BASE}/api/orders/${encodeURIComponent(id.trim())}`))
}

export async function listMyOrders(token) {
  const local = readLocal()
  if (DEMO) return local
  const remote = token ? await fetchMyOrders(token).catch(() => []) : []
  const ids = new Set(remote.map((o) => o.id))
  return [...remote, ...local.filter((o) => !ids.has(o.id))]
}

function patchLocal(id, fn) {
  const list = readLocal(); let out = null
  writeLocal(list.map((o) => (o.id === id ? (out = fn(o)) : o)))
  return out
}

export async function cancelOrder(id, reason = '') {
  const note = reason ? `Order cancelled — ${reason}` : 'Order cancelled by customer'
  const upd = (o) => ({ ...o, status: 'cancelled', history: [...(o.history || []), { status: 'cancelled', at: new Date().toISOString(), note }] })
  if (patchLocal(id, upd)) { if (!DEMO) fetch(`${API_BASE}/api/orders/${id}/cancel`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason }) }).catch(() => {}); return }
  return json(await fetch(`${API_BASE}/api/orders/${id}/cancel`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason }) }))
}

export async function requestReturn(id, reason) {
  const upd = (o) => ({ ...o, returnRequested: true, history: [...(o.history || []), { status: 'return', at: new Date().toISOString(), note: `Return requested — ${reason}` }] })
  if (patchLocal(id, upd)) { if (!DEMO) fetch(`${API_BASE}/api/orders/${id}/return`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason }) }).catch(() => {}); return }
  return json(await fetch(`${API_BASE}/api/orders/${id}/return`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason }) }))
}

// Demo only — lets you preview each tracking stage.
export function demoAdvance(id) {
  const next = { paid: 'shipped', 'pay-on-delivery': 'paid', pending: 'paid', shipped: 'delivered' }
  return patchLocal(id, (o) => {
    const s = next[o.status]; if (!s) return o
    const labels = { paid: 'Payment confirmed — preparing your order', shipped: 'Order shipped', delivered: 'Order delivered' }
    return { ...o, status: s, history: [...(o.history || []), { status: s, at: new Date().toISOString(), note: labels[s] }] }
  })
}

// Customer-facing stage: Pending → Processing → Shipped → Delivered
export const STAGES = ['Pending', 'Processing', 'Shipped', 'Delivered']
export function stageIndex(o) {
  if (o.status === 'delivered') return 3
  if (o.status === 'shipped') return 2
  if (o.status === 'paid') return 1
  return 0
}
export function stageLabel(o) {
  if (o.status === 'cancelled') return 'Cancelled'
  if (o.status === 'failed') return 'Payment Failed'
  return STAGES[stageIndex(o)]
}

export function invoiceHtml(o) {
  const rows = (o.items || []).map((i) => `<tr><td>${i.name}</td><td style="text-align:center">${i.qty}</td><td style="text-align:right">${naira(i.price)}</td><td style="text-align:right">${naira(i.price * i.qty)}</td></tr>`).join('')
  const vat = o.vat ?? Math.round(((o.subtotal || 0) - (o.discount || 0)) * VAT_RATE)
  const line = (l, v) => `<tr><td colspan="3" style="text-align:right;color:#555">${l}</td><td style="text-align:right">${v}</td></tr>`
  return `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${o.id}</title><style>body{font-family:Arial,sans-serif;max-width:760px;margin:30px auto;padding:0 20px;color:#111}h1{margin:0;letter-spacing:3px}table{width:100%;border-collapse:collapse;margin-top:20px}th{background:#0A0E14;color:#00D9FF;padding:8px;text-align:left}td{padding:8px;border-bottom:1px solid #ddd}.tot td{font-weight:700;font-size:1.1em;border-top:2px solid #111}.top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:3px solid #00D9FF;padding-bottom:14px}</style></head><body>
<div class="top"><div><h1>BUXTECH</h1><div style="color:#555;font-size:13px">Lagos, Nigeria · buxtech27@gmail.com · 0812 359 0484</div></div><div style="text-align:right"><b>INVOICE</b><br>#${o.id}<br>${new Date(o.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' })}</div></div>
<p><b>Bill to:</b><br>${o.customer?.name || ''}<br>${o.customer?.email || ''} · ${o.customer?.phone || ''}<br>${o.customer?.address || ''}, ${o.customer?.city || ''}, ${o.customer?.state || ''}</p>
<table><tr><th>Item</th><th style="text-align:center">Qty</th><th style="text-align:right">Price</th><th style="text-align:right">Amount</th></tr>${rows}
${line('Subtotal', naira(o.subtotal))}${o.discount ? line(`Discount${o.promoCode ? ' (' + o.promoCode + ')' : ''}`, '−' + naira(o.discount)) : ''}${line('VAT (7.5%)', naira(vat))}${line('Delivery', naira(o.deliveryFee))}${o.pointsDiscount ? line('Loyalty points', '−' + naira(o.pointsDiscount)) : ''}
<tr class="tot"><td colspan="3" style="text-align:right">TOTAL</td><td style="text-align:right">${naira(o.total)}</td></tr></table>
<p style="color:#555;font-size:13px">Payment: ${o.paymentMethod === 'pay-on-delivery' ? 'Pay on delivery' : 'Paystack'} · Status: ${stageLabel(o)}<br>Thank you for shopping with BuxTech.</p></body></html>`
}

export function downloadInvoice(o) {
  const html = invoiceHtml(o)
  const blob = new Blob([html], { type: 'text/html' })
  const a = document.createElement('a')
  a.href = URL.createObjectURL(blob); a.download = `BuxTech-invoice-${o.id}.html`
  document.body.appendChild(a); a.click(); a.remove()
  setTimeout(() => URL.revokeObjectURL(a.href), 2000)
}
export function printInvoice(o) {
  const w = window.open('', '_blank')
  if (!w) return downloadInvoice(o)
  w.document.write(invoiceHtml(o)); w.document.close(); w.focus(); setTimeout(() => w.print(), 300)
}
