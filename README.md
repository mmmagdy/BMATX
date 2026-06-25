# BMatx — Marketplace Portal (UI/UX)

Clean, bilingual (Arabic-RTL default / English) multi-supplier marketplace portal for
building materials. **UI/UX & frontend structure phase only** — mock data, no backend,
no real auth. Amazon-clear, Noon-light, deliberately calmer than both.

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** (CSS-first `@theme`, OKLCH tokens in `app/globals.css`)
- **Framer Motion** for purposeful motion
- Lightweight in-app i18n (`lib/i18n`) + cart (`lib/cart`) via React context + `localStorage`

## Run (local)

```bash
npm install
npm run dev      # http://localhost:3000
```

## Run with Docker

Two Dockerfiles:

- **`Dockerfile`** — self-contained multi-stage build (`npm ci` + `next build` inside the image). Use on a normal network.
- **`Dockerfile.prebuilt`** — packages a locally-built standalone artifact, **zero network at build time**. Use behind TLS-intercepting proxies or air-gapped networks.

### Prebuilt (recommended here — proxy/offline-safe)

```bash
npm install
npm run build                                  # next.config has output:"standalone"
docker build -f Dockerfile.prebuilt -t bmatx-portal .
docker run -d --name bmatx-portal -p 3200:3000 bmatx-portal
# → http://localhost:3200
```

### Self-contained (normal network)

```bash
docker build -t bmatx-portal .
docker run -d --name bmatx-portal -p 3200:3000 bmatx-portal
```

### Compose

```bash
npm run build        # required for the default (prebuilt) compose path
docker compose up -d --build      # → http://localhost:3200
```

> Host port **3200** (container listens on 3000) — host 3000 is used by another local stack on this machine. Change the mapping in `docker run -p` / `docker-compose.yml` as needed.

## Screens (all built)

| Route | What |
|---|---|
| `/` | Home — hero + search, categories, featured suppliers, popular products, how-delivery-works, B2B, CTA |
| `/products` | Listing — filters (category · region · supplier · delivery type · price) + sort, desktop rail / mobile drawer |
| `/products/[id]` | Product details — gallery, price, delivery explainer, MOQ, qty, regions, specs |
| `/cart` | Cart — grouped by supplier, single-delivery warnings, live totals + delivery estimate |
| `/checkout` | 4-step flow — address → review → delivery → confirm, with a plain-language delivery-cost breakdown (region · type · qty · grouped/single) + order-placed screen |
| `/register` | Individual & business registration (tabbed); company submit shows the approval-pending message + status badge |
| `/login` | Sign-in card |
| `/account` | Dashboard — overview, addresses (full add/edit/delete/default CRUD), orders, company-account status |
| `/orders` | Order history with statuses + reorder-to-cart |
| `/account/wallet` | Electronic wallet — balance, recharge, transaction history + statuses |

All mock-data, no backend. Cart & language persist in `localStorage`.

### Suppliers · warehouses · delivery · pickup · wallet

- **Warehouses** per supplier (`data/warehouses.ts`); stock, delivery cost & ETA vary by warehouse (`data/logistics.ts`).
- **PDP**: ships-from / warehouse selector (only when >1), per-warehouse stock, address-aware delivery estimate, pickup availability, delivery-rule chips (groupable / separate / fragile / heavy / special / pickup-only…).
- **Cart**: grouped into **shipments** by supplier+warehouse; multi-shipment notice; delivery total.
- **Checkout**: home-delivery **or** pickup; per-shipment delivery breakdown (region · warehouse · qty · grouped/single); pickup location cards; **wallet** payment toggle (used / remaining) + payment method for the remainder.
- **Wallet** (`lib/wallet`): balance, recharge, transaction history (recharge/purchase/refund/adjustment × completed/pending/failed/refunded).
- Currency **SAR**, Saudi regions (kept consistent with the existing app).

## Design system

- Tokens & rationale: see `PRODUCT.md` and `DESIGN.md` at the workspace root (`C:\Work\BMatx\v2`).
- Brand: refined golden-amber primary, pure-white surface, deep-teal accent. All OKLCH.
- Fonts: Tajawal (Arabic) + Inter (Latin numerals).
- Everything RTL-native via CSS logical properties; language toggle in the header.

## Structure

```
app/            routes (home, products, cart, checkout, account, orders, login, register) + layout + globals.css
components/
  ui/           Button, Badge, Price, Rating, QtyStepper, Logo, Field, SegmentedControl, StatusBadge
  layout/       Header, Footer, SearchBar, CategoryNav, MobileMenu, RegionPicker…
  commerce/     ProductCard, ProductGrid, Filters, SortBar, ProductDetails, CartView, CheckoutView
  home/         Hero + home sections
  auth/         LoginView, RegisterView, AuthShell
  account/      AccountView, AddressManager, OrdersList
lib/            i18n, cart, icons, format, cn
data/           mock categories, suppliers, regions, products, account (addresses/orders/company) + types
```
