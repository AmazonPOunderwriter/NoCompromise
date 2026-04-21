// src/app/(marketing)/contact/page.tsx
export const metadata = { title: "Contact" };

export default function ContactPage() {
  return (
    <div className="container-prose py-16 md:py-24">
      <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
        Contact
      </div>
      <h1 className="font-serif text-5xl md:text-6xl mt-3 leading-tight">
        Reach us.
      </h1>
      <p className="mt-6 text-lg text-muted-foreground">
        Questions about our standard, a brand you&apos;d like us to review, or
        something else entirely — we read everything.
      </p>

      <form className="mt-12 space-y-4 max-w-xl" action="/api/contact" method="post">
        <input
          type="text"
          name="name"
          placeholder="Your name"
          required
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <input
          type="email"
          name="email"
          placeholder="Your email"
          required
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <textarea
          name="message"
          rows={6}
          placeholder="How can we help?"
          required
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
        <button type="submit" className="btn-primary">
          Send message
        </button>
      </form>
    </div>
  );
}
