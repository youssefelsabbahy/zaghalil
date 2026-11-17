"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useGo } from "@/lib/nav";
import { story } from "@/content/site";
import { toArabicDigits } from "@/lib/format";
import { Button, CharacterArt, Flower, Pill, Reveal, SplitHeading } from "@/components/ui/primitives";

export function Story() {
  const go = useGo();

  return (
    <section id="story" className="relative mx-auto max-w-[1240px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="flex justify-start">
        <Pill>{story.eyebrow}</Pill>
      </div>

      <div className="mt-6 grid items-end gap-4 lg:grid-cols-2">
        <SplitHeading text={story.title} className="text-[clamp(2.2rem,4.4vw,3.6rem)] text-ink" />
        <Reveal delay={0.15} className="max-w-md text-[17px] leading-8 text-ink/75 lg:justify-self-end">
          {story.lead}
        </Reveal>
      </div>

      <Reveal y={50} className="mt-10">
        <TimelineCard />
      </Reveal>


      <div className="mt-10 flex justify-center">
        <Button variant="mint" onClick={() => go("/about")}>
          {story.cta}
        </Button>
      </div>
    </section>
  );
}

type Milestone = (typeof story.milestones)[number];

/** Desktop: is there room to pin the card for a slow, scroll-driven reveal? */
function usePinnable(card: React.RefObject<HTMLDivElement | null>) {
  const [state, setState] = useState({ pin: false, top: 96, height: 0 });
  useEffect(() => {
    const el = card.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    const measure = () => {
      const h = el.offsetHeight;
      const vh = window.innerHeight;
      const pin = window.innerWidth >= 1024 && !reduce.matches && h + 120 < vh;
      setState({ pin, top: Math.max(96, Math.round((vh - h) / 2 + 30)), height: h });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [card]);
  return state;
}

/** One milestone whose entrance is driven by a 0→1 progress value. */
function MilestoneRow({ m, progress, i, count }: { m: Milestone; progress: MotionValue<number>; i: number; count: number }) {
  const span = 0.8 / count;
  const start = 0.08 + i * span;
  const end = start + span * 0.85;
  const t = useTransform(progress, [start, end], [0, 1], { clamp: true });
  const yearX = useTransform(t, [0, 0.6], [60, 0]);
  const yearOpacity = useTransform(t, [0, 0.45], [0, 1]);
  const flowerScale = useTransform(t, [0.15, 0.55, 0.75], [0, 1.25, 1]);
  const flowerRotate = useTransform(t, [0.15, 0.75], [-160, 0]);
  const textY = useTransform(t, [0.3, 1], [24, 0]);
  const textOpacity = useTransform(t, [0.3, 0.9], [0, 1]);
  const blur = useTransform(t, [0.3, 0.9], ["blur(6px)", "blur(0px)"]);
  const glow = useTransform(t, [0.5, 0.8, 1], [0, 1, 0.35]);

  return (
    <li className="relative flex items-start gap-4 sm:gap-6">
      <motion.span style={{ x: yearX, opacity: yearOpacity }} className="font-display w-[4.2rem] shrink-0 text-[2.1rem] leading-none text-white sm:w-[5rem] sm:text-[2.6rem]">
        {toArabicDigits(m.year)}
      </motion.span>
      <motion.span style={{ scale: flowerScale, rotate: flowerRotate }} className="relative z-10 mt-1 shrink-0">
        <motion.span
          aria-hidden
          style={{ opacity: glow, background: m.color }}
          className="absolute inset-[-10px] rounded-full blur-md"
        />
        <Flower color={m.color} className="relative h-8 w-8" />
      </motion.span>
      <motion.div style={{ y: textY, opacity: textOpacity, filter: blur }} className="pt-0.5">
        <h3 className="font-display text-xl text-white sm:text-2xl">{m.title}</h3>
        <p className="mt-2 max-w-md text-[15px] leading-7 text-white/85">{m.body}</p>
      </motion.div>
    </li>
  );
}

/** Purple milestone card (home + /about). Pinned with a slow scroll-driven reveal on desktop. */
export function TimelineCard() {
  const track = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { pin, top, height } = usePinnable(card);

  // Pinned: progress runs while the card is held in place (≈1.6 screens of scrolling).
  // Not pinned (phones): progress runs as the card travels through the viewport.
  const { scrollYProgress } = useScroll({
    target: track,
    offset: pin ? [`start ${top}px`, `end ${top + height}px`] : ["start 85%", "end 55%"],
  });
  const progress = useSpring(scrollYProgress, { stiffness: 55, damping: 22, mass: 0.6, restDelta: 0.0005 });
  const settled = useMotionValue(1);
  const p = reduce ? settled : progress;

  const line = useTransform(p, [0.04, 0.88], [0, 1], { clamp: true });
  const bunnyY = useTransform(p, [0, 1], [90, -10]);
  const bunnyRotate = useTransform(p, [0, 0.5, 1], [-8, 4, 0]);
  const hint = useTransform(p, [0, 0.06], [1, 0]);

  return (
    <div ref={track} style={pin ? { height: `calc(${height}px + 160vh)` } : undefined} className="relative">
      <div ref={card} style={pin ? { position: "sticky", top } : undefined}>
        <div className="grain relative overflow-hidden rounded-[2.2rem] bg-purple px-6 py-12 sm:px-12 lg:px-16 lg:py-16">
          <div className="relative z-10 lg:w-[68%]">
            {/* dashed spine: faint track + the part already "drawn" */}
            <div aria-hidden className="absolute right-[5.4rem] top-4 bottom-4 w-0 border-r-2 border-dashed border-white/25 sm:right-[6.4rem]" />
            <motion.div
              aria-hidden
              style={{ scaleY: line }}
              className="absolute right-[5.4rem] top-4 bottom-4 w-0 origin-top border-r-2 border-dashed border-white sm:right-[6.4rem]"
            />
            <ol className="relative space-y-12">
              {story.milestones.map((m, i) => (
                <MilestoneRow key={m.year} m={m} i={i} count={story.milestones.length} progress={p} />
              ))}
            </ol>
          </div>

          <motion.div
            style={{ y: bunnyY, rotate: bunnyRotate }}
            className="pointer-events-none absolute bottom-0 left-4 w-[30%] max-w-[230px] origin-bottom sm:left-10 lg:left-14 lg:w-[20%]"
          >
            <motion.div animate={{ rotate: [-2, 2, -2] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} className="origin-bottom">
              <CharacterArt id="zouina" pose="sitting" className="w-full" />
            </motion.div>
          </motion.div>

          {pin && (
            <motion.p
              aria-hidden
              style={{ opacity: hint }}
              className="absolute bottom-5 left-1/2 -translate-x-1/2 rounded-full bg-white/15 px-4 py-1.5 text-xs font-semibold text-white"
            >
              كمل سكرول ↓
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
}
