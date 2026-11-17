"use client";
import type Lenis from "lenis";

let instance: Lenis | null = null;
export const registerLenis = (l: Lenis | null) => {
  instance = l;
};
export const getLenis = () => instance;

/** Smooth-scrolls to "#id" (Lenis when active, native otherwise). */
export function scrollToHash(href: string) {
  if (!href.startsWith("#")) return;
  const el = href === "#home" ? document.body : document.querySelector(href);
  if (!el) return;
  if (instance?.isStopped) {
    instance.start();
    document.documentElement.style.overflow = "";
  }
  // html scroll-padding-top (6rem) clears the header
  if (instance) instance.scrollTo(el as HTMLElement, { duration: 1.4, easing: (t) => (t < 0.5 ? 8 * t ** 4 : 1 - (-2 * t + 2) ** 4 / 2) });
  else (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" });
  history.replaceState(null, "", href === "#home" ? location.pathname : href);
}

export const lockScroll = (locked: boolean) => {
  if (instance) {
    if (locked) instance.stop();
    else if (instance.isStopped) instance.start();
  }
  document.documentElement.style.overflow = locked ? "hidden" : "";
};
