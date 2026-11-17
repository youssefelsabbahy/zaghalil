import type { Metadata } from "next";
import { Suspense } from "react";
import { ProductsPage } from "@/components/pages/ProductsPage";

export const metadata: Metadata = {
  title: "الدكان",
  description: "ستيكرز ونوت بوك وهدايا ومنتجات من عالم زغاليل.",
};

export default function Page() {
  return (
    <Suspense fallback={<main className="min-h-screen" />}>
      <ProductsPage />
    </Suspense>
  );
}
