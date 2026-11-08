import { Link } from 'react-router-dom'
import SEO from '../../components/SEO.jsx'

export default function ShippingPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <SEO title="Shipping & Delivery Policy — BuxTech" description="BuxTech delivery times, fees, tracking and free-shipping threshold across Nigeria." path="/shipping-policy" />
      <h1 className="font-display text-4xl sm:text-5xl text-ink mb-8 tracking-wide">SHIPPING &amp; DELIVERY</h1>
      <div className="space-y-5 text-muted leading-relaxed">
        <p>Last updated: November 2026</p>
        <h2 className="font-display text-xl text-ink pt-2">Processing</h2>
        <p>Orders are packed and dispatched within 24 hours of confirmed payment (or confirmation of a pay-on-delivery order). Orders placed on Sundays or public holidays ship the next working day.</p>
        <h2 className="font-display text-xl text-ink pt-2">Delivery times</h2>
        <p>Lagos: 1–2 business days · Ogun, Oyo and Abuja (FCT): 2–3 business days · All other states: 3–5 business days. Remote locations may take a little longer and we will tell you if that applies to you.</p>
        <h2 className="font-display text-xl text-ink pt-2">Delivery fees</h2>
        <p>Fees depend on your state and the weight of your order: from ₦1,800 in Lagos, ₦3,000 for Ogun, Oyo and Abuja, and ₦4,500 elsewhere, plus a small charge per kilogram above 2kg. Use the shipping calculator in your cart for an exact figure. Orders of ₦150,000 and above ship free.</p>
        <h2 className="font-display text-xl text-ink pt-2">Tracking</h2>
        <p>Every order has an Order ID. Track it any time on the <Link to="/orders" className="text-cyan hover:underline">Orders page</Link> — no login required. You also receive email and SMS updates.</p>
        <h2 className="font-display text-xl text-ink pt-2">Receiving your order</h2>
        <p>Please inspect your package at delivery. If it is damaged, tell the rider and contact us within 48 hours so we can sort it out quickly. For pay-on-delivery orders, have the exact amount ready.</p>
        <h2 className="font-display text-xl text-ink pt-2">Need help?</h2>
        <p>Reach us on the <Link to="/customer-service" className="text-cyan hover:underline">Customer Service page</Link> or WhatsApp 0812 359 0484.</p>
      </div>
    </div>
  )
}
