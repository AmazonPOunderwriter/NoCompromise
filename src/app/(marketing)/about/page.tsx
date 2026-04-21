// src/app/(marketing)/about/page.tsx
export const metadata = { title: "About" };

export default function AboutPage() {
  return (
    <div className="container-prose py-16 md:py-24">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        About
      </div>
      <h1 className="font-serif text-5xl md:text-6xl mt-3 leading-tight">
        We do the label reading for you.
      </h1>
      <div className="mt-10 space-y-6 text-lg leading-relaxed text-foreground/80">
        <p>
          NoCompromise Market exists because shopping for clean food is broken.
          Labels are obscure, certifications are gamed, and marketing has eaten
          the supply chain. You can spend twenty minutes in a grocery aisle and
          still leave with food you didn&apos;t want.
        </p>
        <p>
          So we made a strict, public standard — one we don&apos;t bend. Every
          product is screened against a banned and caution ingredient list.
          Every product passes a manual review. Every brand is vetted.
        </p>
        <p>
          If it&apos;s on our site, it passed. That&apos;s the whole promise.
        </p>
      </div>
    </div>
  );
}
