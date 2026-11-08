import { useEffect, useState } from 'react'
import Logo from './Logo.jsx'

// Full-screen loading animation shown on first visit, then fades away.
export default function Loader() {
  const [phase, setPhase] = useState('show') // show | fade | gone
  useEffect(() => {
    const a = setTimeout(() => setPhase('fade'), 1100)
    const b = setTimeout(() => setPhase('gone'), 1600)
    return () => { clearTimeout(a); clearTimeout(b) }
  }, [])
  if (phase === 'gone') return null
  return (
    <div className={`fixed inset-0 z-[100] bg-base flex flex-col items-center justify-center transition-opacity duration-500 ${phase === 'fade' ? 'opacity-0 pointer-events-none' : 'opacity-100'}`} role="status" aria-label="Loading BuxTech">
      <div className="relative w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-border border-t-cyan loader-ring" />
        <Logo size={40} />
      </div>
      <div className="font-display text-2xl text-ink tracking-[0.3em] mt-6">BUX<span className="text-cyan">TECH</span></div>
      <div className="w-40 h-0.5 bg-border rounded mt-5 overflow-hidden"><div className="h-full w-1/3 bg-cyan loader-bar" /></div>
    </div>
  )
}
