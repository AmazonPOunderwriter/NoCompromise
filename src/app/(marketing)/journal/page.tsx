// src/app/(marketing)/journal/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = { title: "Journal" };

export default async function JournalPage() {
  const articles = await prisma.article.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
  });

  return (
    <div className="container-wide py-16 md:py-24">
      <div className="space-y-3 mb-12 max-w-2xl">
        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          Journal
        </div>
        <h1 className="font-serif text-5xl">Notes on ingredients.</h1>
        <p className="text-muted-foreground">
          How we read labels, what we&apos;ve rejected, and why it matters.
        </p>
      </div>
      <div className="grid md:grid-cols-2 gap-8">
        {articles.map((a) => (
          <Link
            key={a.id}
            href={`/journal/${a.slug}`}
            className="group block rounded-2xl border border-border p-8 hover:border-primary/40 transition-colors"
          >
            <div className="text-xs uppercase tracking-[0.15em] text-muted-foreground">
              {a.readMinutes ?? 5} min read
            </div>
            <h2 className="font-serif text-2xl mt-3 leading-tight group-hover:text-primary transition-colors">
              {a.title}
            </h2>
            {a.excerpt && (
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                {a.excerpt}
              </p>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
}
