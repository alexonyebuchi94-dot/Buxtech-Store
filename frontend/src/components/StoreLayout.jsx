import { Outlet, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import LiveActivityToast from './LiveActivityToast.jsx'
import AnnouncementBar from './AnnouncementBar.jsx'
import CompareBar from './CompareBar.jsx'
import AbandonedCartReminder from './AbandonedCartReminder.jsx'
import Loader from './Loader.jsx'
import ChatLauncher from './ChatLauncher.jsx'

function ScrollManager() {
  const { pathname, hash } = useLocation()
  useEffect(() => {
    if (hash) {
      const el = document.getElementById(hash.slice(1))
      if (el) { el.scrollIntoView({ behavior: 'smooth' }); return }
    }
    window.scrollTo(0, 0)
  }, [pathname, hash])
  return null
}

export default function StoreLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-base">
      <Loader />
      <ScrollManager />
      <AnnouncementBar />
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <LiveActivityToast />
      <CompareBar />
      <AbandonedCartReminder />
      <ChatLauncher />
    </div>
  )
}
