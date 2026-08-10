import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface User {
    role?: string;
    supervisionAccess?: boolean;
  }
  interface Session {
    user: {
      id: string;
      role: string;
      supervisionAccess: boolean;
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string;
    role?: string;
    supervisionAccess?: boolean;
  }
}
