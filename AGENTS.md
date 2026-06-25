# AGENTS.md

Guidance for AI agents working in the **BMatx portal** codebase. Read this before editing.

## What this is

A clean, bilingual (Arabic-RTL default / English) multi-supplier **marketplace portal** for building materials (B2B + B2C). Amazon-clear, Noon-light, deliberately calmer than both.

**Phase: UI/UX & frontend structure only.** No backend, no real auth, no DB. Everything runs on **mock data** + React context + `localStorage`. Do not add a backend, real authentication, or external API calls unless explicitly asked. Keep the experience simple and uncluttered for non-technical users.

Strategy & visual docs live one level up at the workspace root (`../../PRODUCT.md`, `../../DESIGN.md`). Read `DESIGN.md` before any visual change.

## Stack

- **Next.js 15** (App Router) · **React 19** · **TypeScript** (strict)
- **Tailwind CSS v4** — CSS-first `@theme` in `app/globals.css`, OKLCH tokens. **No `tailwind.config.js`.** No shadcn/ui (Tailwind-only, hand-built primitives in `components/ui`).
- **Framer Motion** for motion
- Fonts via `next/font`: **Tajawal** (Arabic) + **Inter** (Latin/numerals)

## Commands

```bash
npm install
npm run dev            # http://localhost:3000
npm run build          # production build — ALSO the type-check. Run this to verify changes.
npm run start          # serve the build
```

There is no separate `tsc`/lint gate wired in; **`npm run build` is how you verify** (it type-checks all routes). Always run it after changes.

### Docker (this machine)

The network does **TLS interception**, so a normal in-container `npm ci` / `next build` / Google-font fetch **fails cert validation**. Two Dockerfiles:

- `Dockerfile` — standard multi-stage self-contained build. Use only on a normal (non-intercepted) network.
- `Dockerfile.prebuilt` — packages a **locally-built** `.next/standalone`, zero in-container network. **Use this here.**

```bash
npm run build
docker build -f Dockerfile.prebuilt -t bmatx-portal .
docker rm -f bmatx-portal; docker run -d --name bmatx-portal -p 3200:3000 bmatx-portal
# → http://localhost:3200
```

Container maps host **3200** → container 3000. **Host 3000 is taken by an unrelated `repos-frontend-1` stack — do not touch it.**

## Project structure

```
app/            routes + layout.tsx + globals.css (design tokens)
  account/wallet/   wallet route
components/
  ui/           Button, Badge, Price, Rating, QtyStepper, Logo, Field, SegmentedControl, StatusBadge
  layout/       Header, Footer, SearchBar, CategoryNav, MobileMenu, RegionPicker, CartButton, LanguageToggle
  commerce/     ProductCard/Grid/Details, Filters, SortBar, CartView, CheckoutView,
                SupplierBadge, WarehouseSelector, WarehouseInfoBox, DeliveryEstimateBox,
                DeliveryRules, ShipmentGroup, PickupOptionCard, DeliveryOptionSelector
  home/         Hero + home sections
  auth/         LoginView, RegisterView, AuthShell
  account/      AccountView, AddressManager, LocationPicker, OrdersList
  wallet/       WalletView, WalletBalanceCard, WalletTransactionList, WalletPaymentToggle
lib/
  i18n/         dictionaries.ts (ar+en), I18nProvider (useI18n)
  cart/         CartProvider (useCart)
  wallet/       WalletProvider (useWallet)
  icons.tsx     inline SVG icon set (Icon, IconName)
  format.ts     formatNumber / formatCount
  cn.ts         className joiner
data/           types.ts + mock: products, suppliers, warehouses, regions, categories,
                logistics.ts (delivery/shipment engine), account.ts, wallet.ts
```

## Conventions (follow these)

### Components
- Default to **server components**; add `"use client"` only when the component uses hooks/state/context (most interactive ones already do).
- Reuse `components/ui` primitives. Don't reinvent buttons/badges/inputs.
- Match the surrounding file's style. Keep components focused and uncluttered.

