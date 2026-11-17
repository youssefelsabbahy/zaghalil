import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { notFound } from "next/navigation";
import { ProductDetail } from "@/components/pages/ProductDetail";
import { categoryBlurb, productById, products } from "@/content/site";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return products.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const p = productById[id];
  if (!p) return {};
  return pageMeta({ title: p.name, description: categoryBlurb[p.category], path: `/products/${id}`, image: `/og/products/${id}.png` });
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  if (!productById[id]) notFound();
  return <ProductDetail id={id} />;
}
