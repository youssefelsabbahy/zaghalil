"use client";

import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { nav } from "@/content/site";
import { useStore } from "@/lib/store";
import { lockScroll, scrollToHash } from "@/lib/scroll";
import { navKey, useGo } from "@/lib/nav";
import { cn, toArabicDigits } from "@/lib/format";
import { Wordmark } from "@/components/ui/primitives";
import { CartIcon, CloseIcon, HeartIcon, MenuIcon, SearchIcon } from "@/components/ui/Icons";

function Badge({ n }: { n: number }) {
  return (
    <AnimatePresence>
      {n > 0 && (
        <motion.span
          key={n}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ type: "spring", stiffness: 600, damping: 15 }}
          className="absolute -top-1.5 -left-1.5 grid h-5 min-w-5 place-items-center rounded-full bg-orange px-1 text-[11px] font-bold leading-none text-white ring-2 ring-cream"
        >
          {toArabicDigits(n)}
        </motion.span>
      )}
    </AnimatePresence>
  );
}

function IconBtn({ label, onClick, children }: { label: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      onClick={onClick}
      whileHover={{ scale: 1.12, rotate: -6 }}
      whileTap={{ scale: 0.88 }}
      className="relative grid h-10 w-10 place-items-center rounded-full text-ink transition-colors hover:bg-white/70"
    >
      {children}
    </motion.button>
  );
}

