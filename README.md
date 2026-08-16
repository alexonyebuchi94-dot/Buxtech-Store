# BuxTech

Ecommerce store for kitchen appliances, electronics, and laptop & desktop
gadgets. React + Express, Paystack for payment.

## Structure

```
buxtech/
  frontend/   React (Vite) storefront — deploy to Vercel
  backend/    Express API + Paystack integration — deploy to Render
```

## Local setup

**Backend:**
```
cd backend
npm install
cp .env.example .env      # then fill in PAYSTACK_SECRET_KEY
npm run dev
```
Runs on http://localhost:5000

**Frontend:**
```
cd frontend
npm install
cp .env.example .env      # defaults are fine for local dev
npm run dev
```
Runs on http://localhost:5173

## Paystack setup

1. Create a Paystack account: https://paystack.com
2. Dashboard → Settings → API Keys & Webhooks → copy your **Secret Key**
   (use the test key while building, switch to live key when you're ready
   to take real payments)
3. Put it in `backend/.env` as `PAYSTACK_SECRET_KEY`
4. Test payments use Paystack's test cards: https://paystack.com/docs/payments/test-payments

## Deploying

**Backend → Render**
1. Push this repo to GitHub
2. New Web Service on Render, point it at `/backend`
3. Build command: `npm install` — Start command: `npm start`
4. Add environment variables: `PAYSTACK_SECRET_KEY`, `FRONTEND_URL` (your Vercel URL once you have it), `PORT` (Render sets this automatically, safe to leave out)

**Frontend → Vercel**
1. New Project on Vercel, point it at `/frontend`
2. Framework preset: Vite
3. Add environment variable: `VITE_API_BASE_URL` = your Render backend URL
4. Deploy

Once both are live, update `FRONTEND_URL` on Render to match your real
Vercel domain so Paystack redirects customers back to the right place.

## Where to go next

- **Real inventory**: replace the placeholder items in `frontend/src/data/products.js`
  and `backend/data/products.js` with your actual stock, images, and prices.
- **Real database**: orders currently live in memory on the backend
  (`backend/data/orderStore.js`) and reset on restart — swap in Postgres or
  MongoDB before taking real orders.
- **Product images**: currently pulling placeholder photos from Unsplash —
  swap in real product photography.
- **Admin view**: no admin panel yet for managing orders/stock — worth
  building once you're live.
