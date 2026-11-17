"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useStore, type Toast as ToastItem } from "@/lib/store";
import { toArabicDigits } from "@/lib/format";

const LIFETIME = 2600;

function ToastPill({ t }: { t: ToastItem }) {
  const dismiss = useStore((s) => s.dismiss);
  // Restart the timer whenever the same toast is bumped (t.at changes).
  useEffect(() => {
    const id = setTimeout(() => dismiss(t.id), LIFETIME);
    return () => clearTimeout(id);
  }, [t.id, t.at, dismiss]);

  return (
    <motion.li
      layout="position"
      initial={{ opacity: 0, y: 24, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 8, scale: 0.94, transition: { duration: 0.18 } }}
      transition={{ type: "spring", stiffness: 520, damping: 34 }}
      className="flex w-max max-w-full items-center gap-3 rounded-2xl bg-ink px-5 py-3 text-[15px] font-semibold text-white shadow-[0_12px_30px_-10px_rgba(0,0,0,0.45)]"
      role="status"
    >
      <span className="min-w-0 whitespace-nowrap overflow-hidden text-ellipsis">{t.text}</span>
      <AnimatePresence initial={false}>
        {t.count > 1 && (
          <motion.span
            key={t.count}
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 700, damping: 18 }}
            className="grid h-6 min-w-6 shrink-0 place-items-center rounded-full bg-orange px-1.5 text-xs font-bold"
          >
            ×{toArabicDigits(t.count)}
          </motion.span>
        )}
      </AnimatePresence>
    </motion.li>
  );
}

/** Stacked toasts (newest at the bottom). Each keeps its own width — no squeezing side by side. */
export function Toast() {
  const toasts = useStore((s) => s.toasts);
  return (
    <ol
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 z-[90] flex flex-col items-center gap-2 px-4"
      style={{ bottom: "max(1.25rem, env(safe-area-inset-bottom))" }}
    >
      <AnimatePresence initial={false} mode="popLayout">
        {toasts.map((t) => (
          <ToastPill key={t.id} t={t} />
        ))}
      </AnimatePresence>
    </ol>
  );
}
