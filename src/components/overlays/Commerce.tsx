"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { characterById, contact, productById, waDigits, type Product } from "@/content/site";
import { asset } from "@/lib/assets";
import { useStore } from "@/lib/store";
import { useGo } from "@/lib/nav";
import { DEMO, DEMO_CONTACT_URL } from "@/lib/demo";
import { cn, egp, toArabicDigits } from "@/lib/format";
import { Button, CharacterArt } from "@/components/ui/primitives";
import { Modal } from "@/components/ui/Modal";
import { CartIcon, CloseIcon, HeartIcon, MinusIcon, PlusIcon, StarIcon, TrashIcon } from "@/components/ui/Icons";

/** Image key for product gallery slot n (0-based): products/<id>, products/<id>-2, … */
export const productImage = (p: Product, n = 0) => asset(n === 0 ? `products/${p.id}` : `products/${p.id}-${n + 1}`);

/**
 * Product picture. Uses the official export when present; otherwise a stand-in in the
 * design's sticker layout (character + name + traits on the character's tile colour).
 * `view` gives the gallery a few different crops of the same stand-in.
 */
export function ProductArt({
  p,
  view = 0,
  compact,
  className,
}: {
  p: Product;
  view?: number;
  compact?: boolean;
  className?: string;
}) {
  const c = characterById[p.character];
  const src = productImage(p, view);
  if (src) {
    return (
      <div className={cn("relative overflow-hidden", className)} style={{ background: c.tile }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt={p.name} className="absolute inset-[9%] h-[82%] w-[82%] object-contain drop-shadow-[0_10px_14px_rgba(0,0,0,0.12)]" loading="lazy" draggable={false} />
      </div>
    );
  }
  const traits = p.tagline ?? c.traits;
  return (
    <div className={cn("relative overflow-hidden [container-type:inline-size]", className)} style={{ background: c.tile }} role="img" aria-label={p.name}>
      {compact ? (
        <div className="absolute inset-[16%]">
          <CharacterArt id={p.character} className="h-full w-full" />
        </div>
      ) : view === 1 ? (
        <div className="absolute inset-[8%] scale-110">
          <CharacterArt id={p.character} className="h-full w-full" />
        </div>
      ) : view === 2 ? (
        <div className="absolute inset-[18%] -rotate-6 rounded-[10cqi] bg-white p-[4cqi] shadow-[0_3cqi_6cqi_-2cqi_rgba(0,0,0,0.25)]">
          <CharacterArt id={p.character} className="h-full w-full" />
        </div>
      ) : view === 3 ? (
        <div className="absolute inset-0 grid place-items-center p-[8cqi] text-center">
          <span className="font-display text-[16cqi] leading-none text-ink">{c.name}</span>
        </div>
      ) : (
        <div className="absolute inset-0 flex items-center gap-[4cqi] px-[8cqi]">
          <div className="min-w-0 flex-1 text-right">
            <span className="font-display block text-[12cqi] leading-[1.05] text-ink">{c.name}</span>
            {traits && <span className="mt-[2cqi] block text-[4.2cqi] font-semibold leading-snug text-ink/70">{traits}</span>}
          </div>
          <div className="aspect-square w-[46%] shrink-0">
            <CharacterArt id={p.character} className="h-full w-full" />
          </div>
        </div>
      )}
    </div>
  );
}

export function Price({ p, className }: { p: Product; className?: string }) {
  return (
    <span className={cn("flex items-baseline gap-2", className)}>
      <span className="font-semibold text-purple">{egp(p.price)}</span>
      {p.oldPrice && (
        <span className="text-[0.8em] text-ink/40 line-through" aria-label={`بدل ${egp(p.oldPrice)}`}>
          {egp(p.oldPrice)}
        </span>
      )}
    </span>
  );
}

export function WishButton({ p, className }: { p: Product; className?: string }) {
  const notify = useStore((s) => s.notify);
  const wished = useStore((s) => s.wishlist.includes(p.id));
  const toggleWish = useStore((s) => s.toggleWish);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const on = mounted && wished;
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.8 }}
      onClick={() => {
        toggleWish(p.id);
        notify(on ? "اتشال من المفضلة" : "اتضاف للمفضلة 💚");
      }}
      aria-label={on ? "شيل من المفضلة" : "ضيف للمفضلة"}
      aria-pressed={on}
      className={cn("grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow", on ? "text-[#E8483B]" : "text-ink", className)}
    >
      <motion.span key={String(on)} initial={{ scale: 0.4 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 600, damping: 14 }}>
        <HeartIcon size={18} filled={on} />
      </motion.span>
    </motion.button>
  );
}

