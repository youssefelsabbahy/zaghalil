"use client";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { cancelFrame, frame } from "framer-motion";
import { useEffect } from "react";
import { getLenis, registerLenis } from "@/lib/scroll";

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      autoRaf: false,
      // ~1.1s exponential glide: responsive on the first frame, soft landing, no floaty tail.
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 0.9,
      // Phones keep their native momentum (feels best on touch).
      syncTouch: false,
      touchMultiplier: 1,
    });
    registerLenis(lenis);
    // Same frame loop as Framer Motion → scroll-linked animations move in lockstep, no jitter.
    const tick = ({ timestamp }: { timestamp: number }) => lenis.raf(timestamp);
    frame.update(tick, true);
    return () => {
      cancelFrame(tick);
      lenis.destroy();
      registerLenis(null);
    };
  }, []);

  // New page → start at the top (unless the URL targets a section).
  useEffect(() => {
    const lenis = getLenis();
    const hash = window.location.hash;
    const target = hash && hash.length > 1 ? document.querySelector(hash) : null;
    if (target) {
      requestAnimationFrame(() => (target as HTMLElement).scrollIntoView({ block: "start" }));
      return;
    }
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
