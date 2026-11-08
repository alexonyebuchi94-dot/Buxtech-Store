import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import SupportChat from './SupportChat.jsx'
import { Chat, Close } from './Icons.jsx'

// Floating chat bubble on every storefront page.
export default function ChatLauncher() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()
  if (pathname.startsWith('/customer-service')) return null
  return (
    <div className="fixed bottom-4 right-4 z-[72] flex flex-col items-end">
      {open && <div className="mb-3 w-[min(22rem,calc(100vw-2rem))] shadow-glow rounded-xl reveal-up"><SupportChat height="h-72" /></div>}
      <button onClick={() => setOpen((o) => !o)} aria-label={open ? 'Close chat' : 'Chat with support'} className="w-12 h-12 rounded-full bg-cyan text-base shadow-glow flex items-center justify-center hover:scale-105 transition-transform">
        {open ? <Close /> : <Chat />}
      </button>
    </div>
  )
}
