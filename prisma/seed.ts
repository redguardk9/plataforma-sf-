import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("A limpar dados...");
  await prisma.message.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.enrollment.deleteMany();
  await prisma.module.deleteMany();
  await prisma.course.deleteMany();
  await prisma.post.deleteMany();
  await prisma.episode.deleteMany();
  await prisma.ebook.deleteMany();
  await prisma.supervisionResource.deleteMany();
  await prisma.supervisionSettings.deleteMany();
  await prisma.user.deleteMany();

  // ---------------- Utilizadores ----------------
  const admin = await prisma.user.create({
    data: {
      name: "Sérgio Fonseca",
      email: "admin@sergiofonseca.pt",
      passwordHash: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
      supervisionAccess: true,
    },
  });

  const ana = await prisma.user.create({
    data: {
      name: "Ana Ribeiro",
      email: "ana@exemplo.pt",
      passwordHash: await bcrypt.hash("user123", 10),
      role: "USER",
      supervisionAccess: true,
    },
  });

  // ---------------- Formações ----------------
  const courses = [
    {
      slug: "o-trauma-que-nao-fala",
      title: "O Trauma Que Não Fala",
      subtitle: "Sobre o trauma que resiste à palavra e como a clínica lhe pode dar lugar.",
      description:
        "Há sofrimentos que não chegam ao discurso. Esta formação percorre o trauma que não se verbaliza — do corpo ao ato — e propõe uma escuta que não força a palavra, mas a acolhe. Inclui o trabalho em trauma ferroviário a partir da investigação do formador.",
      type: "RECORDED",
      level: "Intermédio",
      priceCents: 12000,
      durationLabel: "6h20",
      coverColor: "#1E6FE8",
      rating: 4.9,
      studentsCount: 186,
      featured: true,
      modules: [
        ["Introdução", "O que chamamos trauma", "O conceito para além do manual: o real que não cessa de não se inscrever."],
        ["Módulo 1", "O corpo que fala primeiro", "Manifestações somáticas e o testemunho do corpo."],
        ["Módulo 2", "Trauma ferroviário", "Estudo de caso a partir da investigação do formador."],
        ["Módulo 3", "Acting-out e passagem ao ato", "Distinções clínicas fundamentais."],
        ["Módulo 4", "A repetição", "Porque volta aquilo que magoa."],
        ["Módulo 5", "A escuta do indizível", "Técnica e posição do clínico."],
        ["Módulo 6", "Casos e supervisão", "Trabalho sobre material clínico real."],
        ["Encerramento", "Dar lugar", "Síntese e continuidade da prática."],
      ],
    },
    {
      slug: "perante-o-sujeito",
      title: "Perante o Sujeito: Escuta Clínica Aprofundada",
      subtitle: "Formação em direto, em quatro sessões, sobre a posição do clínico.",
      description:
        "Ao vivo e em grupo reduzido. Quatro encontros para trabalhar aquilo que se joga no antes do sintoma: a relação com um sujeito, a transferência, o enquadramento e o silêncio.",
      type: "LIVE",
      level: "Todos os níveis",
      priceCents: 24000,
      durationLabel: "4 sessões",
      coverColor: "#B85C36",
      rating: 5.0,
      featured: true,
      startAt: new Date("2026-10-18T19:00:00"),
      sessionsLabel: "4 sessões · quintas-feiras",
      seatsTotal: 24,
      seatsTaken: 6,
      enrollUrl: "https://automarte.pt/perante-o-sujeito",
      enrollLabel: "Comprar no Automarte",
      modules: [
        ["Sessão 1", "O primeiro encontro", "Construir o enquadramento e ler o pedido."],
        ["Sessão 2", "A transferência", "O que se repete na relação clínica."],
        ["Sessão 3", "O silêncio e o tempo", "Intervir sem preencher."],
        ["Sessão 4", "Casos ao vivo", "Supervisão coletiva de material dos formandos."],
      ],
    },
    {
      slug: "comportamento-desviante-ler-o-ato",
      title: "Comportamento Desviante: Ler o Ato",
      subtitle: "Uma leitura clínica do ato — para lá do juízo e da norma.",
      description:
        "O comportamento desviante como texto a ler, não como falha a corrigir. Esta formação propõe uma clínica do ato que suspende o juízo para escutar o que o sujeito procura dizer.",
      type: "RECORDED",
      level: "Intermédio",
      priceCents: 9500,
      durationLabel: "4h10",
      coverColor: "#2E86FF",
      rating: 4.8,
      studentsCount: 142,
      featured: true,
      modules: [
        ["Módulo 1", "A norma e o desvio", "De onde falamos quando falamos de desvio."],
        ["Módulo 2", "O ato como mensagem", "Ler para lá do comportamento."],
        ["Módulo 3", "Adolescência e transgressão", "Especificidades clínicas."],
        ["Módulo 4", "Contextos institucionais", "Trabalhar em tensão com a norma."],
        ["Módulo 5", "Casos", "Material clínico comentado."],
        ["Módulo 6", "Ética da escuta", "A posição do clínico perante o ato."],
      ],
    },
    {
      slug: "o-luto-e-a-perda",
      title: "O Luto e a Perda em Contexto Clínico",
      subtitle: "Acompanhar o luto sem o encerrar em etapas.",
      description:
        "O luto não tem etapas obrigatórias nem prazo. Esta formação recusa os modelos fechados e propõe acompanhar a perda no tempo singular de cada sujeito.",
      type: "RECORDED",
      level: "Todos os níveis",
      priceCents: 8500,
      durationLabel: "3h50",
      coverColor: "#1559C4",
      rating: 4.9,
      studentsCount: 203,
      modules: [
        ["Módulo 1", "O que é perder", "Para além do modelo das fases."],
        ["Módulo 2", "Luto e melancolia", "Distinções clínicas."],
        ["Módulo 3", "O tempo do luto", "Respeitar o ritmo do sujeito."],
        ["Módulo 4", "Lutos complicados", "Quando algo emperra."],
        ["Módulo 5", "Casos e prática", "Acompanhamento comentado."],
      ],
    },
    {
      slug: "primeira-consulta",
      title: "Primeira Consulta: Construir o Enquadramento",
      subtitle: "Um dia intensivo, em direto, sobre o momento que decide o tratamento.",
      description:
        "A primeira consulta enquadra tudo o que se segue. Um dia inteiro, ao vivo, para trabalhar a receção do pedido, o contrato e as primeiras decisões clínicas.",
      type: "LIVE",
      level: "Iniciados",
      priceCents: 14000,
      durationLabel: "1 dia",
      coverColor: "#C77A3A",
      rating: 5.0,
      startAt: new Date("2026-09-25T10:00:00"),
      sessionsLabel: "Sessão intensiva · sábado",
      seatsTotal: 24,
      seatsTaken: 11,
      enrollUrl: "https://forms.gle/L99fE4upS2G7eWqL9",
      enrollLabel: "Inscrever (formulário)",
      modules: [
        ["Bloco 1", "Receber o pedido", "O que se escuta antes de tudo."],
        ["Bloco 2", "O contrato", "Enquadramento, tempo e dinheiro."],
        ["Bloco 3", "A avaliação", "Ler sem etiquetar."],
        ["Bloco 4", "Encaminhamento", "Quando e para onde."],
        ["Bloco 5", "Role-play", "Prática ao vivo entre formandos."],
      ],
    },
    {
      slug: "supervisao-clinica-em-grupo",
      title: "Supervisão Clínica em Grupo",
      subtitle: "Grupo mensal de supervisão em direto.",
      description:
        "Um grupo de supervisão que se reúne todos os meses. Espaço para trazer casos, elaborar impasses e sustentar a posição clínica com pares e supervisor.",
      type: "LIVE",
      level: "Psicólogos",
      priceCents: 6500,
      durationLabel: "mensal",
      coverColor: "#1E6FE8",
      rating: 5.0,
      startAt: new Date("2026-08-06T20:00:00"),
      sessionsLabel: "1.ª quinta de cada mês · 20h00",
      seatsTotal: 12,
      seatsTaken: 10,
      enrollUrl: "https://automarte.pt/supervisao-clinica-em-grupo",
      enrollLabel: "Comprar no Automarte",
      modules: [
        ["Formato", "Grupo mensal", "Encontros de 90 minutos, online, em grupo reduzido."],
        ["Método", "Casos dos participantes", "Cada sessão trabalha material trazido pelo grupo."],
        ["Acesso", "Área de supervisão", "Gravações e materiais na área reservada."],
      ],
    },
  ];

  const created: { id: string; slug: string }[] = [];
  for (const c of courses) {
    const { modules, ...data } = c;
    const course = await prisma.course.create({ data });
    await prisma.module.createMany({
      data: modules.map((m, i) => ({
        courseId: course.id,
        order: i,
        section: m[0],
        title: m[1],
        description: m[2],
      })),
    });
    created.push({ id: course.id, slug: course.slug });
  }

  // ---------------- Aulas (com vídeo de exemplo) ----------------
  const SAMPLE_VIDEO = "https://www.youtube.com/embed/aqz-KE-bpKQ";
  const LESSONS: Record<string, [string, string, boolean][]> = {
    "o-trauma-que-nao-fala": [
      ["Introdução — O que chamamos trauma", "O real que não cessa de não se inscrever.", true],
      ["O corpo que fala primeiro", "Manifestações somáticas e o testemunho do corpo.", false],
      ["Trauma ferroviário — estudo de caso", "A partir da investigação do formador.", false],
      ["A escuta do indizível", "Técnica e posição do clínico.", false],
    ],
    "comportamento-desviante-ler-o-ato": [
      ["A norma e o desvio", "De onde falamos quando falamos de desvio.", true],
      ["O ato como mensagem", "Ler para lá do comportamento.", false],
      ["Casos clínicos comentados", "Material real comentado.", false],
    ],
    "o-luto-e-a-perda": [
      ["O que é perder", "Para além do modelo das fases.", true],
      ["Luto e melancolia", "Distinções clínicas.", false],
      ["O tempo do luto", "Respeitar o ritmo do sujeito.", false],
    ],
  };
  for (const c of created) {
    const ls = LESSONS[c.slug];
    if (!ls) continue;
    await prisma.lesson.createMany({
      data: ls.map((l, i) => ({
        courseId: c.id,
        order: i,
        title: l[0],
        description: l[1],
        isFree: l[2],
        videoUrl: SAMPLE_VIDEO,
        durationLabel: `${8 + i * 3}:00`,
      })),
    });
  }

  // ---------------- Inscrições + pagamentos de exemplo ----------------
  const trauma = created.find((c) => c.slug === "o-trauma-que-nao-fala")!;
  const sujeito = created.find((c) => c.slug === "perante-o-sujeito")!;

  await prisma.enrollment.create({ data: { userId: ana.id, courseId: trauma.id, status: "ACTIVE", progress: 50 } });
  await prisma.enrollment.create({ data: { userId: ana.id, courseId: sujeito.id, status: "ACTIVE", progress: 0 } });

  // Progresso da Ana: 2 primeiras aulas de "O Trauma..." concluídas
  const traumaLessons = await prisma.lesson.findMany({ where: { courseId: trauma.id }, orderBy: { order: "asc" } });
  for (let i = 0; i < Math.min(2, traumaLessons.length); i++) {
    await prisma.lessonProgress.create({ data: { userId: ana.id, lessonId: traumaLessons[i].id, completed: true } });
  }
  await prisma.payment.create({ data: { userId: ana.id, courseId: trauma.id, amountCents: 12000, status: "PAID", method: "mbway" } });
  await prisma.payment.create({ data: { userId: ana.id, courseId: sujeito.id, amountCents: 24000, status: "PENDING", method: "multibanco" } });

  await prisma.message.create({ data: { courseId: trauma.id, userId: admin.id, body: "Bem-vindos ao espaço de dúvidas. Aqui podem colocar qualquer questão sobre os módulos — respondo pessoalmente." } });
  await prisma.message.create({ data: { courseId: trauma.id, userId: ana.id, body: "No módulo 3, como distinguir o acting-out da passagem ao ato?" } });

  // ---------------- Blog ----------------
  await prisma.post.createMany({
    data: [
      { slug: "nao-trato-sintomas", title: "Não trato sintomas, recebo sujeitos", excerpt: "O que muda quando deixamos de perseguir o sintoma e passamos a escutar quem o carrega.", category: "Clínica", coverColor: "#1E6FE8", readMinutes: 5, authorId: admin.id, content: "Quando um sintoma chega ao consultório, há sempre a tentação de o resolver depressa. Mas o sintoma não é o problema — é a forma que o sujeito encontrou para dizer algo que ainda não tem palavras.\n\nEscutar antes de intervir é recusar a pressa. É deixar que a verdade de cada história encontre o seu tempo. Não trato sintomas: recebo sujeitos, e é aí que o trabalho verdadeiramente começa." },
      { slug: "o-comboio-e-o-trauma", title: "O que o comboio nos ensina sobre o trauma", excerpt: "Notas a partir da investigação em trauma ferroviário.", category: "Trauma", coverColor: "#B85C36", readMinutes: 7, authorId: admin.id, content: "O trauma ferroviário confronta-nos com o que não se inscreve. Há acontecimentos que o psiquismo não consegue processar no momento — e que voltam, insistentes, sob outras formas.\n\nEstudar estes casos ensinou-me que o trauma não está no acontecimento, mas no que dele fica por dizer. A clínica é o lugar onde esse silêncio pode, finalmente, encontrar escuta." },
      { slug: "porque-supervisao", title: "Porque todo o psicólogo precisa de supervisão", excerpt: "A supervisão não é correção — é sustentação.", category: "Supervisão", coverColor: "#1559C4", readMinutes: 4, authorId: admin.id, content: "Há uma ideia errada de que a supervisão serve para corrigir erros. Não é isso. A supervisão é o espaço onde o clínico se sustenta — onde pode pensar o que sente perante um caso sem ter de ter a resposta pronta.\n\nTrabalhamos com o sofrimento dos outros. Precisamos de um lugar para elaborar o nosso." },
    ],
  });

  // ---------------- Podcast ----------------
  await prisma.episode.createMany({
    data: [
      { slug: "ep-12-trauma-sem-palavras", number: 12, title: "O trauma que não encontra palavras", description: "Sobre aquilo que insiste em não se dizer — e como a clínica pode dar-lhe lugar.", durationLabel: "38:20" },
      { slug: "ep-11-escutar-o-silencio", number: 11, title: "Escutar o silêncio", description: "O que dizer quando não há nada a dizer.", durationLabel: "41:12" },
      { slug: "ep-10-o-sintoma-tem-razao", number: 10, title: "O sintoma tem razão", description: "Sobre a inteligência do sofrimento.", durationLabel: "35:48" },
      { slug: "ep-9-luto-sem-manual", number: 9, title: "Luto sem manual", description: "Porque as cinco fases nos enganam.", durationLabel: "29:30" },
      { slug: "ep-8-o-ato-do-adolescente", number: 8, title: "O ato do adolescente", description: "Transgressão como linguagem.", durationLabel: "44:05" },
    ],
  });

  // ---------------- Ebooks ----------------
  await prisma.ebook.createMany({
    data: [
      { slug: "a-escuta-e-o-ato", title: "A Escuta e o Ato", description: "Ensaio sobre a clínica do comportamento desviante.", category: "Ensaio clínico", priceCents: 1400, coverColor: "#1E6FE8" },
      { slug: "o-trauma-que-nao-fala-ebook", title: "O Trauma Que Não Fala", description: "O indizível do trauma e o lugar da palavra.", category: "Ensaio", priceCents: 1200, coverColor: "#B85C36" },
      { slug: "notas-de-primeira-consulta", title: "Notas de Primeira Consulta", description: "Guia prático para o enquadramento inicial.", category: "Guia prático", priceCents: 900, coverColor: "#1559C4" },
    ],
  });

  // ---------------- Supervisão ----------------
  const nextSession = new Date();
  nextSession.setDate(nextSession.getDate() + ((4 - nextSession.getDay() + 7) % 7 || 7)); // próxima quinta-feira
  nextSession.setHours(20, 0, 0, 0);
  await prisma.supervisionSettings.create({
    data: { nextSessionAt: nextSession, nextSessionLabel: "Grupo de supervisão · 20h00" },
  });
  await prisma.supervisionResource.createMany({
    data: [
      { type: "RECORDING", title: "Sessão de Julho", description: "A transferência no trabalho institucional.", order: 0 },
      { type: "MATERIAL", title: "Guião de leitura de caso", description: "Estrutura para apresentar casos ao grupo.", order: 1 },
      { type: "RECORDING", title: "Sessão de Junho", description: "Acting-out e passagem ao ato — revisão.", order: 2 },
      { type: "MATERIAL", title: "Bibliografia essencial", description: "Textos de referência da supervisão.", order: 3 },
    ],
  });

  console.log("Seed concluído.");
  console.log("  Admin:    admin@sergiofonseca.pt / admin123");
  console.log("  Formando: ana@exemplo.pt / user123");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
