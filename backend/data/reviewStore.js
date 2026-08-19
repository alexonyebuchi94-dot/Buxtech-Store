import { nanoid } from 'nanoid'
import Review from '../models/Review.js'
import { isDBConnected } from '../lib/db.js'

// Works two ways:
//  - MONGODB_URI set + connected -> reviews persist permanently in MongoDB Atlas.
//  - not set -> falls back to an in-memory store (resets on server restart).

const memReviews = new Map() // productId -> array of reviews

export async function getReviews(productId) {
  if (isDBConnected()) {
    const list = await Review.find({ productId }).sort({ createdAt: -1 }).lean()
    return list
  }
  return memReviews.get(productId) || []
}

export async function addReview(productId, { name, rating, comment }) {
  const review = {
    id: nanoid(8),
    productId,
    name,
    rating: Number(rating),
    comment,
    createdAt: new Date().toISOString(),
  }
  if (isDBConnected()) {
    const created = await Review.create(review)
    return created.toObject()
  }
  const existing = memReviews.get(productId) || []
  memReviews.set(productId, [review, ...existing])
  return review
}

export async function getAverageRating(productId) {
  const list = await getReviews(productId)
  if (list.length === 0) return null
  const sum = list.reduce((acc, r) => acc + r.rating, 0)
  return { average: sum / list.length, count: list.length }
}
