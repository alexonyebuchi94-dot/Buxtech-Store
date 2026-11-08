import { products } from '../data/products.js'
import { API_BASE } from '../lib/config.js'

// Storefront now reads the new placeholder catalog from src/data/products.js.
// (Old backend-stored stock is no longer shown. Admin functions below are untouched.)
export async function fetchProducts(category) {
  return category ? products.filter((p) => p.category === category) : products
}

export async function fetchProduct(id) {
  const p = products.find((x) => x.id === id)
  if (!p) throw new Error('Product not found')
  return p
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
