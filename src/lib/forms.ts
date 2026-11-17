import { DEMO } from "./demo";

export type SubmitResult = { ok: true; via: "endpoint" | "mail" | "demo" } | { ok: false; error: string };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
export const isEmail = (v: string) => EMAIL_RE.test(v.trim());

/**
 * Posts JSON to the configured endpoint (Formspree/Getform/own API).
 * Without one, opens the visitor's mail app pre-filled so no message is ever lost.
 */
export async function submitForm(
  endpoint: string | undefined,
  payload: Record<string, string>,
  mail: { subject: string; body: string }
): Promise<SubmitResult> {
  if (DEMO) return { ok: true, via: "demo" };
  if (endpoint) {
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(String(res.status));
      return { ok: true, via: "endpoint" };
    } catch {
      return { ok: false, error: "حصلت مشكلة في الإرسال، جرب تاني كمان شوية." };
    }
  }
  const to = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "Hello@Zaghalil.Com";
  window.location.href = `mailto:${to}?subject=${encodeURIComponent(mail.subject)}&body=${encodeURIComponent(mail.body)}`;
  return { ok: true, via: "mail" };
}
