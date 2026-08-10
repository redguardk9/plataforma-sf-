import type { NextAuthConfig } from "next-auth";

// Configuração base, segura para o middleware (edge) — sem Prisma nem bcrypt.
// O provider de credenciais é adicionado em src/auth.ts.
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    // Protege as rotas privadas com base no papel do utilizador.
    authorized({ auth, request: { nextUrl } }) {
      const user = auth?.user;
      const path = nextUrl.pathname;

      if (path.startsWith("/admin")) return user?.role === "ADMIN";
      if (path.startsWith("/conta")) return !!user;
      // /supervisao e /aprender exigem login; o acesso específico é validado na página.
      if (path.startsWith("/supervisao")) return !!user;
      if (path.startsWith("/aprender")) return !!user;
      return true;
    },
    jwt({ token, user }) {
      if (user) {
        token.id = user.id as string;
        token.role = user.role;
        token.supervisionAccess = user.supervisionAccess;
        token.name = user.name;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as string) ?? "USER";
        session.user.supervisionAccess = (token.supervisionAccess as boolean) ?? false;
      }
      return session;
    },
  },
} satisfies NextAuthConfig;
