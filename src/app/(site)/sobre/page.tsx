import type { Metadata } from "next";
import Image from "next/image";
import { ContactCTA } from "@/components/ContactCTA";
import { MoodBand } from "@/components/MoodBand";
import { ABOUT, PHILOSOPHY } from "@/lib/site";

export const metadata: Metadata = { title: "Sobre" };

export default function SobrePage() {
  return (
    <>
      {/* Hero */}
      <section className="mx-auto max-w-[1180px] px-6 pt-20 pb-10">
        <span className="eyebrow">Sobre</span>
        <h1 className="mt-6 text-[clamp(30px,5vw,52px)] font-semibold max-w-[16ch]">Quem é Sérgio Fonseca?</h1>
        <p className="mt-8 text-[clamp(18px,2.4vw,24px)] italic leading-relaxed text-ink/90 max-w-[46ch]">
          &ldquo;{PHILOSOPHY}&rdquo;
        </p>
      </section>

      {/* Biografia */}
      <section className="mx-auto max-w-[1180px] px-6 py-12">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] items-start">
          <div className="lg:sticky lg:top-24">
            <div className="rounded-3xl overflow-hidden border border-border shadow-xl">
              <Image
                src="/sergio-portrait.jpg"
                alt="Sérgio Fonseca, psicólogo especialista"
                width={800}
                height={989}
                priority
                className="w-full h-auto object-cover"
              />
            </div>
          </div>
          <div className="flex flex-col gap-5">
            {ABOUT.intro.map((p, i) => (
              <p key={i} className={`leading-relaxed ${i === 0 ? "text-ink text-lg" : "text-muted"}`}>{p}</p>
            ))}
            <dl className="grid grid-cols-2 gap-3 mt-4">
              <Fact label="Especialidade" value="Psicologia Clínica e da Saúde (OPP)" />
              <Fact label="Mestrado" value="Comportamento Desviante e da Justiça" />
              <Fact label="Investigação" value="Trauma Ferroviário" />
              <Fact label="Percurso" value="~30 anos como maquinista" />
            </dl>
          </div>
        </div>
      </section>

      {/* Faixa citação */}
      <MoodBand src="/mood-forest.jpg" className="my-12" overlay="bg-gradient-to-b from-[#081324]/86 via-[#081324]/68 to-[#081324]/92">
        <div className="mx-auto max-w-[860px] px-6 py-24 sm:py-28 text-center">
          <div className="text-[#5AA0FF] text-serif text-[40px] leading-none mb-3">&ldquo;</div>
          <p className="text-serif italic text-[#EAF1FB] text-[clamp(23px,3.4vw,38px)] leading-[1.24] text-balance">
            Às vezes, o verdadeiro cuidado começa quando alguém permanece contigo no sítio onde ninguém quis ficar.
          </p>
        </div>
      </MoodBand>

      {/* Especializações */}
      <section className="mx-auto max-w-[1180px] px-6 py-12">
        <span className="eyebrow">Especializações</span>
        <h2 className="mt-3.5 text-[clamp(24px,3.4vw,36px)] font-semibold">Formação e áreas de intervenção</h2>
        <div className="grid gap-5 md:grid-cols-3 mt-8">
          {ABOUT.specializations.map((s) => (
            <div key={s.title} className="card p-6">
              <div className="w-10 h-10 rounded-xl bg-brand-soft text-glow grid place-items-center mb-4">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M12 3l9 5-9 5-9-5 9-5zM3 12l9 5 9-5M3 16l9 5 9-5" /></svg>
              </div>
              <h3 className="font-semibold leading-snug">{s.title}</h3>
              <p className="text-sm text-muted mt-2">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Formações avançadas */}
      <section className="mx-auto max-w-[1180px] px-6 py-12">
        <span className="eyebrow">Formações avançadas</span>
        <h2 className="mt-3.5 text-[clamp(24px,3.4vw,36px)] font-semibold">Percurso contínuo de especialização</h2>
        <div className="grid gap-px bg-border rounded-2xl overflow-hidden border border-border sm:grid-cols-2 mt-8">
          {ABOUT.advanced.map(([title, desc]) => (
            <div key={title} className="bg-surface p-6">
              <h3 className="font-semibold text-glow">{title}</h3>
              <p className="text-sm text-muted mt-2">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1180px] px-6 py-12">
        <ContactCTA />
      </section>
    </>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="card p-4">
      <dt className="text-[10px] font-bold uppercase tracking-wider text-brand">{label}</dt>
      <dd className="text-sm font-semibold text-ink mt-1 leading-snug">{value}</dd>
    </div>
  );
}
