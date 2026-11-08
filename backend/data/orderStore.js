import Order from '../models/Order.js'
import { isDBConnected } from '../lib/db.js'

// Works two ways:
//  - MONGODB_URI set + connected -> orders persist permanently in MongoDB Atlas.
//  - not set -> falls back to an in-memory store so the site still works
//    end to end without setup, but ALL orders are lost whenever the
//    server restarts. Add MONGODB_URI in Render to switch this on.

const memOrders = new Map()

const STATUS_NOTES = {
  pending: 'Awaiting payment',
  'pay-on-delivery': 'Order placed — pay on delivery',
  paid: 'Payment confirmed',
  shipped: 'Order shipped',
  delivered: 'Order delivered',
  cancelled: 'Order cancelled',
  failed: 'Payment failed',
}

export async function createOrder(order) {
  const withHistory = {
    ...order,
    seen: false,
    history: [{ status: order.status, at: order.createdAt, note: 'Order placed' }],
  }
  if (isDBConnected()) {
    const created = await Order.create(withHistory)
    return created.toObject()
  }
  memOrders.set(order.id, withHistory)
  return withHistory
}

export async function getOrder(id) {
  if (isDBConnected()) return Order.findOne({ id }).lean()
  return memOrders.get(id) || null
}

export async function getAllOrders() {
  if (isDBConnected()) {
    const all = await Order.find().lean()
    return all.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
  }
  return [...memOrders.values()].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )
}

export async function getOrdersByEmail(email) {
  const lower = email.toLowerCase().trim()
  const all = await getAllOrders()
  return all.filter((o) => o.customer?.email?.toLowerCase() === lower)
}

export async function updateOrderStatus(id, status) {
  const entry = { status, at: new Date().toISOString(), note: STATUS_NOTES[status] || status }
  if (isDBConnected()) {
    const order = await Order.findOneAndUpdate(
      { id },
      { $set: { status }, $push: { history: entry } },
      { new: true }
    ).lean()
    return order
  }
  const order = memOrders.get(id)
  if (!order) return null
  order.status = status
  order.history = [...(order.history || []), entry]
  return order
}

export async function markOrderSeen(id, seen = true) {
  if (isDBConnected()) {
    return Order.findOneAndUpdate({ id }, { $set: { seen } }, { new: true }).lean()
  }
  const order = memOrders.get(id)
  if (!order) return null
  order.seen = seen
  return order
}

export async function findOrderByReference(reference) {
  if (isDBConnected()) return Order.findOne({ paystackReference: reference }).lean()
  return [...memOrders.values()].find((o) => o.paystackReference === reference) || null
}

export async function setOrderReference(id, reference) {
  if (isDBConnected()) {
    return Order.findOneAndUpdate({ id }, { $set: { paystackReference: reference } }, { new: true }).lean()
  }
  const order = memOrders.get(id)
  if (!order) return null
  order.paystackReference = reference
  return order
}
