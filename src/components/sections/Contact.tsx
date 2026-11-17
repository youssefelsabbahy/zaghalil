"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { characters, contact } from "@/content/site";
import { asset } from "@/lib/assets";
import { useStore } from "@/lib/store";
import { isEmail, submitForm } from "@/lib/forms";
import { DEMO, DEMO_CONTACT_URL } from "@/lib/demo";
import { cn, toArabicDigits } from "@/lib/format";
import { Button, CharacterArt, Flower, Pill, Reveal, SplitHeading } from "@/components/ui/primitives";
import { MailIcon, PinIcon, WhatsappIcon } from "@/components/ui/Icons";

function Confetti() {
  const bits = useMemo(
    () =>
      Array.from({ length: 26 }, (_, i) => ({
        id: i,
        x: (Math.random() - 0.5) * 520,
        y: -120 - Math.random() * 260,
        r: Math.random() * 540 - 270,
        c: ["#F7953E", "#4FCB3B", "#A874A4", "#A7D9EC", "#FFCC1A", "#F9B8C9"][i % 6],
        s: 10 + Math.random() * 12,
      })),
    []
  );
  return (
    <div aria-hidden className="pointer-events-none absolute inset-x-0 bottom-24 flex justify-center">
      {bits.map((b) => (
        <motion.span
          key={b.id}
          className="absolute"
          initial={{ x: 0, y: 0, rotate: 0, opacity: 1 }}
          animate={{ x: b.x, y: [0, b.y, b.y + 260], rotate: b.r, opacity: [1, 1, 0] }}
          transition={{ duration: 1.8, ease: [0.2, 0.8, 0.4, 1] }}
        >
          <span style={{ width: b.s, height: b.s }} className="block">
            <Flower color={b.c} className="h-full w-full" />
          </span>
        </motion.span>
      ))}
    </div>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-[15px] font-semibold text-ink/80">{label}</span>
      {children}
      <AnimatePresence>
        {error && (
          <motion.span
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-1.5 block text-sm font-semibold text-[#C2263A]"
            role="alert"
          >
            {error}
          </motion.span>
        )}
      </AnimatePresence>
    </label>
  );
}

/** In demo mode the design's contact details show as plain text, never as live links. */
export function ContactLink({ href, children }: { href: string; children: React.ReactNode }) {
  if (DEMO) return <span className="inline-flex items-center gap-2">{children}</span>;
  return (
    <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel="noreferrer" className="inline-flex items-center gap-2 hover:underline">
      {children}
    </a>
  );
}

const inputCls =
  "w-full border-2 border-transparent bg-[#E8F8E4] px-5 py-3.5 text-[15px] text-ink outline-none transition placeholder:text-ink/40 focus:border-leaf focus:bg-white";

export function Contact() {
  const castArt = asset("scenes/contact-cast");

  return (
    <section id="contact" className="relative mx-auto max-w-[1240px] px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <Pill>{contact.eyebrow}</Pill>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* invite card (start column) */}
        <Reveal y={40} className="h-full">
          <div className="relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-[2rem] bg-sky p-8 sm:p-10">
            <SplitHeading as="h2" text={contact.inviteTitle} className="text-[clamp(1.9rem,3.4vw,2.7rem)] text-ink" />
            <p className="mt-4 max-w-sm text-[16px] leading-8 text-ink/80">{contact.inviteBody}</p>
            <ul className="mt-6 space-y-3 text-[15px] font-semibold text-ink">
              <li>
                <ContactLink href={`https://wa.me/2${contact.phone}`}>
                  <WhatsappIcon /> <span dir="ltr">{contact.phone}</span>
                </ContactLink>
              </li>
              <li>
                <ContactLink href={`mailto:${contact.email}`}>
                  <MailIcon /> <span dir="ltr">{contact.email}</span>
                </ContactLink>
              </li>
              <li className="inline-flex items-center gap-2">
                <PinIcon /> <span dir="ltr">{contact.studio}</span>
              </li>
            </ul>
            <div className="relative -mx-8 -mb-8 mt-auto pt-10 sm:-mx-10 sm:-mb-10">
              {castArt ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={castArt} alt="شلة زغاليل" className="w-full object-contain" loading="lazy" />
              ) : (
                <ul className="flex items-end justify-center gap-1 px-4">
                  {characters.map((c, i) => (
                    <motion.li
                      key={c.id}
                      className="w-[13%]"
                      initial={{ y: 80 }}
                      whileInView={{ y: 0 }}
                      viewport={{ once: true }}
                      transition={{ type: "spring", stiffness: 220, damping: 14, delay: 0.2 + i * 0.06 }}
                    >
                      <motion.div
                        animate={{ y: [0, -6, 0] }}
                        transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.2, ease: "easeInOut" }}
                        whileHover={{ y: -18, rotate: -6 }}
                      >
                        <CharacterArt id={c.id} className="w-full" />
                      </motion.div>
                    </motion.li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </Reveal>

        {/* form card */}
        <Reveal y={40} delay={0.1}>
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

export function ContactForm({ title = contact.formTitle, initialMessage }: { title?: string; initialMessage?: string }) {
  const prefill = useStore((s) => s.contactPrefill);
  const clearPrefill = useStore((s) => s.prefillContact);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState(initialMessage ? initialMessage + " " : "");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "demo">("idle");
  const [serverError, setServerError] = useState("");
  const msgRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!prefill) return;
    setMsg(prefill.slice(0, contact.maxLength) + " ");
    setStatus("idle");
    const t = setTimeout(() => msgRef.current?.focus({ preventScroll: true }), 900);
    clearPrefill("");
    return () => clearTimeout(t);
  }, [prefill, clearPrefill]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (name.trim().length < 2) errs.name = "اكتب اسمك كامل لو سمحت";
    if (!isEmail(email)) errs.email = "الإيميل ده مش مظبوط";
    if (msg.trim().length < 5) errs.msg = "احكيلنا طلبك في كلمتين على الأقل";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setStatus("sending");
    setServerError("");
    const res = await submitForm(
      process.env.NEXT_PUBLIC_CONTACT_ENDPOINT,
      { name, email, message: msg, source: "zaghalil-landing" },
      { subject: `رسالة من ${name} — موقع زغاليل`, body: `${msg}\n\n— ${name}\n${email}` }
    );
    if (res.ok && res.via === "demo") {
      setStatus("demo");
    } else if (res.ok) {
      setStatus("done");
      setName("");
      setEmail("");
      setMsg("");
    } else {
      setStatus("idle");
      setServerError(res.error);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-[2rem] bg-[#B4E8A9] p-8 sm:p-10">
      <AnimatePresence mode="wait">
        {status === "demo" ? (
          <motion.div
            key="demo"
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="grid min-h-[420px] place-items-center text-center"
            role="status"
          >
            <div className="max-w-sm">
              <motion.div
                initial={{ rotate: -20, scale: 0 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 14 }}
                className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white text-4xl shadow-[0_5px_0_0_rgba(0,0,0,0.08)]"
              >
                ✨
              </motion.div>
              <h3 className="font-display mt-6 text-3xl text-ink">ده نموذج تجريبي</h3>
              <p className="mt-3 leading-8 text-ink/75">
                الموقع ده تنفيذ مستقل لتصميم زغاليل، فرسالتك متبعتتش لأي حد. لو حابب تتواصل مع المطوّر، تقدر من خلال البورتفوليو.
              </p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <a href={DEMO_CONTACT_URL} target="_blank" rel="noopener noreferrer">
                  <Button variant="leaf" tabIndex={-1}>البورتفوليو</Button>
                </a>
                <Button variant="mint" onClick={() => setStatus("idle")}>
                  رجوع للنموذج
                </Button>
              </div>
            </div>
          </motion.div>
        ) : status === "done" ? (
          <motion.div
            key="done"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="relative grid min-h-[420px] place-items-center text-center"
          >
            <Confetti />
            <div>
              <motion.div
                initial={{ scale: 0, rotate: -90 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 12 }}
                className="mx-auto grid h-24 w-24 place-items-center rounded-full bg-leaf text-5xl"
              >
                ✓
              </motion.div>
              <h3 className="font-display mt-6 text-3xl text-ink">وصلتنا رسالتك!</h3>
              <p className="mt-3 text-ink/75">هنرد عليك في أقرب وقت ممكن. شكراً إنك بقيت جزء من عالم زغاليل 💚</p>
              <Button variant="mint" className="mt-6" onClick={() => setStatus("idle")}>
                ابعت رسالة تانية
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.form key="form" noValidate onSubmit={submit} exit={{ opacity: 0, y: -10 }} className="space-y-5">
            <h2 className="font-display text-[clamp(1.9rem,3.4vw,2.7rem)] text-ink">{title}</h2>
            <Field label={contact.fields.name} error={errors.name}>
              <input className={cn(inputCls, "rounded-full")} value={name} onChange={(e) => setName(e.target.value)} placeholder="رنا العبد" autoComplete="name" aria-invalid={!!errors.name} />
            </Field>
            <Field label={contact.fields.email} error={errors.email}>
              <input className={cn(inputCls, "rounded-full text-left placeholder:text-right")} dir="ltr" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@email.com" autoComplete="email" aria-invalid={!!errors.email} />
            </Field>
            <Field label={contact.fields.message} error={errors.msg}>
              <div className="relative">
                <textarea
                  ref={msgRef}
                  rows={5}
                  maxLength={contact.maxLength}
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                  placeholder={contact.fields.messagePh}
                  aria-invalid={!!errors.msg}
                  className={cn(inputCls, "resize-none rounded-[1.6rem] pb-8")}
                />
                <span className="pointer-events-none absolute bottom-3 left-5 text-xs text-ink/50" dir="ltr">
                  {toArabicDigits(msg.length)}/{toArabicDigits(contact.maxLength)}
                </span>
              </div>
            </Field>
            {serverError && <p className="text-sm font-semibold text-[#C2263A]" role="alert">{serverError}</p>}
            <div className="flex justify-end">
              <Button variant="leaf" size="lg" type="submit" disabled={status === "sending"} className="min-w-[180px]">
                {status === "sending" ? (
                  <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }} className="inline-block">
                    <Flower color="#1f1f1f" className="h-5 w-5" />
                  </motion.span>
                ) : (
                  contact.submit
                )}
              </Button>
            </div>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
