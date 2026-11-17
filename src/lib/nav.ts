"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";
import { scrollToHash } from "./scroll";

/**
 * Navigate to "/route", "/route?x=y", "/#section" or "#section".
 * Same-page anchors scroll smoothly; everything else is a client-side route change.
 */
export function useGo() {
  const router = useRouter();
  const pathname = usePathname();
  return useCallback(
    (href: string) => {
      const [path, hash] = href.split("#");
      const target = path || pathname;
      if (target === pathname && hash !== undefined) {
        scrollToHash(`#${hash || "home"}`);
        return;
      }
      router.push(href);
    },
    [router, pathname]
  );
}

/** Which top-level nav item a pathname belongs to. */
export function navKey(pathname: string) {
  if (pathname === "/") return "/";
  const first = "/" + (pathname.split("/")[1] ?? "");
  return first;
}
