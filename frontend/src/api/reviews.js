import { API_BASE, DEMO } from '../lib/config.js'
import { products } from '../data/products.js'

// Reviews are stored in the browser (works with no server) and also sent to the
// backend when it's available, so you can collect them centrally later.
const KEY = 'bx_reviews'
const day = 86400000
const seeds = [
  { id: 's1', productId: 'bx-001', name: 'Chiamaka O.', rating: 5, comment: 'Light, fast and the battery really lasts. Arrived in 2 days to Lekki.', date: Date.now() - 6 * day },
  { id: 's2', productId: 'bx-008', name: 'Tunde A.', rating: 5, comment: 'Works with my laptop and TV at the same time. Great build quality.', date: Date.now() - 9 * day },
  { id: 's3', productId: 'bx-034', name: 'Emeka N.', rating: 4, comment: 'Excellent controller, no drift after two weeks of heavy use.', date: Date.now() - 12 * day },
  { id: 's4', productId: 'bx-020', name: 'Ifeoma K.', rating: 5, comment: 'Colours are stunning at 144Hz. Packaging was very secure.', date: Date.now() - 15 * day },
  { id: 's5', productId: 'bx-028', name: 'Damilola S.', rating: 4, comment: 'Good noise cancelling for the price. Fast delivery to Abuja.', date: Date.now() - 18 * day },
  { id: 's6', productId: 'bx-013', name: 'Blessing E.', rating: 5, comment: 'Easy RAM upgrade, laptop feels brand new. Support helped me confirm compatibility.', date: Date.now() - 21 * day },
  { id: 's7', productId: 'bx-002', name: 'Seyi A.', rating: 5, comment: 'Editing 4K is smooth. Genuine product with warranty card.', date: Date.now() - 25 * day },
  { id: 's8', productId: 'bx-036', name: 'Kelechi M.', rating: 4, comment: 'Hot-swap switches are a joy. Customer service was quick on WhatsApp.', date: Date.now() - 30 * day },
]

function readLocal() {
  try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
}
const enrich = (r) => ({ ...r, product: products.find((p) => p.id === r.productId) })

export async function fetchReviews(productId) {
  const list = [...readLocal(), ...seeds].filter((r) => r.productId === productId).sort((a, b) => b.date - a.date)
  const p = products.find((x) => x.id === productId)
  const count = (p?.reviewCount || 0) + readLocal().filter((r) => r.productId === productId).length
  const local = readLocal().filter((r) => r.productId === productId)
  const average = p ? (p.rating * p.reviewCount + local.reduce((s, r) => s + r.rating, 0)) / Math.max(1, count) : 0
  return { reviews: list, rating: count ? { average, count } : null }
}

export async function fetchAllReviews() {
  return [...readLocal(), ...seeds].sort((a, b) => b.date - a.date).map(enrich)
}

export async function submitReview(productId, { name, rating, comment }) {
  const review = { id: `r${Date.now()}`, productId, name, rating, comment, date: Date.now() }
  localStorage.setItem(KEY, JSON.stringify([review, ...readLocal()]))
  if (!DEMO) {
    fetch(`${API_BASE}/api/reviews/${productId}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, rating, comment }) }).catch(() => {})
  }
  return review
}
