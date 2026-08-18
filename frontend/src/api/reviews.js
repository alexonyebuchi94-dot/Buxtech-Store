const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'

export async function fetchReviews(productId) {
  const res = await fetch(`${API_BASE}/api/reviews/${productId}`)
  if (!res.ok) throw new Error('Failed to load reviews')
  return res.json()
}

export async function submitReview(productId, { name, rating, comment }) {
  const res = await fetch(`${API_BASE}/api/reviews/${productId}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, rating, comment }),
  })
  if (!res.ok) throw new Error('Failed to submit review')
  return res.json()
}
