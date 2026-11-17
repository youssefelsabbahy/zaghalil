"use client";
import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { getLenis, registerLenis } from "@/lib/scroll";

export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, smoothWheel: true, syncTouch: false });
    registerLenis(lenis);
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
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
