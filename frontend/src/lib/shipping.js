// Delivery pricing by state (distance proxy) + weight surcharge. Same rules the
// original checkout used — moved here so Cart and Checkout share them.
export const NIGERIAN_STATES = [
  'Lagos', 'Abuja (FCT)', 'Ogun', 'Oyo', 'Rivers', 'Kano', 'Kaduna', 'Enugu',
  'Delta', 'Edo', 'Anambra', 'Imo', 'Abia', 'Akwa Ibom', 'Cross River',
  'Osun', 'Ondo', 'Ekiti', 'Kwara', 'Plateau', 'Benue', 'Niger', 'Katsina',
  'Bauchi', 'Borno', 'Sokoto', 'Kebbi', 'Zamfara', 'Jigawa', 'Yobe',
  'Adamawa', 'Taraba', 'Gombe', 'Nasarawa', 'Kogi', 'Bayelsa', 'Ebonyi',
]
export const FREE_WEIGHT_KG = 2
export const PER_KG_FEE = 400
export const HEAVY_ORDER_KG = 15
export const FREE_SHIPPING_OVER = 150000

export function getBaseFee(state) {
  if (!state) return 3000
  if (state === 'Lagos') return 1800
  if (['Ogun', 'Oyo', 'Abuja (FCT)'].includes(state)) return 3000
  return 4500
}
export function getDeliveryFee(state, weightKg = 0, subtotal = 0, freeShip = false) {
  if (freeShip || subtotal >= FREE_SHIPPING_OVER) return 0
  const extra = Math.max(0, weightKg - FREE_WEIGHT_KG)
  return getBaseFee(state) + Math.ceil(extra) * PER_KG_FEE
}
export function deliveryDays(state) {
  if (state === 'Lagos') return [1, 2]
  if (['Ogun', 'Oyo', 'Abuja (FCT)'].includes(state)) return [2, 3]
  return [3, 5]
}
export function deliveryEstimate(state = 'Lagos') {
  const [a, b] = deliveryDays(state)
  const f = (d) => {
    const x = new Date(); let n = d
    while (n > 0) { x.setDate(x.getDate() + 1); if (x.getDay() !== 0) n-- }
    return x.toLocaleDateString('en-NG', { weekday: 'short', day: 'numeric', month: 'short' })
  }
  return `${f(a)} – ${f(b)}`
}
