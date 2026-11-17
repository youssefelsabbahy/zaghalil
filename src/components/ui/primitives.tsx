"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { forwardRef, type ReactNode } from "react";
import { asset, firstAsset } from "@/lib/assets";
import { characterById, type CharacterId } from "@/content/site";
import { cn } from "@/lib/format";

/* ───────────── Section eyebrow (mint label pill of the identity) ───────────── */
export function Pill({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.span
      initial={{ opacity: 0, y: 12, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ type: "spring", stiffness: 380, damping: 22 }}
      className={cn(
        "inline-flex items-center gap-2 rounded-full bg-mint px-5 py-2 text-[15px] font-semibold text-ink",
        className
      )}
    >
      {children}
    </motion.span>
  );
}

/* ───────────── Buttons ───────────── */
type Variant = "orange" | "leaf" | "mint" | "ghost";
const variants: Record<Variant, string> = {
  orange: "bg-orange text-white shadow-[0_6px_0_0_var(--color-orange-deep)] hover:shadow-[0_8px_0_0_var(--color-orange-deep)]",
  leaf: "bg-leaf text-ink shadow-[0_6px_0_0_var(--color-leaf-deep)] hover:shadow-[0_8px_0_0_var(--color-leaf-deep)]",
  mint: "bg-mint text-ink shadow-[0_6px_0_0_var(--color-mint-deep)] hover:shadow-[0_8px_0_0_var(--color-mint-deep)]",
  ghost: "bg-white/70 text-ink shadow-[0_4px_0_0_rgba(0,0,0,0.08)]",
};

type BtnProps = HTMLMotionProps<"button"> & { variant?: Variant; size?: "sm" | "md" | "lg" | "lg-fluid" };
const sizes = {
  sm: "h-10 px-5 text-sm",
  md: "h-12 px-7 text-[15px]",
  lg: "h-14 px-9 text-lg",
  "lg-fluid": "h-14 px-4 text-base sm:px-9 sm:text-lg",
};

export const Button = forwardRef<HTMLButtonElement, BtnProps>(function Button(
  { variant = "orange", size = "md", className, children, ...rest },
  ref
) {
  return (
    <motion.button
      ref={ref}
      whileHover={{ y: -2, scale: 1.03 }}
      whileTap={{ y: 4, scale: 0.97, boxShadow: "0 1px 0 0 rgba(0,0,0,0.15)" }}
      transition={{ type: "spring", stiffness: 500, damping: 18 }}
      className={cn(
        "group relative inline-flex select-none items-center justify-center gap-2 overflow-hidden rounded-full font-bold transition-shadow disabled:opacity-60",
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-[-45%] w-1/3 skew-x-[-20deg] bg-white/35 opacity-0 transition-[left,opacity] duration-700 ease-out group-hover:left-[130%] group-hover:opacity-100"
      />
      <span className="relative z-10 inline-flex items-center gap-2">{children as ReactNode}</span>
    </motion.button>
  );
});

/* ───────────── Reveal helpers ───────────── */
export function Reveal({
  children,
  delay = 0,
  y = 28,
  className,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  as?: "div" | "li" | "p" | "span";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      initial={reduce ? false : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </Comp>
  );
}

/** Word-by-word bouncy heading reveal (keeps Arabic letter joins intact). */
export function SplitHeading({
  text,
  className,
  highlight,
  highlightClass = "text-leaf",
  as = "h2",
  delay = 0,
}: {
  text: string;
  className?: string;
  highlight?: string;
  highlightClass?: string;
  as?: "h1" | "h2" | "h3";
  delay?: number;
}) {
  const reduce = useReducedMotion();
  const words = text.split(" ");
  const Tag = motion[as];
  return (
    <Tag
      className={cn("font-display", className)}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      transition={{ staggerChildren: 0.07, delayChildren: delay }}
      aria-label={text}
    >
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden pb-[0.12em] align-bottom" aria-hidden>
          <motion.span
            className={cn("inline-block", highlight && w.includes(highlight) && highlightClass)}
            variants={
              reduce
                ? { hidden: { opacity: 0 }, show: { opacity: 1 } }
                : {
                    hidden: { y: "110%", rotate: -6 },
                    show: { y: "0%", rotate: 0, transition: { type: "spring", stiffness: 260, damping: 20 } },
                  }
            }
          >
            {w}
          </motion.span>
          {i < words.length - 1 && " "}
        </span>
      ))}
    </Tag>
  );
}

