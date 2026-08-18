import { nanoid } from 'nanoid'

// In-memory review store, keyed by product ID.
const reviews = new Map() // productId -> array of reviews

export function getReviews(productId) {
  return reviews.get(productId) || []
}

export function addReview(productId, { name, rating, comment }) {
  const review = {
    id: nanoid(8),
    name,
    rating: Number(rating),
    comment,
    createdAt: new Date().toISOString(),
  }
  const existing = reviews.get(productId) || []
  reviews.set(productId, [review, ...existing])
  return review
}

export function getAverageRating(productId) {
  const list = reviews.get(productId) || []
  if (list.length === 0) return null
  const sum = list.reduce((acc, r) => acc + r.rating, 0)
  return { average: sum / list.length, count: list.length }
}
