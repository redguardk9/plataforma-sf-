import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/constants";
import { toggleUserAdmin, toggleSupervision } from "../actions";

export default async function AdminUtilizadores() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { enrollments: true, payments: true } } },
  });

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-semibold">Utilizadores</h1>
      <p className="text-muted mt-2 mb-8">Gira papéis e o acesso à área de supervisão.</p>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left font-mono text-[10px] uppercase tracking-wider text-faint border-b border-border">
                <th className="px-4 py-3">Nome</th>
                <th className="px-4 py-3">Papel</th>
                <th className="px-4 py-3 text-center">Formações</th>
                <th className="px-4 py-3">Registo</th>
                <th className="px-4 py-3 text-right">Acessos</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((u) => (
                <tr key={u.id}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full grid place-items-center text-xs font-semibold text-white bg-gradient-to-br from-brand to-brand-700 shrink-0">
                        {u.name.charAt(0).toUpperCase()}
                      </span>
                      <div>
                        <div className="font-medium">{u.name}</div>
                        <div className="text-[11px] text-faint">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`pill ${u.role === "ADMIN" ? "pill-success" : "pill-brand"}`}>{u.role === "ADMIN" ? "Administrador" : "Formando"}</span>
                    {u.supervisionAccess && <span className="pill pill-live ml-1">Supervisão</span>}
                  </td>
                  <td className="px-4 py-3 text-center font-mono">{u._count.enrollments}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(u.createdAt)}</td>
                  <td className="px-4 py-3">
                    <div className="flex gap-3 justify-end">
                      <form action={toggleSupervision.bind(null, u.id)}>
                        <button className="text-xs text-muted hover:text-ink">{u.supervisionAccess ? "Retirar supervisão" : "Dar supervisão"}</button>
                      </form>
                      <form action={toggleUserAdmin.bind(null, u.id)}>
                        <button className="text-xs text-glow hover:underline">{u.role === "ADMIN" ? "Remover admin" : "Tornar admin"}</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
