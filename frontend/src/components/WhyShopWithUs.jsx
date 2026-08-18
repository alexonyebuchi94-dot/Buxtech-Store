const reasons = [
  {
    title: 'Real Stock, Real Fast',
    text: 'What you see is what we have. Orders ship within 24 hours of confirmation.',
  },
  {
    title: 'Nigerian Prices',
    text: 'No import markup guesswork — priced fairly for the Nigerian market from day one.',
  },
  {
    title: 'You Can Actually Reach Us',
    text: 'Email or WhatsApp a real person, not a bot loop. We reply the same day.',
  },
  {
    title: 'Backed By Warranty',
    text: 'Every electronic and appliance is covered — see our warranty policy for details.',
  },
]

export default function WhyShopWithUs() {
  return (
    <section className="max-w-7xl mx-auto px-6 py-20">
      <h2 className="font-display text-3xl text-ink mb-10 tracking-wide">WHY SHOP WITH BUXTECH</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {reasons.map((r) => (
          <div key={r.title} className="glow-card p-6">
            <div className="w-8 h-8 rounded-full border border-cyan flex items-center justify-center mb-4">
              <div className="w-1.5 h-1.5 bg-cyan rounded-full" />
            </div>
            <h3 className="font-display text-lg text-ink tracking-wide mb-2">{r.title}</h3>
            <p className="text-muted text-sm leading-relaxed">{r.text}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
