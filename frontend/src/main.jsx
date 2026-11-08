import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, HashRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { GoogleOAuthProvider } from '@react-oauth/google'
import App from './App.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { StoreProvider } from './context/StoreContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import './index.css'

// Demo/preview builds are hosted without server rewrites, so they use hash routing.
const Router = import.meta.env.VITE_DEMO === '1' ? HashRouter : BrowserRouter
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || ''

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
        <Router>
          <AuthProvider>
            <StoreProvider>
              <CartProvider>
                <App />
              </CartProvider>
            </StoreProvider>
          </AuthProvider>
        </Router>
      </GoogleOAuthProvider>
    </HelmetProvider>
  </React.StrictMode>,
)

// Register the service worker — this is what makes the browser treat
// the site as installable ("Install App" / "Add to Home Screen").
if ('serviceWorker' in navigator && import.meta.env.VITE_DEMO !== '1') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {})
  })
}
