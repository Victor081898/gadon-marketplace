# API do GadOn (`api.gadon.com.br`)

Cloudflare Worker com banco D1 (`gadon-db`), arquivos no R2 (`gadon-media`) e limite de tentativas por IP. Todas as telas do app usam esta API; o navegador guarda apenas a sessão e preferências (tema, modo do perfil).

## Organização

| Arquivo | Conteúdo |
| --- | --- |
| `src/index.js` | Roteamento (`:param` e `*curinga`), CORS, limite de tentativas e tratamento de erros. |
| `src/lib.js` | Utilidades: respostas JSON, validação, sessão JWT, papéis (`requireUser`, `requireAdmin`), notificações. |
| `src/auth.js` | Cadastro, login, Google, sessão, perfil, troca e redefinição de senha, pré-cadastro. |
| `src/lots.js` | Anúncios, moderação, perguntas públicas, favoritos. |
| `src/commerce.js` | Cotação do frete na compra, pedidos, pagamento protegido, conversas liberadas após o pagamento. |
| `src/freight.js` | Central de fretes: cotação avulsa, pedidos às transportadoras (inclusive voltas do Radar), agenda e documentos. |
| `src/radar.js` | Radar de Frete: rotas previstas, oportunidades (48 h / 30 km) e aviso único por lote + rota. |
| `src/account.js` | Notificações, perfil vendedor, pesador, arquivos (R2) e painel de administração. |
| `src/geo.js` | Localização de municípios (Nominatim, busca estruturada por cidade + UF, cache de 30 dias). |

## Rotas

Rotas marcadas com 🔒 exigem `Authorization: Bearer <token>`; 🛡️ exigem conta administradora (`ADMIN_EMAILS`).

### Conta
| Método | Rota | O que faz |
| --- | --- | --- |
| GET | `/health` | Verificação de saúde. |
| POST | `/auth/register` | Cria conta `{ name, email, phone?, password (≥ 8), role }` → `{ token, user }`. |
| POST | `/auth/login` | Entra com `{ email, password }`. |
| POST | `/auth/google` | Entra ou cria conta com `{ credential, role? }` (ID token do Google Identity Services). |
| POST | `/auth/forgot` | Envia o link de redefinição por e-mail. Responde 503 enquanto o envio de e-mail não estiver ativo. |
| POST | `/auth/reset` | `{ token, password }` → nova sessão. |
| GET 🔒 | `/auth/me` | Usuário da sessão. |
| PATCH 🔒 | `/me` | Atualiza `name`, `phone`, `location`, `role`. |
| POST 🔒 | `/me/password` | `{ currentPassword, password }` (a atual só é exigida de quem já tem senha). |
| POST | `/pre-cadastro` | Pré-cadastro público de gadon.com.br/pre-cadastro (com campo isca contra robôs). |

### Anúncios e perguntas
| Método | Rota | O que faz |
| --- | --- | --- |
| GET | `/lots` | Anúncios publicados. Do proprietário só sai o primeiro nome. |
| POST 🔒 | `/lots` | Cria anúncio "em análise" (fotos já enviadas por `/media`; telefone, e-mail e links bloqueados). |
| GET | `/lots/:id` | Detalhe do anúncio (o dono e a administração também veem os não publicados). |
| PATCH 🔒 | `/lots/:id` | Edita (volta para análise) ou `{ action: 'pausar' \| 'reativar' \| 'remover' }`. |
| POST 🔒 | `/lots/:id/view` | Registra a visita e devolve oportunidades do Radar. |
| GET / POST 🔒 | `/lots/:id/questions` | Perguntas públicas (sem dados de contato). |
| POST 🔒 | `/questions/:id/answer` | Resposta pública do vendedor do lote. |
| GET 🔒 | `/me/lots`, `/me/questions` | Anúncios e perguntas recebidas do vendedor. |
| GET / PUT / DELETE 🔒 | `/me/favorites(/:id)` | Favoritos. |

### Compra, pagamento e conversas
| Método | Rota | O que faz |
| --- | --- | --- |
| POST 🔒 | `/freight/quote` | Frete da compra `{ lotIds, destination }`, calculado pela estrada (OSRM); inclui a opção do Radar com 30% de desconto quando houver. |
| POST 🔒 | `/orders` | Reserva os lotes, recalcula o frete, cobra pelo provedor (`PAYMENT_PROVIDER`) e libera as conversas. |
| GET 🔒 | `/orders` | Pedidos como comprador e como vendedor. |
| POST 🔒 | `/orders/:id/accept` | Comprador confirma a entrega e o valor retido é liberado. |
| GET 🔒 | `/conversations` | Conversas dos pedidos pagos, com contagem de não lidas. |
| GET / POST 🔒 | `/conversations/:id/messages` | Mensagens (texto, anexo, áudio). Só participantes. |

