import { createContext, useContext, useState, useMemo, useEffect } from 'react'

const CartContext = createContext(null)
const KEY = 'bx_cart'

// Promo codes — edit freely. type: percent | fixed | freeship
export const PROMOS = {
  BUX10: { type: 'percent', value: 10, label: '10% off your order' },
  WELCOME5: { type: 'percent', value: 5, label: '5% welcome discount' },
  SAVE5000: { type: 'fixed', value: 5000, label: '₦5,000 off' },
  FREESHIP: { type: 'freeship', value: 0, label: 'Free delivery' },
}

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY))?.items || [] } catch { return [] }
  })
  const [promo, setPromo] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY))?.promo || null } catch { return null }
  })
  const [shipState, setShipState] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY))?.shipState || '' } catch { return '' }
  })
  const [updatedAt, setUpdatedAt] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY))?.updatedAt || null } catch { return null }
  })

  // Persist so the cart survives refresh (also powers the abandoned-cart reminder).
  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify({ items, promo, shipState, updatedAt }))
    } catch { /* storage unavailable */ }
  }, [items, promo, shipState, updatedAt])

  const touch = () => setUpdatedAt(Date.now())

  function addToCart(product, qty = 1, variant = null) {
    touch()
    setItems((prev) => {
      const key = `${product.id}-${variant ?? 'default'}`
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) => (i.key === key ? { ...i, qty: i.qty + qty } : i))
      }
      return [
        ...prev,
        {
          key, id: product.id, name: product.name, price: product.price,
          image: product.images?.[0] || product.image,
          weight: product.weight ?? null, variant, qty,
        },
      ]
    })
  }

  function updateQty(key, qty) {
    if (qty <= 0) { removeFromCart(key); return }
    touch()
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty } : i)))
  }

  function removeFromCart(key) {
    touch()
    setItems((prev) => prev.filter((i) => i.key !== key))
  }

  function clearCart() {
    setItems([]); setPromo(null); setUpdatedAt(null)
  }

  function applyPromo(raw) {
    const code = String(raw || '').trim().toUpperCase()
    if (!code) return { ok: false, msg: 'Enter a promo code' }
    const p = PROMOS[code]
    if (!p) return { ok: false, msg: 'That code isn’t valid' }
    setPromo({ code, ...p })
    return { ok: true, msg: `${code} applied — ${p.label}` }
  }
  const removePromo = () => setPromo(null)

  const subtotal = useMemo(() => items.reduce((s, i) => s + i.price * i.qty, 0), [items])
  const itemCount = useMemo(() => items.reduce((s, i) => s + i.qty, 0), [items])
  const totalWeight = useMemo(() => items.reduce((s, i) => s + (i.weight || 0) * i.qty, 0), [items])
  const discount = useMemo(() => {
    if (!promo) return 0
    if (promo.type === 'percent') return Math.round((subtotal * promo.value) / 100)
    if (promo.type === 'fixed') return Math.min(promo.value, subtotal)
    return 0
  }, [promo, subtotal])
  const freeShip = promo?.type === 'freeship'

  return (
    <CartContext.Provider
      value={{
        items, addToCart, updateQty, removeFromCart, clearCart, subtotal, itemCount, totalWeight,
        promo, applyPromo, removePromo, discount, freeShip, shipState, setShipState, updatedAt,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used within CartProvider')
  return ctx
}
