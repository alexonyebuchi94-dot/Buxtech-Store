import { useEffect, useState } from 'react'

const events = [
  { name: 'Chiamaka', location: 'Lagos', product: 'Digital Air Fryer' },
  { name: 'Tunde', location: 'Ibadan', product: 'USB-C Docking Station' },
  { name: 'Ifeoma', location: 'Abuja', product: 'High-Speed Blender' },
  { name: 'Emeka', location: 'Port Harcourt', product: 'Mechanical Keyboard' },
  { name: 'Blessing', location: 'Enugu', product: 'Bluetooth Speaker Pro' },
  { name: 'Damilola', location: 'Lagos', product: 'Electric Kettle' },
]

export default function LiveActivityToast() {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // First appearance after a short delay
    const initial = setTimeout(() => setVisible(true), 3000)

    const cycle = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setIndex((i) => (i + 1) % events.length)
        setVisible(true)
      }, 500)
    }, 7000)

    return () => {
      clearTimeout(initial)
      clearInterval(cycle)
    }
  }, [])

  const event = events[index]

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 max-w-xs transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="flex items-center gap-3 bg-surface border border-cyan/30 rounded-lg px-4 py-3 shadow-glow">
        <span className="w-2 h-2 rounded-full bg-cyan pulse-dot flex-shrink-0" />
        <p className="text-xs text-muted leading-snug">
          <span className="text-ink font-medium">{event.name}</span> in {event.location} just
          bought a <span className="text-cyan">{event.product}</span>
        </p>
      </div>
    </div>
  )
}
