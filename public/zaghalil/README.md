# Drop the official Zaghalil exports here

Every scene on the site reads from this folder. Export from the designers' Figma
file (transparent PNG or WebP at 2x, or SVG), name the files as below, then run
`npm run dev` / `npm run build` — the manifest is regenerated automatically and
each file replaces its stand-in. Missing files simply keep the stand-in.

| Path (no extension needed: .webp/.png/.svg/.avif/.jpg) | Used in |
|---|---|
| `brand/logo` | Header, video cards, footer wordmark |
| `characters/zaghloul` `qalqas` `naanaa` `zouina` `basal` `wezza` `otteya` | 3D swing (as billboards), cast cards, contact lineup, sticker fans, products |
| `poses/zouina-sitting` | Timeline card corner (falls back to `characters/zouina`) |
| `poses/<character>-wave` | Large cards on `/characters` (falls back to `characters/<character>`) |
| `scenes/characters-group` | Wide cast-in-a-room scene on `/characters` |
| `scenes/about-hero` | Illustration beside the intro on `/about` |
| `scenes/service-ads` `service-sponsorship` `service-theatre` | "بنقدم ايه" cards (16:10) |
| `scenes/contact-cast` | Bottom of the blue contact card (full-width strip) |
| `scenes/footer-cast` | Replaces the giant footer wordmark with the illustrated version |
| `shop/stickers` `notebooks` `gifts` `merch` | Shop category tiles (square) |
| `products/<product-id>` | Product image everywhere (ids in `src/content/site.ts`) |
| `products/<product-id>-2` … `-4` | Extra gallery images on the product page |
| `videos/haqqi` `domoo3` `saqsaqa` `tarawa` (.mp4/.webm) | Hover preview + modal player |
| `videos/<id>-poster` | Video card poster (9:16) |
| `partners/eva-pharma` `al-adwaa` `bahia` `oppo` | Partner logo marquee |
| `avatars/t1` `t2` `t3` | Testimonial avatars |
| `fonts/Rabie-Bold.woff2` (any Rabie-*.woff2/otf/ttf) | Licensed heading font; replaces the bundled fallback |
