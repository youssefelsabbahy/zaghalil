import type { Metadata } from "next";
import { ContactPage } from "@/components/pages/ContactPage";
import { contactPage } from "@/content/site";

export const metadata: Metadata = { title: contactPage.crumb, description: contactPage.body };

export default function Page() {
  return <ContactPage variant="contact" />;
}
