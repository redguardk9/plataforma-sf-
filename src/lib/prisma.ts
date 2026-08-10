import { PrismaClient } from "@prisma/client";

// Reutiliza a instância do Prisma em desenvolvimento (evita esgotar ligações
// com o hot-reload do Next.js).
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
