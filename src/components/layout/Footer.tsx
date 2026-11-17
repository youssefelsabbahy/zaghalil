"use client";

import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState } from "react";
import { contact, footer, waDigits } from "@/content/site";
import { asset } from "@/lib/assets";
import { useStore } from "@/lib/store";
import { isEmail, submitForm } from "@/lib/forms";
import { DEMO } from "@/lib/demo";
import { scrollToHash } from "@/lib/scroll";
import { useGo } from "@/lib/nav";
import { cn } from "@/lib/format";
import { Flower, Spark, Wordmark } from "@/components/ui/primitives";
import { ChevronIcon, socialIcon } from "@/components/ui/Icons";
import { Modal } from "@/components/ui/Modal";
import { Credits, CreditLine } from "./Credits";

type Link = { label: string; href: string; prefill?: string };

function LinkList({ links, onTerms }: { links: readonly Link[]; onTerms: () => void }) {
  const prefill = useStore((s) => s.prefillContact);
  const go = useGo();
  return (
    <ul className="space-y-3">
      {links.map((l) => (
        <li key={l.label}>
          <a
            href={l.href}
            onClick={(e) => {
              e.preventDefault();
              if (l.href === "#terms") return onTerms();
              if (l.prefill) prefill(l.prefill);
              go(l.href);
            }}
            className="group inline-flex items-center gap-2 text-[15px] text-white/85 transition hover:text-white"
          >
            <span className="h-1.5 w-0 rounded-full bg-mint transition-all duration-300 group-hover:w-3" />
            {l.label}
          </a>
        </li>
      ))}
    </ul>
  );
}

