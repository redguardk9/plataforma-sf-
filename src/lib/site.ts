// Conteúdo institucional real do site sergiofonsecapsi.com
// (marca, contactos, serviços clínicos, especializações, testemunhos, FAQ)

export const CONTACT = {
  phone: "+351 933 988 517",
  phoneRaw: "351933988517",
  email: "sergiofonseca.psic@gmail.com",
  whatsapp: "https://wa.me/351933988517",
  // Página de marcações da Agenda do Google (Appointment schedule).
  agendar: "https://calendar.app.google/THShjWsmTHkf8e8q6",
  social: {
    facebook: "https://facebook.com/",
    instagram: "https://instagram.com/",
    threads: "https://threads.net/",
  },
};

export const PHILOSOPHY =
  "Não intervenho sobre sintomas, mas diante de um sujeito. Cada história que recebo é única, marcada por silêncio, dor e resistência. A minha missão não é aliviar o que dói, mas criar espaço para que aquilo que é verdadeiro possa finalmente emergir. A terapia não é um alívio rápido, é um lugar de reencontro com quem te tornaste para sobreviver.";

// ------------------------------------------------------------------
// Sobre
// ------------------------------------------------------------------
export const ABOUT = {
  intro: [
    "Sou psicólogo especialista em Psicologia Clínica e da Saúde, com dedicação profunda à intervenção em Trauma Complexo, Comportamentos Aditivos, Luto, Ideação Suicida e Perturbação de Personalidade Borderline.",
    "Mas antes de escutar em consultório, escutei a dor onde ela mais grita: fui maquinista de comboios durante quase trinta anos. Nesse percurso, vivi de frente a brutalidade do sofrimento humano, testemunhei doze acidentes, oito deles fatais. Sobre os trilhos, aprendi o que nenhum livro ensina — a presença silenciosa, a impotência radical, o peso da perda sem palavras.",
    "É desse lugar que nasce o meu modo de estar na clínica: uma escuta sem pressa, que não julga nem tenta corrigir, apenas sustenta. Uma escuta que não procura «curar», mas compreender. Porque, às vezes, o verdadeiro cuidado começa quando alguém permanece contigo no sítio onde ninguém quis ficar.",
  ],
  specializations: [
    {
      title: "Mestre em Psicologia do Comportamento Desviante e da Justiça",
      desc: "Análise e intervenção junto de populações em desvio face à norma social. Foco nas margens do sofrimento humano: delinquência, exclusão, estigma e rutura com a ordem estabelecida.",
    },
    {
      title: "Investigador Independente em Trauma Ferroviário",
      desc: "Estudo clínico pioneiro sobre o impacto psíquico da exposição a mortes violentas na ferrovia. Contributo técnico-científico para a compreensão do trauma ocupacional extremo.",
    },
    {
      title: "Psicólogo Especialista em Psicologia Clínica e da Saúde (OPP)",
      desc: "Intervenção clínica especializada com foco na escuta, regulação emocional e reconstrução da identidade psíquica. Apoio a vítimas de trauma psicológico, com ênfase em contextos de risco e sofrimento profundo.",
    },
  ],
  advanced: [
    ["Terapia Narrativa", "Técnicas para externalizar o problema, desconstruir histórias dominantes e reconstruir significados. Potencia o empoderamento pessoal e a reescrita de identidades feridas."],
    ["Psicologia da Crise", "Intervenção em situações críticas e ruturas súbitas. Competências para lidar com estados de emergência psíquica, colapsos identitários e sofrimento agudo."],
    ["Neuropsicologia Clínica", "Especialização avançada: da avaliação à reabilitação. Integração de avaliação e intervenção para reorganizar padrões de funcionamento cerebral e psicológico."],
    ["Redução de Riscos", "Pós-graduação em redução de riscos associada ao uso de drogas e ao trabalho sexual — intervenção psicossocial junto de populações vulneráveis."],
    ["Terapia Focada nos Esquemas", "Abordagem integrativa centrada nos esquemas mal-adaptativos precoces — trabalha padrões emocionais e relacionais enraizados, para lá do sintoma imediato."],
  ],
};

// ------------------------------------------------------------------
// Serviços clínicos
// ------------------------------------------------------------------
export type Service = {
  slug: string;
  title: string;
  short: string;
  tagline: string;
  price: string;
  priceNote?: string;
  duration: string;
  format: string;
  intro: string[];
  bulletsTitle?: string;
  bullets?: string[];
  quote?: string;
  cta: "agendar" | "lista" | "consultoria";
};

