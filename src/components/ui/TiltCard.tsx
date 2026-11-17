"use client";

import { motion, useMotionTemplate, useMotionValue, useSpring, useTransform } from "framer-motion";
import type { CSSProperties, ReactNode } from "react";
import { cn } from "@/lib/format";

/** Pastel "toy block" card with springy 3D tilt and a moving glare. */
export function TiltCard({
  children,
  className,
  style,
  max = 10,
  onClick,
  label,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  max?: number;
  onClick?: () => void;
  label?: string;
}) {
  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rx = useSpring(useTransform(py, [0, 1], [max, -max]), { stiffness: 250, damping: 20 });
  const ry = useSpring(useTransform(px, [0, 1], [-max, max]), { stiffness: 250, damping: 20 });
  const gx = useTransform(px, (v) => `${v * 100}%`);
  const gy = useTransform(py, (v) => `${v * 100}%`);
  const glare = useMotionTemplate`radial-gradient(circle at ${gx} ${gy}, rgba(255,255,255,0.55), transparent 55%)`;

  const Comp = onClick ? motion.button : motion.div;
  return (
    <div style={{ perspective: 900 }} className="h-full">
      <Comp
        type={onClick ? "button" : undefined}
        aria-label={label}
        onClick={onClick}
        onPointerMove={(e: React.PointerEvent<HTMLElement>) => {
          if (e.pointerType !== "mouse") return;
          const r = e.currentTarget.getBoundingClientRect();
          px.set((e.clientX - r.left) / r.width);
          py.set((e.clientY - r.top) / r.height);
        }}
        onPointerLeave={() => {
          px.set(0.5);
          py.set(0.5);
        }}
        whileTap={{ scale: 0.97 }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d", ...style }}
        className={cn("group edge-card relative block h-full w-full overflow-hidden text-right", className)}
      >
        {children}
        <motion.span aria-hidden style={{ background: glare }} className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Comp>
    </div>
  );
}
