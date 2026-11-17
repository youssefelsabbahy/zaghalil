"use client";

import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { characters, characterById, products, productsPage, shop, type CharacterId, type ShopCategoryId } from "@/content/site";
import { cn, toArabicDigits } from "@/lib/format";
import { PageTop } from "@/components/ui/Breadcrumb";
import { SplitHeading } from "@/components/ui/primitives";
import { CloseIcon } from "@/components/ui/Icons";
import { ProductCard } from "@/components/overlays/Commerce";
import { StickerFan } from "@/components/sections/Shop";

type Sort = (typeof productsPage.sort.options)[number]["id"];

const FilterIcon = ({ size = 20 }: { size?: number }) => (
  <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 5h16l-6.2 7.6V19l-3.6-1.8v-4.6Z" />
  </svg>
);

function Chip({ active, onClick, children, color }: { active: boolean; onClick: () => void; children: React.ReactNode; color?: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        "relative shrink-0 rounded-full border-2 px-4 py-1.5 text-sm font-semibold transition",
        active ? "border-ink bg-ink text-white" : "border-ink/10 bg-white text-ink/75 hover:border-ink/30 hover:text-ink"
      )}
    >
      {color && <span className="me-1.5 inline-block h-2.5 w-2.5 rounded-full align-middle" style={{ background: color }} />}
      {children}
    </button>
  );
}

/** Category tiles: swipe carousel with dots on phones, a row of four on desktop. */
function CategoryRail({ value, onChange }: { value: ShopCategoryId | null; onChange: (c: ShopCategoryId | null) => void }) {
  const rail = useRef<HTMLUListElement>(null);
  const [page, setPage] = useState(0);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    const measure = () => {
      setPages(Math.max(1, Math.round(el.scrollWidth / el.clientWidth)));
      setPage(Math.round(Math.abs(el.scrollLeft) / el.clientWidth));
    };
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div>
      <ul ref={rail} className="no-scrollbar -mx-4 flex snap-x snap-mandatory scroll-px-4 gap-3 overflow-x-auto px-4 pb-2 sm:scroll-px-0 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible">
        {shop.categories.map((cat, i) => {
          const active = value === cat.id;
          return (
            <motion.li
              key={cat.id}
              className="w-[31%] shrink-0 snap-start sm:w-[23%] lg:w-auto"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 + i * 0.06 }}
            >
              <motion.button
                type="button"
                onClick={() => onChange(active ? null : cat.id)}
                aria-pressed={active}
                initial="rest"
                whileHover="hover"
                animate="rest"
                whileTap={{ scale: 0.96 }}
                className={cn(
                  "edge-card group relative block aspect-square w-full overflow-hidden rounded-[1.3rem] transition-[outline] lg:rounded-[1.6rem]",
                  active && "outline outline-[3px] outline-offset-4 outline-orange"
                )}
                style={{ background: cat.bg, ["--edge" as string]: cat.edge }}
              >
                <StickerFan category={cat.id} />
              </motion.button>
              <p className={cn("mt-2 text-center text-sm font-bold lg:mt-3 lg:text-lg", active ? "text-orange-deep" : "text-ink")}>{cat.name}</p>
            </motion.li>
          );
        })}
      </ul>
      {pages > 1 && (
        <div className="mt-2 flex justify-center gap-1.5 lg:hidden" aria-hidden>
          {Array.from({ length: pages }, (_, i) => (
            <span key={i} className={cn("h-2 rounded-full transition-all", i === page ? "w-5 bg-leaf" : "w-2 bg-ink/15")} />
          ))}
        </div>
      )}
    </div>
  );
}