### Styling
- **OKLCH only.** Use the CSS-variable tokens (`bg-bg`, `text-ink`, `text-muted`, `bg-primary`, `text-primary-ink`, `border-border`, `bg-surface`, `bg-surface-2`, `text-accent-strong`, status `*-soft`, etc.). Shadows via `shadow-[var(--shadow-md)]`. See `app/globals.css` + `../../DESIGN.md`.
- Body text uses `--ink`; only truly secondary metadata uses `--muted` (keep ≥4.5:1 contrast).
- **RTL-native:** use **logical properties** (`ps-/pe-`, `ms-/me-`, `start-/end-`, `gap-`), never hard `left/right`. Flip directional icons with `className="flip-rtl"` (chevrons/arrows). Layout must work at RTL (default) and LTR.
- Responsive: test mobile (375) / tablet (768) / desktop. Grids step `grid-cols-2 → md:3 → lg:4`. Header collapses below `lg`; filters become a drawer.

### i18n (important)
- All UI strings live in `lib/i18n/dictionaries.ts` as **two objects, `ar` and `en`, with identical key sets**. `en` is typed `Record<keyof typeof ar, string>` — **add every new key to BOTH** or the build fails.
- Keys are dotted for grouping (e.g. `"co.step.address"`). In components: `const { t, tl, locale, dir } = useI18n()`.
  - `t("some.key")` → UI string.
  - `tl(localizedValue)` → picks `ar`/`en` from a `Localized` data object (`{ ar, en }`). Mock domain data (product names, etc.) is `Localized`, not dictionary keys.
- Never hardcode user-facing Arabic/English in JSX — go through `t`/`tl`.

### Data / logistics model (don't break these invariants)
- `data/types.ts` is the source of truth for shapes.
- **CartLine has `warehouseId`.** A product can appear as two lines from two warehouses; identity is `(productId, warehouseId)` (`lineKey`). `useCart()` methods: `add(productId, qty?, warehouseId?)`, `setQuantity(productId, warehouseId, qty)`, `remove(productId, warehouseId)`. Old carts (no `warehouseId`) are migrated on load.
- `data/logistics.ts` is the delivery engine: `productWarehouses`, `warehouseHasStock`, `defaultWarehouseFor`, `quoteDelivery(warehouseId, regionId, product, qty)` → `{cost, minDays, maxDays}`, `buildShipments(lines, regionId)` → groups lines into per-warehouse `Shipment[]`, `productRules(product)` → delivery-rule chips. Reuse these; don't recompute delivery inline.
- Currency is **SAR**, geography is **Saudi** (regions in `data/regions.ts`). Keep it consistent — illustrative Egyptian examples in past requests were not a currency change.
- Wallet: `useWallet()` → `{ balance, transactions, recharge }`.

### Adding things
- **New screen** → `app/<route>/page.tsx` (thin) rendering a client view in `components/...`. Add nav links + i18n keys (both languages).
- **New product flag/fulfillment** → extend `DeliveryFlag`/`Fulfillment` in `types.ts`, handle in `productRules`/`quoteDelivery`, add rule strings to both dictionaries.
- **Mock data** goes in `data/`. Keep `Localized` for anything user-facing.

## Verifying changes

1. `npm run build` — must pass (this is the type-check + prerender gate).
2. For behavior, run `npm run dev` and check the relevant route. **Browser screenshots time out in this environment** — verify with DOM/`eval`-style checks instead (read `document.body.innerText`, measure `document.documentElement.scrollWidth` vs viewport for overflow). The decorative blur blobs are wider than the viewport but sit inside `overflow-hidden` ancestors — they are not real horizontal overflow (`scrollWidth` stays == viewport).
3. If asked to ship via Docker, rebuild with `Dockerfile.prebuilt` (see above).

## Don't
- Don't add a backend, real auth, DB, or network calls (mock-data phase).
- Don't change the design direction, currency, or geography without being asked.
- Don't introduce shadcn/ui or a `tailwind.config.js` — this is Tailwind v4 CSS-first.
- Don't use physical `left/right` spacing/positioning — breaks RTL.
- Don't add a dictionary key to only one language.
- Don't kill or rebind host port 3000 (other stack).
