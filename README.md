# زغاليل — Zaghalil landing page

An independent, unofficial implementation of the Zaghalil (زغاليل) website design.
Arabic, right-to-left.

## Credits & copyright
- **Original design:** [Rana Elabd](https://www.behance.net/ranaelabd1) · [Rahma Gamal](https://www.behance.net/rahmaelabd)
- **Development:** [Youssef Elsabbahy](https://youssefelsabbahy.com)
- **Original design reference:** [Zaghalil (زغاليل) – Website UI/UX on Behance](https://www.behance.net/gallery/258574069/Zaghalil-()-Website-UIUX)

All original design rights, artwork, characters, illustrations, and intellectual property
belong to their respective original creators, Rana Elabd and Rahma Gamal. This implementation
was created independently, purely out of admiration for their design and creativity. It is
not an official Zaghalil project and does not claim ownership of their work. For any concerns,
inquiries, or requests, please get in touch via [youssefelsabbahy.com](https://youssefelsabbahy.com).

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 ·
Framer Motion · React Three Fiber + drei (3D hero) · Lenis (smooth scroll) · Zustand (cart/wishlist).

```bash
npm install
npm run dev            # http://localhost:3000
npm run build && npm start
npm run build:static   # fully static export in ./out (any static host)
```

## Pages
| Route | Page |
|---|---|
| `/` | Landing page (3D swing hero, story, cast, partners, services, shop, videos, reviews, contact) |
| `/characters` | اتعرف على الشلة — intro, cast scene, a large card per character (`#<id>` anchors) |
| `/about` | حكايتنا — intro, partners, timeline, vision & mission |
| `/products` | المنتجات — category rail, filters (type, character, sort) synced to `?category=&character=` |
| `/products/[id]` | Product page — gallery with swipe/zoom/thumbnails, rating, old price, quantity, related products |
| `/contact`, `/careers` | تواصل مع زغاليل / كاريير — info cards + form (careers pre-fills the message) |

The inner pages were designed for mobile only; their desktop layouts are new, built on the
same identity as the desktop home page.

## What's inside
- **Hero:** real-time toon-shaded 3D swing (rope, plank, clouds, sparkles) with pendulum
  physics — it sways on its own, reacts to scroll momentum, and can be dragged/pushed.
  Pauses rendering when off-screen; respects `prefers-reduced-motion`.
- **Sections:** story timeline (self-drawing spine + expandable vision/mission), the cast,
  partners with count-up stats + logo marquee, sticky services, shop, videos with player,
  testimonials, contact form, footer with newsletter.
- **Commerce:** products page with filters, product pages, cart drawer (qty, free-shipping
  meter, persisted across pages), wishlist, checkout via Shopify URL or WhatsApp order message.
- **Search:** ⌘/Ctrl-K overlay across characters, products, services, videos (Arabic-normalised).
- **Forms:** validated contact + newsletter, posting JSON to your endpoint (see `.env.example`)
  or falling back to a pre-filled email.

## Demo mode (on by default)
Because this is an unofficial build, `NEXT_PUBLIC_DEMO_MODE` defaults to on: checkout, the
contact form and the newsletter never contact anyone, they explain it's a demo instead, and
the design's email/WhatsApp are shown as plain text. Set `NEXT_PUBLIC_DEMO_MODE=0` only for a
deployment the brand owner has approved and configured.

## Brand assets
The character art, logo and scene illustrations are the brand's own files and are **not**
bundled. Drop the official exports into `public/zaghalil/` (naming guide inside) and they
replace every stand-in automatically — including on the 3D swing.

## Content
All copy lives in `src/content/site.ts` (credits in `src/content/credits.ts`). Items flagged `sample: true` (notebooks, gifts,
merch products/prices) and the terms-of-service text in `Footer.tsx` were not specified
in the design — confirm with the client before launch. The same goes for the product
descriptions (`categoryBlurb`), the careers page copy, and the traits of the five characters
whose traits weren't legible in the design. Social links point to platform
home pages until the real handles are added.
