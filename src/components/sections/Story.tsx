"use client";

import { motion, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useGo } from "@/lib/nav";
import { story } from "@/content/site";
import { toArabicDigits } from "@/lib/format";
import { Button, CharacterArt, Pill, Reveal, SplitHeading } from "@/components/ui/primitives";

/**
 * The design's milestone marker: Figma star (9 points, inner radius 43.6%) with its corners fully
 * rounded — every corner is an arc tangent to the edges at their midpoints, exactly as Figma clamps it.
 */
const BADGE_PATH = "M23.136 7.379A1.923 1.923 0 0 1 26.864 7.379L26.864 7.379A5.168 5.168 0 0 0 34.899 10.303L34.899 10.303A1.923 1.923 0 0 1 37.755 12.699L37.755 12.699A5.168 5.168 0 0 0 42.030 20.104L42.030 20.104A1.923 1.923 0 0 1 42.677 23.776L42.677 23.776A5.168 5.168 0 0 0 41.193 32.196L41.193 32.196A1.923 1.923 0 0 1 39.329 35.425L39.329 35.425A5.168 5.168 0 0 0 32.778 40.921L32.778 40.921A1.923 1.923 0 0 1 29.275 42.196L29.275 42.196A5.168 5.168 0 0 0 20.725 42.196L20.725 42.196A1.923 1.923 0 0 1 17.222 40.921L17.222 40.921A5.168 5.168 0 0 0 10.671 35.425L10.671 35.425A1.923 1.923 0 0 1 8.807 32.196L8.807 32.196A5.168 5.168 0 0 0 7.323 23.776L7.323 23.776A1.923 1.923 0 0 1 7.970 20.104L7.970 20.104A5.168 5.168 0 0 0 12.245 12.699L12.245 12.699A1.923 1.923 0 0 1 15.101 10.303L15.101 10.303A5.168 5.168 0 0 0 23.136 7.379Z";

function Badge({ color, className }: { color: string; className?: string }) {
  return (
    <svg viewBox="6.1 6.1 37.8 37.8" className={className} aria-hidden>
      <path d={BADGE_PATH} fill={color} />
    </svg>
  );
}

/* Shared geometry so the dashed spine always runs through the marker centres. */
const ROW = "gap-4 sm:gap-6";
const YEAR_W = "w-[4.2rem] sm:w-[5rem]";
const MARK = "h-9 w-9 sm:h-11 sm:w-11";
// right offset of a marker centre = year width + gap + half the marker
const SPINE_RIGHT = "right-[calc(4.2rem+1rem+1.125rem-1px)] sm:right-[calc(5rem+1.5rem+1.375rem-1px)]";
const SPINE_TOP = "top-[calc(0.25rem+1.125rem)] sm:top-[calc(0.25rem+1.375rem)]";
const DASH = "bg-[repeating-linear-gradient(to_bottom,currentColor_0_10px,transparent_10px_20px)]";

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
  const markScale = useTransform(t, [0.15, 0.55, 0.75], [0, 1.2, 1]);
  const markRotate = useTransform(t, [0.15, 0.75], [-120, 0]);
  // the dashed segment down to the next marker draws itself as the next milestone arrives
  const seg = useTransform(progress, [start + span * 0.6, start + span * 1.2], [0, 1], { clamp: true });
  const last = i === count - 1;
  const textY = useTransform(t, [0.3, 1], [24, 0]);
  const textOpacity = useTransform(t, [0.3, 0.9], [0, 1]);
  const blur = useTransform(t, [0.3, 0.9], ["blur(6px)", "blur(0px)"]);

  return (
    <li className={`relative flex items-start ${ROW}`}>
      {!last && (
        <>
          {/* segment from this marker to the next one (li height + the 3rem list gap) */}
          <span aria-hidden className={`absolute ${SPINE_RIGHT} ${SPINE_TOP} h-[calc(100%+3rem)] w-[2px] text-white/25 ${DASH}`} />
          <motion.span aria-hidden style={{ scaleY: seg }} className={`absolute ${SPINE_RIGHT} ${SPINE_TOP} h-[calc(100%+3rem)] w-[2px] origin-top text-white ${DASH}`} />
        </>
      )}
      <motion.span style={{ x: yearX, opacity: yearOpacity }} className={`font-display ${YEAR_W} shrink-0 text-[2.1rem] leading-none text-white sm:text-[2.6rem]`}>
        {toArabicDigits(m.year)}
      </motion.span>
      <motion.span style={{ scale: markScale, rotate: markRotate }} className="relative z-10 mt-1 shrink-0">
        <Badge color={m.color} className={`block ${MARK}`} />
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

  const bunnyY = useTransform(p, [0, 1], [90, -10]);
  const bunnyRotate = useTransform(p, [0, 0.5, 1], [-8, 4, 0]);
  const hint = useTransform(p, [0, 0.06], [1, 0]);

  return (
    <div ref={track} style={pin ? { height: `calc(${height}px + 160vh)` } : undefined} className="relative">
      <div ref={card} style={pin ? { position: "sticky", top } : undefined}>
        <div className="grain relative overflow-hidden rounded-[2.2rem] bg-purple px-6 pt-12 pb-[12.5rem] sm:px-12 sm:pb-[14rem] lg:px-16 lg:py-16">
          <div className="relative z-10 lg:w-[68%]">
            <ol className="relative space-y-12">
              {story.milestones.map((m, i) => (
                <MilestoneRow key={m.year} m={m} i={i} count={story.milestones.length} progress={p} />
              ))}
            </ol>
          </div>

          <motion.div
            style={{ y: bunnyY, rotate: bunnyRotate }}
            className="pointer-events-none absolute bottom-0 left-6 w-[34%] max-w-[140px] origin-bottom sm:left-10 sm:max-w-[160px] lg:left-14 lg:w-[20%] lg:max-w-[230px]"
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
