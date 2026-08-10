import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/constants";

const LABEL: Record<string, string> = { PAID: "Pago", PENDING: "Pendente", FAILED: "Falhou", REFUNDED: "Reembolsado" };
const PILL: Record<string, string> = { PAID: "pill-success", PENDING: "pill-live", FAILED: "pill-live", REFUNDED: "pill-brand" };

export default async function Pagamentos() {
  const session = await auth();
  const payments = await prisma.payment.findMany({
    where: { userId: session!.user.id },
    include: { course: true, ebook: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 lg:p-10 max-w-[900px]">
      <h1 className="text-2xl font-semibold">Compras e pagamentos</h1>
      <p className="text-muted mt-2 mb-8">Histórico das suas compras na plataforma.</p>

      {payments.length === 0 ? (
        <p className="text-muted">Ainda não há pagamentos.</p>
      ) : (
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left font-mono text-[10px] uppercase tracking-wider text-faint border-b border-border">
                  <th className="px-4 py-3">Item</th>
                  <th className="px-4 py-3">Data</th>
                  <th className="px-4 py-3">Método</th>
                  <th className="px-4 py-3 text-right">Valor</th>
                  <th className="px-4 py-3">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {payments.map((p) => (
                  <tr key={p.id}>
                    <td className="px-4 py-3 font-medium">{p.course?.title ?? p.ebook?.title ?? "Compra"}</td>
                    <td className="px-4 py-3 text-muted">{formatDate(p.createdAt)}</td>
                    <td className="px-4 py-3 text-muted font-mono">{p.method.toUpperCase()}</td>
                    <td className="px-4 py-3 text-right font-mono tabular-nums">{formatPrice(p.amountCents)}</td>
                    <td className="px-4 py-3"><span className={`pill ${PILL[p.status] ?? "pill-brand"}`}>{LABEL[p.status] ?? p.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
