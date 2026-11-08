// DEMO=1 builds run without the backend (orders/login/reviews live in the browser).
export const DEMO = import.meta.env.VITE_DEMO === '1'
export const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'
export const WHATSAPP = '2348123590484'
export const PHONE = '+2348123590484'
export const EMAIL = 'buxtech27@gmail.com'
export const VAT_RATE = 0.075
export const naira = (n) => `₦${Math.round(Number(n) || 0).toLocaleString('en-NG')}`
