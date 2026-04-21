// src/app/(auth)/layout.tsx
import Link from "next/link";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="hidden md:flex bg-gradient-to-br from-primary/95 to-primary text-primary-foreground p-12 flex-col justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full border border-white/30 bg-white/10 grid place-items-center">
            <span className="font-serif text-white">N</span>
          </div>
          <span className="font-serif text-lg">NoCompromise</span>
        </Link>
        <div className="max-w-md">
          <h1 className="font-serif text-5xl leading-tight">
            Shop once.<br />Trust everything.
          </h1>
          <p className="mt-6 text-primary-foreground/80 leading-relaxed">
            The strictest food standard online. No seed oils. No shortcuts. No exceptions.
          </p>
        </div>
        <p className="text-xs text-primary-foreground/50">
          © {new Date().getFullYear()} NoCompromise Market
        </p>
      </div>
      <div className="flex items-center justify-center p-8">{children}</div>
    </div>
  );
}
