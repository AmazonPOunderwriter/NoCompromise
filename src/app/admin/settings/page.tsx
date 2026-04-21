// src/app/admin/settings/page.tsx
import { requireAdmin } from "@/lib/auth";

export default async function AdminSettingsPage() {
  await requireAdmin();

  return (
    <div className="space-y-8 max-w-2xl">
      <h1 className="font-serif text-3xl">Settings</h1>
      <div className="rounded-2xl border border-border p-6 bg-background space-y-4">
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Store name
          </div>
          <div className="mt-1 font-medium">NoCompromise Market</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Free shipping threshold
          </div>
          <div className="mt-1 font-medium">$75</div>
        </div>
        <div>
          <div className="text-xs uppercase tracking-wider text-muted-foreground">
            Member shipping threshold
          </div>
          <div className="mt-1 font-medium">$50</div>
        </div>
        <p className="text-xs text-muted-foreground pt-4 border-t border-border">
          Settings CRUD is a post-MVP feature. Update values in{" "}
          <code className="font-mono">src/server/orders/checkout.ts</code> or move
          to the <code className="font-mono">SiteSetting</code> model.
        </p>
      </div>
    </div>
  );
}
