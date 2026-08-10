import { prisma } from "@/lib/prisma";
import { formatDateTime } from "@/lib/constants";
import { updateSupervisionSettings, createSupervisionResource, deleteSupervisionResource } from "../actions";
import { ConfirmSubmitButton } from "@/components/ConfirmSubmitButton";

function toLocalInput(d: Date | null): string {
  if (!d) return "";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
}

const TYPE_LABEL: Record<string, string> = { RECORDING: "Gravação", MATERIAL: "Material" };

export default async function AdminSupervisao() {
  const [settings, resources] = await Promise.all([
    prisma.supervisionSettings.findFirst(),
    prisma.supervisionResource.findMany({ orderBy: { order: "asc" } }),
  ]);

  return (
    <div className="p-6 lg:p-10">
      <h1 className="text-2xl font-semibold">Supervisão</h1>
      <p className="text-muted mt-2 mb-8">Conteúdo da área reservada de supervisão — visível a quem tem acesso.</p>

      <h2 className="font-semibold mb-3">Próximo encontro</h2>
      <form action={updateSupervisionSettings} className="adm-card p-6 grid sm:grid-cols-2 gap-4 mb-10">
        <div>
          <label className="adm-label">Data / hora</label>
          <input name="nextSessionAt" type="datetime-local" defaultValue={toLocalInput(settings?.nextSessionAt ?? null)} className="adm-input" />
        </div>
        <div>
          <label className="adm-label">Título</label>
          <input name="nextSessionLabel" defaultValue={settings?.nextSessionLabel ?? "Grupo de supervisão"} className="adm-input" />
        </div>
        <div className="sm:col-span-2">
          <label className="adm-label">Link da sala (Zoom, Meet, …)</label>
          <input name="meetingUrl" placeholder="https://…" defaultValue={settings?.meetingUrl ?? ""} className="adm-input" />
        </div>
        {settings?.nextSessionAt && (
          <p className="sm:col-span-2 text-[12px] text-faint -mt-1">Atual: {formatDateTime(settings.nextSessionAt)}</p>
        )}
        <div className="sm:col-span-2">
          <button className="btn btn-primary">Guardar</button>
        </div>
      </form>

      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">Gravações e materiais <span className="text-muted font-normal">({resources.length})</span></h2>
      </div>

      <form action={createSupervisionResource} className="adm-card p-5 grid sm:grid-cols-2 gap-3 mb-4">
        <div>
          <label className="adm-label">Tipo</label>
          <select name="type" className="adm-input">
            <option value="RECORDING">Gravação</option>
            <option value="MATERIAL">Material</option>
          </select>
        </div>
        <div>
          <label className="adm-label">Link (opcional)</label>
          <input name="url" placeholder="https://…" className="adm-input" />
        </div>
        <div className="sm:col-span-2">
          <label className="adm-label">Título</label>
          <input name="title" required className="adm-input" />
        </div>
        <div className="sm:col-span-2">
          <label className="adm-label">Descrição</label>
          <input name="description" className="adm-input" />
        </div>
        <div className="sm:col-span-2"><button className="btn btn-primary text-sm">Adicionar</button></div>
      </form>

      <div className="adm-card divide-y divide-border">
        {resources.length === 0 && <p className="px-5 py-6 text-muted text-sm">Ainda não há gravações nem materiais.</p>}
        {resources.map((r) => (
          <div key={r.id} className="flex items-center gap-4 px-5 py-3">
            <span className="pill pill-brand shrink-0">{TYPE_LABEL[r.type] ?? r.type}</span>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{r.title}</p>
              {r.description && <p className="text-[11px] text-faint truncate">{r.description}</p>}
            </div>
            <form action={deleteSupervisionResource.bind(null, r.id)}>
              <ConfirmSubmitButton confirmMessage={`Apagar "${r.title}"?`} className="text-xs text-red-500 hover:text-red-400">
                Apagar
              </ConfirmSubmitButton>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
