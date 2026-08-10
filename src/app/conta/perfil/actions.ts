"use server";

import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export type PwState = { error?: string; ok?: string } | undefined;

export async function changePassword(_prev: PwState, formData: FormData): Promise<PwState> {
  const session = await auth();
  if (!session?.user) return { error: "Sessão inválida." };

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (next.length < 6) return { error: "A nova palavra-passe deve ter pelo menos 6 caracteres." };
  if (next !== confirm) return { error: "A confirmação não coincide com a nova palavra-passe." };

  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user) return { error: "Utilizador não encontrado." };

  const valid = await bcrypt.compare(current, user.passwordHash);
  if (!valid) return { error: "A palavra-passe atual está incorreta." };

  await prisma.user.update({
    where: { id: user.id },
    data: { passwordHash: await bcrypt.hash(next, 10) },
  });
  return { ok: "Palavra-passe alterada com sucesso." };
}
