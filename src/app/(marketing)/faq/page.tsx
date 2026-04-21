// src/app/(marketing)/faq/page.tsx
import { prisma } from "@/lib/prisma";

export const metadata = { title: "FAQ" };

export default async function FAQPage() {
  const faqs = await prisma.fAQ.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
  });

  const grouped = faqs.reduce<Record<string, typeof faqs>>((acc, f) => {
    const cat = f.category ?? "General";
    (acc[cat] ??= []).push(f);
    return acc;
  }, {});

  return (
    <div className="container-prose py-16 md:py-24">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        FAQ
      </div>
      <h1 className="font-serif text-5xl md:text-6xl mt-3 leading-tight">
        Questions, answered.
      </h1>

      <div className="mt-12 space-y-12">
        {Object.entries(grouped).map(([cat, items]) => (
          <section key={cat}>
            <h2 className="font-serif text-2xl mb-4">{cat}</h2>
            <div className="space-y-3">
              {items.map((f) => (
                <details
                  key={f.id}
                  className="group rounded-xl border border-border p-5"
                >
                  <summary className="cursor-pointer font-medium flex items-center justify-between">
                    {f.question}
                    <span className="text-muted-foreground group-open:rotate-45 transition-transform">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                    {f.answer}
                  </p>
                </details>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
