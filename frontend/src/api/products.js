const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export async function fetchProducts(category) {
  const url = category
    ? `${API_BASE}/api/products?category=${encodeURIComponent(category)}`
    : `${API_BASE}/api/products`
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to load products')
  return res.json()
}

export async function fetchProduct(id) {
  const res = await fetch(`${API_BASE}/api/products/${id}`)
  if (!res.ok) throw new Error('Product not found')
  return res.json()
}

export async function createProduct(adminKey, data) {
  const res = await fetch(`${API_BASE}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to create product')
  return res.json()
}

export async function updateProduct(adminKey, id, data) {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'x-admin-key': adminKey },
    body: JSON.stringify(data),
  })
  if (!res.ok) throw new Error('Failed to update product')
  return res.json()
}

export async function deleteProduct(adminKey, id) {
  const res = await fetch(`${API_BASE}/api/products/${id}`, {
    method: 'DELETE',
    headers: { 'x-admin-key': adminKey },
  })
  if (!res.ok) throw new Error('Failed to delete product')
  return res.json()
}
