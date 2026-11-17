"use client";

import { motion } from "framer-motion";
import { careersPage, contact, contactPage, waDigits } from "@/content/site";
import { PageTop } from "@/components/ui/Breadcrumb";
import { Reveal, SplitHeading } from "@/components/ui/primitives";
import { MailIcon, PinIcon, WhatsappIcon } from "@/components/ui/Icons";
import { ContactForm, ContactLink } from "@/components/sections/Contact";

const cards = [
  { label: "Email", value: contact.email, href: `mailto:${contact.email}`, Icon: MailIcon, tint: "#F9C6D6" },
  { label: "WhatsApp", value: contact.phone, href: `https://wa.me/${waDigits(contact.phone)}`, Icon: WhatsappIcon, tint: "#E2CCEB" },
  { label: "Studio", value: contact.studio, Icon: PinIcon, tint: "#F9C6D6" },
];

export function ContactPage({ variant = "contact" }: { variant?: "contact" | "careers" }) {
  const copy = variant === "careers" ? careersPage : contactPage;
  return (
    <main className="pb-10">
      <PageTop items={[{ label: copy.crumb }]} />

      <section className="mx-auto grid max-w-[1240px] gap-10 px-4 pt-10 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8 lg:pt-14">
        <div>
          <div className="flex flex-wrap items-center gap-x-3">
            <SplitHeading as="h1" text={copy.title} className="text-[clamp(2.2rem,4.4vw,3.6rem)] text-ink" />
            <motion.span
              aria-hidden
              className="inline-block origin-[70%_70%] text-[clamp(2rem,3.6vw,3rem)]"
              animate={{ rotate: [0, 18, -8, 18, 0] }}
              transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.4 }}
            >
              👋
            </motion.span>
          </div>
          <Reveal delay={0.1} className="mt-4 text-[18px] font-bold text-ink">
            {copy.question}
          </Reveal>
          <Reveal delay={0.2} className="mt-3 max-w-xl text-[16px] font-semibold leading-8 text-purple">
            {copy.body}
          </Reveal>

          <ul className="mt-8 space-y-4">
            {cards.map(({ label, value, href, Icon, tint }, i) => (
              <motion.li
                key={label}
                initial={{ opacity: 0, x: 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.1 + i * 0.08 }}
                whileHover={{ x: -6 }}
                className="flex items-center justify-between gap-4 rounded-2xl bg-[#FBE08A] px-5 py-4 shadow-[0_5px_0_0_#EBC95A]"
              >
                <div className="min-w-0">
                  <p className="font-bold text-ink">
                    <span dir="ltr">{label}</span> :
                  </p>
                  <p className="mt-1 truncate text-[15px] text-ink/80" dir="ltr">
                    {href ? <ContactLink href={href}>{value}</ContactLink> : value}
                  </p>
                </div>
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full text-ink" style={{ background: tint }}>
                  <Icon size={20} />
                </span>
              </motion.li>
            ))}
          </ul>
          <Reveal delay={0.2} className="mt-6 text-[15px] text-ink/70">
            {copy.note}
          </Reveal>
        </div>

        <Reveal y={40} delay={0.1} className="lg:sticky lg:top-28 lg:h-fit">
          <ContactForm title={copy.formTitle} initialMessage={variant === "careers" ? careersPage.prefill : undefined} />
        </Reveal>
      </section>
    </main>
  );
}