/* ───────────── Brand wordmark ───────────── */
export function Wordmark({ className, color = "text-leaf" }: { className?: string; color?: string }) {
  const logo = asset("brand/logo");
  if (logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={logo} alt="زغاليل" className={cn("h-auto w-auto", className)} />;
  }
  return (
    <span
      className={cn("font-display inline-block leading-none", color, className)}
      style={{ textShadow: "0 2px 0 rgba(0,0,0,0.06)" }}
    >
      زغاليل
    </span>
  );
}

/* ───────────── Character art slot ───────────── */
/**
 * Renders the official character export when present in public/zaghalil.
 * Until then it shows a designed name badge in the character's colours —
 * deliberately not a drawing of the character.
 */
export function CharacterArt({
  id,
  pose,
  className,
  imgClassName,
  priority,
}: {
  id: CharacterId;
  pose?: string;
  className?: string;
  imgClassName?: string;
  priority?: boolean;
}) {
  const c = characterById[id];
  const src = firstAsset(pose ? `poses/${id}-${pose}` : "", `characters/${id}`);
  if (src) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={c.name}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        draggable={false}
        className={cn("h-full w-full object-contain", imgClassName, className)}
      />
    );
  }
  return <NameBadge id={id} className={className} />;
}

export function NameBadge({ id, className }: { id: CharacterId; className?: string }) {
  const c = characterById[id];
  const initial = c.name.replace("السيد ", "").replace("ال", "").trim().charAt(0);
  return (
    <div
      className={cn("relative grid aspect-square place-items-center [container-type:inline-size]", className)}
      role="img"
      aria-label={c.name}
    >
      <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full drop-shadow-[0_8px_0_rgba(0,0,0,0.06)]">
        <path
          d="M100 14c30 0 58 10 72 36s12 60-2 86-42 50-72 50-56-18-70-44S12 80 30 52 70 14 100 14Z"
          fill={c.plush}
          stroke="#1f1f1f"
          strokeWidth="5"
          strokeLinejoin="round"
        />
        <path d="M58 52c10-12 26-18 40-18" stroke="#fff" strokeOpacity=".7" strokeWidth="9" strokeLinecap="round" fill="none" />
        <g fill="#ffcc1a" stroke="#1f1f1f" strokeWidth="3" strokeLinejoin="round">
          <path d="m168 26 5 11 11 5-11 5-5 11-5-11-11-5 11-5Z" />
          <path d="m30 150 3 7 7 3-7 3-3 7-3-7-7-3 7-3Z" />
        </g>
      </svg>
      <span className="font-display relative translate-y-[4%] text-[42cqi] leading-none text-ink">
        {initial}
      </span>
    </div>
  );
}

/* ───────────── Decorative bits from the identity ───────────── */
export function Spark({ className, color = "#FFCC1A" }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 60 60" className={className} aria-hidden>
      <g stroke={color} strokeWidth="7" strokeLinecap="round">
        <path d="M30 6v12M12 16l7 8M48 16l-7 8" />
      </g>
    </svg>
  );
}

/** Scalloped flower used as timeline bullets. */
export function Flower({ color, className }: { color: string; className?: string }) {
  const petals = Array.from({ length: 10 }, (_, i) => {
    const a = (i / 10) * Math.PI * 2;
    return <circle key={i} cx={20 + Math.cos(a) * 11} cy={20 + Math.sin(a) * 11} r="6.2" fill={color} />;
  });
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      {petals}
      <circle cx="20" cy="20" r="11" fill={color} />
      <circle cx="20" cy="20" r="5" fill="#fff" fillOpacity=".45" />
    </svg>
  );
}

export function Cloud({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 70" className={className} aria-hidden>
      <path
        d="M28 62C14 62 6 54 6 44s8-17 18-17c2-12 12-21 25-21 11 0 20 6 24 15 3-2 7-3 11-3 12 0 22 9 22 21 0 13-10 23-23 23Z"
        fill="#E4F4FB"
        stroke="#BFE2F0"
        strokeWidth="2.5"
      />
      <path d="M30 40c2-8 9-13 17-13" stroke="#fff" strokeWidth="5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
