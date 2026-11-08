import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FAQS, answer } from '../lib/faq.js'
import { products } from '../data/products.js'
import { getOrder, stageLabel } from '../lib/orders.js'
import { API_BASE, DEMO, WHATSAPP, naira } from '../lib/config.js'

const HELLO = { from: 'bot', text: 'Hi, I’m BuxBot 🤖 — BuxTech’s AI assistant. Ask me about delivery, payment, returns, warranty or tracking an order. If I can’t solve it, I’ll hand you to a real person.' }
const QUICK = ['Track my order', 'Delivery time', 'Return an item', 'Warranty', 'Talk to a human']

// AI assistant first → human handoff when it can't help.
export default function SupportChat({ height = 'h-[26rem]' }) {
  const [msgs, setMsgs] = useState([HELLO])
  const [input, setInput] = useState('')
  const [human, setHuman] = useState(false)
  const [misses, setMisses] = useState(0)
  const [busy, setBusy] = useState(false)
  const end = useRef(null)
  useEffect(() => { end.current?.scrollIntoView({ block: 'nearest' }) }, [msgs])

  const push = (m) => setMsgs((x) => [...x, m])
  const transcript = () => msgs.map((m) => `${m.from === 'user' ? 'Customer' : m.from === 'bot' ? 'BuxBot' : 'Agent'}: ${m.text}`).join('\n')
  const waLink = () => `https://wa.me/${WHATSAPP}?text=${encodeURIComponent('Hello BuxTech, I need help.\n\n' + transcript().slice(-900))}`

  function handoff(reason) {
    setHuman(true)
    push({ from: 'bot', text: reason || 'Connecting you to a human agent…' })
    if (!DEMO) {
      fetch(`${API_BASE}/api/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: 'Live chat handoff', email: 'chat@buxtech.local', message: transcript() }) }).catch(() => {})
    }
    setTimeout(() => push({ from: 'agent', text: 'You’re in the human support queue. Keep typing here, or tap “Continue on WhatsApp” to chat with an agent right now — your conversation is attached so you don’t need to repeat yourself.' }), 900)
  }

  async function send(text) {
    const t = text.trim(); if (!t || busy) return
    setInput(''); push({ from: 'user', text: t })
    if (human) { setTimeout(() => push({ from: 'agent', text: 'Thanks — an agent will reply shortly. For the fastest answer, continue on WhatsApp below.' }), 700); return }
    if (/human|agent|person|representative|real someone/i.test(t)) return handoff()
    setBusy(true)
    await new Promise((r) => setTimeout(r, 450))

    // Order tracking: look for an order ID in the message
    const idMatch = t.match(/\b[A-Za-z0-9_-]{10}\b/g)?.find((x) => /\d/.test(x) || x === x.toUpperCase())
    if (/track|order|where/i.test(t) && idMatch) {
      try {
        const o = await getOrder(idMatch)
        push({ from: 'bot', text: `Order #${o.id} is currently “${stageLabel(o)}”. Total ${naira(o.total)}.`, link: { to: `/orders?track=${o.id}`, label: 'Open full tracking' } })
        setBusy(false); return
      } catch { /* fall through */ }
    }
    if (/track/i.test(t) && !idMatch) { push({ from: 'bot', text: 'Sure — paste your 10-character Order ID here, or open the Orders page to track without logging in.', link: { to: '/orders', label: 'Go to Orders' } }); setBusy(false); return }

    // Product questions
    const hit = /have|sell|stock|price|buy|looking/i.test(t) ? products.filter((p) => t.toLowerCase().split(/\W+/).some((w) => w.length > 3 && (p.name.toLowerCase().includes(w) || p.sub?.includes(w) || p.category.includes(w)))).slice(0, 3) : []
    if (hit.length) {
      push({ from: 'bot', text: `Here’s what I found: ${hit.map((p) => `${p.name} (${naira(p.price)}, ${p.stock > 0 ? 'in stock' : 'out of stock'})`).join('; ')}.`, link: { to: `/product/${hit[0].id}`, label: 'View product' } })
      setBusy(false); return
    }

    const a = answer(t)
    if (a) { setMisses(0); push({ from: 'bot', text: a.a }) }
    else {
      const m = misses + 1; setMisses(m)
      if (m >= 2) handoff('I’m sorry — I can’t solve this one. Let me hand you to a human agent.')
      else push({ from: 'bot', text: 'I’m not sure I got that. Could you rephrase — or type “human” to reach a person?' })
    }
    setBusy(false)
  }

  return (
    <div className="flex flex-col border border-border rounded-xl bg-surface overflow-hidden">
      <div className="px-4 py-3 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-ink"><span className="w-2 h-2 rounded-full bg-cyan pulse-dot" />{human ? 'Human support' : 'BuxBot · AI assistant'}</div>
        {!human && <button onClick={() => handoff()} className="text-xs text-cyan hover:underline">Talk to a human</button>}
      </div>
      <div className={`${height} overflow-y-auto p-4 space-y-3`} aria-live="polite">
        {msgs.map((m, i) => (
          <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${m.from === 'user' ? 'bg-cyan text-base rounded-br-sm' : 'bg-base border border-border text-ink rounded-bl-sm'}`}>
              {m.from === 'agent' && <div className="text-[10px] text-cyan font-mono-price mb-0.5">HUMAN AGENT</div>}
              {m.text}
              {m.link && <Link to={m.link.to} className="block mt-1.5 text-cyan hover:underline text-xs">{m.link.label} →</Link>}
            </div>
          </div>
        ))}
        {busy && <div className="text-xs text-muted">BuxBot is typing…</div>}
        <div ref={end} />
      </div>
      {!human && msgs.length < 3 && (
        <div className="px-4 pb-2 flex flex-wrap gap-2">
          {QUICK.map((q) => <button key={q} onClick={() => (q === 'Talk to a human' ? handoff() : send(q))} className="text-xs border border-border rounded-full px-3 py-1 text-muted hover:text-cyan hover:border-cyan">{q}</button>)}
        </div>
      )}
      {human && (
        <div className="px-4 pb-2"><a href={waLink()} target="_blank" rel="noopener noreferrer" className="block text-center bg-[#25D366] text-[#05260f] text-sm font-semibold rounded py-2">Continue on WhatsApp</a></div>
      )}
      <form onSubmit={(e) => { e.preventDefault(); send(input) }} className="flex gap-2 p-3 border-t border-border">
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={human ? 'Message our team…' : 'Ask a question…'} aria-label="Chat message" className="flex-1 min-w-0 bg-base border border-border rounded px-3 py-2 text-sm text-ink focus:border-cyan outline-none" />
        <button className="bg-cyan text-base font-semibold px-4 rounded text-sm">Send</button>
      </form>
    </div>
  )
}
