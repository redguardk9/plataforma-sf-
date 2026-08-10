import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const schema = z.object({
  name: z.string().min(2, "Indique o seu nome."),
  email: z.string().email("Email inválido."),
  password: z.string().min(6, "A palavra-passe deve ter pelo menos 6 caracteres."),
});

export async function POST(request: Request) {
  const data = await request.json().catch(() => null);
  const parsed = schema.safeParse(data);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  const { name, email, password } = parsed.data;
  const normalizedEmail = email.toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: "Já existe uma conta com este email." }, { status: 409 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({
    data: { name, email: normalizedEmail, passwordHash, role: "USER" },
  });

  return NextResponse.json({ ok: true }, { status: 201 });
}
