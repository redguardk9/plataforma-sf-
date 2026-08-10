export function LegalDoc({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-[760px] px-6 py-16">
      <span className="eyebrow">Legal</span>
      <h1 className="mt-4 text-[clamp(30px,5vw,48px)]">{title}</h1>
      <p className="text-faint text-sm mt-3">Última atualização: {updated}</p>

      <div className="card p-4 mt-6 text-[13px] text-muted flex gap-3">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-brand shrink-0 mt-0.5"><circle cx="12" cy="12" r="9" /><path d="M12 8v5M12 16h.01" /></svg>
        Modelo inicial preparado para o seu caso. Recomenda-se uma revisão com apoio jurídico antes da publicação oficial.
      </div>

      <div className="legal mt-10">{children}</div>
    </div>
  );
}

export function LegalSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mt-9">
      <h2 className="text-xl font-bold mb-3">{title}</h2>
      <div className="flex flex-col gap-3 text-[15px] leading-relaxed text-muted">{children}</div>
    </section>
  );
}
