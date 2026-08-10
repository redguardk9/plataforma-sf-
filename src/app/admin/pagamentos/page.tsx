import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate } from "@/lib/constants";
import { markPaymentPaid } from "../actions";

const LABEL: Record<string, string> = { PAID: "Pago", PENDING: "Pendente", FAILED: "Falhou", REFUNDED: "Reembolsado" };
const PILL: Record<string, string> = { PAID: "pill-success", PENDING: "pill-live", FAILED: "pill-live", REFUNDED: "pill-brand" };

export default async function AdminPagamentos() {
  const payments = await prisma.payment.findMany({
    include: { user: true, course: true, ebook: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-semibold">Pagamentos</h1>
      <p className="text-muted mt-2 mb-8">
        Confirme pagamentos manualmente enquanto o Stripe (Multibanco/MB Way) não está ligado.
      </p>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left font-mono text-[10px] uppercase tracking-wider text-faint border-b border-border">
                <th className="px-4 py-3">Cliente</th>
                <th className="px-4 py-3">Item</th>
                <th className="px-4 py-3">Método</th>
                <th className="px-4 py-3 text-right">Valor</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Estado</th>
                <th className="px-4 py-3 text-right">Ação</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {payments.length === 0 && (
                <tr><td colSpan={7} className="px-4 py-6 text-muted text-center">Ainda não há pagamentos.</td></tr>
              )}
              {payments.map((p) => (
                <tr key={p.id}>
                  <td className="px-4 py-3">
                    <div className="font-medium">{p.user.name}</div>
                    <div className="text-[11px] text-faint">{p.user.email}</div>
                  </td>
                  <td className="px-4 py-3">{p.course?.title ?? p.ebook?.title ?? "—"}</td>
                  <td className="px-4 py-3 font-mono text-muted">{p.method.toUpperCase()}</td>
                  <td className="px-4 py-3 text-right font-mono tabular-nums">{formatPrice(p.amountCents)}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(p.createdAt)}</td>
                  <td className="px-4 py-3"><span className={`pill ${PILL[p.status] ?? "pill-brand"}`}>{LABEL[p.status] ?? p.status}</span></td>
                  <td className="px-4 py-3 text-right">
                    {p.status === "PENDING" && (
                      <form action={markPaymentPaid.bind(null, p.id)}>
                        <button className="text-xs text-glow hover:underline">Marcar como pago</button>
                      </form>
                    )}
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
