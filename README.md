# IRONBRIDGE

Orlando surplus catalog. Tactical clothing, firearm accessories, silencers, armor, hearing, packs.

- 5% under street
- Military / police / first responders: 15% off
- Bridge points: $100 spent → 1,000 pts · 100 pts = $3
- Free ground / 2-day over $150
- Free overnight over $1,500
- Born and bred in the USA

Demo catalog. No live payment. No complete firearms. No federal tax stamp on silencers.

## Run

```bash
npm install
npm run dev
```

## GitHub export status

This repo has the store UI, pricing, points, cart/shipping stores, catalog pages, and theme.

Still being pushed (too large for one GitHub file call, or binary):

- `src/lib/inventory.ts`, `src/lib/kit.ts`, `src/lib/silencers.ts` — the 3,000+ SKU generators
- `src/routes/cart.tsx`, `checkout.tsx`, `order.$id.tsx`
- `vite.config.ts` and Grok preview scripts
- Product JPEG stills under `public/` (~64 MB)

The live Grok preview is the complete store.
