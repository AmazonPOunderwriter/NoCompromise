// src/server/auth/actions.ts
"use server";
import { prisma } from "@/lib/prisma";
import { signIn } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { mergeGuestCartIntoUser } from "@/server/cart/cart";

const signupSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Valid email required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function signupAction(formData: FormData) {
  const parsed = signupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0].message };
  }

  const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
  if (existing) return { error: "An account with this email already exists." };

  const hash = await bcrypt.hash(parsed.data.password, 10);
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      passwordHash: hash,
      customerProfile: { create: {} },
    },
  });

  await mergeGuestCartIntoUser(user.id);

  await signIn("credentials", {
    email: parsed.data.email,
    password: parsed.data.password,
    redirectTo: "/account",
  });

  return { ok: true };
}

export async function loginAction(formData: FormData) {
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Email and password required." };

  try {
    await signIn("credentials", { email, password, redirectTo: "/account" });
    return { ok: true };
  } catch (e) {
    // NextAuth throws a redirect on success; only real errors surface
    if ((e as Error).message?.includes("NEXT_REDIRECT")) throw e;
    return { error: "Invalid email or password." };
  }
}
