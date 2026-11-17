"use client";

import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CartDrawer } from "@/components/overlays/Commerce";
import { SearchOverlay } from "@/components/overlays/Search";
import { Toast } from "@/components/overlays/Toast";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

/** Chrome shared by every page: header, footer, cart, search, toasts. */
export function SiteShell({ children }: { children: ReactNode }) {
  return (
    <>
      <ScrollProgress />
      <Header />
      {children}
      <Footer />
      <CartDrawer />
      <SearchOverlay />
      <Toast />
    </>
  );
}
