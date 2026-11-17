"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { characters, products, services, shop, videos } from "@/content/site";
import { useStore } from "@/lib/store";
import { useGo } from "@/lib/nav";
import { cn } from "@/lib/format";
import { Modal } from "@/components/ui/Modal";
import { SearchIcon } from "@/components/ui/Icons";

type Hit = { id: string; label: string; group: string; run: () => void };

const norm = (s: string) =>
  s
    .replace(/[أإآ]/g, "ا")
    .replace(/ى/g, "ي")
    .replace(/ة/g, "ه")
    .replace(/[ً-ّْ]/g, "")
    .toLowerCase();

export function SearchOverlay() {
  const open = useStore((s) => s.searchOpen);
  const setOpen = useStore((s) => s.setSearchOpen);
  const nav = useGo();
  const [q, setQ] = useState("");
  const [idx, setIdx] = useState(0);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  const all = useMemo<Hit[]>(() => {
    const go = (href: string) => () => {
      setOpen(false);
      setTimeout(() => nav(href), 260);
    };
    return [
      ...characters.map((c) => ({ id: `c-${c.id}`, label: c.name, group: "الشخصيات", run: go(`/characters#${c.id}`) })),
      ...products.map((p) => ({ id: `p-${p.id}`, label: p.name, group: "الدكان", run: go(`/products/${p.id}`) })),
      ...shop.categories.map((c) => ({ id: `s-${c.id}`, label: c.name, group: "الدكان", run: go(`/products?category=${c.id}`) })),
      ...services.items.map((s) => ({ id: `sv-${s.id}`, label: s.title, group: "بنقدم ايه", run: go("/#services") })),
      ...videos.items.map((v) => ({ id: `v-${v.id}`, label: v.title, group: "فيديوهات", run: go("/#videos") })),
      { id: "story", label: "حكايتنا", group: "صفحات", run: go("/about") },
      { id: "careers", label: "كاريير", group: "صفحات", run: go("/careers") },
      { id: "contact", label: "تواصل مع زغاليل", group: "صفحات", run: go("/contact") },
    ];
  }, [setOpen, nav]);

  const hits = useMemo(() => {
    const n = norm(q.trim());
    return (n ? all.filter((h) => norm(h.label).includes(n) || norm(h.group).includes(n)) : all.slice(0, 8)).slice(0, 9);
  }, [q, all]);

  useEffect(() => setIdx(0), [q]);
  useEffect(() => {
    if (!open) setQ("");
  }, [open]);

  return (
    <Modal open={open} onClose={() => setOpen(false)} label="بحث" className="max-w-xl self-start">
      <div className="p-5 pt-16 sm:p-6 sm:pt-6">
        <div className="flex items-center gap-3 rounded-full bg-mint px-5">
          <SearchIcon className="shrink-0 text-ink/60" />
          <input
            data-autofocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "ArrowDown") { e.preventDefault(); setIdx((i) => Math.min(hits.length - 1, i + 1)); }
              if (e.key === "ArrowUp") { e.preventDefault(); setIdx((i) => Math.max(0, i - 1)); }
              if (e.key === "Enter") { e.preventDefault(); hits[idx]?.run(); }
            }}
            placeholder="دور على شخصية، منتج، أو حلقة…"
            className="h-14 flex-1 bg-transparent text-lg outline-none placeholder:text-ink/45"
            aria-label="بحث في زغاليل"
          />
        </div>
        <ul className="mt-4 max-h-[50svh] space-y-1 overflow-y-auto" role="listbox">
          <AnimatePresence initial={false}>
            {hits.map((h, i) => (
              <motion.li key={h.id} layout initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="option" aria-selected={i === idx}>
                <button
                  onMouseEnter={() => setIdx(i)}
                  onClick={h.run}
                  className={cn("flex w-full items-center justify-between rounded-2xl px-4 py-3 text-right transition", i === idx ? "bg-orange text-white" : "hover:bg-ink/5")}
                >
                  <span className="font-semibold">{h.label}</span>
                  <span className={cn("text-xs", i === idx ? "text-white/80" : "text-ink/45")}>{h.group}</span>
                </button>
              </motion.li>
            ))}
          </AnimatePresence>
          {hits.length === 0 && <li className="py-8 text-center text-ink/55">مفيش نتايج… جرب كلمة تانية</li>}
        </ul>
      </div>
    </Modal>
  );
}
