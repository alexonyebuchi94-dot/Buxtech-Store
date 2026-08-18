// In-memory order store. Fine for getting the flow working end to end —
// replace with a real database (Postgres/Mongo) before taking real orders,
// since this resets every time the server restarts.

const orders = new Map()

export function createOrder(order) {
  orders.set(order.id, order)
  return order
}

export function getOrder(id) {
  return orders.get(id)
}

export function getAllOrders() {
  return [...orders.values()].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  )
}

export function getOrdersByEmail(email) {
  return getAllOrders().filter(
    (o) => o.customer.email.toLowerCase() === email.toLowerCase()
  )
}

export function updateOrderStatus(id, status) {
  const order = orders.get(id)
  if (!order) return null
  order.status = status
  return order
}

export function findOrderByReference(reference) {
  return [...orders.values()].find((o) => o.paystackReference === reference)
}

export function setOrderReference(id, reference) {
  const order = orders.get(id)
  if (!order) return null
  order.paystackReference = reference
  return order
}