export function Header() {
  const pathname = usePathname();
  const active = navKey(pathname);
  const goTo = useGo();
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const cartCount = useStore((s) => s.cart.reduce((a, l) => a + l.qty, 0));
  const wishCount = useStore((s) => s.wishlist.length);
  const setCartOpen = useStore((s) => s.setCartOpen);
  const setSearchOpen = useStore((s) => s.setSearchOpen);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  // Hide while travelling down, stay hidden when the scroll settles, reveal only on a
  // deliberate scroll up. Distance is accumulated per direction so the tiny deltas of
  // smooth-scroll deceleration never flip the state.
  const travel = useRef(0);
  useMotionValueEvent(scrollY, "change", (y) => {
    const prev = scrollY.getPrevious() ?? y;
    const delta = y - prev;
    setScrolled(y > 24);
    if (y < 140 || menu) {
      travel.current = 0;
      setHidden(false);
      return;
    }
    if (delta === 0) return;
    if (Math.sign(delta) !== Math.sign(travel.current)) travel.current = 0;
    travel.current += delta;
    if (travel.current > 28) setHidden(true);
    else if (travel.current < -14) setHidden(false);
  });

  useEffect(() => lockScroll(menu), [menu]);
  useEffect(() => {
    setMenu(false);
    setHidden(false);
  }, [pathname]);

  const go = (href: string) => {
    setMenu(false);
    setTimeout(() => (href === pathname ? scrollToHash("#home") : goTo(href)), 60);
  };

  const openWishlist = () => {
    useStore.setState({ cartOpen: true });
    window.dispatchEvent(new CustomEvent("zaghalil:drawer-tab", { detail: "wish" }));
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: hidden ? -110 : 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 30 }}
        className="fixed inset-x-0 top-0 z-50"
      >
        <div
          className={cn(
            "mx-auto flex max-w-[1240px] items-center justify-between gap-4 px-4 transition-all duration-500 sm:px-6 lg:px-8",
            scrolled ? "mt-2 h-16 rounded-full bg-cream/85 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.18)] backdrop-blur-xl sm:mx-4 lg:mx-auto" : "h-20 lg:h-24"
          )}
        >
          {/* Logo (start / right in RTL) */}
          <Link
            href="/"
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                scrollToHash("#home");
              }
            }}
            className="order-2 lg:order-1"
            aria-label="زغاليل — الرئيسية"
          >
            <motion.span whileHover={{ rotate: [-2, 3, -2, 0], scale: 1.05 }} transition={{ duration: 0.5 }} className="inline-block">
              <Wordmark className="text-[2.3rem] lg:text-[2.8rem]" />
            </motion.span>
          </Link>

          {/* Desktop nav pill */}
          <nav aria-label="القائمة الرئيسية" className="order-2 hidden lg:block">
            <ul className="relative flex items-center gap-1 rounded-full bg-mint px-3 py-2">
              {nav.map((item) => {
                const isActive = item.href === active;
                return (
                  <li key={item.label} className="relative">
                    {isActive && (
                      <motion.span
                        layoutId="nav-active"
                        className="absolute inset-0 rounded-full bg-white/80 shadow-[0_3px_0_0_var(--color-mint-deep)]"
                        transition={{ type: "spring", stiffness: 420, damping: 32 }}
                      />
                    )}
                    <Link
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      onClick={(e) => {
                        if (item.href === pathname) {
                          e.preventDefault();
                          scrollToHash("#home");
                        }
                      }}
                      className={cn(
                        "relative z-10 block rounded-full px-4 py-1.5 text-[15px] transition-colors",
                        isActive ? "font-bold text-ink" : "font-medium text-ink/75 hover:text-ink"
                      )}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Desktop actions pill */}
          <div className="order-3 hidden items-center gap-1 rounded-full bg-mint px-2 py-1.5 lg:flex">
            <IconBtn label="المفضلة" onClick={openWishlist}>
              <HeartIcon />
              {mounted && <Badge n={wishCount} />}
            </IconBtn>
            <IconBtn label="السلة" onClick={() => setCartOpen(true)}>
              <CartIcon />
              {mounted && <Badge n={cartCount} />}
            </IconBtn>
            <IconBtn label="بحث" onClick={() => setSearchOpen(true)}>
              <SearchIcon />
            </IconBtn>
          </div>

          {/* Mobile: [menu + cart] (start) … logo … search (end) */}
          <div className="order-1 flex items-center gap-1 lg:hidden">
            <IconBtn label={menu ? "إغلاق القائمة" : "فتح القائمة"} onClick={() => setMenu((v) => !v)}>
              {menu ? <CloseIcon size={24} /> : <MenuIcon size={24} />}
            </IconBtn>
            <IconBtn label="السلة" onClick={() => setCartOpen(true)}>
              <CartIcon size={22} />
              {mounted && <Badge n={cartCount} />}
            </IconBtn>
          </div>
          <div className="order-3 lg:hidden">
            <IconBtn label="بحث" onClick={() => setSearchOpen(true)}>
              <SearchIcon size={22} />
            </IconBtn>
          </div>
        </div>
      </motion.header>

      {/* Mobile menu sheet */}
      <AnimatePresence>
        {menu && (
          <motion.div
            className="fixed inset-0 z-40 bg-cream lg:hidden"
            initial={{ clipPath: "circle(0% at 92% 4%)" }}
            animate={{ clipPath: "circle(150% at 92% 4%)" }}
            exit={{ clipPath: "circle(0% at 92% 4%)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.ul
              className="flex h-full flex-col justify-center gap-2 px-8 pt-16"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.06, delayChildren: 0.15 } } }}
            >
              {nav.map((item) => (
                <motion.li
                  key={item.label}
                  variants={{ hidden: { opacity: 0, x: 40 }, show: { opacity: 1, x: 0 } }}
                  transition={{ type: "spring", stiffness: 300, damping: 24 }}
                >
                  <a
                    href={item.href}
                    aria-current={item.href === active ? "page" : undefined}
                    onClick={(e) => {
                      e.preventDefault();
                      go(item.href);
                    }}
                    className="font-display flex items-center justify-between border-b-2 border-dashed border-ink/10 py-4 text-4xl text-ink"
                  >
                    {item.label}
                    <span className={cn("h-3 w-3 rounded-full", item.href === active ? "bg-orange" : "bg-leaf")} />
                  </a>
                </motion.li>
              ))}
              <motion.li
                variants={{ hidden: { opacity: 0 }, show: { opacity: 1 } }}
                className="mt-6 flex gap-3"
              >
                <button onClick={() => { setMenu(false); openWishlist(); }} className="flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-mint font-bold">
                  <HeartIcon /> المفضلة {mounted && wishCount > 0 && `(${toArabicDigits(wishCount)})`}
                </button>
              </motion.li>
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
