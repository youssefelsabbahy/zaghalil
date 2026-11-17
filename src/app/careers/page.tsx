import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/ContactPage";
import { careersPage } from "@/content/site";

export const metadata: Metadata = { title: careersPage.crumb, description: careersPage.body };

export default function Page() {
  return <ContactPage variant="careers" />;
}
