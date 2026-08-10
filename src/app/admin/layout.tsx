import { signOut } from "@/auth";
import { requireAdmin } from "@/lib/guards";
import { AdminShell, type AdminNavItem } from "@/components/AdminShell";

const ITEMS: AdminNavItem[] = [
  { href: "/admin", label: "Visão geral", icon: "chart" },
  { href: "/admin/formacoes", label: "Formações", icon: "book" },
  { href: "/admin/inscricoes", label: "Inscrições", icon: "calendar" },
  { href: "/admin/pagamentos", label: "Pagamentos", icon: "card" },
  { href: "/admin/utilizadores", label: "Utilizadores", icon: "users" },
  { href: "/admin/blog", label: "Blog", icon: "doc" },
  { href: "/admin/supervisao", label: "Supervisão", icon: "shield" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  async function logout() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  return (
    <AdminShell items={ITEMS} user={{ name: admin.name }} logout={logout}>
      {children}
    </AdminShell>
  );
}
