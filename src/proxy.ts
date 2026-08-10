import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";

// Instância leve (sem Prisma) só para proteger rotas no middleware.
export default NextAuth(authConfig).auth;

export const config = {
  matcher: ["/admin/:path*", "/conta/:path*", "/supervisao/:path*", "/aprender/:path*"],
};
