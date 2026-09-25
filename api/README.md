# API do GadOn (`api.gadon.com.br`)

Cloudflare Worker com banco D1 (`gadon-db`). Hoje cobre a autenticação; as próximas rotas (pedidos, perguntas, Radar, GTA) entram aqui.

## Rotas

| Método | Rota | O que faz |
| --- | --- | --- |
| GET | `/health` | Verificação de saúde. |
| POST | `/auth/register` | Cria conta com `{ name, email, phone?, password (≥ 8), role }` e devolve `{ token, user }`. |
| POST | `/auth/login` | Entra com `{ email, password }`. |
| POST | `/auth/google` | Entra ou cria conta com `{ credential, role? }` (ID token do Google Identity Services). Mesmo e-mail verificado = mesma conta. |
| GET | `/auth/me` | Devolve o usuário da sessão (`Authorization: Bearer <token>`). |

- Senhas: PBKDF2-SHA256 (100 mil iterações, sal por usuário).
- Google: assinatura RS256 conferida com as chaves públicas do Google, além de `aud`, `iss`, `exp` e `email_verified`.
- Sessão: JWT HS256 de 7 dias assinado com `SESSION_SECRET`.
- CORS só para os domínios do app (`ALLOWED_ORIGINS` + prévias `*.gadon-marketplace.pages.dev`).
- Limite de 10 tentativas por minuto por IP em cada rota `/auth/*`.

## Operação

```bash
cd api
npx wrangler dev                                   # local (usa .dev.vars com SESSION_SECRET)
npx wrangler d1 migrations apply gadon-db --remote # aplica migrações em produção
npx wrangler deploy                                # publica em api.gadon.com.br
npx wrangler secret put SESSION_SECRET             # troca o segredo (derruba todas as sessões)
npx wrangler tail                                  # logs ao vivo
```

## Google (projeto Google Cloud "GadOn", ID `gadon-509715`)

- Cliente OAuth "GadOn Web" (tipo Aplicativo da Web). O Client ID está em `wrangler.jsonc` e nos `.env.*` do front.
- Origens autorizadas: `https://app.gadon.com.br`, `https://gadon.quaerion.site`, `https://gadon-marketplace.pages.dev`, `http://localhost:5173`, `http://127.0.0.1:5173`.
- Tela de consentimento: externa, com páginas `/privacidade` e `/termos` do app.
