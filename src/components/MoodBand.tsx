import Image from "next/image";

/** Faixa cinematográfica de largura total: imagem de fundo + sobreposição + conteúdo. */
export function MoodBand({
  src,
  children,
  overlay = "bg-gradient-to-b from-black/65 via-black/45 to-black/70",
  className = "",
}: {
  src: string;
  children: React.ReactNode;
  overlay?: string;
  className?: string;
}) {
  return (
    <section className={`relative overflow-hidden ${className}`}>
      <Image src={src} alt="" fill sizes="100vw" className="object-cover" />
      <div className={`absolute inset-0 ${overlay}`} />
      <div className="relative">{children}</div>
    </section>
  );
}
