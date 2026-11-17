import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { Suspense } from "react";
import { ProductsPage } from "@/components/pages/ProductsPage";

export const metadata: Metadata = pageMeta({
  title: "الدكان",
  description: "ستيكرز ونوت بوك وهدايا تذكارية ومنتجات من عالم زغاليل.",
  path: "/products",
  image: "/og/products.png",
});

export default function Page() {
  return (
    <Suspense fallback={<main className="min-h-screen" />}>
      <ProductsPage />
    </Suspense>
  );
}
