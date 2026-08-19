import { createContext, useContext, useState, useMemo } from 'react'

const CartContext = createContext(null)

export function CartProvider({ children }) {
  const [items, setItems] = useState([]) // { id, name, price, image, qty, variant }

  function addToCart(product, qty = 1, variant = null) {
    setItems((prev) => {
      const key = `${product.id}-${variant ?? 'default'}`
      const existing = prev.find((i) => i.key === key)
      if (existing) {
        return prev.map((i) =>
          i.key === key ? { ...i, qty: i.qty + qty } : i
        )
      }
      return [
        ...prev,
        {
          key,
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          weight: product.weight ?? null,
          variant,
          qty,
        },
      ]
    })
  }

  function updateQty(key, qty) {
    if (qty <= 0) {
      removeFromCart(key)
      return
    }
    setItems((prev) => prev.map((i) => (i.key === key ? { ...i, qty } : i)))
  }

  function removeFromCart(key) {
    setItems((prev) => prev.filter((i) => i.key !== key))
  }

  function clearCart() {
    setItems([])
  }

  const subtotal = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.qty, 0),
    [items]
  )

  const itemCount = useMemo(
    () => items.reduce((sum, i) => sum + i.qty, 0),
    [items]
  )

  const totalWeight = useMemo(
    () => items.reduce((sum, i) => sum + (i.weight || 0) * i.qty, 0),
    [items]
  )

  return (
    <CartContext.Provider
      value={{ items, addToCart, updateQty, removeFromCart, clearCart, subtotal, itemCount, totalWeight }}
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
