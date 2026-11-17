// Renders the Open Graph / social preview images into public/og/*.png
//
//   npm run og
//
// Uses your installed Google Chrome (set CHROME_PATH to override) and the site's own
// fonts and content, so previews always match the identity. Official character / logo
// exports dropped into public/zaghalil are picked up automatically — re-run after adding them.
// Requires Node 22.6+ (imports src/content/*.ts directly).

import { chromium } from "playwright-core";
import { createServer } from "node:http";
import { existsSync, mkdirSync, readFileSync, statSync } from "node:fs";
import { extname, join } from "node:path";
import { execSync } from "node:child_process";
import * as site from "../../src/content/site.ts";

const root = new URL("../..", import.meta.url).pathname;
const out = join(root, "public", "og");
const URL_LABEL = process.env.OG_URL_LABEL || "zaghalil.vercel.app";

const chromePath =
  process.env.CHROME_PATH ||
  {
    darwin: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    win32: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
  }[process.platform] ||
  "/usr/bin/google-chrome";

// Fresh asset manifest so new brand exports are used.
execSync("node scripts/scan-assets.mjs", { cwd: root, stdio: "ignore" });
const manifest = JSON.parse(readFileSync(join(root, "src/generated/asset-manifest.json"), "utf8"));
const asset = (key) => manifest[key];

/* ───────── tiny static server: template, fonts, public/ ───────── */
const types = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".woff2": "font/woff2", ".woff": "font/woff", ".png": "image/png", ".webp": "image/webp", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".avif": "image/avif", ".otf": "font/otf", ".ttf": "font/ttf" };
const server = createServer((req, res) => {
  const path = decodeURIComponent(new URL(req.url, "http://x").pathname);
  let file;
  if (path === "/__brandfonts.css") file = join(root, "src/generated/brand-fonts.css");
  else if (path.startsWith("/__og/")) file = join(root, "scripts/og", path.slice(6));
  else if (path.startsWith("/__fonts/")) file = join(root, "src/fonts", path.slice(9));
  else file = join(root, "public", path);
  if (!file.startsWith(root) || !existsSync(file) || statSync(file).isDirectory()) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { "content-type": types[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
});
await new Promise((r) => server.listen(0, "127.0.0.1", r));
const base = `http://127.0.0.1:${server.address().port}`;

/* ───────── data ───────── */
const cast = site.characters.map((c) => ({
  id: c.id,
  name: c.name,
  traits: c.traits,
  plush: c.plush,
  card: c.card,
  tile: c.tile,
  initial: c.name.replace("السيد ", "").replace("ال", "").trim().charAt(0),
  img: asset(`characters/${c.id}`),
}));
const byId = Object.fromEntries(cast.map((c) => [c.id, c]));
const common = { url: URL_LABEL, ticker: site.ticker, logo: asset("brand/logo"), cast };

const jobs = [
  {
    file: "home",
    data: {
      ...common,
      art: "home",
      eyebrow: "أول عالم كرتوني مصري متكامل",
      title: `${site.hero.titleTop}\n${site.hero.titleWorld} ${site.hero.titleBrand}`,
      titleLines: 2,
      highlight: site.hero.titleBrand,
      subtitle: site.hero.body.split(". ")[0] + ".",
      swing: site.swingCast.map((id) => byId[id]),
      perch: byId.otteya,
    },
  },
  {
    file: "characters",
    data: { ...common, art: "characters", eyebrow: site.charactersPage.crumb, title: site.charactersPage.title, subtitle: site.charactersPage.intro },
  },
  {
    file: "about",
    data: { ...common, art: "about", eyebrow: site.aboutPage.crumb, title: site.aboutPage.title, highlight: "زغاليل!", subtitle: site.aboutPage.lead, milestones: site.story.milestones },
  },
  {
    file: "products",
    data: {
      ...common,
      art: "products",
      eyebrow: site.shop.eyebrow,
      title: site.shop.title,
      highlight: "زغاليل",
      subtitle: site.shop.categories.map((c) => c.name).join(" · "),
      fan: [byId.qalqas, byId.naanaa, byId.zaghloul],
    },
  },
  {
    file: "contact",
    data: { ...common, art: "contact", eyebrow: site.contactPage.crumb, title: site.contactPage.title, highlight: "زغاليل", subtitle: site.contactPage.question, formTitle: site.contactPage.formTitle, button: site.contact.submit },
  },
  {
    file: "careers",
    data: { ...common, art: "contact", eyebrow: site.careersPage.crumb, title: site.careersPage.title, highlight: "زغاليل", subtitle: site.careersPage.question, formTitle: site.careersPage.formTitle, button: "ابعتلنا" },
  },
  ...site.products.map((p) => {
    const cat = site.shop.categories.find((c) => c.id === p.category);
    return {
      file: `products/${p.id}`,
      data: {
        ...common,
        art: "product",
        eyebrow: `${site.shop.title} · ${cat.name}`,
        title: p.name,
        subtitle: p.tagline ?? byId[p.character].traits ?? `من عالم زغاليل · ${byId[p.character].name}`,
        titleLines: 2,
        product: {
          price: p.price,
          oldPrice: p.oldPrice,
          discount: p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0,
          rating: p.rating,
          character: { ...byId[p.character], img: asset(`products/${p.id}`) ?? byId[p.character].img },
        },
      },
    };
  }),
];

/* ───────── render ───────── */
mkdirSync(join(out, "products"), { recursive: true });
const browser = await chromium.launch({ executablePath: chromePath });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.goto(`${base}/__og/template.html`, { waitUntil: "networkidle" });
for (const job of jobs) {
  await page.evaluate((d) => window.renderOG(d), job.data);
  await page.screenshot({ path: join(out, `${job.file}.png`), clip: { x: 0, y: 0, width: 1200, height: 630 } });
  console.log(`[og] ${job.file}.png`);
}
await browser.close();
server.close();
console.log(`[og] ${jobs.length} images → public/og`);
