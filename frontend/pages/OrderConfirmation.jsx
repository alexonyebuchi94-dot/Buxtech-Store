import { useState, useEffect } from 'react';

export default function OrderConfirmation({ orderId, token }) {
  const [order, setOrder] = useState(null);

  useEffect(() => {
    fetch(`/api/orders/${orderId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(setOrder);
  }, [orderId]);

  if (!order) return <p className="text-center text-gray-400 py-16">Loading order...</p>;

  return (
    <div className="max-w-lg mx-auto px-4 py-16 text-center">
      <div className="text-cyan-400 text-5xl mb-4">✓</div>
      <h1 className="text-2xl font-bold text-white">Order {order.order_ref} placed!</h1>
      <p className="text-gray-400 mt-2">
        Status: <span className="text-cyan-400 capitalize">{order.status}</span>
      </p>
      <p className="text-gray-400 mt-1">Total: ₦{Number(order.total).toLocaleString()}</p>

      <div className="text-left bg-[#0d1117] border border-gray-800 rounded p-4 mt-6">
        {order.items?.map((item) => (
          <div key={item.id} className="flex justify-between text-gray-300 py-1">
            <span>{item.name} × {item.quantity}</span>
            <span>₦{(item.price * item.quantity).toLocaleString()}</span>
          </div>
        ))}
      </div>

      <a href={`/track/${order.order_ref}`} className="inline-block mt-6 text-cyan-400">
        Track this order →
      </a>
    </div>
  );
}
