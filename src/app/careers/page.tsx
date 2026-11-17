import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { ContactPage } from "@/components/pages/ContactPage";
import { careersPage } from "@/content/site";

export const metadata: Metadata = pageMeta({ title: careersPage.crumb, description: careersPage.body, path: "/careers", image: "/og/careers.png" });

export default function Page() {
  return <ContactPage variant="careers" />;
}
