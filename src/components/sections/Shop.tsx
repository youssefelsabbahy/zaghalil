"use client";

import { motion } from "framer-motion";
import { shop, type CharacterId, type ShopCategoryId } from "@/content/site";
import { asset } from "@/lib/assets";
import { useGo } from "@/lib/nav";
import { Button, CharacterArt, Pill, SplitHeading } from "@/components/ui/primitives";
import { TiltCard } from "@/components/ui/TiltCard";

const fan: { color: string; id: CharacterId; rest: number; open: number; x: number }[] = [
  { color: "#F2A3A0", id: "qalqas", rest: -14, open: -24, x: -30 },
  { color: "#CDA6E8", id: "naanaa", rest: 14, open: 24, x: 30 },
  { color: "#A7D9EC", id: "zaghloul", rest: 0, open: 0, x: 0 },
];

export function StickerFan({ category }: { category: ShopCategoryId }) {
  const src = asset(`shop/${category}`);
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt="" className="absolute inset-[10%] h-[80%] w-[80%] object-contain transition-transform duration-500 group-hover:scale-110" loading="lazy" />
    );
  }
  return (
    <div className="absolute inset-0 grid place-items-center [transform:translateZ(30px)]">
      {fan.map((c, i) => (
        <motion.div
          key={c.id}
          variants={{
            rest: { rotate: c.rest, x: c.x * 1.2, y: i === 2 ? -6 : 8 },
            hover: { rotate: c.open, x: c.x * 2.1, y: i === 2 ? -18 : 2 },
          }}
          transition={{ type: "spring", stiffness: 260, damping: 16 }}
          className="absolute h-[44%] w-[40%] rounded-xl border-2 border-white/70 p-1.5 shadow-[0_6px_14px_-6px_rgba(0,0,0,0.25)]"
          style={{ background: c.color, zIndex: i }}
        >
          <CharacterArt id={c.id} className="h-full w-full" />
        </motion.div>
      ))}
    </div>
  );
}

export function Shop() {
  const go = useGo();
  return (
    <section id="shop" className="relative mx-auto max-w-[1240px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <Pill>{shop.eyebrow}</Pill>
      <SplitHeading text={shop.title} className="mt-5 text-[clamp(2.2rem,4.4vw,3.6rem)] text-ink" />

      <ul className="mt-10 grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
        {shop.categories.map((cat, i) => (
          <motion.li
            key={cat.id}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 170, damping: 18, delay: i * 0.08 }}
          >
            <motion.div initial="rest" whileHover="hover" animate="rest">
              <TiltCard
                onClick={() => go(`/products?category=${cat.id}`)}
                label={`تصفح ${cat.name}`}
                className="aspect-square rounded-[1.6rem]"
                style={{ background: cat.bg, ["--edge" as string]: cat.edge }}
              >
                <StickerFan category={cat.id} />
                <span className="absolute bottom-3 left-3 rounded-full bg-white/80 px-3 py-1 text-xs font-bold text-ink opacity-0 transition-opacity group-hover:opacity-100">
                  تصفح ←
                </span>
              </TiltCard>
            </motion.div>
            <p className="font-display mt-4 text-center text-[1.35rem] text-ink">{cat.name}</p>
          </motion.li>
        ))}
      </ul>
      <div className="mt-10 flex justify-center">
        <Button onClick={() => go("/products")}>تصفح الدكان كله</Button>
      </div>
    </section>
  );
}
