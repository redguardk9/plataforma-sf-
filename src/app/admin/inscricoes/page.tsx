import { prisma } from "@/lib/prisma";
import { formatDate, isLive } from "@/lib/constants";

export default async function AdminInscricoes() {
  const enrollments = await prisma.enrollment.findMany({
    include: { user: true, course: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-semibold">Inscrições</h1>
      <p className="text-muted mt-2 mb-8">Quem está inscrito em cada formação.</p>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left font-mono text-[10px] uppercase tracking-wider text-faint border-b border-border">
                <th className="px-4 py-3">Formando</th>
                <th className="px-4 py-3">Formação</th>
                <th className="px-4 py-3">Tipo</th>
                <th className="px-4 py-3 text-center">Progresso</th>
                <th className="px-4 py-3">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {enrollments.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-6 text-muted text-center">Ainda não há inscrições.</td></tr>
              )}
              {enrollments.map((e) => (
                <tr key={e.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium">{e.user.name}</div>
                    <div className="text-[11px] text-faint">{e.user.email}</div>
                  </td>
                  <td className="px-4 py-3">{e.course.title}</td>
                  <td className="px-4 py-3"><span className={`pill ${isLive(e.course.type) ? "pill-live" : "pill-brand"}`}>{isLive(e.course.type) ? "Direto" : "Gravada"}</span></td>
                  <td className="px-4 py-3 text-center font-mono">{e.progress}%</td>
                  <td className="px-4 py-3 text-muted">{formatDate(e.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
