export default function ReturnsPolicy() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-20">
      <h1 className="font-display text-5xl text-ink mb-8 tracking-wide">RETURNS &amp; REFUNDS</h1>
      <div className="space-y-5 text-muted leading-relaxed">
        <p>Last updated: August 2026</p>
        <p>
          If an item arrives damaged, faulty, or different from what you ordered, contact us
          within 48 hours of delivery at{' '}
          <a href="mailto:buxtech27@gmail.com" className="text-cyan hover:underline">
            buxtech27@gmail.com
          </a>{' '}
          or{' '}
          <a href="tel:+2348123590484" className="text-cyan hover:underline">
            0812 359 0484
          </a>{' '}
          with your order number and photos of the item.
        </p>
        <p>
          Approved returns must be unused, in original packaging, and with all accessories
          included. Once we receive and inspect the returned item, we'll process a replacement
          or refund within 5–7 business days.
        </p>
        <p>
          Refunds are issued to the original payment method via Paystack. Delivery fees are
          non-refundable unless the return is due to our error.
        </p>
        <p>
          Items damaged through misuse, or returned outside the 48-hour window, are not
          eligible for return.
        </p>
      </div>
    </div>
  )
}
