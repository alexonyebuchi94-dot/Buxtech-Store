import { useState } from 'react'
import { useStore } from '../context/StoreContext.jsx'
import { API_BASE, DEMO } from '../lib/config.js'

export default function Newsletter() {
  const { subscribed, setSubscribed, notify } = useStore()
  const [email, setEmail] = useState('')
  async function submit(e) {
    e.preventDefault()
    if (!DEMO) { fetch(`${API_BASE}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Newsletter signup', email, message: 'Please add me to the BuxTech newsletter.' }) }).catch(() => {}) }
    setSubscribed(email); notify('You’re subscribed 🎉 Use code WELCOME5')
  }
  return (
    <section className="max-w-[90rem] mx-auto px-4 sm:px-6 py-12">
      <div className="border border-border rounded-xl bg-surface px-5 py-10 sm:py-14 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-grad-glow opacity-50 pointer-events-none" />
        <div className="relative max-w-xl mx-auto">
          <h2 className="font-display text-2xl sm:text-4xl text-ink mb-3">STAY WIRED</h2>
          <p className="text-muted mb-6">Get drops, flash-sale alerts and tech tips. New subscribers get <span className="text-cyan font-mono-price">WELCOME5</span> for 5% off.</p>
          {subscribed ? (
            <div className="border border-cyan/40 bg-cyan/10 text-cyan rounded p-3">You’re on the list: {subscribed}</div>
          ) : (
            <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@email.com" aria-label="Email address" className="flex-1 bg-base border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none" />
              <button type="submit" className="bg-cyan text-base font-semibold px-8 py-3 rounded shadow-glow hover:shadow-glowStrong transition-shadow">Subscribe</button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}
