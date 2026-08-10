import { signOut } from "@/auth";
import { currentUser } from "@/lib/guards";
import { DashboardShell, type NavItem } from "@/components/DashboardShell";

const ITEMS: NavItem[] = [
  { href: "/conta", label: "Painel", icon: "home" },
  { href: "/conta/formacoes", label: "As minhas formações", icon: "book" },
  { href: "/conta/pagamentos", label: "Compras e pagamentos", icon: "card" },
  { href: "/conta/perfil", label: "Perfil", icon: "user" },
];

export default async function ContaLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  async function logout() {
    "use server";
    await signOut({ redirectTo: "/" });
  }

  const items = user?.supervisionAccess
    ? [...ITEMS.slice(0, -1), { href: "/supervisao", label: "Supervisão", icon: "shield" as const }, ITEMS[ITEMS.length - 1]]
    : ITEMS;

  return (
    <DashboardShell
      area="A minha área"
      items={items}
      user={{ name: user?.name, role: user?.role ?? "USER" }}
      logout={logout}
    >
      {children}
    </DashboardShell>
  );
}
