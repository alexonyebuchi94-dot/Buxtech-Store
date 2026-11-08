import { useState } from 'react'
import { Link } from 'react-router-dom'
export default function AnnouncementBar() {
  const [show, setShow] = useState(true)
  if (!show) return null
  return (
    <div className="bg-cyan text-[#0A0E14] text-xs sm:text-sm text-center px-8 py-2 relative">
      <span className="font-semibold">Free delivery on orders over ₦150,000</span> · Use <span className="font-mono-price font-bold">BUX10</span> for 10% off · <Link to="/home#flash-sale" className="underline font-semibold">Shop the flash sale</Link>
      <button onClick={() => setShow(false)} aria-label="Dismiss" className="absolute right-3 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100">✕</button>
    </div>
  )
}