export function useAddToCart() {
  const add = useStore((s) => s.add);
  const notify = useStore((s) => s.notify);
  return (p: Product, qty = 1) => {
    for (let i = 0; i < qty; i++) add(p.id);
    notify(`${p.name} اتحط في السلة 🛒`);
  };
}

export function ProductCard({ p, index = 0 }: { p: Product; index?: number }) {
  const addToCart = useAddToCart();
  const href = `/products/${p.id}`;
  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ type: "spring", stiffness: 220, damping: 24, delay: Math.min(index, 8) * 0.04 }}
      className="flex flex-col"
    >
      <div className="group relative">
        <Link href={href} aria-label={p.name} className="block overflow-hidden rounded-[1.2rem]">
          <ProductArt p={p} className="aspect-square transition-transform duration-500 ease-[var(--ease-soft)] group-hover:scale-[1.05]" />
        </Link>
        <WishButton p={p} className="absolute left-3 top-3" />
        {p.oldPrice && (
          <span className="pointer-events-none absolute right-3 top-3 rounded-full bg-orange px-2.5 py-0.5 text-xs font-bold text-white">خصم</span>
        )}
      </div>
      <Link href={href} className="mt-3 font-bold text-ink transition hover:text-green">
        {p.name}
      </Link>
      <div className="mt-1 flex items-center justify-between text-sm">
        <Price p={p} />
        {p.rating && (
          <span className="inline-flex items-center gap-1 text-ink/60">
            {toArabicDigits(p.rating)} <StarIcon size={14} className="text-orange" />
          </span>
        )}
      </div>
      <Button size="sm" className="mt-3 w-full" onClick={() => addToCart(p)}>
        حطه في السلة
      </Button>
    </motion.li>
  );
}

function checkoutMessage(lines: { p: Product; qty: number }[], total: number) {
  const rows = lines.map((l) => `• ${l.p.name} × ${l.qty} = ${l.p.price * l.qty} جنيه`).join("\n");
  return `أهلاً زغاليل! عايز أطلب:\n${rows}\n\nالإجمالي: ${total} جنيه`;
}

