import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchAllReviews, submitReview } from '../api/reviews.js'
import { products } from '../data/products.js'
import StarRating from '../components/StarRating.jsx'
import SEO from '../components/SEO.jsx'

export default function Reviews() {
  const [reviews, setReviews] = useState([])
  const [form, setForm] = useState({ productId: products[0].id, name: '', rating: 0, comment: '' })
  const [status, setStatus] = useState('idle')
  const load = () => fetchAllReviews().then(setReviews)
  useEffect(() => { load() }, [])

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0
  const input = 'w-full bg-base border border-border rounded px-4 py-3 text-sm text-ink focus:border-cyan outline-none'

  async function submit(e) {
    e.preventDefault()
    if (!form.rating) return
    setStatus('sending')
    await submitReview(form.productId, { name: form.name, rating: form.rating, comment: form.comment })
    setForm({ ...form, name: '', rating: 0, comment: '' }); setStatus('sent'); load()
    setTimeout(() => setStatus('idle'), 2500)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14">
      <SEO title="Customer Reviews — BuxTech" description="See what BuxTech customers say, and share your own review." path="/reviews" />
      <h1 className="font-display text-4xl sm:text-5xl text-ink mb-2 tracking-wide">CUSTOMER REVIEWS</h1>
      <div className="flex items-center gap-3 mb-10 text-muted">
        <StarRating value={Math.round(avg)} size={20} /><span><span className="text-ink font-medium">{avg.toFixed(1)}</span> from {reviews.length} recent reviews</span>
      </div>

      <div className="grid lg:grid-cols-[22rem_1fr] gap-8">
        <form onSubmit={submit} className="border border-border rounded-xl p-5 bg-surface space-y-4 h-fit lg:sticky lg:top-24">
          <h2 className="font-display text-lg text-ink">WRITE A REVIEW</h2>
          <div>
            <label className="text-sm text-muted block mb-1" htmlFor="rv-prod">Product</label>
            <select id="rv-prod" value={form.productId} onChange={(e) => setForm({ ...form, productId: e.target.value })} className={input}>
              {products.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm text-muted block mb-2">Your rating</label>
            <StarRating value={form.rating} onChange={(r) => setForm({ ...form, rating: r })} size={26} />
          </div>
          <input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name" aria-label="Your name" className={input} />
          <textarea rows={4} value={form.comment} onChange={(e) => setForm({ ...form, comment: e.target.value })} placeholder="Share your experience…" aria-label="Your review" className={input} />
          <button disabled={!form.rating || status === 'sending'} className="w-full bg-cyan text-base font-semibold py-3 rounded shadow-glow disabled:opacity-50">{status === 'sending' ? 'Submitting…' : 'Submit review'}</button>
          {!form.rating && <p className="text-xs text-muted">Pick a star rating to submit.</p>}
          {status === 'sent' && <p className="text-cyan text-sm">Thank you — your review is live! ✓</p>}
        </form>

        <div className="space-y-4">
          {reviews.map((r) => (
            <article key={r.id} className="border border-border rounded-lg p-5 bg-surface">
              <div className="flex items-center justify-between gap-3 mb-2">
                <div className="text-ink font-medium">{r.name}</div>
                <StarRating value={r.rating} size={14} />
              </div>
              {r.comment && <p className="text-muted text-sm leading-relaxed mb-3">{r.comment}</p>}
              <div className="flex justify-between text-xs text-muted">
                {r.product ? <Link to={`/product/${r.product.id}`} className="text-cyan hover:underline truncate max-w-[70%]">{r.product.name}</Link> : <span />}
                <span>{new Date(r.date).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
