const ar = new Intl.NumberFormat("ar-EG", { useGrouping: false });
const arGroup = new Intl.NumberFormat("ar-EG");

/** 2021 → ٢٠٢١ */
export const toArabicDigits = (n: number | string) =>
  String(n).replace(/\d/g, (d) => ar.format(Number(d)));

export const egp = (n: number) => `${arGroup.format(n)} جنيه`;

export const cn = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(" ");
