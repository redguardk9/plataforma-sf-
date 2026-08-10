import { TESTIMONIALS } from "@/lib/site";

export function Testimonials({ limit }: { limit?: number }) {
  const items = limit ? TESTIMONIALS.slice(0, limit) : TESTIMONIALS;
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((t) => (
        <figure key={t.initials + t.text.slice(0, 8)} className="card p-8 flex flex-col">
          <div className="text-brand text-serif text-[34px] leading-none mb-1">&ldquo;</div>
          <blockquote className="text-serif text-[17px] leading-[1.55] text-ink flex-1 italic">
            {t.text}
          </blockquote>
          <figcaption className="flex items-center gap-3 mt-6 pt-6 border-t border-border">
            <span className="w-10 h-10 rounded-full grid place-items-center text-sm font-bold bg-brand text-white">
              {t.initials.charAt(0)}
            </span>
            <div>
              <div className="text-sm font-semibold text-ink">{t.initials}</div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-faint">{t.role}</div>
            </div>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
