"use client";

import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { videos } from "@/content/site";
import { asset } from "@/lib/assets";
import { Button, Pill, SplitHeading, Wordmark } from "@/components/ui/primitives";
import { VideoBackdrop } from "@/components/ui/Scenes";
import { Modal } from "@/components/ui/Modal";
import { PauseIcon, PlayIcon, SoundIcon, YoutubeIcon } from "@/components/ui/Icons";

type Item = (typeof videos.items)[number];

function VideoCard({ v, i, onOpen }: { v: Item; i: number; onOpen: () => void }) {
  const vid = useRef<HTMLVideoElement>(null);
  const src = asset(`videos/${v.id}`);
  const poster = asset(`videos/${v.id}-poster`);
  return (
    <motion.li
      initial={{ opacity: 0, y: 70, rotate: i % 2 ? 3 : -3 }}
      whileInView={{ opacity: 1, y: 0, rotate: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ type: "spring", stiffness: 140, damping: 18, delay: i * 0.08 }}
      className="w-[68vw] max-w-[300px] shrink-0 snap-center sm:w-[44vw] lg:w-auto lg:max-w-none"
    >
      <motion.button
        type="button"
        onClick={onOpen}
        aria-label={`شغل: ${v.title}`}
        whileHover={{ y: -10, rotate: i % 2 ? 1.5 : -1.5 }}
        whileTap={{ scale: 0.97 }}
        transition={{ type: "spring", stiffness: 300, damping: 18 }}
        onHoverStart={() => vid.current?.play().catch(() => {})}
        onHoverEnd={() => {
          if (!vid.current) return;
          vid.current.pause();
          vid.current.currentTime = 0;
        }}
        className="group relative block aspect-[9/16] w-full overflow-hidden rounded-[1.6rem] border-2 border-ink/10 text-right shadow-[0_18px_40px_-22px_rgba(0,0,0,0.45)]"
      >
        <div className="absolute inset-0 transition-transform duration-700 group-hover:scale-105">
          {poster ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={poster} alt="" className="h-full w-full object-cover" loading="lazy" />
          ) : (
            <VideoBackdrop scene={v.scene} />
          )}
        </div>
        {src && <video ref={vid} src={src} muted playsInline loop preload="none" className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100" />}
        {!poster && (
          <>
            <div className="absolute inset-x-0 top-0 flex justify-center pt-5">
              <Wordmark className="text-3xl" />
            </div>
            <p className="font-display ink-outline absolute inset-x-4 top-[19%] text-balance text-center text-[clamp(1.7rem,2.6vw,2.3rem)] leading-[1.3] text-white">
              {v.title}
            </p>
            {"caption" in v && v.caption && (
              <p className="absolute inset-x-0 bottom-[22%] text-center text-sm font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">{v.caption}</p>
            )}
          </>
        )}
        <span className="absolute inset-x-0 bottom-[7%] grid place-items-center">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-ink shadow-lg backdrop-blur transition duration-300 group-hover:scale-125 group-hover:bg-orange group-hover:text-white">
            <PlayIcon size={26} className="translate-x-0.5" />
          </span>
        </span>
      </motion.button>
    </motion.li>
  );
}

function Player({ v }: { v: Item }) {
  const src = asset(`videos/${v.id}`);
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(true);
  const [muted, setMuted] = useState(false);
  const [progress, setProgress] = useState(0);
  if (!src) {
    return (
      <div className="grid gap-0 sm:grid-cols-[0.8fr_1fr]">
        <div className="relative aspect-[9/16] max-h-[70svh] w-full overflow-hidden">
          <VideoBackdrop scene={v.scene} />
          <p className="font-display ink-outline absolute inset-x-4 top-[30%] text-center text-4xl text-white">{v.title}</p>
        </div>
        <div className="flex flex-col justify-center gap-4 p-8 text-right">
          <Wordmark className="text-4xl" />
          <h3 className="font-display text-3xl text-ink">{v.title}</h3>
          <p className="leading-8 text-ink/70">الحلقة دي بتتعرض دلوقتي على قناة زغاليل. اتفرج عليها هناك واشترك عشان توصلك الحلقات الجديدة أول بأول.</p>
          <a href="https://youtube.com/" target="_blank" rel="noreferrer">
            <Button variant="orange" tabIndex={-1}>
              <YoutubeIcon /> اتفرج على يوتيوب
            </Button>
          </a>
        </div>
      </div>
    );
  }
  return (
    <div className="relative mx-auto aspect-[9/16] max-h-[85svh] bg-ink">
      <video
        ref={ref}
        src={src}
        poster={asset(`videos/${v.id}-poster`)}
        autoPlay
        playsInline
        muted={muted}
        onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime / (e.currentTarget.duration || 1))}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onClick={() => (ref.current?.paused ? ref.current.play() : ref.current?.pause())}
        className="h-full w-full object-contain"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-ink/70 to-transparent p-4 text-white">
        <button aria-label={playing ? "إيقاف" : "تشغيل"} onClick={() => (ref.current?.paused ? ref.current.play() : ref.current?.pause())}>
          {playing ? <PauseIcon /> : <PlayIcon />}
        </button>
        <div
          className="relative h-1.5 flex-1 cursor-pointer rounded-full bg-white/30"
          dir="ltr"
          onClick={(e) => {
            const r = e.currentTarget.getBoundingClientRect();
            if (ref.current) ref.current.currentTime = ((e.clientX - r.left) / r.width) * (ref.current.duration || 0);
          }}
        >
          <div className="absolute inset-y-0 left-0 rounded-full bg-orange" style={{ width: `${progress * 100}%` }} />
        </div>
        <button aria-label={muted ? "تشغيل الصوت" : "كتم الصوت"} onClick={() => setMuted((m) => !m)}>
          <SoundIcon muted={muted} />
        </button>
      </div>
    </div>
  );
}

export function Videos() {
  const [open, setOpen] = useState<Item | null>(null);
  return (
    <section id="videos" className="relative py-20 lg:py-24">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        <Pill>{videos.eyebrow}</Pill>
        <SplitHeading text={videos.title} className="mt-5 text-[clamp(2.1rem,4.2vw,3.4rem)] text-ink" />
      </div>
      <ul className="no-scrollbar mx-auto mt-10 flex max-w-[1240px] snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 sm:px-6 lg:grid lg:grid-cols-5 lg:gap-5 lg:overflow-visible lg:px-8">
        {videos.items.map((v, i) => (
          <VideoCard key={v.id} v={v} i={i} onOpen={() => setOpen(v)} />
        ))}
      </ul>
      <Modal open={!!open} onClose={() => setOpen(null)} label={open?.title ?? "فيديو"} className="max-w-3xl overflow-hidden">
        {open && <Player v={open} />}
      </Modal>
    </section>
  );
}
