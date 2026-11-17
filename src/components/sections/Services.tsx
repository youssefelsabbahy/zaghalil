"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { services } from "@/content/site";
import { asset } from "@/lib/assets";
import { useStore } from "@/lib/store";
import { scrollToHash } from "@/lib/scroll";
import { cn, toArabicDigits } from "@/lib/format";
import { Button, Pill, Reveal, SplitHeading } from "@/components/ui/primitives";
import { RecordingScene, StudioScene, TheatreScene } from "@/components/ui/Scenes";

const fallbackScene = { ads: StudioScene, sponsor: RecordingScene, theatre: TheatreScene } as const;

function ServiceCard({
  item,
  index,
  onActive,
}: {
  item: (typeof services.items)[number];
  index: number;
  onActive: (i: number) => void;
}) {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const imgScale = useTransform(scrollYProgress, [0, 0.5, 1], [1.18, 1.02, 1.1]);
  const imgY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);
  const prefill = useStore((s) => s.prefillContact);
  const src = asset(`scenes/${item.scene}`);
  const Scene = fallbackScene[item.id];

  return (
    <motion.article
      ref={ref}
      onViewportEnter={() => onActive(index)}
      viewport={{ margin: "-45% 0px -45% 0px" }}
      className="group"
    >
      <motion.div
        initial={{ clipPath: "inset(12% 12% 12% 12% round 2rem)", opacity: 0 }}
        whileInView={{ clipPath: "inset(0% 0% 0% 0% round 1.6rem)", opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="relative aspect-[16/10] overflow-hidden rounded-[1.6rem] border-2 border-ink/10 bg-sky"
      >
        <motion.div style={{ scale: imgScale, y: imgY }} className="absolute inset-0">
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={item.title} className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <Scene />
          )}
        </motion.div>
        <span className="font-display absolute right-4 top-4 grid h-12 w-12 place-items-center rounded-full bg-cream text-xl text-ink shadow-[0_4px_0_0_rgba(0,0,0,0.12)]">
          {toArabicDigits(index + 1)}
        </span>
      </motion.div>
      <Reveal className="mt-6">
        <h3 className="font-display text-[1.7rem] text-ink">{item.title}</h3>
        <p className="mt-3 max-w-xl text-[16px] leading-8 text-ink/75">{item.body}</p>
        <Button
          className="mt-6"
          onClick={() => {
            prefill(item.prefill);
            scrollToHash("#contact");
          }}
        >
          {services.cta}
        </Button>
      </Reveal>
    </motion.article>
  );
}

export function Services() {
  const [active, setActive] = useState(0);
  return (
    <section id="services" className="relative mx-auto max-w-[1240px] px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:gap-20">
        {/* sticky intro (start column) */}
        <div className="lg:sticky lg:top-28 lg:h-fit">
          <Pill>{services.eyebrow}</Pill>
          <SplitHeading text={services.title} className="mt-5 text-[clamp(2.4rem,4.6vw,3.8rem)] text-ink" />
          <Reveal delay={0.1} className="mt-3 text-xl font-semibold text-ink/85">
            {services.sub}
          </Reveal>
          <Reveal delay={0.2} className="mt-4 max-w-md text-[16px] leading-8 text-ink/70">
            {services.body}
          </Reveal>
          <ol className="mt-10 hidden space-y-3 lg:block">
            {services.items.map((it, i) => (
              <li key={it.id} className="flex items-center gap-3">
                <motion.span
                  animate={{ width: active === i ? 44 : 14, background: active === i ? "#F7953E" : "#E7E3C8" }}
                  transition={{ type: "spring", stiffness: 300, damping: 26 }}
                  className="h-3.5 rounded-full"
                />
                <span className={cn("text-[15px] transition-all", active === i ? "font-bold text-ink" : "text-ink/45")}>{it.title}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="space-y-20 lg:space-y-28">
          {services.items.map((item, i) => (
            <ServiceCard key={item.id} item={item} index={i} onActive={setActive} />
          ))}
        </div>
      </div>
    </section>
  );
}
