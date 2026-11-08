import { Link } from 'react-router-dom'
import SEO from '../../components/SEO.jsx'

export default function ReturnsPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <SEO title="Return & Refund Policy — BuxTech" description="How to return a faulty, damaged or wrong item and get a replacement or refund from BuxTech." path="/returns-policy" />
      <h1 className="font-display text-4xl sm:text-5xl text-ink mb-8 tracking-wide">RETURN &amp; REFUND</h1>
      <div className="space-y-5 text-muted leading-relaxed">
        <p>Last updated: November 2026</p>
        <p>If an item arrives damaged, faulty or different from what you ordered, you can request a return within <span className="text-ink">7 days of delivery</span>. Start from the <Link to="/orders" className="text-cyan hover:underline">Orders page</Link> → “Return Request”, or contact{' '}
          <a href="mailto:buxtech27@gmail.com" className="text-cyan hover:underline">buxtech27@gmail.com</a> or{' '}
          <a href="tel:+2348123590484" className="text-cyan hover:underline">0812 359 0484</a> with your Order ID and photos of the item.</p>
        <p>Approved returns must be unused, in original packaging, with all accessories included. Once we receive and inspect the item, we process a replacement or refund within 5–7 business days.</p>
        <p>Refunds go back to the original payment method via Paystack. Delivery fees are non-refundable unless the return is due to our error. You can also cancel an order from the Orders page any time before it ships.</p>
        <p>Items damaged through misuse, liquid or physical damage, or returned outside the return window are not eligible. Warranty claims follow our <Link to="/warranty" className="text-cyan hover:underline">Warranty terms</Link>.</p>
      </div>
    </div>
  )
}
