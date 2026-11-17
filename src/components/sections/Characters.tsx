"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { characters, crew, products, type Character } from "@/content/site";
import { egp } from "@/lib/format";
import { useStore } from "@/lib/store";
import { useGo } from "@/lib/nav";
import { Button, CharacterArt, Pill, Reveal, Spark, SplitHeading } from "@/components/ui/primitives";
import { TiltCard } from "@/components/ui/TiltCard";
import { Modal } from "@/components/ui/Modal";
import { ArrowIcon } from "@/components/ui/Icons";

function CrewCard({ c, i, onOpen }: { c: Character; i: number; onOpen: () => void }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 60, rotate: i % 2 ? 4 : -4 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 160, damping: 18, delay: (i % 4) * 0.08 }}
      className="w-[calc(50%-0.5rem)] sm:w-[calc(33.333%-0.85rem)] lg:w-[calc(25%-1.15rem)]"
    >
      <TiltCard
        onClick={onOpen}
        label={`اتعرف على ${c.name}`}
        className="aspect-[4/5] rounded-[1.8rem]"
        style={{ background: c.card, ["--edge" as string]: c.edge }}
      >
        <div className="absolute inset-x-[12%] top-[6%] bottom-[34%] lg:bottom-[30%] transition-transform duration-500 ease-[var(--ease-bounce)] [transform:translateZ(40px)] group-hover:-translate-y-3 group-hover:scale-[1.06]">
          <CharacterArt id={c.id} className="h-full w-full" />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex flex-col items-center px-2 pb-[6%] text-center [transform:translateZ(30px)]">
          <span className="font-display text-[clamp(1.2rem,2.4vw,1.8rem)] leading-tight text-ink">{c.name}</span>
          {c.traits && <span className="mt-0.5 text-[12px] text-ink/65 sm:text-[13px]">{c.traits}</span>}
          {/* always visible on touch screens (as in the mobile design); revealed on hover with a mouse */}
          <span className="mt-1 flex items-center gap-1 text-[12px] font-bold text-green transition-all duration-300 sm:text-[13px] lg:h-0 lg:overflow-hidden lg:opacity-0 lg:group-hover:h-5 lg:group-hover:opacity-100">
            اعرف {c.name.split(" ").at(-1)} أكتر <ArrowIcon size={14} />
          </span>
        </div>
      </TiltCard>
    </motion.li>
  );
}

export function Characters() {
  const [open, setOpen] = useState<Character | null>(null);
  const go = useGo();
  const add = useStore((s) => s.add);
  const notify = useStore((s) => s.notify);
  const theirs = open ? products.filter((p) => p.character === open.id).slice(0, 3) : [];

  return (
    <section id="characters" className="relative overflow-hidden py-20 lg:py-28">
      <Spark className="absolute right-[8%] top-24 h-14 w-14 rotate-12 animate-wiggle" />
      <Spark className="absolute left-[10%] top-40 h-10 w-10 -rotate-12 animate-wiggle [animation-delay:-1s]" color="#F7953E" />
      <div className="mx-auto max-w-[1240px] px-4 text-center sm:px-6 lg:px-8">
        <Pill>{crew.eyebrow}</Pill>
        <SplitHeading text={crew.title} className="mt-5 text-[clamp(2.4rem,5.4vw,4.4rem)] text-ink" />
        <Reveal delay={0.2} className="mt-3 text-lg text-ink/65">
          {crew.sub}
        </Reveal>

        <ul className="mx-auto mt-12 flex max-w-[1080px] flex-wrap justify-center gap-4 lg:gap-6">
          {characters.map((c, i) => (
            <CrewCard key={c.id} c={c} i={i} onOpen={() => setOpen(c)} />
          ))}
        </ul>
        <div className="mt-10 flex justify-center">
          <Button variant="mint" onClick={() => go("/characters")}>
            شوف كل الشخصيات
          </Button>
        </div>
      </div>

      <Modal open={!!open} onClose={() => setOpen(null)} label={open ? `بطاقة ${open.name}` : "بطاقة الشخصية"}>
        {open && (
          <div className="grid gap-0 md:grid-cols-[1fr_1.1fr]">
            <div className="relative grid min-h-[280px] place-items-center p-8" style={{ background: open.card }}>
              <motion.div
                initial={{ scale: 0.6, rotate: -10, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: "spring", stiffness: 240, damping: 14 }}
                className="w-[70%] max-w-[260px]"
              >
                <CharacterArt id={open.id} className="w-full" />
              </motion.div>
            </div>
            <div className="p-8 text-right">
              <p className="text-sm font-semibold text-ink/50">من شلة زغاليل</p>
              <h3 className="font-display mt-1 text-4xl text-ink">{open.name}</h3>
              {open.traits && (
                <ul className="mt-4 flex flex-wrap gap-2">
                  {open.traits.split("،").map((t) => (
                    <li key={t} className="rounded-full px-4 py-1.5 text-sm font-bold text-ink" style={{ background: open.card }}>
                      {t.trim()}
                    </li>
                  ))}
                </ul>
              )}
              <p className="mt-5 leading-8 text-ink/75">
                تابع {open.name} في حلقات وأغاني زغاليل، واحتفظ بيه معاك من منتجات الدكان.
              </p>
              {theirs.length > 0 && (
                <ul className="mt-6 space-y-2">
                  {theirs.map((p) => (
                    <li key={p.id} className="flex items-center justify-between gap-3 rounded-2xl bg-white/80 p-3">
                      <span className="font-semibold">{p.name}</span>
                      <span className="flex items-center gap-3">
                        <span className="text-sm text-ink/60">{egp(p.price)}</span>
                        <Button
                          size="sm"
                          onClick={() => {
                            add(p.id);
                            notify(`${p.name} اتحط في السلة 🛒`);
                          }}
                        >
                          حطه في السلة
                        </Button>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-6 flex flex-wrap gap-3">
                <Button
                  variant="mint"
                  onClick={() => {
                    setOpen(null);
                    setTimeout(() => go("/#videos"), 250);
                  }}
                >
                  شوف الحلقات
                </Button>
                <Button
                  variant="orange"
                  onClick={() => {
                    const id = open.id;
                    setOpen(null);
                    setTimeout(() => go(`/products?character=${id}`), 250);
                  }}
                >
                  منتجات {open.name.split(" ").at(-1)}
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </section>
  );
}
