export const FAQS = [
  { q: 'How long does delivery take?', a: 'Lagos orders arrive in 1–2 business days, Ogun, Oyo and Abuja in 2–3 days, and other states in 3–5 days. Orders over ₦150,000 ship free.', k: ['delivery', 'deliver', 'arrive', 'shipping', 'how long', 'days', 'ship'] },
  { q: 'How much is delivery?', a: 'Delivery starts from ₦1,800 in Lagos, ₦3,000 for Ogun, Oyo and Abuja, and ₦4,500 elsewhere, plus a small weight charge on heavy items. Use the shipping calculator in your cart for the exact fee.', k: ['delivery fee', 'shipping fee', 'cost', 'price of delivery', 'delivery cost', 'how much'] },
  { q: 'How do I pay?', a: 'Pay securely with Paystack by card, bank transfer or USSD. We also offer pay on delivery on eligible orders.', k: ['pay', 'payment', 'paystack', 'card', 'transfer', 'ussd', 'cash'] },
  { q: 'How can I track my order?', a: 'Open the Orders page and enter your Order ID — no login needed. You can also see every update in your account order history.', k: ['track', 'tracking', 'where is my order', 'order status', 'status'] },
  { q: 'Can I cancel my order?', a: 'Yes, you can cancel from the Orders page any time before it ships. If you already paid, the refund goes back to your original payment method.', k: ['cancel', 'cancellation', 'cancel order'] },
  { q: 'What is your return policy?', a: 'You can request a return within 7 days of delivery for faulty, damaged or wrong items. Items must be unused with original packaging. Start from the Orders page → Return Request.', k: ['return', 'refund', 'exchange', 'wrong item', 'damaged', 'faulty', 'money back'] },
  { q: 'Do products come with a warranty?', a: 'Every product carries a 12-month warranty against manufacturing defects. Keep your order confirmation as proof of purchase.', k: ['warranty', 'guarantee', 'defect', 'repair'] },
  { q: 'Are your products genuine?', a: 'Yes. We only sell genuine, factory-sealed products and test them before dispatch.', k: ['original', 'genuine', 'fake', 'authentic', 'sealed'] },
  { q: 'How do promo codes and loyalty points work?', a: 'Enter a promo code in your cart (for example BUX10). You also earn 1 loyalty point per ₦1,000 spent, and each point is worth ₦10 off at checkout.', k: ['promo', 'code', 'discount', 'coupon', 'points', 'loyalty', 'reward', 'voucher'] },
  { q: 'Do I need an account to order?', a: 'No — guest checkout is available. An account lets you save addresses, see order history and earn loyalty points.', k: ['account', 'guest', 'register', 'sign up', 'login', 'log in'] },
  { q: 'How do I know if a part fits my laptop or PC?', a: 'Send us your laptop or motherboard model number on WhatsApp and we will confirm compatibility before you buy.', k: ['compatible', 'compatibility', 'fit', 'fits', 'model', 'ram', 'ssd', 'battery', 'screen'] },
  { q: 'How do I contact a human?', a: 'Type “human” in the chat, or use WhatsApp / call on the Customer Service page.', k: ['human', 'agent', 'person', 'representative', 'call'] },
]

export function answer(text) {
  const t = text.toLowerCase()
  let best = null; let score = 0
  for (const f of FAQS) {
    const s = f.k.reduce((n, k) => n + (t.includes(k) ? k.split(' ').length + 1 : 0), 0)
    if (s > score) { score = s; best = f }
  }
  return score >= 1 ? best : null
}
