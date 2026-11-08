import { useMemo, useState } from 'react'
import { products } from '../data/products.js'
import { useStore } from '../context/StoreContext.jsx'
import HomeSlider from '../components/HomeSlider.jsx'
import FlashSale from '../components/FlashSale.jsx'
import ProductRail from '../components/ProductRail.jsx'
import Newsletter from '../components/Newsletter.jsx'
import QuickView from '../components/QuickView.jsx'
import TrustBadges from '../components/TrustBadges.jsx'
import SEO from '../components/SEO.jsx'

// Store home ("/home")
export default function StoreHome() {
  const { recent, wishlist } = useStore()
  const [qv, setQv] = useState(null)

  const newest = useMemo(() => [...products].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 8), [])
  const newIds = new Set(newest.map((p) => p.id))
  const recommended = useMemo(() => [...products].filter((p) => !newIds.has(p.id)).sort((a, b) => b.rating * 10 + b.popularity / 10 - (a.rating * 10 + a.popularity / 10)).slice(0, 4), []) // eslint-disable-line react-hooks/exhaustive-deps
  const recentItems = recent.map((id) => products.find((p) => p.id === id)).filter(Boolean).slice(0, 4)
  const alsoLike = useMemo(() => {
    const seedIds = [...recent, ...wishlist]
    const cats = new Set(seedIds.map((id) => products.find((p) => p.id === id)?.category).filter(Boolean))
    const pool = products.filter((p) => !seedIds.includes(p.id) && p.stock > 0 && (cats.size ? cats.has(p.category) : true))
    return [...pool].sort(() => Math.random() - 0.5).slice(0, 4)
  }, [recent, wishlist])

  return (
    <>
      <SEO title="Store Home — BuxTech" description="New arrivals, flash sale and recommended tech at BuxTech — laptops, desktops, gadgets and gaming gear in Nigeria." path="/home" />
      <HomeSlider />
      <FlashSale onQuickView={setQv} />
      <ProductRail title="NEW ARRIVALS" items={newest} link="/shop" onQuickView={setQv} />
      <ProductRail title="RECOMMENDED FOR YOU" items={recommended} link="/shop" onQuickView={setQv} />
      <ProductRail title="RECENTLY VIEWED" items={recentItems} onQuickView={setQv} />
      <ProductRail title="YOU MAY ALSO LIKE" items={alsoLike} link="/shop" onQuickView={setQv} />
      <section className="max-w-[90rem] mx-auto px-4 sm:px-6 py-8"><TrustBadges /></section>
      <Newsletter />
      {qv && <QuickView product={qv} onClose={() => setQv(null)} />}
    </>
  )
}