export const SERVICES: Service[] = [
  {
    slug: "consultas",
    title: "Consultas Online",
    short: "Acolho cada pessoa como um sujeito único. Tempo, escuta e presença para compreender o teu sofrimento e reconstruir sentido.",
    tagline: "Uma consulta não é um ato técnico, é um encontro humano.",
    price: "70€",
    duration: "Sessão individual",
    format: "Online",
    intro: [
      "Online, o que ofereço é tempo, escuta e presença. Aqui, não há pressa nem fórmulas — há um espaço seguro onde a tua dor pode ser dita, e o teu caminho, escutado.",
      "Trabalho com clareza, profundidade e rigor em Trauma Complexo, Dissociação, Luto, Ideação Suicida e Perturbação de Personalidade Borderline — ajudando-te a compreender o teu sofrimento, a tomar decisões conscientes e a reconstruir sentido.",
    ],
    bulletsTitle: "Quando procurar apoio?",
    bullets: [
      "Quando as relações se tornam montanhas-russas emocionais.",
      "Quando te sentes demasiado — ou absolutamente ninguém.",
      "Quando o medo de seres abandonado te faz sabotar tudo.",
      "Quando a dor interna é constante e inexplicável.",
      "Quando queres viver… mas não sabes como.",
    ],
    quote: "Às vezes não é um nome clínico. É só não aguentar mais.",
    cta: "agendar",
  },
  {
    slug: "supervisao-clinica",
    title: "Supervisão Clínica Avançada",
    short: "Pensamento clínico e crítico. Mais profundidade. Uma supervisão para psicólogos que não querem ficar na superfície.",
    tagline: "A profundidade está no modo como se pensa, não na frequência com que se reúne.",
    price: "Lista de espera",
    priceNote: "Vagas atualmente indisponíveis",
    duration: "90 minutos",
    format: "Semanal, quinzenal ou mensal · online ou presencial",
    intro: [
      "Um espaço quinzenal ou mensal de reflexão técnica, análise clínica e desenvolvimento profissional centrado na prática real do psicólogo.",
      "Foi desenhada para profissionais que desejam ir além da validação superficial — e que reconhecem que a supervisão é um instrumento terapêutico para o próprio terapeuta. Cada sessão funciona como uma leitura estratégica da tua forma de estar em clínica: decisões, relação com casos, impasses, vícios, intuições, transferências e silêncios.",
    ],
    bulletsTitle: "O que torna esta supervisão diferente?",
    bullets: [
      "Não é ajuda pontual: é um percurso estratégico de crescimento clínico.",
      "Centra-se em ti enquanto psicólogo.",
      "Integra trauma, esquemas, narrativa, contra-transferência e psicanálise relacional.",
      "Cada sessão é construída a partir do que o teu estilo clínico precisa.",
    ],
    cta: "lista",
  },
  {
    slug: "consultoria",
    title: "Consultoria Avançada por Sessão Única",
    short: "Uma sessão. Uma leitura clínica. Um novo rumo. Para momentos em que o tempo emocional não pode esperar.",
    tagline: "Clareza clínica, rigor psicológico e orientação estratégica.",
    price: "100€",
    priceNote: "pagamento antecipado",
    duration: "90 minutos",
    format: "Online (via Meet) ou presencial",
    intro: [
      "Criada para momentos em que o tempo emocional não pode esperar. Quando há dúvidas que se tornam peso, sintomas que não cabem em diagnósticos simples, ou quando a terapia tradicional não parece ser o caminho.",
      "Destinada a adultos em sofrimento emocional agudo, impasses relacionais, momentos de luto, trauma recente ou decisões existenciais complexas. Também pode ser útil a familiares que acompanham alguém em sofrimento e não sabem como agir.",
      "Ao contrário de uma psicoterapia contínua, não é uma proposta de vínculo: é uma intervenção de leitura profunda, com escuta desacelerada, análise clínica precisa e devolutiva estratégica.",
    ],
    bulletsTitle: "O que esperar",
    bullets: [
      "Acolhimento ético, sem julgamentos ou pressões para «mudar».",
      "Exploração narrativa e clínica do problema central.",
      "Leitura integrativa (trauma, esquemas, identidade, ciclo de vida).",
      "Devolução clara, sem jargões ou ilusões.",
      "Inclui follow-up breve por e-mail após uma semana, se necessário.",
    ],
    cta: "consultoria",
  },
];

// ------------------------------------------------------------------
// Testemunhos reais
// ------------------------------------------------------------------
export const TESTIMONIALS = [
  {
    initials: "A. E.",
    role: "Em acompanhamento",
    text: "Recorrer ao Sérgio foi das decisões mais importantes que tomei para o meu bem-estar emocional. Trabalhei questões profundas relacionadas com a minha autoestima e a constante comparação com os outros. Aprendi a compreender melhor as minhas atitudes à luz do meu passado e, sobretudo, a aceitar-me tal como sou. Cresci muito neste processo e serei-lhe sempre grata.",
  },
  {
    initials: "J.",
    role: "Acompanhamento",
    text: "Numa fase da minha vida em que estava desesperado, idealizava o suicídio e ativamente o tentei cometer, uma amiga introduziu-me ao Sérgio. Nele encontrei a compaixão e compreensão necessárias para me voltar para a luz. Estou-lhe eternamente agradecido.",
  },
  {
    initials: "D.",
    role: "Advogada",
    text: "Depois de ter procurado ajuda com outros profissionais, com o Sérgio a empatia sentiu-se imediatamente. Ensinou-me a «ver-me», a perceber que esse será sempre o ponto de partida para tudo o resto: amor próprio. Uma abordagem direta, simples e inconvencional. Contar com o Sérgio é uma certeza imensurável.",
  },
  {
    initials: "Anónimo",
    role: "Perturbação Borderline",
    text: "O Dr. Sérgio deu-me a mão e acompanhou-me num processo do qual achava que nunca iria sair. Ensinou-me a dizer não, a valorizar-me, a sair de ambientes tóxicos, a gostar de viver. Hoje tenho uma vida tranquila, tenho objetivos. O Sérgio mudou a minha vida.",
  },
];

// ------------------------------------------------------------------
// FAQ
// ------------------------------------------------------------------
export const FAQ = [
  ["Como funciona o processo de marcação?", "Simples. Escolhes o serviço (consulta, supervisão ou consultoria), envias mensagem por WhatsApp ou e-mail e recebes as instruções para pagamento e agendamento."],
  ["Quanto custa uma sessão?", "Os valores variam consoante o tipo de serviço. Podes consultar a página Serviços para mais detalhes ou contactar-me diretamente."],
  ["Posso fazer uma sessão única?", "Sim. Ofereço uma modalidade chamada Consultoria Pontual — uma sessão intensa, estratégica e transformadora."],
  ["Como posso entrar em contacto contigo?", "Podes enviar mensagem por WhatsApp, e-mail ou através do botão de marcação. Respondo sempre que possível."],
];
