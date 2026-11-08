import { useEffect, useState } from 'react'

const WORDS = [
  'Faster.', 'Smarter.', 'Sharper.', 'Unplugged.', 'Limitless.', 'Next-Gen.', 'Powered Up.',
  'Wired.', 'Always On.', 'Future-Proof.', 'Zero Lag.', 'Turbo.', 'Online.', 'Upgraded.',
  'Boundless.', 'Hyper.', 'Genius.', 'In Sync.', 'Overclocked.', 'Ahead.',
]

// Random order, no repeat control: each tick picks any word at random.
export default function RotatingWords({ className = '' }) {
  const [word, setWord] = useState(() => WORDS[Math.floor(Math.random() * WORDS.length)])
  const [tick, setTick] = useState(0)
  useEffect(() => {
    const t = setInterval(() => {
      setWord(WORDS[Math.floor(Math.random() * WORDS.length)])
      setTick((n) => n + 1)
    }, 2200)
    return () => clearInterval(t)
  }, [])
  return (
    <div className={`font-display text-2xl md:text-4xl text-ink mb-6 ${className}`} aria-live="off">
      <span className="text-muted">Tech, </span>
      <span key={tick} className="inline-block text-cyan text-glow word-in">{word}</span>
    </div>
  )
}
