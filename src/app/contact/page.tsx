import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { ContactPage } from "@/components/pages/ContactPage";
import { contactPage } from "@/content/site";

export const metadata: Metadata = pageMeta({ title: contactPage.crumb, description: contactPage.body, path: "/contact", image: "/og/contact.png" });

export default function Page() {
  return <ContactPage variant="contact" />;
}
