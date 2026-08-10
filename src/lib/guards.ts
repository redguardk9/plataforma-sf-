import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

/**
 * Garante que quem executa é administrador — validando na BASE DE DADOS
 * (e não apenas no token da sessão). Assim, um admin removido perde o acesso
 * de imediato, sem esperar por novo login.
 */
export async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = await prisma.user.findUnique({ where: { id: session.user.id } });
  if (!user || user.role !== "ADMIN") redirect("/");
  return user;
}

/** Devolve o utilizador atual (fresco da BD) ou null. */
export async function currentUser() {
  const session = await auth();
  if (!session?.user) return null;
  return prisma.user.findUnique({ where: { id: session.user.id } });
}
