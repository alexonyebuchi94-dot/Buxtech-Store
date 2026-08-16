import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

function formatNaira(amount) {
  return `₦${amount.toLocaleString('en-NG')}`
}

export default function Cart() {
  const { items, updateQty, removeFromCart, subtotal } = useCart()
  const navigate = useNavigate()

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-4xl text-ink mb-4 tracking-wide">YOUR CART IS EMPTY</h1>
        <p className="text-muted mb-8">Browse the catalog and find something worth adding.</p>
        <Link
          to="/shop"
          className="inline-block bg-cyan text-base font-semibold px-8 py-3 rounded shadow-glow"
        >
          Shop Now
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-ink mb-10 tracking-wide">YOUR CART</h1>

      <div className="space-y-4 mb-10">
        {items.map((item) => (
          <div
            key={item.key}
            className="flex items-center gap-4 border border-border rounded-lg p-4 bg-surface"
          >
            <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
            <div className="flex-1">
              <div className="text-ink font-medium">{item.name}</div>
              <div className="font-mono-price text-cyan text-sm mt-1">
                {formatNaira(item.price)}
              </div>
            </div>
            <div className="flex items-center border border-border rounded">
              <button
                onClick={() => updateQty(item.key, item.qty - 1)}
                className="px-3 py-1 text-ink hover:text-cyan"
              >
                −
              </button>
              <span className="px-3 font-mono-price text-ink">{item.qty}</span>
              <button
                onClick={() => updateQty(item.key, item.qty + 1)}
                className="px-3 py-1 text-ink hover:text-cyan"
              >
                +
              </button>
            </div>
            <div className="font-mono-price text-ink w-24 text-right">
              {formatNaira(item.price * item.qty)}
            </div>
            <button
              onClick={() => removeFromCart(item.key)}
              className="text-muted hover:text-red-400 text-sm"
            >
              Remove
            </button>
          </div>
        ))}
      </div>

      <div className="flex justify-end">
        <div className="w-full max-w-sm border border-border rounded-lg p-6 bg-surface">
          <div className="flex justify-between text-muted mb-2">
            <span>Subtotal</span>
            <span className="font-mono-price text-ink">{formatNaira(subtotal)}</span>
          </div>
          <div className="text-xs text-muted mb-4">Delivery calculated at checkout</div>
          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-cyan text-base font-semibold py-3 rounded shadow-glow hover:shadow-glowStrong transition-shadow"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  )
}
