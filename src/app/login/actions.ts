"use server";

import { AuthError } from "next-auth";
import { signIn } from "@/auth";

export async function authenticate(_prev: string | undefined, formData: FormData) {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: (formData.get("next") as string) || "/conta",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return "Email ou palavra-passe incorretos.";
    }
    throw error; // rethrow do redirect de sucesso (NEXT_REDIRECT)
  }
}