export function CartDrawer() {
  const open = useStore((s) => s.cartOpen);
  const setOpen = useStore((s) => s.setCartOpen);
  const cart = useStore((s) => s.cart);
  const wishlist = useStore((s) => s.wishlist);
  const setQty = useStore((s) => s.setQty);
  const remove = useStore((s) => s.remove);
  const add = useStore((s) => s.add);
  const toggleWish = useStore((s) => s.toggleWish);
  const go = useGo();
  const [tab, setTab] = useState<"cart" | "wish">("cart");
  const [demoNote, setDemoNote] = useState(false);

  useEffect(() => {
    const onTab = (e: Event) => setTab((e as CustomEvent<"cart" | "wish">).detail);
    window.addEventListener("zaghalil:drawer-tab", onTab);
    return () => window.removeEventListener("zaghalil:drawer-tab", onTab);
  }, []);
  useEffect(() => {
    if (!open)
      setTimeout(() => {
        setTab("cart");
        setDemoNote(false);
      }, 400);
  }, [open]);

  const lines = useMemo(() => cart.map((l) => ({ p: productById[l.id], qty: l.qty })).filter((l) => l.p), [cart]);
  const total = lines.reduce((a, l) => a + l.p.price * l.qty, 0);
  const freeShip = 500;

  const checkout = () => {
    if (DEMO) return setDemoNote(true);
    const url = process.env.NEXT_PUBLIC_CHECKOUT_URL;
    if (url) return void window.open(url, "_blank", "noopener");
    const phone = process.env.NEXT_PUBLIC_WHATSAPP || waDigits(contact.phone);
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(checkoutMessage(lines, total))}`, "_blank", "noopener");
  };

  return (
    <Modal open={open} onClose={() => setOpen(false)} label="السلة" variant="drawer">
      <div className="flex items-center justify-between border-b-2 border-dashed border-ink/10 p-5">
        <div className="flex gap-1 rounded-full bg-mint p-1">
          {(["cart", "wish"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className="relative rounded-full px-4 py-1.5 text-sm font-bold">
              {tab === t && <motion.span layoutId="drawer-tab" className="absolute inset-0 rounded-full bg-white shadow" />}
              <span className="relative inline-flex items-center gap-1.5">
                {t === "cart" ? <CartIcon size={16} /> : <HeartIcon size={16} />}
                {t === "cart" ? `السلة (${toArabicDigits(lines.length)})` : `المفضلة (${toArabicDigits(wishlist.length)})`}
              </span>
            </button>
          ))}
        </div>
        <button onClick={() => setOpen(false)} aria-label="إغلاق" className="grid h-10 w-10 place-items-center rounded-full hover:bg-ink/5">
          <CloseIcon />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5">
        {tab === "cart" ? (
          lines.length === 0 ? (
            <Empty text="السلة لسه فاضية" cta="روح الدكان" onClick={() => { setOpen(false); go("/products"); }} />
          ) : (
            <ul className="space-y-3">
              <AnimatePresence initial={false}>
                {lines.map(({ p, qty }) => (
                  <motion.li key={p.id} layout initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -60, height: 0 }} className="flex gap-3 rounded-2xl bg-white p-3">
                    <Link href={`/products/${p.id}`} onClick={() => setOpen(false)} className="shrink-0"><ProductArt p={p} compact className="h-20 w-20 rounded-xl" /></Link>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-bold leading-snug">{p.name}</span>
                        <button onClick={() => remove(p.id)} aria-label={`شيل ${p.name}`} className="text-ink/40 hover:text-[#C2263A]">
                          <TrashIcon size={18} />
                        </button>
                      </div>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-sm font-semibold text-purple">{egp(p.price * qty)}</span>
                        <div className="flex items-center gap-1 rounded-full bg-mint p-1">
                          <button onClick={() => setQty(p.id, qty + 1)} aria-label="زود" className="grid h-7 w-7 place-items-center rounded-full bg-white"><PlusIcon size={14} /></button>
                          <span className="w-6 text-center text-sm font-bold">{toArabicDigits(qty)}</span>
                          <button onClick={() => setQty(p.id, qty - 1)} aria-label="قلل" className="grid h-7 w-7 place-items-center rounded-full bg-white"><MinusIcon size={14} /></button>
                        </div>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )
        ) : wishlist.length === 0 ? (
          <Empty text="لسه مفيش حاجة في المفضلة" cta="اكتشف المنتجات" onClick={() => { setOpen(false); go("/products"); }} />
        ) : (
          <ul className="space-y-3">
            {wishlist.map((id) => productById[id]).filter(Boolean).map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-2xl bg-white p-3">
                <Link href={`/products/${p.id}`} onClick={() => setOpen(false)} className="shrink-0"><ProductArt p={p} compact className="h-16 w-16 rounded-xl" /></Link>
                <div className="flex-1">
                  <p className="font-bold">{p.name}</p>
                  <p className="text-sm text-purple">{egp(p.price)}</p>
                </div>
                <Button size="sm" onClick={() => { add(p.id); toggleWish(p.id); }}>للسلة</Button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {tab === "cart" && lines.length > 0 && (
        <div className="border-t-2 border-dashed border-ink/10 p-5">
          <div className="mb-3 h-2.5 overflow-hidden rounded-full bg-ink/10" dir="rtl">
            <motion.div className="h-full rounded-full bg-leaf" animate={{ width: `${Math.min(100, (total / freeShip) * 100)}%` }} />
          </div>
          <p className="mb-4 text-sm text-ink/65">
            {total >= freeShip ? "مبروك! طلبك عليه شحن مجاني 🎉" : `فاضلك ${egp(freeShip - total)} وتاخد شحن مجاني`}
          </p>
          <div className="mb-4 flex items-center justify-between text-lg font-bold">
            <span>الإجمالي</span>
            <span className="text-purple">{egp(total)}</span>
          </div>
          <AnimatePresence>
            {demoNote && (
              <motion.p
                role="status"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-3 overflow-hidden rounded-2xl bg-sand px-4 py-3 text-sm leading-6 text-ink/80"
              >
                ده تنفيذ تجريبي لتصميم زغاليل، فمفيش طلبات حقيقية بتتبعت ومفيش أي دفع. للتواصل مع المطوّر:{" "}
                <a href={DEMO_CONTACT_URL} target="_blank" rel="noopener noreferrer" className="font-bold underline underline-offset-4" dir="ltr">
                  youssefelsabbahy.com
                </a>
              </motion.p>
            )}
          </AnimatePresence>
          <Button size="lg" variant="leaf" className="w-full" onClick={checkout}>
            كمل الطلب
          </Button>
        </div>
      )}
    </Modal>
  );
}

function Empty({ text, cta, onClick }: { text: string; cta: string; onClick: () => void }) {
  return (
    <div className="grid h-full min-h-[50svh] place-items-center text-center">
      <div>
        <motion.div animate={{ rotate: [-6, 6, -6] }} transition={{ repeat: Infinity, duration: 2.4 }} className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-mint">
          <CartIcon size={40} />
        </motion.div>
        <p className="font-display mt-5 text-2xl">{text}</p>
        <Button className="mt-5" onClick={onClick}>{cta}</Button>
      </div>
    </div>
  );
}
