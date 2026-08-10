# Plataforma Sérgio Fonseca · Psicologia

Plataforma de formação clínica, supervisão, podcast e ebooks.
Next.js 16 · React 19 · TypeScript · Tailwind v4 · Prisma (SQLite) · Auth.js v5.

## Arrancar em desenvolvimento

```bash
npm install
npm run db:push     # cria a base de dados SQLite a partir do schema
npm run seed        # insere dados de exemplo + contas
npm run dev         # http://localhost:3000
```

## Contas de exemplo (do seed)

| Papel      | Email                        | Palavra-passe |
| ---------- | ---------------------------- | ------------- |
| Admin      | `admin@sergiofonseca.pt`     | `admin123`    |
| Formando   | `ana@exemplo.pt`             | `user123`     |

> Altere estas credenciais antes de publicar.

## Estrutura

- `src/app/(site)/` — site público (início, formações, ficha, supervisão, podcast, loja, blog)
- `src/app/conta/` — área do formando (protegida)
- `src/app/admin/` — painel de administração (só ADMIN)
- `src/app/login`, `src/app/registar` — autenticação
- `src/auth.ts`, `src/auth.config.ts`, `src/proxy.ts` — Auth.js + proteção de rotas
- `prisma/schema.prisma` — modelo de dados
- `prisma/seed.ts` — dados de exemplo

## Papéis e acessos

- **USER** — área pessoal, formações, compras.
- **ADMIN** — tudo do USER + painel de administração.
- **Acesso à supervisão** — flag por utilizador (`supervisionAccess`), gerível no admin.

## Comandos úteis

```bash
npm run db:reset       # recria a base de dados e volta a semear
npx prisma studio      # explorador visual da base de dados
npm run build          # build de produção
```

## Por ligar na fase seguinte (produção)

- **Pagamentos reais** — Stripe (Multibanco / MB Way). Já existe o modelo `Payment`;
  falta ligar o checkout e o webhook que marca `PAID`.
- **Alojamento de vídeo/áudio** — formações e podcast (ex.: Mux, Bunny, Cloudflare Stream).
- **Base de dados de produção** — trocar SQLite por PostgreSQL (Neon/Supabase): muda-se
  o `provider` e o `DATABASE_URL`.
- **Envio de emails** — confirmações de compra e inscrição (ex.: Resend).
