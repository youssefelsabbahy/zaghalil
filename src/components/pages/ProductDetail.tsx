"use client";

import Link from "next/link";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import { categoryBlurb, characterById, productById, products, productsPage, shop, type Product } from "@/content/site";
import { cn, egp, toArabicDigits } from "@/lib/format";
import { PageTop } from "@/components/ui/Breadcrumb";
import { Button, Reveal } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/Modal";
import { ChevronIcon, MinusIcon, PlusIcon, StarIcon, ZoomIcon } from "@/components/ui/Icons";
import { ProductArt, ProductCard, WishButton, productImage, useAddToCart } from "@/components/overlays/Commerce";

/** Number of gallery slots: real exports when the main one exists, otherwise four stand-in views. */
function useViews(p: Product) {
  return useMemo(() => {
    if (!productImage(p, 0)) return [0, 1, 2, 3];
    return [0, 1, 2, 3].filter((n) => productImage(p, n));
  }, [p]);
}

function Gallery({ p }: { p: Product }) {
  const views = useViews(p);
  const [[idx, dir], setIdx] = useState<[number, number]>([0, 0]);
  const [zoom, setZoom] = useState(false);
  const go = useCallback((d: number) => setIdx(([i]) => [(i + d + views.length) % views.length, d]), [views.length]);

  useEffect(() => {
    if (!zoom) return;
    // RTL: ArrowLeft moves forward
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(1);
      if (e.key === "ArrowRight") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom, go]);

  // RTL: the next picture sits to the left, so dragging right brings it in.
  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (info.offset.x > 50) go(1);
    else if (info.offset.x < -50) go(-1);
  };

  const slide = (big?: boolean) => (
    <AnimatePresence initial={false} custom={dir} mode="popLayout">
      <motion.div
        key={idx}
        custom={dir}
        variants={{
          enter: (d: number) => ({ x: d > 0 ? "-60%" : "60%", opacity: 0, scale: 0.96 }),
          center: { x: 0, opacity: 1, scale: 1 },
          exit: (d: number) => ({ x: d > 0 ? "60%" : "-60%", opacity: 0, scale: 0.96 }),
        }}
        initial="enter"
        animate="center"
        exit="exit"
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        drag={views.length > 1 ? "x" : false}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.25}
        onDragEnd={onDragEnd}
        className="absolute inset-0 cursor-grab active:cursor-grabbing"
      >
        <ProductArt p={p} view={views[idx]} className={cn("h-full w-full", big && "rounded-[1.6rem]")} />
      </motion.div>
    </AnimatePresence>
  );

  const arrows = () =>
    views.length > 1 ? (
      <>
        <button
          type="button"
          onClick={() => go(-1)}
          aria-label="الصورة اللي قبل"
          className="absolute right-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border-2 border-white/80 bg-white/30 text-white backdrop-blur transition hover:bg-white hover:text-ink"
        >
          <ChevronIcon size={18} />
        </button>
        <button
          type="button"
          onClick={() => go(1)}
          aria-label="الصورة اللي بعد"
          className="absolute left-3 top-1/2 z-10 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full border-2 border-white/80 bg-white/30 text-white backdrop-blur transition hover:bg-white hover:text-ink"
        >
          <ChevronIcon size={18} className="rotate-180" />
        </button>
      </>
    ) : null;

  return (
    <div>
      <div className="relative aspect-square overflow-hidden rounded-[1.6rem] border-2 border-ink/5" style={{ background: characterById[p.character].tile }}>
        {slide()}
        {arrows()}
        <button
          type="button"
          onClick={() => setZoom(true)}
          aria-label="تكبير الصورة"
          className="absolute left-3 top-3 z-10 grid h-10 w-10 place-items-center rounded-xl bg-white/80 text-ink shadow-sm transition hover:scale-110 hover:bg-white"
        >
          <ZoomIcon size={20} />
        </button>
      </div>
      {views.length > 1 && (
        <ul className="mt-3 grid grid-cols-4 gap-3" role="tablist" aria-label="صور المنتج">
          {views.map((v, i) => (
            <li key={v}>
              <button
                type="button"
                role="tab"
                aria-selected={i === idx}
                aria-label={`صورة ${toArabicDigits(i + 1)}`}
                onClick={() => setIdx(([cur]) => [i, i > cur ? 1 : -1])}
                className={cn(
                  "block w-full overflow-hidden rounded-xl border-[3px] transition",
                  i === idx ? "border-leaf" : "border-transparent opacity-80 hover:opacity-100"
                )}
              >
                <ProductArt p={p} view={v} className="aspect-square" />
              </button>
            </li>
          ))}
        </ul>
      )}

      <Modal open={zoom} onClose={() => setZoom(false)} label={`${p.name} — تكبير`} className="max-w-[min(92vw,760px)] p-4 pt-16 sm:p-6 sm:pt-16">
        <div className="relative aspect-square w-full overflow-hidden rounded-[1.6rem]" style={{ background: characterById[p.character].tile }}>
          {slide(true)}
          {arrows()}
        </div>
        <p className="mt-3 text-center text-sm font-semibold text-ink/60">
          {toArabicDigits(idx + 1)} / {toArabicDigits(views.length)}
        </p>
      </Modal>
    </div>
  );
}

