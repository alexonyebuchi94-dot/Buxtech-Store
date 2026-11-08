import { useState } from 'react'
import { Link } from 'react-router-dom'
import SupportChat from '../components/SupportChat.jsx'
import SEO from '../components/SEO.jsx'
import { API_BASE, DEMO, EMAIL, PHONE, WHATSAPP } from '../lib/config.js'

export default function CustomerService() {
  const [form, setForm] = useState({ name: '', email: '', orderId: '', topic: 'Order help', message: '' })
  const [status, setStatus] = useState('idle')
  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const input = 'w-full bg-base border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none'

  async function submit(e) {
    e.preventDefault(); setStatus('sending')
    try {
      if (!DEMO) {
        const res = await fetch(`${API_BASE}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: form.name, email: form.email, message: `[${form.topic}]${form.orderId ? ` Order ${form.orderId}` : ''}\n\n${form.message}` }) })
        if (!res.ok) throw new Error()
      }
      setStatus('sent'); setForm({ name: '', email: '', orderId: '', topic: 'Order help', message: '' })
    } catch { setStatus('error') }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-14">
      <SEO title="Customer Service — BuxTech" description="Get help fast: AI assistant, live human chat, WhatsApp, phone and a follow-up form." path="/customer-service" />
      <h1 className="font-display text-4xl sm:text-5xl text-ink mb-3 tracking-wide">CUSTOMER SERVICE</h1>
      <p className="text-muted mb-10 max-w-2xl">Start with our AI assistant for instant answers. If it can’t solve your problem, it hands you straight to a real person.</p>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="font-display text-lg text-ink mb-3">1 · CHAT WITH US</h2>
          <SupportChat />
        </div>

        <div className="space-y-8">
          <div>
            <h2 className="font-display text-lg text-ink mb-3">2 · TALK TO A HUMAN</h2>
            <div className="grid sm:grid-cols-3 gap-3">
              <a href={`https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hello BuxTech, I need help with…')}`} target="_blank" rel="noopener noreferrer" className="border border-[#25D366]/50 rounded-lg p-4 hover:bg-[#25D366]/10 transition-colors">
                <div className="text-ink font-medium text-sm">WhatsApp</div><div className="text-muted text-xs mt-1">Chat with an agent</div>
              </a>
              <a href={`tel:${PHONE}`} className="border border-border rounded-lg p-4 hover:border-cyan transition-colors">
                <div className="text-ink font-medium text-sm">Call us</div><div className="text-cyan font-mono-price text-xs mt-1">0812 359 0484</div>
              </a>
              <a href={`mailto:${EMAIL}`} className="border border-border rounded-lg p-4 hover:border-cyan transition-colors">
                <div className="text-ink font-medium text-sm">Email</div><div className="text-muted text-xs mt-1 break-all">{EMAIL}</div>
              </a>
            </div>
          </div>

          <div>
            <h2 className="font-display text-lg text-ink mb-3">3 · FOLLOW-UP FORM</h2>
            {status === 'sent' ? (
              <div className="border border-cyan/40 bg-cyan/10 text-cyan rounded p-4">Thanks — we’ve got your message and will follow up by email. <button onClick={() => setStatus('idle')} className="underline ml-1">Send another</button></div>
            ) : (
              <form onSubmit={submit} className="space-y-3">
                <div className="grid sm:grid-cols-2 gap-3">
                  <input required name="name" value={form.name} onChange={set} placeholder="Your name" aria-label="Name" className={input} />
                  <input required type="email" name="email" value={form.email} onChange={set} placeholder="Email" aria-label="Email" className={input} />
                  <select name="topic" value={form.topic} onChange={set} aria-label="Topic" className={input}>
                    {['Order help', 'Delivery', 'Return / refund', 'Warranty claim', 'Product question', 'Payment issue', 'Other'].map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <input name="orderId" value={form.orderId} onChange={set} placeholder="Order ID (optional)" aria-label="Order ID" className={input} />
                </div>
                <textarea required rows={4} name="message" value={form.message} onChange={set} placeholder="Describe the issue so we can solve it in one go…" aria-label="Describe your issue" className={input} />
                {status === 'error' && <p className="text-red-400 text-sm">Something went wrong — please try again or use WhatsApp.</p>}
                <button disabled={status === 'sending'} className="bg-cyan text-base font-semibold px-8 py-3 rounded shadow-glow disabled:opacity-50">{status === 'sending' ? 'Sending…' : 'Send follow-up'}</button>
              </form>
            )}
          </div>
          <p className="text-sm text-muted">Browse answers on the <Link to="/faq" className="text-cyan hover:underline">FAQ page</Link>.</p>
        </div>
      </div>
    </div>
  )
}
