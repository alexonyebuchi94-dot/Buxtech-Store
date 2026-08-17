import { useState, useEffect } from 'react';

export default function AdminDashboard({ token }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    fetch('/api/admin/dashboard', { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then(setData);
  }, []);

  if (!data) return <p className="text-gray-400 p-8">Loading dashboard...</p>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-white mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-[#0d1117] border border-gray-800 rounded p-5">
          <p className="text-gray-400 text-sm">Total Revenue</p>
          <p className="text-2xl font-bold text-cyan-400">₦{Number(data.revenue).toLocaleString()}</p>
        </div>
        <div className="bg-[#0d1117] border border-gray-800 rounded p-5">
          <p className="text-gray-400 text-sm">Total Orders</p>
          <p className="text-2xl font-bold text-white">{data.order_count}</p>
        </div>
        <div className="bg-[#0d1117] border border-gray-800 rounded p-5">
          <p className="text-gray-400 text-sm">Low Stock Items</p>
          <p className="text-2xl font-bold text-red-400">{data.lowStock.length}</p>
        </div>
      </div>

      {data.lowStock.length > 0 && (
        <div className="bg-[#0d1117] border border-red-900 rounded p-4 mb-8">
          <h3 className="text-red-400 font-bold mb-2">Low Stock Alerts</h3>
          {data.lowStock.map((p) => (
            <p key={p.id} className="text-gray-300 text-sm">{p.name} — only {p.stock} left</p>
          ))}
        </div>
      )}

      <div className="bg-[#0d1117] border border-gray-800 rounded p-5">
        <h3 className="text-white font-bold mb-3">Revenue — Last 30 Days</h3>
        {data.chart.map((row) => (
          <div key={row.day} className="flex justify-between text-sm text-gray-400 py-1">
            <span>{new Date(row.day).toLocaleDateString()}</span>
            <span className="text-cyan-400">₦{Number(row.revenue).toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
