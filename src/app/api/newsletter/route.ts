// src/app/api/newsletter/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const formData = await req.formData().catch(() => null);
  const email = formData?.get("email")?.toString();
  if (!email) return NextResponse.json({ error: "Email required" }, { status: 400 });

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email, source: "footer" },
      update: {},
    });
  } catch (e) {
    console.error(e);
  }
  return NextResponse.redirect(new URL("/?subscribed=1", req.url));
}
