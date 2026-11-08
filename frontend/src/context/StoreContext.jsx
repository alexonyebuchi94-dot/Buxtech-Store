import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const StoreContext = createContext(null)

function usePersisted(key, initial) {
  const [value, setValue] = useState(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initial
    } catch { return initial }
  })
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(value)) } catch { /* storage unavailable */ }
  }, [key, value])
  return [value, setValue]
}

export const POINTS_PER_NAIRA = 1 / 1000 // 1 point per ₦1,000 spent
export const NAIRA_PER_POINT = 10 // each point is worth ₦10 off

export function StoreProvider({ children }) {
  const [wishlist, setWishlist] = usePersisted('bx_wishlist', [])
  const [compare, setCompare] = usePersisted('bx_compare', [])
  const [recent, setRecent] = usePersisted('bx_recent', [])
  const [theme, setTheme] = usePersisted('bx_theme', 'dark')
  const [points, setPoints] = usePersisted('bx_points', 0)
  const [addresses, setAddresses] = usePersisted('bx_addresses', [])
  const [subscribed, setSubscribed] = usePersisted('bx_newsletter', null)
  const [toast, setToast] = useState(null)

  useEffect(() => { document.documentElement.dataset.theme = theme }, [theme])

  const notify = useCallback((msg) => {
    setToast({ msg, id: Date.now() })
  }, [])
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 2200)
    return () => clearTimeout(t)
  }, [toast])

  const toggleWishlist = (id) => {
    setWishlist((w) => {
      const has = w.includes(id)
      notify(has ? 'Removed from wishlist' : 'Saved to wishlist ♥')
      return has ? w.filter((x) => x !== id) : [id, ...w]
    })
  }
  const toggleCompare = (id) => {
    setCompare((c) => {
      if (c.includes(id)) return c.filter((x) => x !== id)
      if (c.length >= 4) { notify('You can compare up to 4 products'); return c }
      return [...c, id]
    })
  }
  const clearCompare = () => setCompare([])
  const pushRecent = useCallback((id) => {
    setRecent((r) => [id, ...r.filter((x) => x !== id)].slice(0, 12))
  }, [setRecent])
  const addPoints = (n) => setPoints((p) => p + Math.max(0, Math.floor(n)))
  const spendPoints = (n) => setPoints((p) => Math.max(0, p - Math.floor(n)))
  const saveAddress = (addr) =>
    setAddresses((list) => {
      const key = `${addr.address}|${addr.city}|${addr.state}`.toLowerCase()
      if (list.some((a) => `${a.address}|${a.city}|${a.state}`.toLowerCase() === key)) return list
      return [{ ...addr, id: String(Date.now()) }, ...list].slice(0, 8)
    })
  const removeAddress = (id) => setAddresses((l) => l.filter((a) => a.id !== id))

  return (
    <StoreContext.Provider
      value={{
        wishlist, toggleWishlist, compare, toggleCompare, clearCompare,
        recent, pushRecent, theme, setTheme, points, addPoints, spendPoints,
        addresses, saveAddress, removeAddress, subscribed, setSubscribed, notify,
      }}
    >
      {children}
      {toast && (
        <div key={toast.id} className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[90] bg-surface border border-cyan/40 text-ink text-sm rounded-full px-5 py-2.5 shadow-glow reveal-up">
          {toast.msg}
        </div>
      )}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
