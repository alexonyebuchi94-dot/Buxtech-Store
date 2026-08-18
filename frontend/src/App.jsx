import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Footer from './components/Footer.jsx'
import LiveActivityToast from './components/LiveActivityToast.jsx'
import Home from './pages/Home.jsx'
import Shop from './pages/Shop.jsx'
import ProductPage from './pages/ProductPage.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderConfirmation from './pages/OrderConfirmation.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Account from './pages/Account.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminDashboard from './pages/AdminDashboard.jsx'
import AdminProducts from './pages/AdminProducts.jsx'
import PrivacyPolicy from './pages/legal/PrivacyPolicy.jsx'
import ReturnsPolicy from './pages/legal/ReturnsPolicy.jsx'
import TermsConditions from './pages/legal/TermsConditions.jsx'
import Warranty from './pages/legal/Warranty.jsx'

export default function App() {
  return (
    <div className="min-h-screen flex flex-col bg-base">
      <Navbar />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/order-confirmation" element={<OrderConfirmation />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<Account />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/products" element={<AdminProducts />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/returns-policy" element={<ReturnsPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />
          <Route path="/warranty" element={<Warranty />} />
        </Routes>
      </main>
      <Footer />
      <LiveActivityToast />
    </div>
  )
}