function Accordion({ title, children, defaultOpen = false }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/15 lg:border-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex w-full items-center justify-between py-4 text-right lg:pointer-events-none lg:py-0"
      >
        <h3 className="font-display text-xl text-white">{title}</h3>
        <ChevronIcon className={cn("text-white transition-transform lg:hidden", open ? "-rotate-90" : "rotate-90")} />
      </button>
      <div className={cn("grid transition-[grid-template-rows] duration-500 lg:mt-5 lg:grid-rows-[1fr]", open ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
        <div className="overflow-hidden">
          <div className="pb-5 lg:pb-0">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  const ref = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "error" | "done" | "demo">("idle");
  const [terms, setTerms] = useState(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end end"] });
  const markY = useTransform(scrollYProgress, [0, 1], [120, 0]);
  const markScale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const castArt = asset("scenes/footer-cast");
  const notify = useStore((st) => st.notify);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isEmail(email)) return setState("error");
    const res = await submitForm(
      process.env.NEXT_PUBLIC_NEWSLETTER_ENDPOINT,
      { email, list: "zaghalil-news" },
      { subject: "اشتراك في أخبار زغاليل", body: `عايز أشترك في أخبار زغاليل: ${email}` }
    );
    setState(res.ok ? (res.via === "demo" ? "demo" : "done") : "error");
    if (res.ok) setEmail("");
  };

  return (
    <footer id="footer" ref={ref} className="relative mt-10 overflow-hidden rounded-t-[2.5rem] bg-purple text-white lg:rounded-t-[3.5rem]">
      <div className="grain absolute inset-0" aria-hidden />
      <div className="relative mx-auto max-w-[1240px] px-6 pt-14 sm:px-8 lg:pt-20">
        <div className="grid gap-2 lg:grid-cols-4 lg:gap-10">
          {footer.columns.map((col) => (
            <Accordion key={col.title} title={col.title}>
              <LinkList links={col.links as readonly Link[]} onTerms={() => setTerms(true)} />
            </Accordion>
          ))}
          <Accordion title="معلومات مهمة">
            <dl className="space-y-4 text-[15px]">
              <div>
                <dt className="text-white/70">واتساب:</dt>
                <dd>
                  {DEMO ? (
                    <span dir="ltr">{contact.phone}</span>
                  ) : (
                    <a href={`https://wa.me/${waDigits(contact.phone)}`} target="_blank" rel="noreferrer" className="underline decoration-white/40 underline-offset-4 hover:decoration-white" dir="ltr">
                      {contact.phone}
                    </a>
                  )}
                </dd>
              </div>
              <div>
                <dt className="text-white/70">إيميلنا:</dt>
                <dd>
                  {DEMO ? (
                    <span dir="ltr">{contact.email}</span>
                  ) : (
                    <a href={`mailto:${contact.email}`} className="underline decoration-white/40 underline-offset-4 hover:decoration-white" dir="ltr">
                      {contact.email}
                    </a>
                  )}
                </dd>
              </div>
            </dl>
          </Accordion>
          <div className="pt-6 lg:pt-0">
            <h3 className="font-display text-xl">{footer.newsletter.title}</h3>
            <p className="mt-4 text-[15px] text-white/80">{footer.newsletter.body}</p>
            <form onSubmit={subscribe} noValidate className="mt-5 flex gap-2">
              <input
                type="email"
                dir="ltr"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setState("idle");
                }}
                placeholder={footer.newsletter.placeholder}
                aria-label={footer.newsletter.placeholder}
                className={cn(
                  "h-12 min-w-0 flex-1 rounded-full border-2 bg-white/20 px-5 text-right text-white outline-none transition placeholder:text-white/70 focus:bg-white/30",
                  state === "error" ? "border-[#FFB4B4]" : "border-white/40 focus:border-white"
                )}
              />
              <motion.button
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                className="h-12 shrink-0 rounded-full bg-leaf px-6 font-bold text-ink shadow-[0_5px_0_0_var(--color-leaf-deep)]"
              >
                {footer.newsletter.cta}
              </motion.button>
            </form>
            <AnimatePresence>
              {state !== "idle" && (
                <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-2 text-sm font-semibold" role="status">
                  {state === "done"
                    ? "تمام! هتوصلك أخبارنا أول بأول 💚"
                    : state === "demo"
                      ? "نسخة تجريبية: الاشتراك متسجلش في أي قائمة."
                      : "اكتب إيميل صحيح لو سمحت"}
                </motion.p>
              )}
            </AnimatePresence>
            <ul className="mt-6 flex gap-2">
              {footer.socials.map((s) => {
                const Icon = socialIcon[s.id];
                const demoOnly = DEMO && (s.id === "whatsapp" || s.id === "mail");
                const cls =
                  "grid h-10 w-10 place-items-center rounded-full bg-white/15 text-white transition-colors duration-200 hover:bg-mint hover:text-ink";
                const motionProps = {
                  whileHover: { y: -4, rotate: -8 },
                  whileTap: { scale: 0.9 },
                  transition: { type: "spring" as const, stiffness: 420, damping: 18 },
                };
                return (
                  <li key={s.id}>
                    {demoOnly ? (
                      <motion.button
                        type="button"
                        aria-label={s.label}
                        onClick={() => notify("نسخة تجريبية: التواصل مع زغاليل مش متاح من هنا")}
                        className={cls}
                        {...motionProps}
                      >
                        <Icon size={18} />
                      </motion.button>
                    ) : (
                      <motion.a href={s.href} target="_blank" rel="noreferrer" aria-label={s.label} className={cls} {...motionProps}>
                        <Icon size={18} />
                      </motion.a>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        {/* giant wordmark */}
        <div className="relative mt-14 select-none lg:mt-20">
          <motion.div style={{ y: markY, scale: markScale }} className="relative mx-auto grid place-items-center">
            {castArt ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={castArt} alt="شلة زغاليل على اللوجو" className="w-full max-w-[1000px]" loading="lazy" />
            ) : (
              <div className="relative">
                <Wordmark className="text-[clamp(7rem,30vw,22rem)] leading-[0.95] drop-shadow-[0_10px_0_rgba(0,0,0,0.12)]" />
                <Flower color="#FFCC1A" className="absolute -top-2 right-[8%] h-14 w-14 animate-[spin_10s_linear_infinite] lg:h-20 lg:w-20" />
                <Flower color="#F9B8C9" className="absolute bottom-[18%] left-[4%] h-10 w-10 animate-[spin_12s_linear_infinite] lg:h-16 lg:w-16" />
                <Spark className="absolute -top-6 left-[30%] h-12 w-12 animate-wiggle lg:h-16 lg:w-16" />
                <Spark className="absolute top-[30%] -right-4 h-10 w-10 rotate-90 animate-wiggle [animation-delay:-1s]" color="#CAF4C3" />
              </div>
            )}
          </motion.div>
        </div>

        <Credits />

        <div className="relative mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/15 py-6 text-sm text-white/70 sm:flex-row">
          <CreditLine />
          <button onClick={() => scrollToHash("#home")} className="group inline-flex items-center gap-2 font-semibold text-white">
            ارجع لفوق
            <span className="grid h-8 w-8 place-items-center rounded-full bg-white/15 transition group-hover:-translate-y-1 group-hover:bg-mint group-hover:text-ink">
              <ChevronIcon size={16} className="-rotate-90" />
            </span>
          </button>
        </div>
      </div>

      <TermsDialog open={terms} onClose={() => setTerms(false)} />
    </footer>
  );
}

// Sample terms text — replace with the client's approved terms before launch.
function TermsDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} label="شروط الخدمة" className="max-w-2xl">
      <div className="p-8 text-right sm:p-10">
        <h2 className="font-display text-3xl text-ink">شروط الخدمة</h2>
        <ul className="mt-5 list-disc space-y-3 pr-5 leading-8 text-ink/80">
          <li>كل محتوى وشخصيات زغاليل محمية بحقوق الملكية، وممنوع إعادة استخدامها من غير إذن مكتوب.</li>
          <li>الطلبات من الدكان بتتأكد بعد التواصل معاك على واتساب أو الإيميل، والشحن مجاني للطلبات اللي فوق ٥٠٠ جنيه.</li>
          <li>بيانات التواصل اللي بتبعتها بنستخدمها بس عشان نرد عليك، ومش بنشاركها مع أي حد.</li>
          <li>للشراكات والعروض المسرحية بيتم الاتفاق على التفاصيل في عقد منفصل.</li>
        </ul>
        <p className="mt-6 text-sm text-ink/50">آخر تحديث: ٢٠٢٦</p>
      </div>
    </Modal>
  );
}
