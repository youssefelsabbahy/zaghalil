// Scans public/zaghalil for the official brand exports and writes a typed manifest.
// Drop files in with the expected names (see public/zaghalil/README.md) and every
// scene picks them up on the next `npm run dev` / `npm run build`.
import { readdirSync, statSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join, extname, basename } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const base = join(root, "public", "zaghalil");
const outDir = join(root, "src", "generated");
const IMG = [".webp", ".png", ".avif", ".svg", ".jpg", ".jpeg"];
const VID = [".mp4", ".webm"];
const FONT = [".woff2", ".woff", ".otf", ".ttf"];
const PRIORITY = [...IMG, ...VID];

const manifest = {};
const fonts = [];

function walk(dir, rel = "") {
  if (!existsSync(dir)) return;
  for (const name of readdirSync(dir)) {
    if (name.startsWith(".") || name.toLowerCase() === "readme.md") continue;
    const full = join(dir, name);
    const relPath = rel ? `${rel}/${name}` : name;
    if (statSync(full).isDirectory()) {
      walk(full, relPath);
      continue;
    }
    const ext = extname(name).toLowerCase();
    if (rel === "fonts" && FONT.includes(ext)) {
      fonts.push({ file: `/zaghalil/${relPath}`, name: basename(name, ext), ext });
      continue;
    }
    if (!PRIORITY.includes(ext)) continue;
    const key = `${rel}/${basename(name, ext)}`;
    const prev = manifest[key];
    if (!prev || PRIORITY.indexOf(ext) < PRIORITY.indexOf(extname(prev))) {
      manifest[key] = `/zaghalil/${relPath}`;
    }
  }
}

walk(base);
mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "asset-manifest.json"), JSON.stringify(manifest, null, 2) + "\n");

// Rabie (the brand heading face) is commercial, so it is never bundled here.
// Put the licensed files in public/zaghalil/fonts as Rabie-<Weight>.woff2 and they
// take over every heading automatically.
const weightOf = (n) => {
  const w = n.toLowerCase();
  if (w.includes("black") || w.includes("heavy")) return 900;
  if (w.includes("extrabold")) return 800;
  if (w.includes("bold")) return 700;
  if (w.includes("medium")) return 500;
  if (w.includes("light")) return 300;
  return 400;
};
const fmt = { ".woff2": "woff2", ".woff": "woff", ".otf": "opentype", ".ttf": "truetype" };
const faces = fonts
  .filter((f) => f.name.toLowerCase().startsWith("rabie"))
  .map(
    (f) =>
      `@font-face{font-family:"Rabie";src:url("${f.file}") format("${fmt[f.ext]}");font-weight:${weightOf(f.name)};font-display:swap;}`
  )
  .join("\n");
writeFileSync(join(outDir, "brand-fonts.css"), (faces || "/* No licensed Rabie files found; headings use the bundled fallback. */") + "\n");

console.log(`[assets] ${Object.keys(manifest).length} brand files, ${fonts.length} font files`);
