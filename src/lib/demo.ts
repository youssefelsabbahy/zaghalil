/**
 * Portfolio/demo mode (default ON). This build is an unofficial implementation of the
 * Zaghalil design, so no order, message or subscription is sent to the brand's
 * WhatsApp or email shown in the design. Set NEXT_PUBLIC_DEMO_MODE=0 only for a
 * deployment the brand owner has approved and configured.
 */
export const DEMO = process.env.NEXT_PUBLIC_DEMO_MODE !== "0";
export const DEMO_CONTACT_URL = "https://youssefelsabbahy.com";
