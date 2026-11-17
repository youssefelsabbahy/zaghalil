import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto grid min-h-[70vh] max-w-xl place-items-center px-6 pt-28 text-center">
      <div>
        <p className="font-display text-[6rem] leading-none text-leaf">٤٠٤</p>
        <h1 className="font-display mt-4 text-3xl text-ink">الصفحة دي تاهت من الشلة!</h1>
        <p className="mt-3 text-ink/70">يمكن اللينك اتغير أو الصفحة مش موجودة.</p>
        <Link href="/" className="mt-8 inline-flex h-12 items-center rounded-full bg-orange px-7 font-bold text-white shadow-[0_6px_0_0_var(--color-orange-deep)]">
          ارجع للرئيسية
        </Link>
      </div>
    </main>
  );
}
