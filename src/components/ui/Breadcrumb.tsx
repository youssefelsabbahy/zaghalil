"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Fragment } from "react";
import { ChevronIcon } from "./Icons";

export type Crumb = { label: string; href?: string };

export function Breadcrumb({ items }: { items: Crumb[] }) {
  const all: Crumb[] = [{ label: "الرئيسية", href: "/" }, ...items];
  return (
    <motion.nav
      aria-label="مسار الصفحة"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="rounded-full bg-[#F7F0DA] px-5 py-3 text-[13px] sm:text-sm"
    >
      <ol className="flex min-w-0 items-center gap-2">
        {all.map((c, i) => {
          const last = i === all.length - 1;
          return (
            <Fragment key={i}>
              <li className={last ? "min-w-0 truncate font-semibold text-ink" : "shrink-0 text-ink/60"}>
                {c.href && !last ? (
                  <Link href={c.href} className="transition hover:text-ink hover:underline hover:underline-offset-4">
                    {c.label}
                  </Link>
                ) : (
                  <span aria-current={last ? "page" : undefined}>{c.label}</span>
                )}
              </li>
              {!last && (
                <li aria-hidden className="shrink-0 text-ink/40">
                  <ChevronIcon size={14} className="rotate-180" />
                </li>
              )}
            </Fragment>
          );
        })}
      </ol>
    </motion.nav>
  );
}

/** Standard inner-page top: offset for the fixed header + breadcrumb. */
export function PageTop({ items }: { items: Crumb[] }) {
  return (
    <div className="mx-auto max-w-[1240px] px-4 pt-24 sm:px-6 lg:px-8 lg:pt-28">
      <Breadcrumb items={items} />
    </div>
  );
}
