import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

function formatNaira(amount) {
  return `₦${amount.toLocaleString('en-NG')}`
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

const NIGERIAN_STATES = [
  'Lagos', 'Abuja (FCT)', 'Ogun', 'Oyo', 'Rivers', 'Kano', 'Kaduna', 'Enugu',
  'Delta', 'Edo', 'Anambra', 'Imo', 'Abia', 'Akwa Ibom', 'Cross River',
  'Osun', 'Ondo', 'Ekiti', 'Kwara', 'Plateau', 'Benue', 'Niger', 'Katsina',
  'Bauchi', 'Borno', 'Sokoto', 'Kebbi', 'Zamfara', 'Jigawa', 'Yobe',
  'Adamawa', 'Taraba', 'Gombe', 'Nasarawa', 'Kogi', 'Bayelsa', 'Ebonyi',
]

// Delivery is by dispatch bike, so price scales with both distance (state,
// as a proxy for how far the rider has to go) and weight (heavier loads
// are slower/harder on a bike and some riders charge more for them).
// Adjust these numbers to match what you actually pay your riders.
const FREE_WEIGHT_KG = 2 // first 2kg included in the base fee
const PER_KG_FEE = 400 // charged per kg above the free allowance
const HEAVY_ORDER_KG = 15 // above this, flag that bike delivery may not be practical

function getBaseFee(state) {
  if (!state) return 3000
  if (state === 'Lagos') return 1800
  if (['Ogun', 'Oyo', 'Abuja (FCT)'].includes(state)) return 3000
  return 4500
}

function getDeliveryFee(state, weightKg = 0) {
  const base = getBaseFee(state)
  const extraKg = Math.max(0, weightKg - FREE_WEIGHT_KG)
  const weightSurcharge = Math.ceil(extraKg) * PER_KG_FEE
  return base + weightSurcharge
}

export default function Checkout() {
  const { items, subtotal, totalWeight, clearCart } = useCart()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('paystack') // 'paystack' | 'pay-on-delivery'
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
  })

  const deliveryFee = getDeliveryFee(form.state, totalWeight)
  const total = subtotal + deliveryFee

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      // 1. Create the order on our backend
      const orderRes = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer: form,
          items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
          subtotal,
          deliveryFee,
          total,
          totalWeight,
          paymentMethod,
        }),
      })
      const order = await orderRes.json()
      if (!orderRes.ok) throw new Error(order.error || 'Could not create order')

      // Pay on delivery — no online payment needed, order is confirmed immediately
      if (paymentMethod === 'pay-on-delivery') {
        clearCart()
        navigate(`/order-confirmation?orderId=${order.id}&pod=1`)
        return
      }

      // 2. Initialize Paystack payment for this order
      const payRes = await fetch(`${API_BASE}/api/payment/initialize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: form.email,
          amount: total,
          orderId: order.id,
        }),
      })
      const payData = await payRes.json()
      if (!payRes.ok) throw new Error(payData.error || 'Could not start payment')

      // 3. Redirect to Paystack's hosted checkout page
      clearCart()
      window.location.href = payData.authorizationUrl
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  if (items.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-6 py-24 text-center">
        <h1 className="font-display text-4xl text-ink mb-4 tracking-wide">NOTHING TO CHECK OUT</h1>
        <button onClick={() => navigate('/shop')} className="text-cyan hover:underline">
          Back to shop
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-16 grid md:grid-cols-3 gap-12">
      <form onSubmit={handleSubmit} className="md:col-span-2 space-y-5">
        <h1 className="font-display text-4xl text-ink mb-6 tracking-wide">CHECKOUT</h1>

        {error && (
          <div className="border border-red-500/40 bg-red-500/10 text-red-300 text-sm rounded p-3">
            {error}
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="text-sm text-muted block mb-1">Full Name</label>
            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-surface border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm text-muted block mb-1">Email</label>
            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-surface border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm text-muted block mb-1">Phone Number</label>
            <input
              required
              type="tel"
              name="phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full bg-surface border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
            />
          </div>
          <div className="col-span-2">
            <label className="text-sm text-muted block mb-1">Delivery Address</label>
            <input
              required
              name="address"
              value={form.address}
              onChange={handleChange}
              className="w-full bg-surface border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">City</label>
            <input
              required
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full bg-surface border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">State</label>
            <select
              required
              name="state"
              value={form.state}
              onChange={handleChange}
              className="w-full bg-surface border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
            >
              <option value="">Select state…</option>
              {NIGERIAN_STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            {form.state && (
              <p className="text-xs text-cyan mt-1">
                Delivery to {form.state}: {formatNaira(getDeliveryFee(form.state, totalWeight))}
                {totalWeight > FREE_WEIGHT_KG && ` (includes ${totalWeight.toFixed(1)}kg surcharge)`}
              </p>
            )}
            {totalWeight > HEAVY_ORDER_KG && (
              <p className="text-xs text-amber-400 mt-1">
                This order is {totalWeight.toFixed(1)}kg — heavier than a bike can comfortably carry. We may contact you to confirm delivery arrangements before dispatch.
              </p>
            )}
          </div>
        </div>

        <div>
          <label className="text-sm text-muted block mb-2">How would you like to pay?</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setPaymentMethod('paystack')}
              className={`text-left border rounded-lg px-4 py-3 transition-colors ${
                paymentMethod === 'paystack' ? 'border-cyan bg-cyan/10' : 'border-border hover:border-muted'
              }`}
            >
              <div className="text-ink font-medium text-sm">Pay Now</div>
              <div className="text-muted text-xs mt-0.5">Card, bank transfer, or USSD via Paystack</div>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('pay-on-delivery')}
              className={`text-left border rounded-lg px-4 py-3 transition-colors ${
                paymentMethod === 'pay-on-delivery' ? 'border-cyan bg-cyan/10' : 'border-border hover:border-muted'
              }`}
            >
              <div className="text-ink font-medium text-sm">Pay on Delivery</div>
              <div className="text-muted text-xs mt-0.5">Pay cash or transfer when it arrives</div>
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-cyan text-base font-semibold py-4 rounded shadow-glow hover:shadow-glowStrong transition-shadow disabled:opacity-50"
        >
          {loading
            ? paymentMethod === 'paystack' ? 'Redirecting to Paystack…' : 'Placing order…'
            : paymentMethod === 'paystack' ? `Pay ${formatNaira(total)}` : `Place Order — Pay ${formatNaira(total)} on Delivery`}
        </button>
      </form>

      <div className="border border-border rounded-lg p-6 bg-surface h-fit">
        <h2 className="font-display text-xl text-ink mb-4 tracking-wide">ORDER SUMMARY</h2>
        <div className="space-y-3 mb-4">
          {items.map((item) => (
            <div key={item.key} className="flex justify-between text-sm">
              <span className="text-muted">{item.name} × {item.qty}</span>
              <span className="font-mono-price text-ink">{formatNaira(item.price * item.qty)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-4 space-y-2">
          <div className="flex justify-between text-sm text-muted">
            <span>Subtotal</span>
            <span className="font-mono-price text-ink">{formatNaira(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm text-muted">
            <span>Delivery {totalWeight > 0 && `(${totalWeight.toFixed(1)}kg)`}</span>
            <span className="font-mono-price text-ink">{formatNaira(deliveryFee)}</span>
          </div>
          <div className="flex justify-between text-ink font-medium pt-2 border-t border-border">
            <span>Total</span>
            <span className="font-mono-price text-cyan">{formatNaira(total)}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