### Fretes e Radar
| Método | Rota | O que faz |
| --- | --- | --- |
| GET 🔒 | `/radar` | Rotas previstas e oportunidades perto das fazendas vistas nas últimas 48 h. |
| POST 🔒 | `/freight/estimate` | Cotação avulsa `{ origin, destination, heads }`. |
| POST 🔒 | `/freight/requests` | Pede o frete à transportadora `{ origin, destination, heads, pickupDate?, purpose?, partnerId, phone }`; o valor é recalculado no servidor. |
| POST 🔒 | `/freight/return-requests` | Pede espaço numa volta vazia do Radar `{ routeId, cargoType, quantity?, phone }`. |
| GET 🔒 | `/me/freight` | Pedidos de frete, agenda de viagens e documentos da conta. |
| POST / PATCH / DELETE 🔒 | `/me/freight/trips(/:id)` | Agenda de viagens (status: Programada, Em andamento, Concluída, Cancelada). |
| POST / PATCH / DELETE 🔒 | `/me/freight/documents(/:id)` | Documentos de transporte (arquivo enviado antes em `/media?privado=1`). |

### Perfis, arquivos e notificações
| Método | Rota | O que faz |
| --- | --- | --- |
| GET 🔒 | `/notifications` | Notificações da conta. |
| POST 🔒 | `/notifications/read` | Marca `{ ids }` ou todas como lidas. |
| GET / PUT 🔒 | `/me/seller-profile` | Perfil vendedor; ao enviar, fica "em análise" até a conferência dos documentos. |
| GET / PUT 🔒 | `/me/weigher` | Progresso do pesador (aulas assistidas e conclusão). |
| POST 🔒 | `/me/weigher/training` | Mini treinamento corrigido no servidor. |
| POST 🔒 | `/media` | Envia foto, PDF ou áudio (até 10 MB). `?privado=1` guarda em área privada da conta. |
| GET | `/media/*key` | Arquivos públicos; os privados só para o dono ou a administração. |

### Administração 🛡️
| Método | Rota | O que faz |
| --- | --- | --- |
| GET | `/admin/stats` | Contas, pré-cadastros, anúncios, vendedores, pedidos e pedidos de frete novos. |
| GET / POST | `/admin/lots`, `/admin/lots/:id/review` | Fila de anúncios e aprovação (`{ decision: 'aprovar' \| 'recusar', note }`). |
| GET / POST | `/admin/sellers`, `/admin/sellers/:id/review` | Fila de vendedores e aprovação dos documentos. |
| GET | `/admin/pre-cadastros` | Lista; `?formato=csv` baixa a planilha. |
| GET / PATCH | `/admin/freight-requests(/:id)` | Pedidos de frete e de carga nas voltas; mudar o status avisa o produtor. |

## Segurança

- Senhas em PBKDF2-SHA256 (100 mil iterações, sal por usuário); sessão JWT HS256 de 7 dias assinada com `SESSION_SECRET`.
- Google: assinatura RS256 conferida com as chaves públicas do Google, além de `aud`, `iss`, `exp` e `email_verified`.
- CORS só para os domínios do app (`ALLOWED_ORIGINS` + prévias `*.gadon-marketplace.pages.dev`).
- Limite de 10 tentativas por minuto por IP nas rotas de login, cadastro, pré-cadastro, perguntas e fretes.
- Valores de frete e de pedido são sempre calculados no servidor; o navegador nunca define preço.
- Documentos pessoais e de transporte ficam em `private/<usuário>/` no R2 e só são entregues ao dono ou à administração.

## Operação

```bash
cd api
npx wrangler dev --port 8787                            # local (usa .dev.vars com SESSION_SECRET)
npx wrangler d1 migrations apply gadon-db --local       # banco local
npx wrangler d1 execute gadon-db --local --file seeds/demo.sql   # lotes de demonstração (local)
node test/e2e.mjs                                       # testes ponta a ponta (API local por padrão)
npx wrangler d1 migrations apply gadon-db --remote      # migrações em produção
npx wrangler deploy                                     # publica em api.gadon.com.br
npx wrangler secret put SESSION_SECRET                  # troca o segredo (derruba todas as sessões)
npx wrangler tail                                       # logs ao vivo
```

Para testar o front com a API local, crie `.env.development.local` na raiz com `VITE_API_URL=http://localhost:8787`.

## Pagamento

`PAYMENT_PROVIDER` escolhe o adaptador em `src/commerce.js` (`paymentProviders`). Hoje é `simulado`: confirma e retém o valor na hora. O provedor real entra no mesmo formato (`create` → cobrança; webhook confirmando a retenção; `release` após o aceite da entrega).

## Google (projeto Google Cloud "GadOn", ID `gadon-509715`)

- Cliente OAuth "GadOn Web" (tipo Aplicativo da Web). O Client ID está em `wrangler.jsonc` e nos `.env.*` do front.
- Origens autorizadas: `https://app.gadon.com.br`, `https://gadon.quaerion.site`, `https://gadon-marketplace.pages.dev`, `http://localhost:5173`, `http://127.0.0.1:5173`.
- Tela de consentimento: externa e publicada, com as páginas `/privacidade` e `/termos` do app.
