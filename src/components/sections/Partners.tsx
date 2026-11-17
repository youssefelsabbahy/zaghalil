"use client";

import { animate, motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { partners } from "@/content/site";
import { asset } from "@/lib/assets";
import { cn, toArabicDigits } from "@/lib/format";
import { Pill, SplitHeading } from "@/components/ui/primitives";

function CountUp({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const c = animate(0, value, { duration: 1.8, ease: [0.22, 1, 0.36, 1], onUpdate: (v) => setN(Math.round(v)) });
    return () => c.stop();
  }, [inView, value]);
  return (
    <span ref={ref} dir="ltr" className="tabular-nums">
      {suffix === "٪" ? `${suffix} ${toArabicDigits(n)}` : `${prefix} ${toArabicDigits(n)}${suffix}`}
    </span>
  );
}

function Logo({ id, name, latin }: { id: string; name: string; latin?: boolean }) {
  const src = asset(`partners/${id}`);
  return (
    <li className="grid h-24 w-48 shrink-0 place-items-center px-6 grayscale-[35%] transition duration-300 hover:scale-110 hover:grayscale-0">
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={name} className="max-h-16 w-auto object-contain mix-blend-multiply" loading="lazy" />
      ) : (
        <span className={cn("whitespace-nowrap text-ink/70", latin ? "text-2xl font-black tracking-[0.18em] uppercase" : "font-display text-3xl")}>
          {name}
        </span>
      )}
    </li>
  );
}

export function LogoMarquee({ className }: { className?: string }) {
  const row = partners.logos.map((l) => <Logo key={l.id} {...l} />);
  return (
      <div className={cn("relative overflow-hidden", className, "[mask-image:linear-gradient(90deg,transparent,#000_14%,#000_86%,transparent)]")}>
        <ul className="flex w-max animate-marquee items-center hover:[animation-play-state:paused]" style={{ ["--marquee-duration" as string]: "40s" }}>
          {row}
          {row}
        </ul>
      </div>
  );
}

export function Partners() {
  return (
    <section id="partners" className="relative mx-auto max-w-[1240px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <Pill>{partners.eyebrow}</Pill>
      <SplitHeading text={partners.title} className="mt-5 text-[clamp(2.2rem,4.4vw,3.6rem)] text-ink" />

      <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-10 lg:grid-cols-4">
        {partners.stats.map((s, i) => (
          <motion.li
            key={s.label}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 200, damping: 16, delay: i * 0.08 }}
            className="text-center"
          >
            <div className="font-display text-[clamp(2.8rem,5vw,4.2rem)] leading-none text-leaf">
              <CountUp {...s} />
            </div>
            <p className="mt-3 text-[17px] text-ink/75">{s.label}</p>
          </motion.li>
        ))}
      </ul>

      <LogoMarquee className="mt-14" />
    </section>
  );
}
