import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'
import { useAuth } from '../context/AuthContext.jsx'
import { useStore, NAIRA_PER_POINT, POINTS_PER_NAIRA } from '../context/StoreContext.jsx'
import { API_BASE, DEMO, naira, VAT_RATE } from '../lib/config.js'
import { NIGERIAN_STATES, getDeliveryFee, FREE_WEIGHT_KG, HEAVY_ORDER_KG, deliveryEstimate } from '../lib/shipping.js'
import { createOrder } from '../lib/orders.js'
import TrustBadges from '../components/TrustBadges.jsx'
import SEO from '../components/SEO.jsx'

const CHANNELS = [
  { id: 'card', label: 'Card', hint: 'Visa, Mastercard, Verve', paystack: ['card'] },
  { id: 'transfer', label: 'Bank Transfer', hint: 'Pay from your banking app', paystack: ['bank_transfer'] },
  { id: 'ussd', label: 'USSD', hint: 'Dial a code, no internet needed', paystack: ['ussd'] },
]
const field = 'w-full bg-surface border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none'

export default function Checkout() {
  const { items, subtotal, totalWeight, clearCart, discount, promo, freeShip, shipState } = useCart()
  const { user } = useAuth()
  const { addresses, saveAddress, removeAddress, points, addPoints, spendPoints } = useStore()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState(user ? 'account' : 'guest') // guest | account
  const [paymentMethod, setPaymentMethod] = useState('paystack') // 'paystack' | 'pay-on-delivery'
  const [channel, setChannel] = useState('card')
  const [saveAddr, setSaveAddr] = useState(true)
  const [usePoints, setUsePoints] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '', email: user?.email || '', phone: '', address: '', city: '', state: shipState || '',
  })

  const taxable = subtotal - discount
  const vat = Math.round(taxable * VAT_RATE)
  const deliveryFee = getDeliveryFee(form.state, totalWeight, subtotal, freeShip)
  const maxPointsValue = Math.min(points * NAIRA_PER_POINT, taxable + vat + deliveryFee)
  const pointsUsed = usePoints ? Math.ceil(maxPointsValue / NAIRA_PER_POINT) : 0
  const pointsDiscount = usePoints ? maxPointsValue : 0
  const total = taxable + vat + deliveryFee - pointsDiscount
  const earned = Math.floor(total * POINTS_PER_NAIRA)

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const pickAddress = (a) => setForm((f) => ({ ...f, name: a.name || f.name, phone: a.phone || f.phone, address: a.address, city: a.city, state: a.state }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError(''); setLoading(true)
    try {
      const order = await createOrder({
        customer: form,
        items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, qty: i.qty })),
        subtotal, discount, promoCode: promo?.code || null, vat, deliveryFee, pointsDiscount, total, totalWeight, paymentMethod,
        paymentChannel: paymentMethod === 'paystack' ? channel : null,
        checkoutMode: mode,
      })
      if (saveAddr && form.address) saveAddress({ name: form.name, phone: form.phone, address: form.address, city: form.city, state: form.state })
      if (pointsUsed) spendPoints(pointsUsed)
      addPoints(earned)

      if (DEMO || paymentMethod === 'pay-on-delivery') {
        clearCart()
        navigate(`/order-confirmation?orderId=${order.id}&${DEMO ? 'demo=1' : 'pod=1'}`)
        return
      }
      const payRes = await fetch(`${API_BASE}/api/payment/initialize`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, amount: total, orderId: order.id, channels: CHANNELS.find((c) => c.id === channel).paystack }),
      })
      const payData = await payRes.json()
      if (!payRes.ok) throw new Error(payData.error || 'Could not start payment')
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
        <button onClick={() => navigate('/shop')} className="text-cyan hover:underline">Back to shop</button>
      </div>
    )
  }

  const choice = (on) => `text-left border rounded-lg px-4 py-3 transition-colors ${on ? 'border-cyan bg-cyan/10' : 'border-border hover:border-muted'}`

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid lg:grid-cols-3 gap-10">
      <SEO title="Checkout — BuxTech" noindex />
      <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
        <h1 className="font-display text-3xl sm:text-4xl text-ink tracking-wide">CHECKOUT</h1>
        {error && <div className="border border-red-500/40 bg-red-500/10 text-red-300 text-sm rounded p-3">{error}</div>}

        {/* Guest or account */}
        <div className="grid grid-cols-2 gap-3">
          <button type="button" onClick={() => setMode('guest')} className={choice(mode === 'guest')}>
            <div className="text-ink font-medium text-sm">Guest checkout</div><div className="text-muted text-xs mt-0.5">No account needed</div>
          </button>
          <button type="button" onClick={() => (user ? setMode('account') : navigate('/login', { state: { from: '/checkout' } }))} className={choice(mode === 'account')}>
            <div className="text-ink font-medium text-sm">{user ? `Account · ${user.name.split(' ')[0]}` : 'Log in / Register'}</div><div className="text-muted text-xs mt-0.5">Earn points · save addresses</div>
          </button>
        </div>

        {addresses.length > 0 && (
          <div>
            <div className="text-sm text-muted mb-2">Address book</div>
            <div className="flex flex-wrap gap-2">
              {addresses.map((a) => (
                <div key={a.id} className="flex items-stretch border border-border rounded-lg overflow-hidden text-xs">
                  <button type="button" onClick={() => pickAddress(a)} className="px-3 py-2 text-left hover:bg-surface text-ink">{a.address}, {a.city}<span className="block text-muted">{a.state}</span></button>
                  <button type="button" onClick={() => removeAddress(a.id)} aria-label="Remove address" className="px-2 text-muted hover:text-red-400 border-l border-border">✕</button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2"><label className="text-sm text-muted block mb-1">Full Name</label><input required name="name" value={form.name} onChange={handleChange} className={field} autoComplete="name" /></div>
          <div className="col-span-2 sm:col-span-1"><label className="text-sm text-muted block mb-1">Email</label><input required type="email" name="email" value={form.email} onChange={handleChange} className={field} autoComplete="email" /></div>
          <div className="col-span-2 sm:col-span-1"><label className="text-sm text-muted block mb-1">Phone Number (for SMS updates)</label><input required type="tel" name="phone" value={form.phone} onChange={handleChange} className={field} autoComplete="tel" /></div>
          <div className="col-span-2"><label className="text-sm text-muted block mb-1">Delivery Address</label><input required name="address" value={form.address} onChange={handleChange} className={field} autoComplete="street-address" /></div>
          <div><label className="text-sm text-muted block mb-1">City</label><input required name="city" value={form.city} onChange={handleChange} className={field} /></div>
          <div>
            <label className="text-sm text-muted block mb-1">State</label>
            <select required name="state" value={form.state} onChange={handleChange} className={field}>
              <option value="">Select state…</option>
              {NIGERIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="col-span-2 -mt-2">
            {form.state && (
              <p className="text-xs text-cyan">
                Delivery to {form.state}: {deliveryFee === 0 ? 'FREE' : naira(deliveryFee)} · arrives {deliveryEstimate(form.state)}
                {deliveryFee > 0 && totalWeight > FREE_WEIGHT_KG && ` (includes ${totalWeight.toFixed(1)}kg surcharge)`}
              </p>
            )}
            {totalWeight > HEAVY_ORDER_KG && <p className="text-xs text-amber-400 mt-1">This order is {totalWeight.toFixed(1)}kg — heavier than a bike can comfortably carry. We may contact you to confirm delivery arrangements before dispatch.</p>}
          </div>
          <label className="col-span-2 flex items-center gap-2 text-sm text-muted cursor-pointer"><input type="checkbox" checked={saveAddr} onChange={(e) => setSaveAddr(e.target.checked)} className="accent-cyan" /> Save this address to my address book</label>
        </div>

        {/* Payment */}
        <div>
          <label className="text-sm text-muted block mb-2">How would you like to pay?</label>
          <div className="grid sm:grid-cols-2 gap-3">
            <button type="button" onClick={() => setPaymentMethod('paystack')} className={choice(paymentMethod === 'paystack')}>
              <div className="text-ink font-medium text-sm">Pay Now · Paystack</div><div className="text-muted text-xs mt-0.5">Card, bank transfer or USSD</div>
            </button>
            <button type="button" onClick={() => setPaymentMethod('pay-on-delivery')} className={choice(paymentMethod === 'pay-on-delivery')}>
              <div className="text-ink font-medium text-sm">Pay on Delivery</div><div className="text-muted text-xs mt-0.5">Pay cash or transfer when it arrives</div>
            </button>
          </div>
          {paymentMethod === 'paystack' && (
            <div className="grid grid-cols-3 gap-2 mt-3">
              {CHANNELS.map((c) => (
                <button key={c.id} type="button" onClick={() => setChannel(c.id)} className={`${choice(channel === c.id)} !px-3`}>
                  <div className="text-ink text-sm font-medium">{c.label}</div><div className="text-muted text-[11px] leading-tight mt-0.5">{c.hint}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {points > 0 && (
          <label className="flex items-center gap-2 text-sm text-ink cursor-pointer border border-border rounded-lg px-4 py-3 bg-surface">
            <input type="checkbox" checked={usePoints} onChange={(e) => setUsePoints(e.target.checked)} className="accent-cyan" />
            Use my loyalty points <span className="text-cyan font-mono-price">({points} pts = {naira(points * NAIRA_PER_POINT)})</span>
          </label>
        )}

        <button type="submit" disabled={loading} className="w-full bg-cyan text-base font-semibold py-4 rounded shadow-glow hover:shadow-glowStrong transition-shadow disabled:opacity-50">
          {loading ? (paymentMethod === 'paystack' && !DEMO ? 'Redirecting to Paystack…' : 'Placing order…') : paymentMethod === 'paystack' ? `Pay ${naira(total)}${DEMO ? ' (demo)' : ''}` : `Place Order — Pay ${naira(total)} on Delivery`}
        </button>
        <p className="text-xs text-muted text-center">You’ll get an email and SMS confirmation after your order. You’ll earn <span className="text-cyan">{earned} loyalty points</span> on this order.</p>
        <TrustBadges />
      </form>

      <div className="border border-border rounded-lg p-6 bg-surface h-fit lg:sticky lg:top-24">
        <h2 className="font-display text-xl text-ink mb-4 tracking-wide">ORDER SUMMARY</h2>
        <div className="space-y-3 mb-4">
          {items.map((item) => (
            <div key={item.key} className="flex gap-3 text-sm">
              <img src={item.image} alt="" className="w-12 h-12 rounded object-cover" />
              <span className="text-muted flex-1">{item.name} × {item.qty}</span>
              <span className="font-mono-price text-ink">{naira(item.price * item.qty)}</span>
            </div>
          ))}
        </div>
        <div className="border-t border-border pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-muted"><span>Subtotal</span><span className="font-mono-price text-ink">{naira(subtotal)}</span></div>
          {discount > 0 && <div className="flex justify-between text-cyan"><span>Discount ({promo.code})</span><span className="font-mono-price">−{naira(discount)}</span></div>}
          <div className="flex justify-between text-muted"><span>VAT (7.5%)</span><span className="font-mono-price text-ink">{naira(vat)}</span></div>
          <div className="flex justify-between text-muted"><span>Delivery fee {totalWeight > 0 && `(${totalWeight.toFixed(1)}kg)`}</span><span className="font-mono-price text-ink">{form.state ? (deliveryFee === 0 ? 'FREE' : naira(deliveryFee)) : '—'}</span></div>
          {pointsDiscount > 0 && <div className="flex justify-between text-cyan"><span>Loyalty points</span><span className="font-mono-price">−{naira(pointsDiscount)}</span></div>}
          <div className="flex justify-between text-ink font-medium pt-2 border-t border-border"><span>Total</span><span className="font-mono-price text-cyan">{naira(total)}</span></div>
        </div>
        <Link to="/cart" className="block text-center text-xs text-muted hover:text-cyan mt-4">← Edit cart</Link>
      </div>
    </div>
  )
}
