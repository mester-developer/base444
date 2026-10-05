# Project notes — فریز (FRZN)

## What this app is
A Persian, RTL fashion/streetwear e-commerce storefront: React 18 + Vite SPA,
client-side routing (react-router), and a mock data layer that is structured like
an API response so a real backend/CMS can be connected later.

- `src/data/catalog.js` — products, categories, collections, color map, sizes.
- `src/data/content.js` — journal, FAQ, provinces, shipping methods, sample orders.
- `src/state/ShopProvider.jsx` — cart, wishlist, auth, orders, coupons, toasts,
  UI state (cart drawer / search overlay / mobile menu). Persisted to localStorage
  under `friz.store.v1`.
- `src/components/SceneImage.jsx` — every "photograph" is a deterministic SVG scene
  (mountains, ice, city, garment studio shots). No external image hosts, so images
  can never break offline. Seed + variant identify each image.

## Running it
`docker compose -f docker-compose.base44.yml up -d` → dev server on host port 3000.
Dependencies are installed on container start into the `node_modules` named volume
(`npm install` in the service command), so a fresh clone boots in one step.

## How to verify
- `curl -s -o /dev/null -w '%{http_code}' http://localhost:3000/` → 200.
- `docker compose -f docker-compose.base44.yml ps` → `web` healthy.
- Healthcheck probes `http://127.0.0.1:3000/` with `wget`. Use `127.0.0.1`, not
  `localhost`: Vite listens on IPv4 only, and busybox wget tries IPv6 first
  (that mismatch makes a working app look unhealthy).

## Quirks worth remembering
- `ShopProvider` exposes UI controls (`openCart`, `closeMenu`, …) as `useCallback`
  identities. They must stay stable — an unstable one put `Header` in an infinite
  update loop (effect depending on the callback re-ran every render).
- Vite server config sets `host: true`, `allowedHosts: true`, and polling watch
  (`CHOKIDAR_USEPOLLING=true` in compose) for bind-mounted source.
- Persian numerals are formatted through `faDigits` / `formatToman`; keep Persian
  headings at `letter-spacing: 0` — negative tracking breaks connected Arabic script.
- Demo credentials: login accepts any valid `09xxxxxxxxx` mobile with OTP code `1234`.

## Editing
Edits hot-reload through Vite. Route-level code splitting means a new page needs no
extra wiring beyond adding it to `src/App.jsx`.