export function ProductsPage() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const cats = shop.categories.map((c) => c.id) as string[];

  const initialCat = params.get("category");
  const initialChar = params.get("character");
  const [category, setCategory] = useState<ShopCategoryId | null>(cats.includes(initialCat ?? "") ? (initialCat as ShopCategoryId) : null);
  const [character, setCharacter] = useState<CharacterId | null>(initialChar && initialChar in characterById ? (initialChar as CharacterId) : null);
  const [sort, setSort] = useState<Sort>("featured");
  const [panel, setPanel] = useState(Boolean(initialChar));

  // Pick up new params when navigating here from elsewhere (search, home tiles).
  useEffect(() => {
    const c = params.get("category");
    const ch = params.get("character");
    setCategory(cats.includes(c ?? "") ? (c as ShopCategoryId) : null);
    setCharacter(ch && ch in characterById ? (ch as CharacterId) : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);

  // Keep the URL shareable.
  const sync = (c: ShopCategoryId | null, ch: CharacterId | null) => {
    const q = new URLSearchParams();
    if (c) q.set("category", c);
    if (ch) q.set("character", ch);
    const qs = q.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };
  const pickCategory = (c: ShopCategoryId | null) => {
    setCategory(c);
    sync(c, character);
  };
  const pickCharacter = (ch: CharacterId | null) => {
    setCharacter(ch);
    sync(category, ch);
  };

  const list = useMemo(() => {
    const l = products.filter((p) => (!category || p.category === category) && (!character || p.character === character));
    if (sort === "price-asc") return [...l].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") return [...l].sort((a, b) => b.price - a.price);
    return l;
  }, [category, character, sort]);

  const activeCount = Number(!!category) + Number(!!character) + Number(sort !== "featured");

  return (
    <main className="pb-10">
      <PageTop items={[{ label: productsPage.crumb }]} />

      <section className="mx-auto max-w-[1240px] px-4 pt-8 sm:px-6 lg:px-8 lg:pt-12">
        <SplitHeading as="h1" text={shop.title} className="hidden text-[clamp(2.4rem,4.6vw,3.8rem)] text-ink lg:block" />
        <div className="lg:mt-10">
          <CategoryRail value={category} onChange={pickCategory} />
        </div>

        {/* toolbar */}
        <div className="mt-8 flex items-center justify-between gap-4 border-b-2 border-dashed border-ink/10 pb-4">
          <p className="text-[15px] text-ink/60" aria-live="polite">
            {productsPage.count(toArabicDigits(list.length))}
          </p>
          <div className="flex items-center gap-2">
            <label className="hidden items-center gap-2 text-sm text-ink/60 sm:flex">
              {productsPage.sort.label}
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as Sort)}
                className="rounded-full border-2 border-ink/10 bg-white px-4 py-1.5 text-sm font-semibold text-ink outline-none focus:border-orange"
              >
                {productsPage.sort.options.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.label}
                  </option>
                ))}
              </select>
            </label>
            <motion.button
              type="button"
              onClick={() => setPanel((v) => !v)}
              aria-expanded={panel}
              aria-controls="filters"
              whileTap={{ scale: 0.92 }}
              className={cn(
                "relative inline-flex h-10 items-center gap-2 rounded-full px-4 text-sm font-bold transition",
                panel ? "bg-ink text-white" : "bg-mint text-ink hover:bg-mint-deep"
              )}
            >
              <FilterIcon size={18} />
              {productsPage.filter}
              {activeCount > 0 && (
                <span className="grid h-5 min-w-5 place-items-center rounded-full bg-orange px-1 text-[11px] text-white">{toArabicDigits(activeCount)}</span>
              )}
            </motion.button>
          </div>
        </div>

        {/* filter panel */}
        <AnimatePresence initial={false}>
          {panel && (
            <motion.div
              id="filters"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="grid gap-5 rounded-[1.6rem] bg-[#F7F0DA] p-5 sm:p-6 lg:grid-cols-[auto_1fr] lg:gap-x-8" style={{ marginTop: "1rem" }}>
                <p className="text-sm font-bold text-ink/70 lg:pt-2">النوع</p>
                <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 lg:flex-wrap">
                  <Chip active={!category} onClick={() => pickCategory(null)}>
                    {productsPage.all}
                  </Chip>
                  {shop.categories.map((c) => (
                    <Chip key={c.id} active={category === c.id} onClick={() => pickCategory(c.id)} color={c.edge}>
                      {c.name}
                    </Chip>
                  ))}
                </div>
                <p className="text-sm font-bold text-ink/70 lg:pt-2">الشخصية</p>
                <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 lg:flex-wrap">
                  <Chip active={!character} onClick={() => pickCharacter(null)}>
                    {productsPage.all}
                  </Chip>
                  {characters.map((c) => (
                    <Chip key={c.id} active={character === c.id} onClick={() => pickCharacter(c.id)} color={c.tile}>
                      {c.name}
                    </Chip>
                  ))}
                </div>
                <p className="text-sm font-bold text-ink/70 sm:hidden">{productsPage.sort.label}</p>
                <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1 sm:hidden">
                  {productsPage.sort.options.map((o) => (
                    <Chip key={o.id} active={sort === o.id} onClick={() => setSort(o.id)}>
                      {o.label}
                    </Chip>
                  ))}
                </div>
                {activeCount > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSort("featured");
                      setCategory(null);
                      setCharacter(null);
                      sync(null, null);
                    }}
                    className="inline-flex w-fit items-center gap-1 text-sm font-bold text-orange-deep lg:col-start-2"
                  >
                    <CloseIcon size={16} /> مسح الفلاتر
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* grid */}
        <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
          <AnimatePresence mode="popLayout">
            {list.map((p, i) => (
              <ProductCard key={p.id} p={p} index={i} />
            ))}
          </AnimatePresence>
        </ul>
        {list.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="py-16 text-center">
            <p className="font-display text-2xl text-ink">{productsPage.empty}</p>
            <button
              type="button"
              onClick={() => {
                setCategory(null);
                setCharacter(null);
                sync(null, null);
              }}
              className="mt-4 font-bold text-orange-deep underline underline-offset-4"
            >
              اعرض كل المنتجات
            </button>
          </motion.div>
        )}
      </section>
    </main>
  );
}
