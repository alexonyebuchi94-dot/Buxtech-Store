import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext.jsx'

function formatNaira(amount) {
  return `₦${amount.toLocaleString('en-NG')}`
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  return (
    <div className="glow-card flex flex-col">
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
