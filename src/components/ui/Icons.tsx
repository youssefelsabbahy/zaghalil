import type { SVGProps } from "react";

type P = SVGProps<SVGSVGElement> & { size?: number };
const base = (size = 20) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.9,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
});

export const SearchIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></svg>
);
export const CartIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M3 4h2.2l2.1 10.2a1.6 1.6 0 0 0 1.6 1.3h8.3a1.6 1.6 0 0 0 1.6-1.2L20.5 8H6.1" /><circle cx="9.5" cy="19.5" r="1.2" /><circle cx="17" cy="19.5" r="1.2" /></svg>
);
export const HeartIcon = ({ size, filled, ...p }: P & { filled?: boolean }) => (
  <svg {...base(size)} {...p} fill={filled ? "currentColor" : "none"}><path d="M12 20s-7.5-4.4-7.5-10A4.3 4.3 0 0 1 12 7.4 4.3 4.3 0 0 1 19.5 10c0 5.6-7.5 10-7.5 10Z" /></svg>
);
export const MenuIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
);
export const CloseIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M6 6l12 12M18 6 6 18" /></svg>
);
export const PlayIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p} fill="currentColor" stroke="none"><path d="M8 5.5v13a1 1 0 0 0 1.5.9l10.4-6.5a1 1 0 0 0 0-1.8L9.5 4.6A1 1 0 0 0 8 5.5Z" /></svg>
);
export const PauseIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p} fill="currentColor" stroke="none"><rect x="6" y="5" width="4" height="14" rx="1.2" /><rect x="14" y="5" width="4" height="14" rx="1.2" /></svg>
);
export const StarIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p} fill="currentColor" stroke="none"><path d="m12 2.8 2.8 5.8 6.3.9-4.6 4.4 1.1 6.3L12 17.2l-5.6 3 1.1-6.3L2.9 9.5l6.3-.9L12 2.8Z" /></svg>
);
export const ChevronIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="m9 6 6 6-6 6" /></svg>
);
export const ArrowIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M19 12H5m6-6-6 6 6 6" /></svg>
);
export const PlusIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const MinusIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M5 12h14" /></svg>
);
export const TrashIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M4 7h16M9 7V4.8h6V7m-8.5 0 1 12.2a1.5 1.5 0 0 0 1.5 1.3h6a1.5 1.5 0 0 0 1.5-1.3l1-12.2" /></svg>
);
export const PinIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M12 21s6.5-6.1 6.5-11.3a6.5 6.5 0 0 0-13 0C5.5 14.9 12 21 12 21Z" /><circle cx="12" cy="9.7" r="2.3" /></svg>
);
export const MailIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="m4 7.5 8 5.5 8-5.5" /></svg>
);
export const WhatsappIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M4.5 19.5 5.6 16A8 8 0 1 1 8.4 18.6Z" /><path d="M9.2 8.7c.3 2.6 2.4 4.8 5.1 5.4l1-1.1-1.6-1-1 .7a4.2 4.2 0 0 1-2.2-2.2l.7-1-1-1.6Z" /></svg>
);
export const FacebookIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><path d="M14.5 8H16V5h-2a3.5 3.5 0 0 0-3.5 3.5V11H8.5v3h2v7h3v-7h2.2l.5-3h-2.7V9a1 1 0 0 1 1-1Z" /></svg>
);
export const YoutubeIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><rect x="2.8" y="6" width="18.4" height="12.4" rx="3.6" /><path d="m10.4 9.6 4.4 2.6-4.4 2.6Z" fill="currentColor" /></svg>
);
export const InstagramIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><rect x="4" y="4" width="16" height="16" rx="4.6" /><circle cx="12" cy="12" r="3.6" /><circle cx="16.9" cy="7.1" r=".6" fill="currentColor" /></svg>
);
export const ZoomIcon = ({ size, ...p }: P) => (
  <svg {...base(size)} {...p}><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2M11 8.5v5M8.5 11h5" /></svg>
);
export const SoundIcon = ({ size, muted, ...p }: P & { muted?: boolean }) => (
  <svg {...base(size)} {...p}>
    <path d="M4 9.5h3.2L12 5.5v13l-4.8-4H4Z" />
    {muted ? <path d="m16 9.5 5 5m0-5-5 5" /> : <path d="M16 9a4.2 4.2 0 0 1 0 6m2.5-8.5a7.6 7.6 0 0 1 0 11" />}
  </svg>
);

export const socialIcon = {
  instagram: InstagramIcon,
  youtube: YoutubeIcon,
  facebook: FacebookIcon,
  whatsapp: WhatsappIcon,
  mail: MailIcon,
} as const;
