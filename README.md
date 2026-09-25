# GadOn — O mercado do Gado

Marketplace para compra, venda e transporte de gado, com negociação direta entre as partes e pagamento protegido.

- App: https://app.gadon.com.br
- API: https://api.gadon.com.br (código e rotas em [`api/`](api/README.md))
- Pré-cadastro: `site/pre-cadastro.html` (para `gadon.com.br/pre-cadastro`)

## O que está disponível

- Contas com e-mail e senha ou Google; perfis Comprador, Vendedor e Pesador na mesma conta.
- Marketplace com busca, filtros, favoritos e página do lote (do proprietário só aparece o primeiro nome).
- Perguntas e respostas públicas nos anúncios, sem troca de contato antes do pagamento.
- Vendedor: cadastro de gado com fotos, "Meus anúncios" (análise, publicação, pausa, edição, remoção) e perfil vendedor com documentos privados.
- Compra com frete calculado pela estrada, pagamento protegido (valor retido até a entrega e o aceite) e conversa liberada após o pagamento, com anexos e áudio.
- Radar de Frete: voltas vazias a até 30 km das fazendas vistas nas últimas 48 h, com desconto no frete.
- Fretes: cotação e pedido à transportadora, agenda de viagens, documentos de transporte, status e relatórios.
- Pesador: aulas, conclusão e mini treinamento.
- Notificações, painel de administração (moderação de anúncios e vendedores, pré-cadastros, pedidos de frete) e modo escuro.

## Executar localmente

Requisitos: Node.js 20 ou superior.

```bash
npm install
npm run dev                      # app em http://localhost:5173
```

Para usar a API local (recomendado no desenvolvimento), veja `api/README.md` e crie `.env.development.local` com `VITE_API_URL=http://localhost:8787`.

Validação antes de publicar:

```bash
npm run build
node api/test/e2e.mjs            # com a API local rodando
```

O app é Vite com JavaScript vanilla e CSS; a API é um Cloudflare Worker com D1 e R2.

## Colaboração

As regras de trabalho estão em [AGENTS.md](AGENTS.md) e [CONTRIBUTING.md](CONTRIBUTING.md). O registro contínuo de decisões fica em [docs/DIARIO_DE_DESENVOLVIMENTO.md](docs/DIARIO_DE_DESENVOLVIMENTO.md) e as dependências externas em [docs/INTEGRACOES_PENDENTES.md](docs/INTEGRACOES_PENDENTES.md).

A skill local de colaboração fica em `.agents/skills/gadon-colaboracao/SKILL.md` e só vale para este repositório.

## Status

Em produção com pagamento em modo simulado. Antes de cobrar valores reais é preciso integrar o provedor de pagamento com custódia (ver `docs/INTEGRACOES_PENDENTES.md`).
