import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { useCart } from '../context/CartContext.jsx'

function formatNaira(amount) {
  return `₦${amount.toLocaleString('en-NG')}`
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart()
  const cardRef = useRef(null)

  function handleMouseMove(e) {
    const card = cardRef.current
    if (!card) return
    const rect = card.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const rotateX = ((y - rect.height / 2) / rect.height) * -8
    const rotateY = ((x - rect.width / 2) / rect.width) * 8
    card.style.transform = `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-3px)`
  }

  function handleMouseLeave() {
    const card = cardRef.current
    if (!card) return
    card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) translateY(0)'
  }

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="glow-card tilt-card flex flex-col"
    >
      <Link to={`/product/${product.id}`} className="block">
        <div className="aspect-square overflow-hidden bg-base">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </Link>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-ink font-medium leading-snug hover:text-cyan transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="font-mono-price text-cyan text-lg mt-auto">
          {formatNaira(product.price)}
        </div>
        <button
          onClick={() => addToCart(product)}
          className="mt-2 w-full border border-border rounded py-2 text-sm text-ink hover:border-cyan hover:text-cyan transition-colors"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
