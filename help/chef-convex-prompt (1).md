# Chef Convex Prompt: RayaanXplorAE E‑Commerce Site

Build a production-ready ecommerce site named **RayaanXplorAE** using Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + Convex, with Stripe Checkout and secure downloads.

## Pages
- Home, Products, Product Detail, Cart, Success (downloads), About, Contact, Admin (products/orders).

## Data (Convex)
- products, carts, orders, downloads, users (see fields in the conversation brief).

## Features
- Search/filter products, cart qty controls, Stripe Checkout.
- Webhook `/api/webhooks/stripe`: verify signature, create order, generate download tokens (72h), clear cart.
- Token route `/downloads/[token]` for secure delivery.

## UI
- Tailwind + shadcn/ui; use the color scheme from `chef-convex-color-scheme.md`; a11y + responsive.

## Env
STRIPE_SECRET_KEY, STRIPE_PUBLISHABLE_KEY, STRIPE_WEBHOOK_SECRET, SITE_URL, NEXTAUTH_SECRET/URL (if using NextAuth).

## Seed
Create 3 sample products and a promoted admin user.
