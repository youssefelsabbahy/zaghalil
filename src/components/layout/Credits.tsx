"use client";

import { motion } from "framer-motion";
import { Fragment, type ReactNode } from "react";
import { credits as t, links, people } from "@/content/credits";
import { cn } from "@/lib/format";

type Person = (typeof people)[keyof typeof people];

const ExternalIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
    <path d="M10 5H5.5A1.5 1.5 0 0 0 4 6.5v12A1.5 1.5 0 0 0 5.5 20h12a1.5 1.5 0 0 0 1.5-1.5V14M14 4h6v6M20 4l-9 9" />
  </svg>
);

/** Fills "{token}" placeholders with rich nodes. */
function fill(text: string, nodes: Record<string, ReactNode>) {
  return text.split(/(\{\w+\})/g).map((part, i) => {
    const key = part.match(/^\{(\w+)\}$/)?.[1];
    return <Fragment key={i}>{key ? nodes[key] : part}</Fragment>;
  });
}

function NameLink({ p, className }: { p: Person; className?: string }) {
  return (
    <a
      href={p.href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        "whitespace-nowrap font-semibold text-white underline decoration-white/35 decoration-2 underline-offset-4 transition hover:decoration-mint",
        className
      )}
    >
      {p.name}
    </a>
  );
}

/** One credit tile: label, title, sub-line, external arrow. Same shape in every row. */
function Tile({ href, label, title, sub, accent = false }: { href: string; label: string; title: string; sub: string; accent?: boolean }) {
  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 420, damping: 24 }}
      className={cn(
        "group relative block h-full rounded-2xl p-3.5 pe-11 ring-1 transition-colors sm:p-5 sm:pe-16",
        accent ? "bg-green text-white ring-transparent shadow-[0_5px_0_0_#2E7F20] hover:brightness-110" : "bg-white/10 text-white ring-white/10 hover:bg-white/[0.16] hover:ring-white/25"
      )}
    >
      <span className={cn("block text-[11px] font-bold sm:text-xs", accent ? "text-white/85" : "text-mint")}>{label}</span>
      <span className="font-display mt-1 block text-[1.05rem] leading-tight sm:text-[1.35rem]">{title}</span>
      <span
        dir={/^[A-Za-z]/.test(sub) ? "ltr" : undefined}
        className={cn("mt-1 block truncate text-right text-[11px] sm:text-[13px]", accent ? "text-white/85" : "text-white/65")}
      >
        {sub}
      </span>
      <span
        className={cn(
          "absolute left-2.5 top-2.5 grid h-7 w-7 place-items-center rounded-full transition-colors sm:left-4 sm:top-1/2 sm:h-10 sm:w-10 sm:-translate-y-1/2",
          accent ? "bg-white/20 group-hover:bg-white group-hover:text-green" : "bg-white/10 group-hover:bg-mint group-hover:text-ink"
        )}
      >
        <ExternalIcon className="h-3.5 w-3.5 -scale-x-100 transition-transform duration-300 group-hover:-translate-x-0.5 group-hover:-translate-y-0.5 sm:h-4 sm:w-4" />
      </span>
    </motion.a>
  );
}

export function Credits() {
  return (
    <motion.section
      id="credits"
      aria-labelledby="credits-title"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className="relative mt-14 overflow-hidden rounded-[2rem] bg-[#94608F] p-6 ring-1 ring-white/15 sm:p-8 lg:mt-20 lg:p-10"
    >
      <div aria-hidden className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-mint/10 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-orange/10 blur-3xl" />

      <h2 id="credits-title" className="font-display relative text-2xl text-white sm:text-[1.8rem]">
        {t.title}
      </h2>

      <div className="relative mt-7 space-y-3 sm:space-y-4">
        {/* row 1 — original designers */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Tile href={people.rana.href} label={t.design} title={people.rana.name} sub={people.rana.meta} />
          <Tile href={people.rahma.href} label={t.design} title={people.rahma.name} sub={people.rahma.meta} />
        </div>
        {/* row 2 — developer + portfolio */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Tile href={people.youssef.href} label={t.dev} title={people.youssef.name} sub={t.devRole} />
          <Tile href={links.portfolio.href} label={t.portfolio} title={t.visitPortfolio} sub={links.portfolio.label} accent />
        </div>
        {/* row 3 — original reference */}
        <Tile href={links.reference.href} label={t.reference} title={t.viewOnBehance} sub={links.reference.label} />
      </div>

      <div className="relative mt-8 space-y-3 border-t-2 border-dashed border-white/20 pt-6 text-[15px] leading-7">
        <p className="flex gap-3 text-white/90">
          <span className="shrink-0 text-xl font-bold leading-7 text-mint" aria-hidden>
            ©
          </span>
          <span>{fill(t.rights, { rana: <NameLink p={people.rana} />, rahma: <NameLink p={people.rahma} /> })}</span>
        </p>
        <p className="ps-8 text-white/80">{t.tribute}</p>
        <p className="ps-8 text-white/80">
          {fill(t.contact, {
            portfolio: (
              <a
                href={links.portfolio.href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-semibold text-mint underline decoration-mint/40 decoration-2 underline-offset-4 hover:decoration-mint"
              >
                {t.contactLink}
              </a>
            ),
          })}
        </p>
      </div>
    </motion.section>
  );
}

/** One-line attribution for the footer's bottom bar. */
export function CreditLine() {
  return (
    <p className="text-center leading-7 sm:text-right">
      {fill(t.bottom, {
        rana: <NameLink p={people.rana} className="font-medium decoration-1" />,
        rahma: <NameLink p={people.rahma} className="font-medium decoration-1" />,
        youssef: <NameLink p={people.youssef} className="font-medium decoration-1" />,
      })}
    </p>
  );
}
