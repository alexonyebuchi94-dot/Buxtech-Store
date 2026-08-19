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

## Customer accounts (signup, login, Google Sign-In)

Customers can now create an account with email/password, or sign in with
Google. This needs two things set up:

**1. MongoDB Atlas (so accounts, orders, and products persist)**
- Create a free cluster at https://www.mongodb.com/atlas — the free tier is enough
- Database Access → add a database user with a password
- Network Access → allow access from anywhere (`0.0.0.0/0`) so Render can connect
- Get your connection string (Connect → Drivers) and put it in `backend/.env` as `MONGODB_URI`
- If `MONGODB_URI` is left unset, signup/login still work for local testing, but
  accounts, orders, and products are stored in memory and disappear whenever the server restarts —
  don't ship to real customers without this set.

**2. JWT secret (signs customer login sessions)**
- Generate a random string: `openssl rand -base64 32`
- Put it in `backend/.env` as `JWT_SECRET`

**3. Google Sign-In**
- Go to https://console.cloud.google.com/apis/credentials
- Create a project (or use an existing one) → **Create Credentials → OAuth client ID**
- Application type: **Web application**
- Under **Authorized JavaScript origins**, add both:
  - `http://localhost:5173` (local dev)
  - your live Vercel URL (e.g. `https://buxtech-store.vercel.app`)
- Copy the generated **Client ID** and put it in:
  - `backend/.env` as `GOOGLE_CLIENT_ID`
  - `frontend/.env` as `VITE_GOOGLE_CLIENT_ID`
- Until this is set, the Google button on the Login/Signup pages will show
  an error when clicked — email/password signup works either way.

## SEO

- Every main page (`Home`, `Shop`, `About`, `Contact`, product pages) sets its
  own title, meta description, and Open Graph/Twitter tags via the `<SEO />`
  component in `frontend/src/components/SEO.jsx`.
- Product pages also output `Product` structured data (JSON-LD) so search
  engines can show price/availability/brand directly in results.
- Each product now has a **Keywords** field (set from the admin panel) —
  it feeds that product's meta keywords tag and is also searchable from
  the Shop page's search bar.
- `frontend/public/sitemap.xml` and `robots.txt` are already in place;
  update the sitemap if you add new static pages. Product pages aren't
  in the sitemap automatically since they're dynamic — for real SEO
  benefit, consider generating it server-side once you have a fixed
  product catalog and domain.

## Deploying

**Backend → Render**
1. Push this repo to GitHub
2. New Web Service on Render, point it at `/backend`
3. Build command: `npm install` — Start command: `npm start`
4. Add environment variables: `PAYSTACK_SECRET_KEY`, `FRONTEND_URL` (your Vercel URL once you have it), `PORT` (Render sets this automatically, safe to leave out), `MONGODB_URI`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`

**Frontend → Vercel**
1. New Project on Vercel, point it at `/frontend`
2. Framework preset: Vite
3. Add environment variable: `VITE_API_BASE_URL` = your Render backend URL, plus `VITE_GOOGLE_CLIENT_ID`
4. Deploy

Once both are live, update `FRONTEND_URL` on Render to match your real
Vercel domain so Paystack redirects customers back to the right place.

## Where to go next

- **Real inventory**: replace the placeholder items (added via Admin → Manage Products)
  with your actual stock, images, and prices — once MongoDB is connected, edits here
  are permanent.
- **Real product photos**: the starter catalog uses placeholder Unsplash photos —
  swap in your own product photography via the admin panel's photo uploader.

## Saved vs. backed up — these are different things

Everything (accounts, orders, products, reviews) now **saves permanently** to
MongoDB Atlas instead of disappearing on server restart. That solves data loss
from restarts/redeploys.

It does **not** protect you from: accidentally deleting something yourself,
a bug wiping data, or MongoDB's servers having an outage. That protection is
called a **backup** — a separate copy of your data you could restore from.

MongoDB Atlas's **free tier (M0) does not include automatic backups.** If you
want real backup coverage, you have two options:

1. **Upgrade to an Atlas paid tier** (M10+, roughly $9+/month) — turns on
   Atlas's built-in continuous backups automatically, no extra setup.
2. **Manual exports on the free tier** — periodically run `mongodump` (or use
   Atlas's "Export" tool in the dashboard) to download a copy of your database
   to your own computer or cloud storage. This is free, but only as current as
   your last manual export — nothing automatic.

For a small store just starting out, manual exports every so often are a
reasonable middle ground. Once you're taking real, high-volume orders,
upgrading for automatic backups is worth the cost.
