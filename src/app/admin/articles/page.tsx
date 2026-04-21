// src/app/admin/articles/page.tsx
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export default async function AdminArticlesPage() {
  await requireAdmin();
  const articles = await prisma.article.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-3xl">Journal</h1>
      <div className="rounded-2xl border border-border overflow-hidden bg-background">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 border-b border-border text-xs uppercase tracking-wider">
            <tr>
              <th className="text-left px-5 py-3">Title</th>
              <th className="text-left px-5 py-3">Status</th>
              <th className="text-left px-5 py-3">Published</th>
            </tr>
          </thead>
          <tbody>
            {articles.map((a) => (
              <tr key={a.id} className="border-b border-border last:border-0">
                <td className="px-5 py-3 font-medium">{a.title}</td>
                <td className="px-5 py-3">
                  <span className="chip">{a.status}</span>
                </td>
                <td className="px-5 py-3 text-muted-foreground">
                  {a.publishedAt?.toLocaleDateString() ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
