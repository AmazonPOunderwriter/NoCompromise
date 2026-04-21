# NoCompromise Market

> The strictest food standard online. A production-ready MVP for a curated ecommerce marketplace where every product must pass a rigorous ingredient compliance review.

## What this is

A full-stack Next.js 15 application built for a trust-driven health marketplace. The defining feature is the **compliance engine** — a rule-based screening system that evaluates every product's ingredient list against banned and caution lists before it can be published.

**Core promise enforced in code:** only products with `status = APPROVED` ever appear on the storefront. This is enforced at the query layer (`/src/server/products/queries.ts`), not at the UI layer, so accidental leaks are impossible.

## Tech stack

- **Next.js 15** (App Router, Server Components, Server Actions)
- **TypeScript** throughout
- **Tailwind CSS** + **shadcn/ui patterns** + **Framer Motion**
- **PostgreSQL** + **Prisma ORM**
- **NextAuth v5 (Auth.js)** — credentials + Google
- **Stripe Checkout + Billing** — one-time + recurring subscriptions
- **UploadThing** — image uploads
- **MDX** for journal articles

## Features implemented

### Storefront
- Premium homepage with hero, categories, standard explainer, featured products, membership teaser, staff picks, trust grid
- Shop page with category, brand, badge, and search filters
- Product detail pages with ingredient transparency, "why it passed" callout, "what we banned" comparison, trust badges, autoship options
- Category and brand landing pages
- Standard page listing every banned and caution ingredient
- Membership page with monthly/annual plans
- Journal index and article pages
- About, FAQ, Contact pages

### Cart + Checkout
- Guest cart (cookie-session) + authenticated user cart
- Automatic guest-to-user cart merging on sign-in
- Stripe Checkout integration — one-time payments
- Stripe Subscriptions — membership + product autoship
- Webhook handler for order fulfillment + subscription lifecycle
- Free shipping threshold ($75)

### Admin dashboard
- Compliance review queue with automated verdicts
- Product CRUD with ingredient scanning
- Brand, category, badge management
- Order management
- Customer management
- Membership plan management
- Journal article editor

### Compliance engine
- `evaluateCompliance(ingredientText)` — pure function, fully testable
- 15+ banned ingredients (seed oils, artificial flavors/colors, HFCS, preservatives)
- 8+ caution ingredients (natural flavors, gums, maltodextrin, etc.)
- Three-state verdict: PASS / FAIL / NEEDS_REVIEW
- Manual override by human reviewers

### Auth
- Email/password with bcrypt
- Google OAuth
- Role-based access: CUSTOMER / REVIEWER / ADMIN
- Session management via JWT

## Getting started

### Prerequisites
- Node.js 20+
- PostgreSQL 14+ (or Neon / Supabase / Railway)
- Stripe account (test mode is fine)

### Local setup

```bash
# 1. Install dependencies
npm install

# 2. Copy environment template
cp .env.example .env
# Edit .env — fill in DATABASE_URL and AUTH_SECRET at minimum

# 3. Generate Prisma client and push schema
npx prisma generate
npx prisma db push

# 4. Seed the database
npm run db:seed

# 5. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Default accounts after seeding

| Email | Password | Role |
|---|---|---|
| `admin@nocompromise.com` | `admin123` | ADMIN |
| `customer1@example.com` ... `customer10@example.com` | `user12345` | CUSTOMER |

Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

### Stripe webhooks (local)

For testing subscription lifecycle locally:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

Copy the `whsec_...` signing secret into `STRIPE_WEBHOOK_SECRET`.

## Deployment

### Vercel + Neon (recommended)

1. Create a Neon Postgres database, copy the connection string
2. Push this repo to GitHub
3. Import to Vercel
4. Add all environment variables from `.env.example`
5. Vercel will run `prisma generate && next build` automatically
6. After first deploy, run migrations: `npx prisma db push` locally against production DB
7. Optionally seed production: `DATABASE_URL=<prod-url> npm run db:seed`

### Stripe production

1. Create products + prices in Stripe dashboard for each membership plan
2. Update `SubscriptionPlan.stripePriceId` for each plan in DB
3. Set webhook endpoint in Stripe: `https://yourdomain.com/api/stripe/webhook`
4. Subscribe to events: `checkout.session.completed`, `customer.subscription.*`

## Architecture notes

### Why server components by default
Product pages render fast, are SEO-friendly, and don't ship unused JavaScript. Client components only exist where interaction is required (cart controls, admin forms, filter UI).

### Why `publicWhere()` everywhere
Every storefront query goes through helpers in `/src/server/products/queries.ts` that enforce `status: APPROVED` + `publishedAt <= now`. Storefront components cannot call `prisma.product` directly — this makes it impossible to accidentally display a draft or rejected product.

### Why the compliance engine is a pure function
`evaluateCompliance()` takes a string, returns a verdict. No side effects, no DB calls. This means:
- It runs identically in admin UI previews, seed scripts, and batch reprocessing jobs
- It's trivially testable — `expect(evaluate("canola oil, salt").result).toBe("FAIL")`
- Rule updates are a single-file change in `/src/server/compliance/rules.ts`

### Why cart lives in DB (not localStorage)
Guests get a cookie-based session ID, authenticated users get a `userId`-linked cart. On login, the guest cart merges into the user's. This means: cart survives device switches, works with SSR, and is recoverable.

### Folder structure conventions

```
src/
├── app/              # routes only — thin
├── components/       # presentational + small client state
├── lib/              # infrastructure (prisma, stripe, auth clients)
└── server/           # business logic — this is where the brains live
    ├── compliance/   # engine + rules
    ├── products/     # query helpers enforcing visibility
    ├── cart/         # cart operations
    ├── orders/       # checkout + fulfillment
    └── admin/        # admin-only server actions
```

Rule: if it touches money, data integrity, or compliance, it lives in `/server` — not in a component or a route handler.

## What's scaffolded but needs keys

- **Stripe checkout** — fully wired; needs `STRIPE_SECRET_KEY` + webhook secret to actually charge
- **Google OAuth** — scaffolded; needs `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET`
- **UploadThing** — scaffolded; needs API keys for production uploads (seed uses hotlinked Unsplash URLs for demo)

## What to build next (post-MVP)

These are scaffolded in the schema but would need UI completion:
- Wishlist (model exists, pages not built)
- Product reviews (model exists, submission UI stub)
- Referral codes (field exists on `CustomerProfile`)
- Product bundles / starter packs (can layer on `RelatedProduct`)
- Multi-image upload UI in admin (UploadThing routes stubbed)
- Full-text search (currently uses Postgres `contains` — swap to Meilisearch or Postgres full-text for production)

## License

Proprietary — this is a commercial application scaffold.

---

**Built with no compromise.**
