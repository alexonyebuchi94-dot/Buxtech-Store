import { testimonials } from '../data/products.js'

export default function Testimonials() {
  return (
    <section className="bg-surface border-y border-border py-20">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="font-display text-3xl text-ink mb-10 tracking-wide">WHAT CUSTOMERS SAY</h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div key={idx} className="border border-border rounded-lg p-6 bg-base">
              <div className="text-cyan text-2xl font-display mb-3">"</div>
              <p className="text-ink text-sm leading-relaxed mb-6">{t.quote}</p>
              <div className="text-sm text-muted">
                <span className="text-ink font-medium">{t.name}</span> · {t.location}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
