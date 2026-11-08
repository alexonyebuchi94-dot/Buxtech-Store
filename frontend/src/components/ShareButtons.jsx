import { useState } from 'react'

// WhatsApp / Facebook open a share link. Instagram has no web share URL, so we
// copy the link and open Instagram — the standard workaround.
export default function ShareButtons({ title, url }) {
  const [copied, setCopied] = useState(false)
  const link = url || (typeof window !== 'undefined' ? window.location.href : '')
  const text = encodeURIComponent(`${title} — ${link}`)
  const btn = 'flex-1 min-w-[90px] text-center border border-border rounded py-2 text-xs text-ink hover:border-cyan hover:text-cyan transition-colors'
  async function instagram() {
    try { await navigator.clipboard.writeText(link); setCopied(true); setTimeout(() => setCopied(false), 2500) } catch { /* clipboard blocked */ }
    window.open('https://www.instagram.com/', '_blank', 'noopener')
  }
  return (
    <div>
      <div className="text-sm text-muted mb-2">Share this product</div>
      <div className="flex gap-2 flex-wrap">
        <a className={btn} href={`https://wa.me/?text=${text}`} target="_blank" rel="noopener noreferrer">WhatsApp</a>
        <button type="button" className={btn} onClick={instagram}>{copied ? 'Link copied ✓' : 'Instagram'}</button>
        <a className={btn} href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(link)}`} target="_blank" rel="noopener noreferrer">Facebook</a>
      </div>
    </div>
  )
}
