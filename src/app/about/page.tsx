import type { Metadata } from "next";
import { AboutPage } from "@/components/pages/AboutPage";
import { aboutPage } from "@/content/site";

export const metadata: Metadata = { title: aboutPage.crumb, description: aboutPage.lead };

export default function Page() {
  return <AboutPage />;
}
