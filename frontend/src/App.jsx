import { Routes, Route, Navigate } from 'react-router-dom'
import StoreLayout from './components/StoreLayout.jsx'
import AdminLayout from './components/AdminLayout.jsx'
import Home from './pages/Home.jsx'
import StoreHome from './pages/StoreHome.jsx'
import Wishlist from './pages/Wishlist.jsx'
import CustomerService from './pages/CustomerService.jsx'
import FAQ from './pages/FAQ.jsx'
import Reviews from './pages/Reviews.jsx'
import ShippingPolicy from './pages/legal/ShippingPolicy.jsx'
import Shop from './pages/Shop.jsx'
import ProductPage from './pages/ProductPage.jsx'
import Cart from './pages/Cart.jsx'
import Checkout from './pages/Checkout.jsx'
import OrderConfirmation from './pages/OrderConfirmation.jsx'
import About from './pages/About.jsx'
import Login from './pages/Login.jsx'
import Signup from './pages/Signup.jsx'
import Account from './pages/Account.jsx'
import Orders from './pages/Orders.jsx'
import Inbox from './pages/Inbox.jsx'
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
        <Route path="/home" element={<StoreHome />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/customer-service" element={<CustomerService />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/reviews" element={<Reviews />} />
        <Route path="/shipping-policy" element={<ShippingPolicy />} />
        <Route path="/product/:id" element={<ProductPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Navigate to="/customer-service" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<Account />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/inbox" element={<Inbox />} />
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
