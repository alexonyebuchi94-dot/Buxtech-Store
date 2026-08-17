import { useState, useEffect } from 'react';

const STATUSES = ['pending', 'paid', 'shipped', 'delivered', 'cancelled'];

export default function AdminOrders({ token }) {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');

  const loadOrders = () => {
    const url = filter ? `/api/admin/orders?status=${filter}` : '/api/admin/orders';
    fetch(url, { headers: { Authorization: `Bearer ${token}` } }).then((r) => r.json()).then(setOrders);
  };
  useEffect(() => { loadOrders(); }, [filter]);

  const updateStatus = async (id, status) => {
    await fetch(`/api/admin/orders/${id}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ status }),
    });
    loadOrders();
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Orders</h1>

      <div className="flex gap-2 mb-6">
        <button onClick={() => setFilter('')} className={`px-3 py-1 rounded text-sm ${!filter ? 'bg-cyan-400 text-black' : 'bg-[#0d1117] text-gray-400'}`}>All</button>
        {STATUSES.map((s) => (
          <button key={s} onClick={() => setFilter(s)} className={`px-3 py-1 rounded text-sm capitalize ${filter === s ? 'bg-cyan-400 text-black' : 'bg-[#0d1117] text-gray-400'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-[#0d1117] border border-gray-800 rounded divide-y divide-gray-800">
        {orders.map((o) => (
          <div key={o.id} className="flex items-center gap-4 p-4">
            <div className="flex-1">
              <p className="text-white">{o.order_ref}</p>
              <p className="text-gray-500 text-sm">₦{Number(o.total).toLocaleString()} · {o.phone}</p>
            </div>
            <select
              value={o.status}
              onChange={(e) => updateStatus(o.id, e.target.value)}
              className="bg-black border border-gray-700 rounded px-2 py-1 text-white text-sm capitalize"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}
