import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchProduct, fetchProducts } from '../api/products.js'
import { fetchReviews, submitReview } from '../api/reviews.js'
import { useCart } from '../context/CartContext.jsx'
import { useStore } from '../context/StoreContext.jsx'
import { deliveryEstimate, NIGERIAN_STATES } from '../lib/shipping.js'
import { catName, subName } from '../data/products.js'
import ShareButtons from '../components/ShareButtons.jsx'
import TrustBadges from '../components/TrustBadges.jsx'
import { Heart } from '../components/Icons.jsx'
import StarRating from '../components/StarRating.jsx'
import ProductCard from '../components/ProductCard.jsx'
import SEO from '../components/SEO.jsx'

import { naira as formatNaira } from '../lib/config.js'

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { wishlist, toggleWishlist, pushRecent, notify } = useStore()
  const [tab, setTab] = useState('delivery')
  const [shipTo, setShipTo] = useState('Lagos')
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImage, setActiveImage] = useState(0)

  const [reviews, setReviews] = useState([])
  const [rating, setRating] = useState(null)
  const [related, setRelated] = useState([])

  const [reviewForm, setReviewForm] = useState({ name: '', rating: 0, comment: '' })
  const [reviewStatus, setReviewStatus] = useState('idle')

  useEffect(() => {
    setLoading(true)
    fetchProduct(id)
      .then((p) => {
        setProduct(p)
        setActiveImage(0)
        pushRecent(p.id)
      })
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))

    fetchReviews(id)
      .then((data) => {
        setReviews(data.reviews)
        setRating(data.rating)
      })
      .catch(() => {})
  }, [id, pushRecent])

  useEffect(() => {
    if (!product) return
    fetchProducts(product.category)
      .then((all) => setRelated(all.filter((p) => p.id !== product.id).sort((a, b) => (b.sub === product.sub) - (a.sub === product.sub)).slice(0, 4)))
      .catch(() => setRelated([]))
  }, [product])

  async function handleReviewSubmit(e) {
    e.preventDefault()
    if (reviewForm.rating === 0) return
    setReviewStatus('sending')
    try {
      await submitReview(id, reviewForm)
      const data = await fetchReviews(id)
      setReviews(data.reviews)
      setRating(data.rating)
      setReviewForm({ name: '', rating: 0, comment: '' })
      setReviewStatus('sent')
      setTimeout(() => setReviewStatus('idle'), 2000)
    } catch {
      setReviewStatus('error')
    }
  }

  if (loading) {
    return <div className="max-w-3xl mx-auto px-6 py-24 text-center text-muted">Loading…</div>
  }

  if (!product) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-ink mb-4">PRODUCT NOT FOUND</h1>
        <Link to="/shop" className="text-cyan hover:underline">Back to shop</Link>
      </div>
    )
  }

  function handleAddToCart() {
    addToCart(product, qty)
    notify('Added to cart 🛒')
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleBuyNow() {
    addToCart(product, qty)
    navigate('/cart')
  }

  return (
    <div className="max-w-[90rem] mx-auto px-4 sm:px-6 py-10">
      <SEO
        title={`${product.name} — BuxTech`}
        description={product.description ? product.description.slice(0, 160) : `Buy ${product.name} at BuxTech.`}
        keywords={Array.isArray(product.keywords) ? product.keywords.join(', ') : undefined}
        path={`/product/${product.id}`}
        image={(product.images && product.images[0]) || product.image}
        jsonLd={{
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: product.name,
          description: product.description,
          image: product.images || [product.image],
          brand: product.brand ? { '@type': 'Brand', name: product.brand } : undefined,
          sku: product.sku || undefined,
          offers: {
            '@type': 'Offer',
            priceCurrency: 'NGN',
            price: product.price,
            availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
          },
        }}
      />
      <nav className="text-xs text-muted mb-6 flex flex-wrap gap-1.5" aria-label="Breadcrumb">
        <Link to="/home" className="hover:text-cyan">Home</Link>/<Link to="/shop" className="hover:text-cyan">Shop</Link>/
        <Link to={`/shop?category=${product.category}`} className="hover:text-cyan">{catName(product.category)}</Link>
        {product.sub && <>/<Link to={`/shop?category=${product.category}&sub=${product.sub}`} className="hover:text-cyan">{subName(product.category, product.sub)}</Link></>}
      </nav>
      <div className="grid md:grid-cols-2 gap-8 lg:gap-14">
        <div>
          <div className="rounded-lg overflow-hidden border border-border bg-surface aspect-square mb-3">
            <img
              src={(product.images && product.images[activeImage]) || product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          {product.images && product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded overflow-hidden border-2 transition-colors ${
                    i === activeImage ? 'border-cyan' : 'border-border hover:border-muted'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <div className="text-xs text-muted font-mono-price uppercase mb-1">{product.brand}</div>
          <h1 className="font-display text-2xl sm:text-4xl text-ink mb-2 tracking-wide">{product.name}</h1>

          {rating && (
            <div className="flex items-center gap-2 mb-4">
              <StarRating value={Math.round(rating.average)} size={16} />
              <span className="text-muted text-sm">
                {rating.average.toFixed(1)} ({rating.count} review{rating.count !== 1 ? 's' : ''})
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mb-6">
            <span className="font-mono-price text-cyan text-3xl">{formatNaira(product.price)}</span>
            {product.oldPrice && <><span className="font-mono-price text-muted line-through">{formatNaira(product.oldPrice)}</span><span className="bg-cyan text-base text-xs font-bold px-2 py-0.5 rounded">-{Math.round((1 - product.price / product.oldPrice) * 100)}%</span></>}
          </div>
          <p className="text-muted leading-relaxed mb-6">{product.description}</p>

          <div className="flex items-center gap-2 text-sm text-ink mb-6"><span className="text-cyan">🛡</span> Warranty: <span className="font-medium">{product.warranty || '12 months'}</span></div>

          {Array.isArray(product.keyFeatures) && product.keyFeatures.length > 0 && (
            <ul className="mb-6 space-y-2">
              {product.keyFeatures.map((feature, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-muted">
                  <span className="text-cyan mt-1">●</span>
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          )}

          <div className="text-sm text-muted mb-6">
            {product.stock > 0 ? (
              <span className="text-cyan">● In Stock{product.stock <= 5 ? ` — only ${product.stock} left` : ''}</span>
            ) : (
              <span className="text-red-400">● Out of Stock</span>
            )}
          </div>

          {(product.brand || product.weight || product.sku) && (
            <div className="text-sm text-muted mb-6 space-y-1">
              {product.brand && <div>Brand: <span className="text-ink">{product.brand}</span></div>}
              {product.weight != null && product.weight !== '' && (
                <div>Weight: <span className="text-ink">{product.weight} kg</span></div>
              )}
              {product.sku && <div>SKU: <span className="text-ink">{product.sku}</span></div>}
            </div>
          )}

          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm text-muted">Quantity</span>
            <div className="flex items-center border border-border rounded">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-ink hover:text-cyan"
              >
                −
              </button>
              <span className="px-4 text-ink font-mono-price">{qty}</span>
              <button
                onClick={() => setQty((q) => Math.min(Math.max(product.stock, 1), q + 1))}
                className="px-3 py-2 text-ink hover:text-cyan"
              >
                +
              </button>
            </div>
          </div>

          {/* Delivery estimate */}
          <div className="border border-border rounded-lg p-4 bg-surface mb-6">
            <div className="flex flex-wrap items-center justify-between gap-2 text-sm">
              <span className="text-muted">Estimated delivery to</span>
              <select value={shipTo} onChange={(e) => setShipTo(e.target.value)} aria-label="Delivery state" className="bg-base border border-border rounded px-2 py-1 text-ink text-sm">
                {NIGERIAN_STATES.map((st) => <option key={st}>{st}</option>)}
              </select>
            </div>
            <div className="text-cyan font-mono-price mt-2">{deliveryEstimate(shipTo)}</div>
          </div>

          <div className="mb-6"><ShareButtons title={product.name} /></div>

          <div className="flex gap-3 mb-3">
            <button onClick={() => toggleWishlist(product.id)} aria-label="Wishlist" aria-pressed={wishlist.includes(product.id)} className={`w-12 border rounded flex items-center justify-center ${wishlist.includes(product.id) ? 'text-red-400 border-red-400/50' : 'text-ink border-border hover:border-cyan'}`}><Heart filled={wishlist.includes(product.id)} /></button>
            <button
              onClick={handleAddToCart}
              disabled={product.stock <= 0}
              className="flex-1 border border-cyan text-cyan rounded py-3 font-medium hover:bg-cyan/10 transition-colors disabled:opacity-40"
            >
              {added ? 'Added ✓' : 'Add to Cart'}
            </button>
            <button
              onClick={handleBuyNow}
              disabled={product.stock <= 0}
              className="flex-1 bg-cyan text-base rounded py-3 font-semibold shadow-glow hover:shadow-glowStrong transition-shadow disabled:opacity-40"
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>

      {/* Delivery / Returns / Warranty */}
      <div className="mt-14 border border-border rounded-xl bg-surface overflow-hidden">
        <div className="flex border-b border-border overflow-x-auto no-scrollbar">
          {[['delivery', 'Delivery Info'], ['returns', 'Return Policy'], ['warranty', 'Warranty']].map(([k, l]) => (
            <button key={k} onClick={() => setTab(k)} className={`px-5 py-3 text-sm whitespace-nowrap transition-colors ${tab === k ? 'text-cyan border-b-2 border-cyan' : 'text-muted hover:text-ink'}`}>{l}</button>
          ))}
        </div>
        <div className="p-5 text-sm text-muted leading-relaxed">
          {tab === 'delivery' && <p>Orders ship within 24 hours of confirmation. Lagos deliveries arrive in 1–2 business days; Ogun, Oyo and Abuja in 2–3; other states in 3–5. Orders over ₦150,000 get free delivery. Every order is tracked — see our <Link to="/shipping-policy" className="text-cyan hover:underline">Shipping &amp; Delivery policy</Link>.</p>}
          {tab === 'returns' && <p>Received a faulty, damaged or wrong item? Request a return within 7 days of delivery. Items must be unused with original packaging. We replace or refund within 5–7 business days. Details in our <Link to="/returns-policy" className="text-cyan hover:underline">Return &amp; Refund policy</Link>.</p>}
          {tab === 'warranty' && <p>This product carries a {product.warranty || '12-month'} warranty against manufacturing defects. Keep your order confirmation as proof of purchase. Physical or liquid damage is not covered. See the full <Link to="/warranty" className="text-cyan hover:underline">Warranty terms</Link>.</p>}
        </div>
      </div>
      <div className="mt-6"><TrustBadges /></div>

      {/* Reviews */}
      <div className="mt-20 border-t border-border pt-12">
        <h2 className="font-display text-2xl text-ink mb-6 tracking-wide">REVIEWS</h2>

        <form onSubmit={handleReviewSubmit} className="border border-border rounded-lg p-6 bg-surface mb-8 space-y-4">
          <div>
            <label className="text-sm text-muted block mb-2">Your Rating</label>
            <StarRating
              value={reviewForm.rating}
              onChange={(r) => setReviewForm({ ...reviewForm, rating: r })}
            />
          </div>
          <input
            required
            placeholder="Your name"
            value={reviewForm.name}
            onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
            className="w-full bg-base border border-border rounded px-4 py-3 text-sm text-ink focus:border-cyan outline-none"
          />
          <textarea
            rows={3}
            placeholder="Share your experience (optional)"
            value={reviewForm.comment}
            onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
            className="w-full bg-base border border-border rounded px-4 py-3 text-sm text-ink focus:border-cyan outline-none"
          />
          <button
            type="submit"
            disabled={reviewStatus === 'sending' || reviewForm.rating === 0}
            className="bg-cyan text-base font-semibold px-6 py-2.5 rounded shadow-glow disabled:opacity-50"
          >
            {reviewStatus === 'sending' ? 'Submitting…' : 'Submit Review'}
          </button>
          {reviewStatus === 'sent' && <p className="text-cyan text-sm">Thanks for your review!</p>}
        </form>

        {reviews.length === 0 ? (
          <p className="text-muted text-sm">No reviews yet — be the first.</p>
        ) : (
          <div className="space-y-4">
            {reviews.map((r) => (
              <div key={r.id} className="border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-ink font-medium text-sm">{r.name}</span>
                  <StarRating value={r.rating} size={14} />
                </div>
                {r.comment && <p className="text-muted text-sm">{r.comment}</p>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Related products */}
      {related.length > 0 && (
        <div className="mt-20 border-t border-border pt-12">
          <h2 className="font-display text-2xl text-ink mb-6 tracking-wide">RELATED PRODUCTS</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
