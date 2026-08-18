import { Outlet } from 'react-router-dom'
import Navbar from './Navbar.jsx'
import Footer from './Footer.jsx'
import LiveActivityToast from './LiveActivityToast.jsx'

export default function StoreLayout() {
  return (
    <div className="min-h-screen flex flex-col bg-base">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <LiveActivityToast />
    </div>
  )
}
