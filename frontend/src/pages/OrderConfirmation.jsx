import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

function formatNaira(amount) {
  return `₦${Number(amount).toLocaleString('en-NG')}`
}

export default function OrderConfirmation() {
  const [searchParams] = useSearchParams()
  const reference = searchParams.get('reference')
  const orderId = searchParams.get('orderId')
  const isPayOnDelivery = searchParams.get('pod') === '1'
  const [status, setStatus] = useState('checking') // checking | success | failed
  const [order, setOrder] = useState(null)

  useEffect(() => {
    if (isPayOnDelivery && orderId) {
      fetch(`${API_BASE}/api/orders/${orderId}`)
        .then((res) => res.json())
        .then((data) => {
          setOrder(data)
          setStatus('success')
        })
        .catch(() => setStatus('failed'))
      return
    }
    if (!reference) {
      setStatus('failed')
      return
    }
    fetch(`${API_BASE}/api/payment/verify/${reference}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data.order)
        setStatus(data.success ? 'success' : 'failed')
      })
      .catch(() => setStatus('failed'))
  }, [reference, orderId, isPayOnDelivery])

  return (
    <div className="max-w-2xl mx-auto px-6 py-24 text-center">
      {status === 'checking' && (
        <>
          <h1 className="font-display text-3xl text-ink mb-4 tracking-wide">
            {isPayOnDelivery ? 'CONFIRMING ORDER…' : 'CONFIRMING PAYMENT…'}
          </h1>
          <p className="text-muted">Hang tight, this only takes a moment.</p>
        </>
      )}

      {status === 'success' && isPayOnDelivery && (
        <>
          <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-cyan flex items-center justify-center text-cyan text-2xl">
            ✓
          </div>
          <h1 className="font-display text-4xl text-ink mb-4 tracking-wide">ORDER PLACED</h1>
          <p className="text-muted mb-2">Your order is confirmed for pay-on-delivery.</p>
          {order && (
            <p className="text-ink font-mono-price mb-2">
              Amount due on delivery: {formatNaira(order.total)}
            </p>
          )}
          <p className="font-mono-price text-cyan mb-8">Order #{orderId}</p>
          <p className="text-muted mb-8">
            We'll send delivery updates to the email you provided. Have the exact amount ready — cash or transfer — when it arrives.
          </p>
          <Link to="/shop" className="inline-block bg-cyan text-base font-semibold px-8 py-3 rounded shadow-glow">
            Continue Shopping
          </Link>
        </>
      )}

      {status === 'success' && !isPayOnDelivery && (
        <>
          <div className="w-16 h-16 mx-auto mb-6 rounded-full border-2 border-cyan flex items-center justify-center text-cyan text-2xl">
            ✓
          </div>
          <h1 className="font-display text-4xl text-ink mb-4 tracking-wide">ORDER CONFIRMED</h1>
          <p className="text-muted mb-2">
            Payment received. Your reference is
          </p>
          <p className="font-mono-price text-cyan mb-8">{reference}</p>
          <p className="text-muted mb-8">
            We'll send delivery updates to the email you provided.
          </p>
          <Link to="/shop" className="inline-block bg-cyan text-base font-semibold px-8 py-3 rounded shadow-glow">
            Continue Shopping
          </Link>
        </>
      )}

      {status === 'failed' && (
        <>
          <h1 className="font-display text-3xl text-ink mb-4 tracking-wide">
            {isPayOnDelivery ? "WE COULDN'T CONFIRM THIS ORDER" : "WE COULDN'T CONFIRM THIS PAYMENT"}
          </h1>
          <p className="text-muted mb-8">
            If money left your account, contact us with your reference and we'll sort it out.
          </p>
          <Link to="/contact" className="text-cyan hover:underline">Contact Support</Link>
        </>
      )}
    </div>
  )
}
