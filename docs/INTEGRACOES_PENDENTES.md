# Integrações — situação em 25/09/2026

O sistema roda sobre a API própria (`api.gadon.com.br`, detalhes em `api/README.md`): contas, anúncios com moderação, perguntas públicas, favoritos, compra com frete, pagamento protegido, conversas após o pagamento, Radar de Frete, central de fretes, perfil vendedor com documentos privados, pesador, notificações, pré-cadastro e painel de administração. O desenvolvimento é feito integralmente pela equipe GadOn com a IA (ver `docs/PROCESSO_DE_COLABORACAO.md`).

Os itens abaixo dependem de decisão, contrato ou credencial externa.

## 1. Provedor de pagamento (decisão pendente)
- **Pronto:** adaptador `paymentProviders` em `api/src/commerce.js`. Hoje `PAYMENT_PROVIDER = "simulado"`: o pedido é pago e o valor fica "retido" na hora; o aceite da entrega muda para "liberado".
- **Falta:** escolher um provedor com custódia/split (retenção até o aceite). Ao escolher: implementar `create` (Pix, boleto, cartão), o webhook de confirmação (assinatura HMAC + proteção contra repetição) e `release`; trocar a variável `PAYMENT_PROVIDER`.
- **Regra mantida:** a conversa privada só abre com o pagamento retido.

## 2. E-mail transacional (redefinição de senha)
- **Pronto:** `/auth/forgot` e `/auth/reset` na API; tela "Criar nova senha" (`?redefinir=TOKEN`) no app.
- **Falta:** ativar o envio de e-mail da Cloudflare em `gadon.com.br` (exige o plano Workers Paid, US$ 5/mês) e adicionar `"send_email": [{ "name": "EMAIL" }]` em `api/wrangler.jsonc`. Enquanto isso, a API responde 503 e o app orienta a entrar com Google ou falar com `contato@gadon.com.br`.

## 3. Emissão automática da GTA
- **Hoje:** cada pedido nasce com `gta_status = 'aguardando_integracao'`, exibido na compra e em Fretes → Documentos.
- **Pesquisa (25/09/2026):** não há API pública para terceiros emitirem GTA. A emissão é do órgão estadual de defesa agropecuária (ex.: INDEA-MT, Módulo do Produtor). O webservice federal PGA/MAPA (SOAP, `gravarGtaEmitida`, `obterGtasEmitidaEstadual`) exige a `sysKey` do estado.
  - Manual do Web Service PGA: https://sistemasweb.agricultura.gov.br/manuais/Manual_PGA_WS/MetodogravarGtaEmitida.html
  - e-GTA no Módulo do Produtor (INDEA-MT): https://sistemafamato.org.br/wp-content/uploads/2021/11/Emissao-e-GTA-no-Modulo-do-Produtor-INDEA-MT.pdf
- **Caminhos:** (a) convênio com cada órgão estadual, começando pelo INDEA-MT; (b) emissão pelo produtor/veterinário no sistema estadual, com o GadOn preenchendo os dados e consultando o status; (c) parceiro já credenciado.
- **Dados que o GadOn já tem:** origem, destino, espécie, quantidade, sexo, idade, finalidade e vacinação do lote.

## 4. Parceiro de frete
- **Pronto:** tabela de preço em `FREIGHT_PARTNERS` (`api/src/commerce.js`), distância real pela estrada, cotação na compra e cotação avulsa, pedidos de frete e de carga nas voltas encaminhados à administração (Administração → Pedidos de frete), agenda e documentos por conta.
- **Falta:** nome e tabela reais do parceiro (hoje "Transportadora Boiadeiro" com base R$ 780 + R$ 3,65/km + R$ 14/cabeça); previsões de viagem reais do parceiro para o Radar (hoje em `radarRoutes`, `api/src/radar.js`); localização do caminhão em tempo real quando o parceiro oferecer integração.

## 5. Conteúdo do pesador
- **Pronto:** aulas → conclusão → mini treinamento corrigido no servidor, com progresso na conta.
- **Falta:** vídeos, documento assinado e perguntas definitivas do treinamento (as atuais são de exemplo; gabarito em `WEIGHER_ANSWERS`, `api/src/account.js`).

## 6. Notificações fora do app
- **Hoje:** notificações ficam na conta (sino) e o app avisa pelo navegador enquanto está aberto.
- **Próximo passo:** Web Push (chaves VAPID + service worker) para avisar o Radar e as mensagens com o app fechado.

## 7. Leilão ao vivo (simulação por decisão do responsável)
- **Decisão (25/09/2026):** o leilão continua como demonstração por enquanto: lances dos outros participantes simulados, sem cobrança. A tela exibe "Leilão de demonstração" e um aviso fixo.
- **Para virar real:** lotes de leilão cadastrados e aprovados, sala em tempo real (Durable Objects/WebSocket), regras de lance e arremate, cadastro/caução do licitante e integração com o pagamento.

## 8. Identidade visual
- Logos oficiais aplicados. As fontes da marca (Snaga Uni Display e Cheddar Gothic Slab) são comerciais; para usá-las no app é preciso enviar os arquivos de fonte com licença para web.
