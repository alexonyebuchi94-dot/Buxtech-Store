import { Routes, Route } from 'react-router-dom'
import StoreLayout from './components/StoreLayout.jsx'
import AdminLayout from './components/AdminLayout.jsx'
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
    <Routes>
      {/* Storefront — Navbar, Footer, cart, etc. */}
      <Route element={<StoreLayout />}>
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
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/returns-policy" element={<ReturnsPolicy />} />
        <Route path="/terms" element={<TermsConditions />} />
        <Route path="/warranty" element={<Warranty />} />
      </Route>

      {/* Admin — separate layout, no link back into the storefront */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/products" element={<AdminProducts />} />
      </Route>
    </Routes>
  )
}
