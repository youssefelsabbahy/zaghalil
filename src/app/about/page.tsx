import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { AboutPage } from "@/components/pages/AboutPage";
import { aboutPage } from "@/content/site";

export const metadata: Metadata = pageMeta({ title: aboutPage.crumb, description: aboutPage.lead, path: "/about", image: "/og/about.png" });

export default function Page() {
  return <AboutPage />;
}
