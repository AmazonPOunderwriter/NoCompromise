// src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, Fraunces } from "next/font/google";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const serif = Fraunces({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
  axes: ["opsz", "SOFT"],
});

export const metadata: Metadata = {
  title: {
    default: "NoCompromise Market — The Strictest Food Standard Online",
    template: "%s · NoCompromise Market",
  },
  description:
    "No seed oils. No shortcuts. No exceptions. Every product is rigorously screened against the Zero Compromise ingredient standard.",
  openGraph: {
    title: "NoCompromise Market",
    description: "The strictest food standard online.",
    type: "website",
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${serif.variable}`}>
      <body className="min-h-screen font-sans">{children}</body>
    </html>
  );
}
