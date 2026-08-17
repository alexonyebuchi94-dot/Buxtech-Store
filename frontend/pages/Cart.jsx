export default function Cart({ items, onUpdateQty, onRemove }) {
  const total = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  if (!items.length) {
    return <p className="text-center text-gray-400 py-16">Your cart is empty. <a href="/" className="text-cyan-400">Continue shopping</a></p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-white mb-6">Your Cart</h1>
      {items.map((item) => (
        <div key={item.product.id} className="flex items-center gap-4 border-b border-gray-800 py-4">
          <img src={item.product.images?.[0]} className="w-20 h-20 object-cover rounded" />
          <div className="flex-1">
            <p className="text-white">{item.product.name}</p>
            <p className="text-cyan-400">₦{Number(item.product.price).toLocaleString()}</p>
          </div>
          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) => onUpdateQty(item.product.id, Number(e.target.value))}
            className="w-16 bg-[#0d1117] border border-gray-700 rounded px-2 py-1 text-white"
          />
          <button onClick={() => onRemove(item.product.id)} className="text-red-400 text-sm">
            Remove
          </button>
        </div>
      ))}
      <div className="flex justify-between items-center mt-6">
        <p className="text-gray-400">Total</p>
        <p className="text-2xl font-bold text-white">₦{total.toLocaleString()}</p>
      </div>
      <a
        href="/checkout"
        className="block text-center bg-cyan-400 text-black font-bold py-3 rounded mt-6"
      >
        Proceed to Checkout
      </a>
    </div>
  );
}
