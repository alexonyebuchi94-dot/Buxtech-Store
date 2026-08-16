const items = [
  { label: 'Fast Delivery', detail: 'Across Nigeria, tracked' },
  { label: 'Secure Payment', detail: 'Paystack encrypted checkout' },
  { label: 'Warranty', detail: 'On all electronics & appliances' },
  { label: 'Real Support', detail: 'Talk to a human, not a bot' },
]

export default function TrustStrip() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        {items.map((item) => (
          <div key={item.label} className="text-center">
            <div className="w-10 h-10 mx-auto mb-3 rounded-full border border-cyan flex items-center justify-center">
              <div className="w-2 h-2 bg-cyan rounded-full" />
            </div>
            <div className="text-ink font-medium text-sm">{item.label}</div>
            <div className="text-muted text-xs mt-1">{item.detail}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
