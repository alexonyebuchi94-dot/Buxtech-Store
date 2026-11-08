import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FAQS } from '../lib/faq.js'
import SEO from '../components/SEO.jsx'

export default function FAQ() {
  const [open, setOpen] = useState(0)
  const [q, setQ] = useState('')
  const list = FAQS.filter((f) => !q || (f.q + f.a).toLowerCase().includes(q.toLowerCase()))
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-14">
      <SEO title="FAQ — BuxTech" description="Answers about delivery, payment, returns, warranty and tracking at BuxTech." path="/faq"
        jsonLd={{ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: FAQS.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }} />
      <h1 className="font-display text-4xl text-ink mb-2 tracking-wide">FREQUENTLY ASKED QUESTIONS</h1>
      <p className="text-muted mb-6">Quick answers to the things customers ask most.</p>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search FAQs…" aria-label="Search FAQs" className="w-full bg-surface border border-border rounded px-4 py-2.5 text-sm text-ink focus:border-cyan outline-none mb-5" />
      <div className="space-y-3">
        {list.map((f, i) => (
          <div key={f.q} className="border border-border rounded-lg bg-surface">
            <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i} className="w-full flex justify-between items-center gap-4 text-left px-5 py-4 text-ink">
              {f.q}<span className={`text-cyan transition-transform ${open === i ? 'rotate-45' : ''}`}>＋</span>
            </button>
            {open === i && <p className="px-5 pb-4 text-muted text-sm leading-relaxed">{f.a}</p>}
          </div>
        ))}
        {list.length === 0 && <p className="text-muted">No matches — <Link to="/customer-service" className="text-cyan hover:underline">ask our team</Link>.</p>}
      </div>
      <div className="mt-10 text-center text-sm text-muted">Still stuck? <Link to="/customer-service" className="text-cyan hover:underline">Talk to Customer Service</Link></div>
    </div>
  )
}
