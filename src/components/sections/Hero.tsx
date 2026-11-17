"use client";

import dynamic from "next/dynamic";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { characterById, hero, swingCast, ticker } from "@/content/site";
import { asset, firstAsset } from "@/lib/assets";
import { useGo } from "@/lib/nav";
import { Button, Cloud, Flower, Spark, Wordmark } from "@/components/ui/primitives";
import type { SeatSpec } from "@/components/three/SwingScene";

const SwingScene = dynamic(() => import("@/components/three/SwingScene"), { ssr: false });

const seatSpec = (id: keyof typeof characterById): SeatSpec => {
  const c = characterById[id];
  return { id, name: c.name, plush: c.plush, texture: asset(`characters/${id}`) };
};

function useInView<T extends Element>(ref: React.RefObject<T | null>) {
  const [inView, setInView] = useState(true);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px" });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref]);
  return inView;
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const active = useInView(stage);
  const [ready, setReady] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const textY = useTransform(scrollYProgress, [0, 1], [0, reduce ? 0 : 120]);
  const stageScale = useTransform(scrollYProgress, [0, 1], [1, reduce ? 1 : 0.92]);
  const fade = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const go = useGo();
  const seats = swingCast.map(seatSpec);
  const perch = seatSpec("otteya");

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 120);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="home" ref={ref} className="relative overflow-hidden pt-20 lg:pt-24">

      <div className="relative mx-auto grid max-w-[1240px] items-center gap-2 px-4 sm:px-6 lg:min-h-[calc(100svh-6rem-56px)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-6 lg:px-8">
        {/* Copy (start column = right in RTL) */}
        <motion.div style={{ y: textY, opacity: fade }} className="relative z-10 order-2 pb-10 text-center lg:order-1 lg:pb-0 lg:text-right">
          <h1 className="font-display text-[clamp(2.6rem,6.4vw,5.6rem)] leading-[1.12] text-ink">
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            >
              {hero.titleTop}
            </motion.span>
            <motion.span
              className="block"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {hero.titleWorld}{" "}
              <motion.span
                className="relative inline-block text-leaf"
                initial={{ scale: 0.4, rotate: -12, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 12, delay: 0.7 }}
                whileHover={{ rotate: [0, -4, 4, -2, 0], transition: { duration: 0.6 } }}
              >
                <Wordmark logoEm={0.92} className="translate-y-[0.06em]" />
                <Spark className="absolute -left-[0.4em] top-[0.04em] h-[0.48em] w-[0.48em] -rotate-[38deg] animate-wiggle" />
              </motion.span>
            </motion.span>
          </h1>
          <motion.p
            className="mx-auto mt-5 max-w-md text-[17px] leading-8 text-ink/80 lg:mx-0 lg:text-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.55 }}
          >
            {hero.body}
          </motion.p>
          <motion.div
            className="mt-8 flex justify-center lg:justify-start"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
          >
            <Button size="lg" onClick={() => go("/characters")}>
              {hero.cta}
            </Button>
          </motion.div>
        </motion.div>

        {/* 3D swing stage */}
        <motion.div
          ref={stage}
          style={{ scale: stageScale }}
          className="relative order-1 aspect-[1/1] w-full [mask-image:linear-gradient(90deg,transparent,#000_7%,#000_93%,transparent)] sm:aspect-[5/4] lg:order-2 lg:aspect-auto lg:h-[min(78svh,720px)]"
        >
          {/* static layer shown while WebGL boots (and for no-WebGL devices) */}
          <div aria-hidden className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}>
            <Cloud className="absolute left-[6%] top-[14%] w-[20%] animate-float" />
            <Cloud className="absolute right-[22%] top-[6%] w-[16%] animate-float [animation-delay:-2s]" />
            <Cloud className="absolute right-[2%] top-[30%] w-[15%] animate-float [animation-delay:-4s]" />
            <div className="absolute bottom-[8%] left-1/2 h-10 w-3/4 -translate-x-1/2 rounded-[50%] bg-[radial-gradient(closest-side,rgba(60,50,40,0.22),transparent)]" />
          </div>
          <motion.div
            className="absolute inset-0"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 30 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            role="img"
            aria-label="شلة زغاليل قاعدين على المرجيحة"
          >
            {ready && <SwingScene seats={seats} perch={perch} active={active} />}
          </motion.div>
          <p className="pointer-events-none absolute bottom-2 left-1/2 hidden -translate-x-1/2 rounded-full bg-white/70 px-3 py-1 text-xs text-ink/60 backdrop-blur lg:block">
            اسحب المرجيحة وزقها 👋
          </p>
        </motion.div>
      </div>

      <Ticker />
    </section>
  );
}

export function Ticker() {
  const icon = firstAsset("brand/mascot", "characters/zaghloul");
  const row = (
    <ul className="flex shrink-0 items-center">
      {ticker.map((t) => (
        <li key={t} className="flex items-center gap-6 px-6 text-[15px] font-semibold text-white sm:text-base">
          <span className="whitespace-nowrap">{t}</span>
          {icon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={icon} alt="" className="h-8 w-8 object-contain" />
          ) : (
            <Flower color="#CAF4C3" className="h-6 w-6 animate-[spin_8s_linear_infinite]" />
          )}
        </li>
      ))}
    </ul>
  );
  return (
    <div className="relative z-10 -mt-1 overflow-hidden bg-purple py-3.5 shadow-[0_-6px_0_0_rgba(0,0,0,0.04)_inset]" aria-label="آخر الأخبار">
      <div className="group flex w-max animate-marquee hover:[animation-play-state:paused]" style={{ ["--marquee-duration" as string]: "38s" }}>
        {row}
        {row}
        {row}
        {row}
      </div>
    </div>
  );
}
