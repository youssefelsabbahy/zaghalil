"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { testimonials } from "@/content/site";
import { asset } from "@/lib/assets";
import { toArabicDigits } from "@/lib/format";
import { Pill, SplitHeading } from "@/components/ui/primitives";
import { ChevronIcon, StarIcon } from "@/components/ui/Icons";

/** Prev/next for the swipeable list (RTL: "next" travels left, so scrollLeft goes negative). */
function useRail() {
  const rail = useRef<HTMLUListElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });
  const measure = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const x = Math.abs(el.scrollLeft);
    setEdge({ start: x < 4, end: x > el.scrollWidth - el.clientWidth - 4 });
  }, []);
  useEffect(() => {
    const el = rail.current;
    if (!el) return;
    measure();
    el.addEventListener("scroll", measure, { passive: true });
    window.addEventListener("resize", measure);
    return () => {
      el.removeEventListener("scroll", measure);
      window.removeEventListener("resize", measure);
    };
  }, [measure]);
  const step = (dir: 1 | -1) => {
    const el = rail.current;
    const card = el?.querySelector("li");
    if (!el || !card) return;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 16;
    el.scrollBy({ left: -dir * (card.getBoundingClientRect().width + gap), behavior: "smooth" });
  };
  return { rail, edge, next: () => step(1), prev: () => step(-1) };
}

function RailButton({ label, disabled, onClick, flip }: { label: string; disabled: boolean; onClick: () => void; flip?: boolean }) {
  return (
    <motion.button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      whileTap={{ scale: 0.9 }}
      className="grid h-12 w-12 place-items-center rounded-full bg-mint text-ink shadow-[0_4px_0_0_var(--color-mint-deep)] transition-[opacity,transform,box-shadow] duration-200 hover:-translate-y-0.5 disabled:pointer-events-none disabled:opacity-35 disabled:shadow-none"
    >
      <ChevronIcon size={22} className={flip ? "rotate-180" : undefined} />
    </motion.button>
  );
}

export function Testimonials() {
  const { rail, edge, next, prev } = useRail();
  return (
    <section id="testimonials" className="relative py-20 lg:py-24">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <Pill>{testimonials.eyebrow}</Pill>
        <div className="mt-5 flex items-end justify-between gap-4">
          <SplitHeading text={testimonials.title} className="text-[clamp(2.2rem,4.4vw,3.6rem)] text-ink" />
          {/* opposite the title; only while the cards are a swipeable rail */}
          <div className="mb-1 flex shrink-0 gap-2.5 lg:hidden">
            <RailButton label="الرأي اللي قبله" disabled={edge.start} onClick={prev} />
            <RailButton label="الرأي اللي بعده" disabled={edge.end} onClick={next} flip />
          </div>
        </div>
      </div>
      <ul
        ref={rail}
        className="no-scrollbar mx-auto mt-10 flex max-w-[1240px] snap-x snap-mandatory scroll-px-4 gap-4 overflow-x-auto px-4 pb-6 sm:scroll-px-6 sm:px-6 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-8"
      >
        {testimonials.items.map((t, i) => {
          const avatar = asset(`avatars/${t.id}`);
          return (
            <motion.li
              key={t.id}
              initial={{ opacity: 0, y: 40, rotate: i === 1 ? 0 : i ? 2 : -2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, margin: "0px 0px -60px 0px" }}
              transition={{ type: "spring", stiffness: 160, damping: 18, delay: i * 0.1 }}
              whileHover={{ y: -8, rotate: i % 2 ? 1 : -1 }}
              className="relative w-[76vw] max-w-[380px] shrink-0 snap-start rounded-[1.6rem] bg-sand p-7 shadow-[0_14px_30px_-22px_rgba(0,0,0,0.4)] lg:w-auto lg:max-w-none"
            >
              <span aria-hidden className="font-display pointer-events-none absolute left-5 top-2 text-[5rem] leading-none text-orange/20">”</span>
              <div className="flex gap-1 text-orange" aria-label={`${toArabicDigits(t.stars)} نجوم`}>
                {Array.from({ length: t.stars }, (_, s) => (
                  <motion.span
                    key={s}
                    initial={{ scale: 0, rotate: -90 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{ type: "spring", stiffness: 500, damping: 12, delay: 0.3 + i * 0.1 + s * 0.08 }}
                  >
                    <StarIcon size={18} />
                  </motion.span>
                ))}
              </div>
              <blockquote className="mt-4 min-h-[6.5rem] text-[16px] leading-8 text-ink/85">“{t.quote}”</blockquote>
              <div className="mt-5 flex items-center gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center overflow-hidden rounded-full bg-[#FFE07A] font-bold text-ink ring-2 ring-white">
                  {avatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={avatar} alt="" className="h-full w-full object-cover" loading="lazy" />
                  ) : (
                    t.initial
                  )}
                </span>
                <span>
                  <span className="block font-bold text-ink">{t.name}</span>
                  <span className="block text-sm text-ink/55" dir="ltr">{toArabicDigits(t.date)}</span>
                </span>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
