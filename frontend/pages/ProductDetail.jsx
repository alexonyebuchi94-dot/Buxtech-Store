import { useState, useEffect } from 'react';

export default function ProductDetail({ slug, onAddToCart }) {
  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    fetch(`/api/products/${slug}`)
      .then((r) => r.json())
      .then(setProduct);
  }, [slug]);

  if (!product) return <p className="text-gray-400 text-center py-10">Loading...</p>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
      <div>
        <img
          src={product.images?.[activeImage]}
          alt={product.name}
          className="w-full h-96 object-cover rounded border border-gray-800"
        />
        <div className="flex gap-2 mt-3">
          {product.images?.map((img, i) => (
            <img
              key={i}
              src={img}
              onClick={() => setActiveImage(i)}
              className={`w-16 h-16 object-cover rounded cursor-pointer border ${i === activeImage ? 'border-cyan-400' : 'border-gray-800'}`}
            />
          ))}
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-white">{product.name}</h1>
        <p className="text-cyan-400 text-2xl font-bold mt-2">₦{Number(product.price).toLocaleString()}</p>
        <p className="text-gray-400 mt-1">{product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}</p>

        <p className="text-gray-300 mt-4">{product.description}</p>

        {product.specs && Object.keys(product.specs).length > 0 && (
          <table className="mt-4 w-full text-sm">
            <tbody>
              {Object.entries(product.specs).map(([k, v]) => (
                <tr key={k} className="border-b border-gray-800">
                  <td className="py-2 text-gray-500 capitalize">{k}</td>
                  <td className="py-2 text-gray-300">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        <div className="flex items-center gap-3 mt-6">
          <input
            type="number"
            min="1"
            max={product.stock}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-16 bg-[#0d1117] border border-gray-700 rounded px-2 py-2 text-white"
          />
          <button
            onClick={() => onAddToCart?.(product, qty)}
            disabled={product.stock === 0}
            className="bg-cyan-400 text-black font-bold px-6 py-2 rounded disabled:opacity-50"
          >
            Add to Cart
          </button>
        </div>

        <p className="text-gray-500 text-sm mt-4">Delivery: Lagos 24–48hrs, other states 3–5 days</p>
        <p className="text-gray-500 text-sm">{product.warranty_months || 6} Months Warranty</p>

        <div className="mt-8">
          <h3 className="text-white font-bold mb-3">Reviews ({product.reviews?.length || 0})</h3>
          {product.reviews?.map((r) => (
            <div key={r.id} className="border-b border-gray-800 py-3">
              <p className="text-cyan-400 text-sm">{'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</p>
              <p className="text-gray-300 text-sm">{r.comment}</p>
              <p className="text-gray-600 text-xs mt-1">{r.user_name}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
