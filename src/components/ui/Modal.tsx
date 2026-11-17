"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { lockScroll } from "@/lib/scroll";
import { cn } from "@/lib/format";
import { CloseIcon } from "./Icons";

type Props = {
  open: boolean;
  onClose: () => void;
  label: string;
  children: ReactNode;
  className?: string;
  variant?: "center" | "drawer";
};

export function Modal({ open, onClose, label, children, className, variant = "center" }: Props) {
  const panel = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const prev = document.activeElement as HTMLElement | null;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panel.current) {
        const f = panel.current.querySelectorAll<HTMLElement>(
          'a[href],button:not([disabled]),input,textarea,select,[tabindex]:not([tabindex="-1"])'
        );
        if (!f.length) return;
        const first = f[0];
        const last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);
    requestAnimationFrame(() => {
      const p = panel.current;
      (p?.querySelector<HTMLElement>("[data-autofocus]") ?? p?.querySelector<HTMLElement>("input,button"))?.focus();
    });
    return () => {
      window.removeEventListener("keydown", onKey);
      lockScroll(false);
      // restore focus after the closing key event finishes, so Enter can't re-trigger the opener
      setTimeout(() => prev?.focus?.({ preventScroll: true }), 0);
    };
  }, [open, onClose]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]" role="dialog" aria-modal="true" aria-label={label}>
          <motion.button
            aria-label="إغلاق"
            className="absolute inset-0 h-full w-full cursor-default bg-ink/45 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          {variant === "drawer" ? (
            <motion.div
              ref={panel}
              data-lenis-prevent
              className={cn("absolute inset-y-0 left-0 flex w-full max-w-md flex-col bg-cream shadow-2xl sm:rounded-r-[2rem]", className)}
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 34 }}
            >
              {children}
            </motion.div>
          ) : (
            <div className="pointer-events-none absolute inset-0 grid place-items-center p-4">
              <motion.div
                ref={panel}
                data-lenis-prevent
                className={cn("pointer-events-auto relative max-h-[90svh] w-full max-w-3xl overflow-y-auto rounded-[2rem] bg-cream shadow-2xl", className)}
                initial={{ opacity: 0, scale: 0.85, y: 40 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", stiffness: 340, damping: 26 }}
              >
                <button
                  onClick={onClose}
                  aria-label="إغلاق"
                  className="absolute left-4 top-4 z-20 grid h-10 w-10 place-items-center rounded-full bg-white/80 text-ink shadow transition hover:rotate-90 hover:bg-white"
                >
                  <CloseIcon />
                </button>
                {children}
              </motion.div>
            </div>
          )}
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
