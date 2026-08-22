import Link from "next/link";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { CourseCard, type CourseCardData } from "@/components/CourseCard";
import { Testimonials } from "@/components/Testimonials";
import { MoodBand } from "@/components/MoodBand";
import { Reveal } from "@/components/Reveal";
import { SERVICES, CONTACT, TESTIMONIALS } from "@/lib/site";

const CREDENTIALS = [
  "Psicólogo Especialista · OPP",
  "Mestre em Comportamento Desviante",
  "Psicologia da Crise",
];

export default async function HomePage() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    orderBy: [{ featured: "desc" }, { createdAt: "asc" }],
    take: 3,
  });

  return (
    <>
      {/* ---------------- HERO (escuro, cinemático) ---------------- */}
      <section className="section-dark grain relative overflow-hidden">
        <div className="glow-soft w-[620px] h-[460px] -left-40 -top-40" style={{ zIndex: 0 }} />
        <div className="absolute inset-0 opacity-[0.14]" style={{
          backgroundImage: "linear-gradient(to right, rgba(90,160,255,.4) 1px, transparent 1px), linear-gradient(to bottom, rgba(90,160,255,.4) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse 70% 60% at 30% 25%, #000 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 30% 25%, #000 30%, transparent 75%)",
        }} />
        <div className="relative mx-auto max-w-[1180px] px-6 pt-16 lg:pt-24 pb-20 grid lg:grid-cols-[1.08fr_0.92fr] gap-12 lg:gap-16 items-center">
          <div>
            <div className="rise pill-badge" style={{ animationDelay: "40ms" }}>Psicólogo Especialista · OPP</div>
            <h1 className="rise mt-7 text-[clamp(40px,6vw,76px)] leading-[1.03]" style={{ animationDelay: "120ms" }}>
              Não intervenho sobre&nbsp;sintomas,
              <span className="block serif-em mt-1">mas diante de um sujeito.</span>
            </h1>
            <p className="rise mt-7 text-[17px] sm:text-[19px] text-muted max-w-[44ch] leading-relaxed" style={{ animationDelay: "220ms" }}>
              Escuta clínica com profundidade e ética. Um espaço, sem pressa, para que aquilo
              que é verdadeiro possa finalmente emergir.
            </p>
            <div className="rise flex flex-wrap gap-3 mt-9" style={{ animationDelay: "320ms" }}>
              <a href={CONTACT.agendar} target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-lg">
                Marcar consulta
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
              </a>
              <Link href="/servicos" className="btn btn-ghost btn-lg">Ver serviços</Link>
            </div>
            <div className="rise flex items-center gap-4 mt-10" style={{ animationDelay: "420ms" }}>
              <div className="flex -space-x-2.5">
                {TESTIMONIALS.map((t) => (
                  <span key={t.initials} className="w-9 h-9 rounded-full grid place-items-center text-[13px] font-bold text-white bg-brand border-2" style={{ borderColor: "#081324" }}>{t.initials.charAt(0)}</span>
                ))}
              </div>
              <div className="text-left">
                <div className="text-brand text-sm leading-none tracking-wide">★★★★★</div>
                <div className="text-[13px] text-muted mt-1">+300 pessoas acompanhadas</div>
              </div>
            </div>
          </div>

          {/* Retrato real */}
          <div className="rise relative mx-auto w-full max-w-[380px] lg:max-w-[430px]" style={{ animationDelay: "260ms" }}>
            <div className="absolute -inset-6 rounded-[2.5rem] blur-3xl -z-10" style={{ background: "radial-gradient(circle at 40% 25%, rgba(90,160,255,.38), transparent 65%)" }} />
            <div className="rounded-[1.75rem] overflow-hidden border shadow-2xl" style={{ borderColor: "#1E3450" }}>
              <Image src="/sergio-portrait.jpg" alt="Sérgio Fonseca, psicólogo especialista" width={800} height={989} priority className="w-full h-auto object-cover" />
            </div>
            <div className="absolute -bottom-5 -left-3 sm:-left-6 card px-4 py-3 shadow-2xl flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-brand grid place-items-center shrink-0" style={{ color: "#fff" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M12 3l8 4v6c0 4-3.5 7-8 8-4.5-1-8-4-8-8V7z" /><path d="M9 12l2 2 4-4" /></svg>
              </div>
              <div>
                <div className="text-sm font-bold leading-tight text-ink">Psicólogo Especialista</div>
                <div className="text-[11px] text-muted">Comportamento Desviante · Trauma</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- FAIXA DE CREDENCIAIS ---------------- */}
      <div className="border-b border-border bg-surface-2/60">
        <div className="mx-auto max-w-[1180px] px-6 py-5 flex flex-wrap items-center justify-center gap-x-8 gap-y-2 text-center">
          {CREDENTIALS.map((c, i) => (
            <span key={i} className="text-[12px] sm:text-[12.5px] tracking-[0.12em] uppercase text-muted font-semibold">
              {i > 0 && <span className="text-brand mr-8 hidden sm:inline">·</span>}
              {c}
            </span>
          ))}
        </div>
      </div>

      {/* ---------------- SERVIÇOS ---------------- */}
      <section className="mx-auto max-w-[1180px] px-6 py-20 lg:py-24">
        <Reveal>
          <div className="flex items-end justify-between gap-6 flex-wrap mb-11">
            <div>
              <span className="eyebrow">Serviços</span>
              <h2 className="mt-4 text-[clamp(32px,4.6vw,50px)]">Como posso ajudar</h2>
            </div>
            <Link href="/servicos" className="btn btn-ghost">Todos os serviços</Link>
          </div>
        </Reveal>
        <div className="grid gap-6 lg:grid-cols-3">
          {SERVICES.map((s, i) => (
            <Reveal key={s.slug} delay={i * 110}>
              <Link href={`/servicos/${s.slug}`} className="card card-hover p-7 flex flex-col h-full group">
                <span className="text-serif text-[26px] text-brand leading-none">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="text-[23px] mt-3">{s.title}</h3>
                <p className="text-[15px] text-muted mt-3 flex-1 leading-relaxed">{s.short}</p>
                <div className="flex items-center justify-between border-t border-border pt-4 mt-6">
                  <span className="text-serif text-lg text-ink">{s.price}</span>
                  <span className="text-brand group-hover:translate-x-1 transition-transform">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M5 12h14M13 5l7 7-7 7" /></svg>
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- SOBRE ---------------- */}
      <section className="mx-auto max-w-[1180px] px-6 pb-20 lg:pb-24">
        <Reveal>
          <div className="grid gap-8 sm:gap-14 md:grid-cols-[0.82fr_1.18fr] items-center">
            <div className="relative mx-auto md:mx-0 w-full max-w-[340px]">
              <div className="absolute -inset-3 rounded-[2rem] -z-10 opacity-100" style={{ background: "linear-gradient(135deg, rgba(30,111,232,.20), transparent 60%)", filter: "blur(20px)" }} />
              <div className="rounded-[1.5rem] overflow-hidden border border-border-strong shadow-xl aspect-[4/5]">
                <Image src="/mood-cliff.jpg" alt="" width={1200} height={1500} className="w-full h-full object-cover" />
              </div>
            </div>
            <div>
              <span className="eyebrow">A minha história</span>
              <h2 className="mt-4 text-[clamp(28px,3.8vw,44px)] leading-[1.1]">
                Antes de escutar em consultório, escutei a dor <span className="serif-em">onde ela mais grita.</span>
              </h2>
              <p className="text-muted leading-relaxed text-[17px] mt-6 max-w-[56ch]">
                Fui maquinista de comboios durante quase trinta anos. Testemunhei doze acidentes,
                oito deles fatais. Sobre os trilhos aprendi o que nenhum livro ensina — a presença
                silenciosa, a impotência radical, o peso da perda sem palavras.
              </p>
              <Link href="/sobre" className="btn btn-ghost mt-8">Conhecer o meu percurso</Link>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ---------------- FAIXA CITAÇÃO (escura, cinemática) ---------------- */}
      <MoodBand src="/mood-sea.jpg" overlay="bg-gradient-to-b from-[#081324]/86 via-[#081324]/70 to-[#081324]/92">
        <div className="mx-auto max-w-[900px] px-6 py-28 sm:py-36 text-center">
          <div className="text-[#5AA0FF] text-[40px] leading-none text-serif mb-4">&ldquo;</div>
          <p className="text-serif text-[#EAF1FB] text-[clamp(24px,3.6vw,42px)] leading-[1.22] italic font-medium text-balance">
            Não venho aliviar o que dói, mas criar espaço para que aquilo que é
            verdadeiro possa finalmente emergir.
          </p>
          <p className="text-[#A9BAD3] mt-8 text-xs uppercase tracking-[0.24em]">Sérgio Fonseca</p>
        </div>
      </MoodBand>

      {/* ---------------- FORMAÇÕES ---------------- */}
      <section className="mx-auto max-w-[1180px] px-6 py-20 lg:py-24">
        <Reveal>
          <div className="flex items-end justify-between gap-6 flex-wrap mb-11">
            <div>
              <span className="eyebrow">Formações</span>
              <h2 className="mt-4 text-[clamp(32px,4.6vw,50px)]">Aprender clínica a sério</h2>
            </div>
            <Link href="/formacoes" className="btn btn-ghost">Todas as formações</Link>
          </div>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {courses.map((c, i) => (
            <Reveal key={c.id} delay={i * 110}>
              <CourseCard course={{ ...(c as CourseCardData), _index: i }} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* ---------------- TESTEMUNHOS ---------------- */}
      <section className="mx-auto max-w-[1180px] px-6 pb-20 lg:pb-24">
        <Reveal>
          <div className="mb-11 text-center">
            <span className="eyebrow justify-center">Algumas histórias</span>
            <h2 className="mt-4 text-[clamp(32px,4.6vw,50px)]">Testemunhos reais</h2>
          </div>
        </Reveal>
        <Reveal delay={120}><Testimonials limit={2} /></Reveal>
      </section>

      {/* ---------------- CTA FINAL (escura) ---------------- */}
      <MoodBand src="/mood-hope.jpg" overlay="bg-gradient-to-br from-[#081324]/92 via-[#0F2036]/86 to-[#081324]/82">
        <div className="mx-auto max-w-[880px] px-6 py-28 text-center">
          <h2 className="text-serif text-[#EAF1FB] text-[clamp(30px,4.4vw,50px)] leading-[1.08]">
            Dar o primeiro passo é, muitas vezes, <span className="serif-em" style={{ color: "#5AA0FF" }}>o mais difícil.</span>
          </h2>
          <p className="text-[#A9BAD3] mt-5 max-w-[48ch] mx-auto text-[17px] leading-relaxed">
            Se precisar de falar, estou aqui. Marque uma sessão ou envie uma mensagem — respondo sempre que possível.
          </p>
          <div className="flex flex-wrap gap-3 justify-center mt-9">
            <a href={CONTACT.agendar} target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-lg" style={{ color: "#fff" }}>Marcar sessão</a>
            <a href={CONTACT.whatsapp} target="_blank" rel="noopener noreferrer" className="btn btn-lg text-[#EAF1FB]" style={{ background: "rgba(234,241,251,.08)", border: "1px solid rgba(234,241,251,.28)" }}>WhatsApp</a>
          </div>
          <p className="text-[#7D8FAB] text-[13px] mt-7">{CONTACT.phone} · {CONTACT.email}</p>
        </div>
      </MoodBand>
    </>
  );
}
