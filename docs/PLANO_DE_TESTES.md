# Plano de testes e automações — GadOn

> Responsável: Pablo (`@ricardopablo1914-create`), automações e testes, em conjunto com Claiton (`@ecossystem2`).
> Escopo de produto de referência: apresentação "Marketplace de Compra, Venda e Frete Inteligente de Gado" (deck executivo) e o protótipo em `src/main.js`.

## Objetivo

Garantir cobertura automatizada dos fluxos críticos do GadOn em três camadas, evoluindo junto com o produto:

1. **Hoje (protótipo front-end):** testes de interface e interação com Vitest + jsdom, sem tocar no código do protótipo.
2. **Quando o back-end existir (Claiton):** testes de contrato e integração das APIs.
3. **Contínuo:** automações de CI para build + testes em todo push e pull request.

## Como rodar

```bash
npm test          # roda a suíte uma vez (CI usa este)
npm run test:watch  # modo interativo durante o desenvolvimento
```

Infra: `vitest.config.js` (ambiente jsdom), `tests/setup.js` (isolamento por teste: localStorage limpo, `#app` recriado, módulo reimportado) e `tests/helpers.js` (interações reutilizáveis).

## Cobertura atual (protótipo)

| Suíte | Fluxo coberto | Origem da demanda |
| --- | --- | --- |
| `tests/marketplace-home.spec.js` | Home: renderização, busca rápida, categorias, ordenação, favoritos (com persistência), histórico, seleção e solicitação de compra, navegação | Fluxos críticos (deck: "Fluxo de compra e venda") |
| `tests/busca-selecao.spec.js` | Tela "Buscar gado": estado inicial vazio, busca por raça, chips de raças populares, limpar pesquisa, seleção + compra | Diário: "testes da busca e seleção" |
| `tests/filtros-avancados.spec.js` | Filtros combinados: sexo, finalidade, fazenda, localização, região, peso e idade; contador; reset; combinações com busca e categoria | Diário: "testes de filtros combinados" |
| `tests/documentos-frete.spec.js` | Gestão de documentos: listagem, contadores (total/emitidos/pendentes), abas de status, anexos entrando como pendentes, limite de 10 MB, persistência | Diário: "cobre filtros, contadores e anexos" |
| `tests/tabela-rotas.spec.js` | Tabela completa de rotas: abertura, fechamento, renderização, somatórios (km e R$), badges de status | Diário: "cobre a abertura, fechamento e renderização da tabela" |

## Próximas ondas (dependem de contratos do back-end)

Mapeadas a partir dos módulos do deck. Cada onda vira issue própria quando Claiton publicar o contrato correspondente:

| Onda | Módulo (deck) | Testes previstos |
| --- | --- | --- |
| A | Cadastro e autenticação (participantes: produtor, comprador, transportador, admin) | Contrato de signup/login, sessão, papéis e permissões por perfil |
| B | Anúncios de lotes + busca/filtros | Contrato de listagem (paginação, filtros, ordenação), criação de lote, fluxo de verificação/auditoria |
| C | Chat e propostas | Envio/recebimento, anexos, histórico, notificações de mensagem |
| D | Cotação de frete (motor de cotação) | Contrato da cotação (origem, destino, quantidade, categoria, km, janela, exigências sanitárias), regras de faixa de preço |
| E | Carga de retorno inteligente | Matching por região/raio/janela/tipo de carga/capacidade, notificações regionais |
| F | Documentos (GTA, CT-e, comprovantes) | Upload real, status, validade, permissões por perfil |
| G | Painel do transportador | Agenda de viagens, status da viagem, oportunidades de retorno |

## Convenções

- Specs em `tests/*.spec.js`, `describe`/`it` em português, um comportamento por `it`.
- Testar o comportamento real do app; se um teste revelar bug, registrar comentário `// BUG?` no spec, reportar no diário e abrir issue — nunca "acomodar" o teste silenciosamente.
- Todo teste deve passar isolado e na suíte completa (o setup garante isolamento; não criar dependência de ordem).
- Persistência sempre verificada nas chaves `gadon.*` do localStorage quando o fluxo salvar dados.
