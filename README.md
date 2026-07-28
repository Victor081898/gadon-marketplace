# GadOn — O mercado do Gado

Marketplace para compra, venda e transporte de gado, com negociação direta entre as partes.

## O que já está disponível

- Marketplace com lotes em destaque, busca, filtros por raça/categoria/região/peso e ordenação.
- Seleção de lotes, favoritos, histórico de visualizações e solicitação de compra.
- Página detalhada do lote com descrição, qualidades, sanidade, certificados, documentação e localização.
- Cadastro de gado com registro de auditoria do processo de verificação.
- Mensagens entre comprador e vendedor com anexos e gravação/envio de áudio.
- Módulos de frete: cotação, distância, agenda, viagens futuras, documentos, status e relatórios.
- Calendário de fretes com feriados nacionais destacados e análise de todas as viagens marcadas.
- Central de notificações em popout.
- Gestão de documentos de frete com inclusão de arquivos e metadados.

## Executar localmente

Requisitos: Node.js 20 ou superior.

```bash
npm install
npm run dev
```

Para validar uma entrega de produção:

```bash
npm run build
```

O projeto é uma aplicação Vite com JavaScript vanilla e CSS. Os dados de demonstração e algumas interações locais são persistidos no `localStorage` do navegador.

## Colaboração

As regras para alterações, commits, validação e atualização do histórico estão em [CONTRIBUTING.md](CONTRIBUTING.md). O registro contínuo de decisões e modificações fica em [docs/DIARIO_DE_DESENVOLVIMENTO.md](docs/DIARIO_DE_DESENVOLVIMENTO.md).

Toda alteração feita por uma pessoa ou pela IA deve atualizar o diário no mesmo commit, indicando data, responsável, resumo, arquivos afetados e validação realizada.

## Status

Protótipo funcional em evolução. Antes de usar dados reais, devem ser conectados backend, autenticação, armazenamento seguro de documentos e validação jurídica/operacional dos fluxos de compra, venda e transporte.
