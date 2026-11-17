"use client";

import { motion } from "framer-motion";
import { aboutPage, story } from "@/content/site";
import { useGo } from "@/lib/nav";
import { PageTop } from "@/components/ui/Breadcrumb";
import { Button, Cloud, Pill, Reveal, Spark, SplitHeading } from "@/components/ui/primitives";
import { LogoMarquee } from "@/components/sections/Partners";
import { TimelineCard } from "@/components/sections/Story";
import { CastLineup } from "./CastLineup";

function Wave() {
  return (
    <motion.span
      aria-hidden
      className="inline-block origin-[70%_70%]"
      animate={{ rotate: [0, 18, -8, 18, 0] }}
      transition={{ duration: 1.6, repeat: Infinity, repeatDelay: 1.4 }}
    >
      👋
    </motion.span>
  );
}

export function AboutPage() {
  const go = useGo();
  return (
    <main className="pb-10">
      <PageTop items={[{ label: aboutPage.crumb }]} />

      {/* intro */}
      <section className="mx-auto grid max-w-[1240px] items-center gap-10 px-4 pt-10 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-14 lg:px-8 lg:pt-14">
        <div>
          <div className="flex flex-wrap items-center gap-x-3">
            <SplitHeading as="h1" text={aboutPage.title} highlight="زغاليل!" className="text-[clamp(2.2rem,4.1vw,3.5rem)] leading-[1.15] text-ink" />
            <span className="text-[clamp(2rem,4vw,3.3rem)]">
              <Wave />
            </span>
          </div>
          <Reveal delay={0.1} className="mt-6 text-[19px] font-semibold leading-9 text-ink lg:text-xl">
            {aboutPage.lead}
          </Reveal>
          <Reveal delay={0.2} className="mt-4 text-[16px] leading-8 text-ink/60">
            {aboutPage.body}
          </Reveal>
          <Reveal delay={0.3} className="mt-5 border-r-4 border-purple pr-4 text-[17px] font-bold leading-8 text-purple">
            {aboutPage.highlight}
          </Reveal>
        </div>
        <Reveal y={50} delay={0.15} className="relative">
          <Cloud className="absolute -top-8 right-6 z-10 w-24 animate-float" />
          <Spark className="absolute -top-6 left-8 z-10 h-12 w-12 animate-wiggle" />
          <CastLineup className="aspect-[4/3]" sceneKey="scenes/about-hero" />
        </Reveal>
      </section>

      {/* partners band */}
      <section className="mt-20 bg-[#F7F0DA] py-14 lg:mt-28 lg:py-20">
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
          <Reveal className="mx-auto max-w-3xl text-center text-[17px] font-semibold leading-9 text-ink lg:text-xl">
            {aboutPage.partners}
          </Reveal>
          <LogoMarquee className="mt-10" />
        </div>
      </section>

      {/* timeline */}
      <section className="mx-auto max-w-[1240px] px-4 pt-20 sm:px-6 lg:px-8 lg:pt-28">
        <Pill>{story.eyebrow}</Pill>
        <div className="mt-6 grid items-end gap-4 lg:grid-cols-2">
          <SplitHeading text={story.title} className="text-[clamp(2.2rem,4.4vw,3.6rem)] text-ink" />
          <Reveal delay={0.15} className="max-w-md text-[17px] leading-8 text-ink/75 lg:justify-self-end">
            {story.lead}
          </Reveal>
        </div>
        <Reveal y={50} className="mt-10">
          <TimelineCard />
        </Reveal>
      </section>

      {/* today */}
      <section className="mx-auto max-w-[1240px] px-4 pt-14 sm:px-6 lg:px-8">
        <Reveal>
          <p className="rounded-[1.8rem] bg-[#FCE3DC] px-7 py-8 text-center text-[17px] font-bold leading-9 text-ink sm:px-12 lg:text-xl lg:leading-10">
            {aboutPage.today}
          </p>
        </Reveal>
      </section>

      {/* vision & mission */}
      <section className="mx-auto grid max-w-[1240px] gap-6 px-4 pt-6 sm:px-6 md:grid-cols-2 lg:px-8">
        {[
          { ...story.vision, bg: "#DDF5D6", edge: "#B6E6AA" },
          { ...story.mission, bg: "#FCE3DC", edge: "#F2C3B6" },
        ].map((b, i) => (
          <motion.article
            key={b.title}
            initial={{ opacity: 0, y: 40, rotate: i ? 1.5 : -1.5 }}
            whileInView={{ opacity: 1, y: 0, rotate: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ type: "spring", stiffness: 160, damping: 18, delay: i * 0.1 }}
            whileHover={{ y: -6 }}
            className="edge-card rounded-[1.8rem] p-8 lg:p-10"
            style={{ background: b.bg, ["--edge" as string]: b.edge }}
          >
            <h2 className="font-display text-3xl text-ink">{b.title}</h2>
            <p className="mt-4 text-[17px] leading-9 text-ink/80">{b.body}</p>
          </motion.article>
        ))}
      </section>

      <Reveal className="mx-auto mt-14 flex max-w-[1240px] flex-wrap justify-center gap-4 px-4">
        <Button size="lg" onClick={() => go("/characters")}>
          اتعرف على الشلة
        </Button>
        <Button size="lg" variant="mint" onClick={() => go("/contact")}>
          يلا نشتغل سوا
        </Button>
      </Reveal>
    </main>
  );
}
