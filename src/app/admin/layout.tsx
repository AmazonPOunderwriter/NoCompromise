// src/app/admin/layout.tsx
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import {
  LayoutDashboard, Package, Tag, ShieldCheck, ShoppingCart,
  Users, CreditCard, FileText, Settings,
} from "lucide-react";

const NAV = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Products", icon: Package },
  { href: "/admin/brands", label: "Brands", icon: Tag },
  { href: "/admin/compliance", label: "Compliance", icon: ShieldCheck },
  { href: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/memberships", label: "Memberships", icon: CreditCard },
  { href: "/admin/articles", label: "Journal", icon: FileText },
  { href: "/admin/settings", label: "Settings", icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-secondary/20">
      <div className="grid grid-cols-[240px_1fr] min-h-screen">
        <aside className="border-r border-border bg-background p-6 space-y-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-full border border-primary/40 bg-primary/5 grid place-items-center">
              <span className="font-serif text-primary text-sm">N</span>
            </div>
            <div>
              <div className="font-serif text-sm leading-tight">NoCompromise</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Admin</div>
            </div>
          </Link>
          <nav className="space-y-1">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm hover:bg-secondary transition"
              >
                <Icon className="h-4 w-4 text-muted-foreground" /> {label}
              </Link>
            ))}
          </nav>
        </aside>
        <main className="p-10">{children}</main>
      </div>
    </div>
  );
}
