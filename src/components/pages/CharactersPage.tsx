"use client";

import { motion } from "framer-motion";
import { characters, charactersPage, products, type Character } from "@/content/site";
import { useGo } from "@/lib/nav";
import { toArabicDigits } from "@/lib/format";
import { PageTop } from "@/components/ui/Breadcrumb";
import { Button, CharacterArt, Reveal, Spark, SplitHeading } from "@/components/ui/primitives";
import { TiltCard } from "@/components/ui/TiltCard";
import { ArrowIcon } from "@/components/ui/Icons";
import { CastLineup } from "./CastLineup";

const shortName = (c: Character) => c.name.split(" ").at(-1) ?? c.name;

function CharacterFeature({ c, i }: { c: Character; i: number }) {
  const go = useGo();
  const count = products.filter((p) => p.character === c.id).length;
  return (
    <motion.li
      id={c.id}
      className="w-full scroll-mt-28 sm:w-[calc(50%-0.75rem)] lg:w-[calc(33.333%-1rem)]"
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 150, damping: 18, delay: (i % 3) * 0.08 }}
    >
      <div className="aspect-[5/4]">
      <TiltCard
        max={7}
        className="rounded-[1.8rem]"
        style={{ background: c.card, ["--edge" as string]: c.edge }}
      >
        <motion.div
          className="absolute inset-[10%_18%_6%] [transform:translateZ(40px)]"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.2, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}
        >
          <CharacterArt id={c.id} pose="wave" className="h-full w-full" />
        </motion.div>
        <span className="absolute right-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-ink/70">
          {toArabicDigits(i + 1)} / {toArabicDigits(characters.length)}
        </span>
      </TiltCard>
      </div>
      <div className="mt-5 px-1">
        <h2 className="font-display text-[1.9rem] leading-tight text-ink">{c.name}</h2>
        {c.traits ? (
          <ul className="mt-2 flex flex-wrap gap-2">
            {c.traits.split("،").map((t) => (
              <li key={t} className="rounded-full px-3 py-1 text-sm font-semibold text-ink" style={{ background: c.card }}>
                {t.trim()}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-2 text-sm text-ink/55">من شلة زغاليل</p>
        )}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          {count > 0 && (
            <Button size="sm" onClick={() => go(`/products?character=${c.id}`)}>
              منتجات {shortName(c)} ({toArabicDigits(count)})
            </Button>
          )}
          <button
            type="button"
            onClick={() => go("/#videos")}
            className="group inline-flex items-center gap-1 text-sm font-bold text-green"
          >
            اتفرج على الحلقات
            <ArrowIcon size={16} className="transition-transform group-hover:-translate-x-1" />
          </button>
        </div>
      </div>
    </motion.li>
  );
}

export function CharactersPage() {
  const go = useGo();
  return (
    <main className="pb-10">
      <PageTop items={[{ label: charactersPage.crumb }]} />

      <section className="relative mx-auto max-w-[1240px] px-4 pt-10 sm:px-6 lg:px-8 lg:pt-14">
        <Spark className="absolute left-[8%] top-10 hidden h-12 w-12 animate-wiggle lg:block" />
        <div className="grid items-end gap-4 lg:grid-cols-2">
          <SplitHeading as="h1" text={charactersPage.title} className="text-[clamp(2.4rem,5.2vw,4.4rem)] text-ink" />
          <Reveal delay={0.15} className="max-w-md text-[17px] leading-8 text-ink/75 lg:justify-self-end lg:text-lg">
            {charactersPage.intro}
          </Reveal>
        </div>
        <Reveal y={50} className="mt-8 lg:mt-12">
          <CastLineup className="aspect-[16/10] sm:aspect-[2/1] lg:aspect-[21/9]" />
        </Reveal>
      </section>

      <section aria-label="الشخصيات" className="mx-auto max-w-[1240px] px-4 pt-16 sm:px-6 lg:px-8 lg:pt-24">
        <ul className="flex flex-wrap items-start justify-center gap-x-6 gap-y-14">
          {characters.map((c, i) => (
            <CharacterFeature key={c.id} c={c} i={i} />
          ))}
        </ul>
      </section>

      <Reveal className="mx-auto mt-20 max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 rounded-[2rem] bg-mint px-8 py-10 text-center sm:flex-row sm:text-right">
          <div>
            <p className="font-display text-[clamp(1.6rem,3vw,2.4rem)] text-ink">خد الشلة معاك في كل حتة</p>
            <p className="mt-1 text-ink/70">ستيكرز ونوت بوك وهدايا من عالم زغاليل.</p>
          </div>
          <Button size="lg" onClick={() => go("/products")}>
            روح الدكان
          </Button>
        </div>
      </Reveal>
    </main>
  );
}
