import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SiteShell } from "@/components/shell/SiteShell";

const cairo = localFont({
  src: [
    { path: "../fonts/cairo-arabic-wght-normal.woff2", weight: "200 1000", style: "normal" },
    { path: "../fonts/cairo-latin-wght-normal.woff2", weight: "200 1000", style: "normal" },
  ],
  variable: "--font-cairo",
  display: "swap",
});

// Free rounded display face standing in for the commercial "Rabie" until its licensed files are added.
const baloo = localFont({
  src: [
    { path: "../fonts/baloo-bhaijaan-2-arabic-600-normal.woff2", weight: "600" },
    { path: "../fonts/baloo-bhaijaan-2-arabic-700-normal.woff2", weight: "700" },
    { path: "../fonts/baloo-bhaijaan-2-arabic-800-normal.woff2", weight: "800" },
    { path: "../fonts/baloo-bhaijaan-2-latin-700-normal.woff2", weight: "700" },
    { path: "../fonts/baloo-bhaijaan-2-latin-800-normal.woff2", weight: "800" },
  ],
  variable: "--font-baloo",
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  // Vercel sets VERCEL_PROJECT_PRODUCTION_URL (e.g. zaghalil.vercel.app) at build time.
  metadataBase: new URL(
    process.env.VERCEL_PROJECT_PRODUCTION_URL ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}` : "http://localhost:3000"
  ),
  // Unofficial implementation. Original design, characters & IP © Rana Elabd and Rahma Gamal.
  authors: [
    { name: "Rana Elabd (original design)", url: "https://www.behance.net/ranaelabd1" },
    { name: "Rahma Gamal (original design)", url: "https://www.behance.net/rahmaelabd" },
    { name: "Youssef Elsabbahy (development)", url: "https://youssefelsabbahy.com" },
  ],
  creator: "Youssef Elsabbahy",
  title: { default: "زغاليل | أول عالم كرتوني مصري متكامل", template: "%s | زغاليل" },
  description:
    "شخصيات كرتونية مصرية تصنع محتوى ترفيهي آمن وممتع لكل أفراد العائلة. من سن 7 لـ 77 سنة. حلقات، أغاني، دكان، وعروض مسرحية.",
  openGraph: {
    title: "زغاليل — اهلاً بيك في عالم زغاليل",
    description: "شخصيات كرتونية مصرية تصنع محتوى ترفيهي آمن وممتع لكل أفراد العائلة.",
    locale: "ar_EG",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFF0",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" className={`${cairo.variable} ${baloo.variable}`}>
      <body>
        <SmoothScroll />
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
