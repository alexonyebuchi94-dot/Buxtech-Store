import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { fetchProduct } from '../api/products.js'
import { useCart } from '../context/CartContext.jsx'

function formatNaira(amount) {
  return `₦${amount.toLocaleString('en-NG')}`
}

export default function ProductPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const [qty, setQty] = useState(1)
  const [added, setAdded] = useState(false)
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchProduct(id)
      .then(setProduct)
      .catch(() => setProduct(null))
      .finally(() => setLoading(false))
  }, [id])

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
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  function handleBuyNow() {
    addToCart(product, qty)
    navigate('/cart')
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-12">
      <div className="rounded-lg overflow-hidden border border-border bg-surface">
        <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
      </div>

      <div>
        <h1 className="font-display text-4xl text-ink mb-3 tracking-wide">{product.name}</h1>
        <div className="font-mono-price text-cyan text-2xl mb-6">
          {formatNaira(product.price)}
        </div>
        <p className="text-muted leading-relaxed mb-6">{product.description}</p>

        <div className="text-sm text-muted mb-6">
          {product.stock > 0 ? (
            <span className="text-cyan">In stock — {product.stock} available</span>
          ) : (
            <span className="text-red-400">Out of stock</span>
          )}
        </div>

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
              onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
              className="px-3 py-2 text-ink hover:text-cyan"
            >
              +
            </button>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={handleAddToCart}
            className="flex-1 border border-cyan text-cyan rounded py-3 font-medium hover:bg-cyan/10 transition-colors"
          >
            {added ? 'Added ✓' : 'Add to Cart'}
          </button>
          <button
            onClick={handleBuyNow}
            className="flex-1 bg-cyan text-base rounded py-3 font-semibold shadow-glow hover:shadow-glowStrong transition-shadow"
          >
            Buy Now
          </button>
        </div>
      </div>
    </div>
  )
}