export function ProductDetail({ id }: { id: string }) {
  const p = productById[id];
  const c = characterById[p.character];
  const cat = shop.categories.find((x) => x.id === p.category)!;
  const addToCart = useAddToCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const discount = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const related = useMemo(() => {
    const same = products.filter((x) => x.id !== p.id && x.character === p.character);
    const cat = products.filter((x) => x.id !== p.id && x.category === p.category && x.character !== p.character);
    return [...same, ...cat].slice(0, 4);
  }, [p]);

  useEffect(() => {
    setQty(1);
    setAdded(false);
  }, [id]);

  return (
    <main className="pb-10">
      <PageTop items={[{ label: productsPage.crumb, href: "/products" }, { label: p.name }]} />

      <section className="mx-auto grid max-w-[1240px] gap-8 px-4 pt-8 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:pt-12">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }} className="lg:sticky lg:top-28 lg:h-fit">
          <Gallery p={p} />
        </motion.div>

        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.07, delayChildren: 0.15 } } }}
          className="flex flex-col"
        >
          {[
            <Link key="cat" href={`/products?category=${p.category}`} className="w-fit rounded-full px-3 py-1 text-xs font-bold text-ink" style={{ background: cat.bg }}>
              {cat.name}
            </Link>,
            <div key="title" className="mt-4 flex items-start justify-between gap-4">
              <h1 className="font-display text-[clamp(2rem,3.6vw,3rem)] leading-tight text-ink">{p.name}</h1>
              {p.rating && (
                <span className="mt-2 inline-flex shrink-0 items-center gap-1 text-[15px] font-semibold text-ink/70">
                  {toArabicDigits(p.rating)} <StarIcon size={18} className="text-orange" />
                </span>
              )}
            </div>,
            <div key="price" className="mt-4 flex flex-wrap items-baseline gap-3">
              <span className="font-display text-3xl text-purple">{egp(p.price)}</span>
              {p.oldPrice && (
                <>
                  <span className="text-lg text-ink/40 line-through">{egp(p.oldPrice)}</span>
                  <span className="rounded-full bg-orange px-2.5 py-0.5 text-sm font-bold text-white">وفّر {toArabicDigits(discount)}٪</span>
                </>
              )}
            </div>,
            <p key="desc" className="mt-5 max-w-lg text-[16px] leading-8 text-ink/75">
              {categoryBlurb[p.category]}
            </p>,
            <Link key="char" href={`/characters#${c.id}`} className="group mt-5 flex w-fit items-center gap-3 rounded-2xl p-2 pe-4 transition hover:bg-black/[0.03]">
              <span className="grid h-12 w-12 place-items-center rounded-xl text-lg font-bold" style={{ background: c.card }}>
                {c.name.replace("السيد ", "").replace("ال", "").charAt(0)}
              </span>
              <span>
                <span className="block text-xs text-ink/55">من عالم زغاليل</span>
                <span className="block font-bold text-ink group-hover:text-green">{c.name}</span>
              </span>
            </Link>,
            <div key="buy" className="mt-7 flex items-center gap-2 sm:gap-3">
              <div className="flex h-14 shrink-0 items-center gap-0.5 rounded-full bg-mint p-1.5 sm:gap-1">
                <button type="button" onClick={() => setQty((q) => Math.min(20, q + 1))} aria-label="زود الكمية" className="grid h-11 w-10 place-items-center rounded-full bg-white transition hover:scale-105 sm:w-11">
                  <PlusIcon size={18} />
                </button>
                <span className="w-7 text-center text-lg font-bold sm:w-9" aria-live="polite">
                  {toArabicDigits(qty)}
                </span>
                <button type="button" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="قلل الكمية" className="grid h-11 w-10 place-items-center rounded-full bg-white transition hover:scale-105 sm:w-11">
                  <MinusIcon size={18} />
                </button>
              </div>
              <Button
                size="lg-fluid"
                className="min-w-0 flex-1 sm:min-w-[200px] sm:flex-none"
                onClick={() => {
                  addToCart(p, qty);
                  setAdded(true);
                }}
              >
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span key={String(added)} initial={{ y: 12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -12, opacity: 0 }}>
                    {added ? "اتحط في السلة ✓" : "حطه في السلة"}
                  </motion.span>
                </AnimatePresence>
              </Button>
              <WishButton p={p} className="h-14 w-14 shrink-0 bg-white shadow-[0_4px_0_0_rgba(0,0,0,0.08)]" />
            </div>,
            <ul key="perks" className="mt-8 space-y-3 border-t-2 border-dashed border-ink/10 pt-6">
              {productsPage.perks.map((t, i) => (
                <li key={t} className="flex items-center gap-3 text-[15px] text-ink/75">
                  <span className="grid h-8 w-8 place-items-center rounded-full text-sm" style={{ background: ["#CAF4C3", "#FCE3DC", "#A7D9EC"][i] }}>
                    {["🚚", "💚", "✓"][i]}
                  </span>
                  {t}
                </li>
              ))}
            </ul>,
            <p key="total" className="mt-4 text-sm text-ink/50">
              الإجمالي للكمية دي: {egp(p.price * qty)}
            </p>,
          ].map((node, i) => (
            <motion.div key={i} variants={{ hidden: { opacity: 0, y: 18 }, show: { opacity: 1, y: 0 } }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}>
              {node}
            </motion.div>
          ))}
        </motion.div>
      </section>

      {related.length > 0 && (
        <section className="mx-auto max-w-[1240px] px-4 pt-20 sm:px-6 lg:px-8 lg:pt-28">
          <Reveal>
            <h2 className="font-display text-[clamp(1.8rem,3.2vw,2.6rem)] text-ink">{productsPage.related}</h2>
          </Reveal>
          <ul className="mt-8 grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4 lg:gap-x-6">
            {related.map((r, i) => (
              <ProductCard key={r.id} p={r} index={i} />
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
