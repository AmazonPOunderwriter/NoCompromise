// src/app/(marketing)/journal/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const a = await prisma.article.findUnique({ where: { slug } });
  return a ? { title: a.title, description: a.excerpt ?? undefined } : {};
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = await prisma.article.findFirst({
    where: { slug, status: "PUBLISHED" },
  });
  if (!article) notFound();

  return (
    <div className="container-prose py-16 md:py-24">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Journal · {article.readMinutes ?? 5} min read
      </div>
      <h1 className="font-serif text-4xl md:text-5xl mt-3 leading-tight">
        {article.title}
      </h1>
      {article.excerpt && (
        <p className="text-lg text-muted-foreground mt-5 leading-relaxed">
          {article.excerpt}
        </p>
      )}
      {article.authorName && (
        <div className="mt-6 text-sm text-muted-foreground">
          By {article.authorName}
        </div>
      )}
      <article className="mt-10 prose prose-lg max-w-none whitespace-pre-wrap">
        {article.bodyMdx}
      </article>
    </div>
  );
}
