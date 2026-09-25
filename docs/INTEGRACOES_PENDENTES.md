# Integrações pendentes — rodada de avaliação (set/2026)

O front-end desta rodada está funcional em modo de demonstração (dados em `localStorage`). Os itens abaixo dependem de back-end, credenciais ou acordos externos. Cada um deve virar uma issue com os marcadores indicados.

## 1. Pagamento protegido (retenção até a entrega e o aceite)
- **Marcadores:** `back-end`, `testes` · **Responsável:** Claiton (`@ecossystem2`) · **Apoio:** Pablo (`@ricardopablo1914-create`)
- **Hoje no front:** `completePurchase()` simula a resposta da API em 1,6 s e cria o pedido (`gadon.orders.v1`) com `payment.status = 'retido'`. O botão "Confirmar entrega" nas mensagens muda para `'liberado'`.
- **Contrato esperado:**
  - `POST /orders` → `{ lotIds[], destination, freightQuoteId, paymentMethod: 'pix' | 'boleto' | 'cartao' }` → `{ orderId, total, payment: { status: 'pendente', pixQrCode?, boletoUrl?, checkoutUrl? } }`
  - Webhook do provedor (HMAC + proteção contra replay) → `payment.status = 'retido'` e libera as conversas privadas do pedido.
  - `POST /orders/:id/accept` (comprador) → libera o valor para a fazenda e para o frete (`'liberado'`).
- **Decisão pendente:** escolher o provedor de pagamento com conta de custódia/split (retenção até o aceite).
- **Aceite:** chat privado só abre após `retido`; nenhum dado de contato é trocado antes disso.

## 2. Emissão automática da GTA
- **Marcadores:** `back-end` · **Responsável:** Claiton · **Urgente**
- **Hoje no front:** cada pedido nasce com `gta: 'aguardando-integracao'`, exibido na confirmação da compra e em Fretes → Documentos.
- **Pesquisa (25/09/2026):** não há API pública para terceiros emitirem GTA. A emissão é feita pelo órgão estadual de defesa agropecuária (OESA), por exemplo o INDEA-MT (Módulo do Produtor). O webservice federal PGA/MAPA (SOAP, métodos como `gravarGtaEmitida` e `obterGtasEmitidaEstadual`) exige a `sysKey` do estado, ou seja, é para os próprios órgãos.
  - Manual do Web Service PGA: https://sistemasweb.agricultura.gov.br/manuais/Manual_PGA_WS/MetodogravarGtaEmitida.html
  - Emissão e-GTA no Módulo do Produtor (INDEA-MT): https://sistemafamato.org.br/wp-content/uploads/2021/11/Emissao-e-GTA-no-Modulo-do-Produtor-INDEA-MT.pdf
- **Caminhos possíveis:** (a) convênio/credenciamento com cada OESA (começar pelo INDEA-MT); (b) emissão pelo produtor/veterinário no sistema estadual, com o GadOn preenchendo os dados e consultando o status pela PGA; (c) parceiro já credenciado.
- **Dados que o GadOn já tem para preencher a GTA:** origem (fazenda e município), destino, espécie, quantidade, sexo, idade, finalidade e vacinação do lote.

## 3. Autenticação (feito em 25/09/2026)
- **API:** Cloudflare Worker `gadon-api` em `https://api.gadon.com.br` com D1 `gadon-db` (código em `api/`, detalhes em `api/README.md`).
- **Front:** cadastro, login com e-mail e senha e "Entrar com Google" usam a API; a sessão é confirmada em `/auth/me` ao abrir o app. O login de demonstração (qualquer senha) foi removido.
- **Google:** projeto Google Cloud "GadOn" (`gadon-509715`), cliente OAuth "GadOn Web". Status "Testando" até publicar a tela de consentimento (exige a Política de Privacidade e os Termos no ar em `app.gadon.com.br`).
- **Falta:** redefinição de senha por e-mail (depende de um e-mail do domínio: `gadon.com.br` hoje não recebe e-mails) e papel de administrador vindo da API.

## 4. Perguntas públicas nos anúncios
- **Marcadores:** `back-end`, `testes` · **Responsável:** Claiton
- **Hoje no front:** perguntas em `gadon.lot-questions.v1`, com bloqueio de telefone, e-mail e links.
- **Contrato:** `GET /lots/:id/questions`, `POST /lots/:id/questions`, `POST /questions/:id/answer` (somente o vendedor do lote). Moderação repetindo a mesma regra de bloqueio no servidor.
- **Falta no front:** tela para o vendedor responder (em "Meus anúncios").

## 5. Radar de Frete
- **Marcadores:** `back-end`, `automação` · **Responsável:** Claiton · **Apoio:** Pablo
- **Regra implementada:** visualização de anúncio vale por 48 h; oportunidade quando um caminhão com retorno vazio previsto passa a até 30 km da fazenda do lote (distância ponto–rota pela geometria OSRM); aviso único por lote + rota, com 30% de desconto no frete da compra.
- **Back-end:** registrar visualizações (`POST /lots/:id/views`), receber as previsões de retorno vazio dos parceiros, calcular as oportunidades e enviar notificação push (Web Push), sem depender do navegador aberto.

## 6. Parceiros de frete
- **Hoje:** um parceiro ativo (`freightPartners` em `src/main.js`; nome de demonstração "Transportadora Boiadeiro"). A tela de compra já lista e ordena vários parceiros por preço.
- **Pendente:** nome e tabela reais do parceiro atual; `GET /freight/quotes?origin&destination&heads` por parceiro.

## 7. Perfil do Pesador
- **Conteúdo:** Paulo produz aulas, dicas, passo a passo, documento assinado do pesador e FAQ. A área "Suporte" já tem a estrutura e a ordem obrigatória (assistir → concluir → mini treinamento); as perguntas atuais são de exemplo.
- **Back-end:** persistir o progresso e a habilitação do pesador; hospedar os vídeos e o documento.

## 8. Loja rural oculta
- Visível só para administradores. Hoje o acesso é por `?admin=1` (desliga com `?admin=0`), o que serve apenas para a demonstração. O papel de administrador deve vir da autenticação no back-end.
