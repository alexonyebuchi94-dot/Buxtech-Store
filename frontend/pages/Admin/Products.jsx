import { useState, useEffect } from 'react';

export default function AdminProducts({ token }) {
  const [products, setProducts] = useState([]);
  const [editing, setEditing] = useState(null); // product object or null
  const [uploading, setUploading] = useState(false);

  const loadProducts = () => fetch('/api/products').then((r) => r.json()).then(setProducts);
  useEffect(() => { loadProducts(); }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    const res = await fetch('/api/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData,
    });
    const data = await res.json();
    setUploading(false);
    setEditing((p) => ({ ...p, images: [...(p.images || []), data.url] }));
  };

  const handleSave = async () => {
    const method = editing.id ? 'PUT' : 'POST';
    const url = editing.id ? `/api/admin/products/${editing.id}` : '/api/admin/products';
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(editing),
    });
    setEditing(null);
    loadProducts();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/admin/products/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } });
    loadProducts();
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">Products</h1>
        <button onClick={() => setEditing({ name: '', price: '', stock: '', images: [] })} className="bg-cyan-400 text-black font-bold px-4 py-2 rounded">
          + Add Product
        </button>
      </div>

      {editing && (
        <div className="bg-[#0d1117] border border-gray-800 rounded p-6 mb-8">
          <h2 className="text-white font-bold text-lg mb-4">{editing.id ? 'Edit Product' : 'New Product'}</h2>

          <label className="block text-gray-400 mb-1">Product Name</label>
          <input value={editing.name} onChange={(e) => setEditing({ ...editing, name: e.target.value })}
            className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white mb-3" />

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div>
              <label className="block text-gray-400 mb-1">Price (₦)</label>
              <input type="number" value={editing.price} onChange={(e) => setEditing({ ...editing, price: e.target.value })}
                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
            </div>
            <div>
              <label className="block text-gray-400 mb-1">Stock</label>
              <input type="number" value={editing.stock} onChange={(e) => setEditing({ ...editing, stock: e.target.value })}
                className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white" />
            </div>
          </div>

          <label className="block text-gray-400 mb-1">Description</label>
          <textarea value={editing.description || ''} onChange={(e) => setEditing({ ...editing, description: e.target.value })}
            className="w-full bg-black border border-gray-700 rounded px-3 py-2 text-white mb-3" rows={3} />

          <label className="block text-gray-400 mb-1">Images</label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {editing.images?.map((img, i) => <img key={i} src={img} className="w-16 h-16 object-cover rounded" />)}
          </div>
          <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} />
          {uploading && <p className="text-cyan-400 text-sm mt-1">Uploading...</p>}

          <div className="flex gap-3 mt-5">
            <button onClick={handleSave} className="bg-cyan-400 text-black font-bold px-6 py-2 rounded">Save Changes</button>
            <button onClick={() => setEditing(null)} className="border border-gray-700 text-gray-300 px-6 py-2 rounded">Cancel</button>
          </div>
        </div>
      )}

      <div className="bg-[#0d1117] border border-gray-800 rounded divide-y divide-gray-800">
        {products.map((p) => (
          <div key={p.id} className="flex items-center gap-4 p-4">
            <img src={p.images?.[0]} className="w-12 h-12 object-cover rounded" />
            <div className="flex-1">
              <p className="text-white">{p.name}</p>
              <p className="text-gray-500 text-sm">Stock: {p.stock} · ₦{Number(p.price).toLocaleString()}</p>
            </div>
            <button onClick={() => setEditing(p)} className="text-cyan-400 text-sm">Edit</button>
            <button onClick={() => handleDelete(p.id)} className="text-red-400 text-sm">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
