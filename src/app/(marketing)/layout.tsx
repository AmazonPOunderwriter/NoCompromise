// src/app/(marketing)/layout.tsx
import { SiteHeader } from "@/components/storefront/SiteHeader";
import { SiteFooter } from "@/components/storefront/SiteFooter";

export default function MarketingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      <SiteFooter />
    </>
  );
}
