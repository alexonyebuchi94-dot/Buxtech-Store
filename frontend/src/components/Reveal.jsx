import { useReveal } from '../hooks/useReveal.js'

export default function Reveal({ children, className = '', delay = 0 }) {
  const [ref, revealed] = useReveal()

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ease-out ${
        revealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      } ${className}`}
      style={{ transitionDelay: revealed ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  )
}
