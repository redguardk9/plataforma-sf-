# Próximos passos — Plataforma Sérgio Fonseca

> Runbook para retomar numa próxima sessão. Estado a 2026‑08‑10.
> Domínio de publicação escolhido: **sergiofonsecapsi.com**
> ✅ Todos os 5 passos feitos — site publicado e no ar em https://sergiofonsecapsi.com.
> Repo: github.com/redguardk9/plataforma-sf- · Deploy: Vercel (conta Miguel Fonseca) · BD: Supabase (projeto plataforma-sf).
> Falta apenas o item opcional do Resend (envio de emails) — ver passo 5.
> ✅ Painel de admin revisto (10/08): secção nova "Supervisão" geríve, confirmação antes de apagar, e os dados de exemplo (formações/blog/podcast/ebooks/conta de teste fictícios) foram removidos da produção. O site está agora vazio de propósito — o Sérgio insere as formações e artigos reais pelo admin.

---

## ✅ O que já está feito
- Site completo com design "azul/navy da marca" (serif Fraunces), responsivo.
- Conteúdo do site real (sergiofonsecapsi.com) integrado.
- **Login** de utilizador e admin (Auth.js). Painel admin funcional.
- **Formações**: admin cria/edita com **data/hora** + **link de inscrição** (Automarte ou Google Form) + texto do botão. Vista de **calendário** em `/formacoes?tipo=calendario`.
- Podcast e Ebooks **removidos**. Menu: Início · Sobre · Serviços · Formações · Blog.
- Marcação **agora é pela agenda do Google** (sistema interno de marcação foi removido).
- Build de produção limpo (27 rotas), typecheck 0 erros, sem bugs conhecidos.

## Contas de teste (locais — SQLite, `npm run seed`)
| Papel | Email | Password |
|---|---|---|
| Admin | `admin@sergiofonseca.pt` | `admin123` |
| Formando | `ana@exemplo.pt` | `user123` |

⚠️ Em **produção** o admin tem email/password diferentes (trocados no passo 5) — pedir ao Sérgio, não estão neste ficheiro.

## Comandos úteis
```bash
cd ~/Documents/plataforma-sf
npm run dev        # http://localhost:3000
npm run db:push    # aplica o schema à BD
npm run seed       # dados de exemplo
npm run build      # build de produção
```

---

# ⏳ PENDENTE — passos a executar

## 1) ✅ Link da agenda do Google — feito
Link real colado em `src/lib/site.ts` (`CONTACT.agendar`).

## 2) ✅ Base de dados no Supabase — feito
Projeto `plataforma-sf` criado (região Ireland/West EU). `schema.prisma` em `postgresql`
com `directUrl`. `.env` com `DATABASE_URL` (pooler 6543) e `DIRECT_URL` (direct 5432).
`db:push` + `seed` correram sem erros (2 users, 6 courses, 3 posts confirmados). `build` limpo.

## 3) ✅ Deploy na Vercel — feito
Repo enviado para `github.com/redguardk9/plataforma-sf-`. Projeto importado na Vercel
(conta "Miguel Fonseca", plano Hobby). Environment Variables (Production) configuradas:
`DATABASE_URL`, `DIRECT_URL`, `AUTH_SECRET` (novo, gerado com `openssl rand -base64 33`),
`AUTH_URL` (temporariamente `https://plataforma-sf.vercel.app` — atualizar para
`https://sergiofonsecapsi.com` no passo 4), `AUTH_TRUST_HOST=true`, `MAIL_ADMIN`, `MAIL_FROM`.
Deployment "Ready", site a funcionar em https://plataforma-sf.vercel.app.

⚠️ Cuidado ao editar env vars na Vercel com a tradução automática do Chrome ativa — ela
mistura os nomes das variáveis (ex.: `AUTH_URL` → `URL_AUTH`). Desligar tradução na página
antes de criar/editar variáveis.

## 4) Ligar o domínio sergiofonsecapsi.com  (DNS na Hostinger)
> O domínio está na **Hostinger** (hoje a servir o site antigo Zyrosite — publicar substitui-o).
1. Na **Vercel** → projeto → **Settings → Domains** → adicionar `sergiofonsecapsi.com` **e** `www.sergiofonsecapsi.com`. A Vercel mostra os valores DNS exatos.
2. No painel **DNS da Hostinger** (normalmente):
   - Registo **A**: `@` → `76.76.21.21`  *(usar o que a Vercel indicar)*
   - Registo **CNAME**: `www` → `cname.vercel-dns.com`
3. SSL é automático na Vercel. Propagação: minutos a algumas horas.

## 5) Segurança antes/depois de publicar
- ✅ Password do admin trocada em produção (já não é `admin123`) e email atualizado para `sergiofonseca.psic@gmail.com`. (Nota: a password de produção é parecida com a da BD do Supabase — ideal seria trocar por algo sem ligação entre as duas, mas ficou por decisão do Sérgio.)
- ✅ `AUTH_SECRET` novo em produção (feito no passo 3).
- ⏳ Emails: verificar o domínio `sergiofonsecapsi.com` no **Resend** e pôr `MAIL_FROM="Sérgio Fonseca <ola@sergiofonsecapsi.com>"` (opcional — sem isto o site funciona, só não envia emails de confirmação/aviso).

---

## Ordem recomendada
**2 (Supabase) → 3 (Vercel) → 4 (DNS).** O passo **1 (link Google)** pode ser feito a qualquer momento.
⚠️ Não inserir formações reais no admin **local** antes do Supabase — esses dados ficam no SQLite da máquina e não vão para produção. Inserir só depois de publicado.

## Housekeeping opcional (não urgente)
Sobrou código morto inofensivo da agenda removida: constantes não usadas em `src/lib/constants.ts` (`SERVICE_TYPE`, `APPOINTMENT_*`, `SLOT_STATUS`, `formatDateTime`, `lisbonWallTimeToUtc`) e a dependência `resend` + vars `RESEND_*`. Pedir ao Claude "limpa o código morto da agenda" quando quiseres.
