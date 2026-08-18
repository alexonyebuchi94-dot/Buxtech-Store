import { useState } from 'react'

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [status, setStatus] = useState('idle') // idle | sending | sent | error

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setStatus('sending')
    try {
      const res = await fetch(`${API_BASE}/api/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      setStatus('sent')
      setForm({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      <h1 className="font-display text-5xl text-ink mb-8 tracking-wide">CONTACT US</h1>
      <p className="text-muted mb-10">
        Questions about an order, a product, or delivery? Send a message and we'll get back to you.
      </p>

      {status === 'sent' ? (
        <div className="border border-cyan/40 bg-cyan/10 text-cyan rounded p-4">
          Message sent — we'll reply as soon as we can.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-muted block mb-1">Name</label>
            <input
              required
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full bg-surface border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Email</label>
            <input
              required
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full bg-surface border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
            />
          </div>
          <div>
            <label className="text-sm text-muted block mb-1">Message</label>
            <textarea
              required
              rows={5}
              name="message"
              value={form.message}
              onChange={handleChange}
              className="w-full bg-surface border border-border rounded px-4 py-3 text-ink focus:border-cyan outline-none"
            />
          </div>
          {status === 'error' && (
            <p className="text-red-400 text-sm">Something went wrong — please try again.</p>
          )}
          <button
            type="submit"
            disabled={status === 'sending'}
            className="bg-cyan text-base font-semibold px-8 py-3 rounded shadow-glow hover:shadow-glowStrong transition-shadow disabled:opacity-50"
          >
            {status === 'sending' ? 'Sending…' : 'Send Message'}
          </button>
        </form>
      )}
    </div>
  )
}
