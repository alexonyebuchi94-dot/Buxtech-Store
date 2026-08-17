# BuxTech — Full Build

Everything from your build-out list, minus the custom domain (that's a
purchase + DNS step, not code — see checklist at the bottom).

## What's in here

```
backend/
  db/schema.sql          → run once against Postgres to create all tables
  db/pool.js              → Postgres connection
  config/cloudinary.js    → image hosting config
  middleware/auth.js      → JWT auth + admin guard
  routes/
    auth.js               → register, login, logout
    products.js           → list, detail, search
    cart.js                → server-side price/stock validation
    orders.js              → create order, view order, order history
    paystack.js            → payment init + webhook (card/transfer/USSD)
    admin.js                → dashboard, product CRUD, order status, users
    reviews.js               → star ratings + comments
    upload.js                 → Cloudinary image upload (admin only)
    contact.js                 → contact form → email to buxtech27@gmail.com
  services/email.js            → order confirmed/shipped/delivered emails (Resend)
  server.js                     → wires everything together
  .env.example                   → copy to .env and fill in your keys
  package.json

frontend/
  components/
    Header.jsx              → search, categories dropdown, cart badge, account
    HomepageSections.jsx    → hero banner, trust badges, category blocks,
                               "why shop with us", featured products
    Footer.jsx               → links, address, socials
  pages/
    ProductDetail.jsx        → gallery, specs, add to cart, reviews
    Cart.jsx                  → qty update, remove, total
    Checkout.jsx                → 3-step: address → payment → summary
    OrderConfirmation.jsx        → "Order BUXxxxxx placed" + tracking link
    Admin/Dashboard.jsx           → revenue, orders, low-stock alerts, chart
    Admin/Products.jsx             → add/edit/delete products + image upload
    Admin/Orders.jsx                 → filter by status, update status
    legal/About.md, Returns.md,
          Privacy.md, Terms.md, FAQ.md
    legal/Contact.jsx                 → contact form
  public-robots.txt                    → SEO robots file
  sitemap-template.xml                  → starter sitemap
```

## Setup order

1. **Database** — create a Postgres instance on Render, run `schema.sql` against it.
2. **Backend** — `cd backend`, `npm install`, copy `.env.example` to `.env`
   and fill in real keys (Cloudinary, Paystack, Resend, JWT secret), then
   `npm start`. Deploy to Render.
3. **Paystack webhook** — in your Paystack dashboard, set the webhook URL to
   `https://your-render-url.onrender.com/api/paystack/webhook`.
4. **Frontend** — drop these components/pages into your existing React app's
   routing (React Router or Next.js pages), wire up API calls to your
   deployed backend URL, deploy to Vercel.
5. Make your first admin user manually: register normally, then run
   `UPDATE users SET is_admin = TRUE WHERE email = 'you@email.com';` in
   Postgres.

## Not code — do these yourself when ready

- **Custom domain** (skipped per your request) — buy `buxtech.com.ng`,
  point DNS to Vercel/Render.
- **Google Analytics + Search Console** — create accounts, drop the
  tracking snippet in your frontend's root layout.
- **Google Business Profile** — register "Buxtech Lagos" directly on Google.
- **Blog posts** for SEO traffic (e.g. "Best 50k Blender 2026") — write these
  as regular pages once the store is live; happy to draft copy for these
  whenever you want.
