---
name: gadon-colaboracao
description: Regras locais do GadOn para alinhar o checkout com o GitHub, encaminhar demandas entre front-end, back-end, automações e testes, e manter o diário atualizado. Aplicar somente dentro deste repositório.
---

# Skill local de colaboração do GadOn

Esta skill pertence exclusivamente ao projeto GadOn. Ela deve ser lida quando um agente trabalhar neste repositório e não deve ser instalada globalmente ou aplicada a outros projetos.

## Início de uma sessão

Antes de alterar arquivos:

1. Execute `git fetch origin`.
2. Confira `git status -sb`, `git log --oneline --decorate -5` e `git diff main...origin/main`.
3. Revise `AGENTS.md`, `docs/PROCESSO_DE_COLABORACAO.md` e o diário.
4. Se houver divergência entre local e remoto, pare para revisar o diff e alinhar a branch com segurança.

## Roteamento de demandas

- Victor cuida do front-end e descreve as necessidades de produto.
- Claiton (`@ecossystem2`) cuida da arquitetura back-end, APIs, persistência e contratos de comunicação.
- Pablo (`@ricardopablo1914-create`), em conjunto com Claiton, cuida de automações, testes de API e testes de integração.

Quando uma mudança atravessar camadas, crie ou atualize uma issue com responsável principal, responsáveis de apoio, contrato de dados, critérios de aceite, dependências e validações.

## Registro obrigatório

Toda alteração humana ou de IA deve atualizar `docs/DIARIO_DE_DESENVOLVIMENTO.md` no mesmo commit, registrando:

- o que foi feito;
- arquivos e contratos afetados;
- validações executadas;
- o que falta;
- próximo responsável;
- novas tasks/issues necessárias.

## Publicação obrigatória

Qualquer alteração, inclusive documentação, deve atualizar o diário no mesmo commit, passar pelas validações aplicáveis e ser publicada no GitHub na branch de trabalho. Ao existir um pull request, ele também deve receber a atualização. Não finalize uma sessão deixando alterações somente no checkout local.

## Finalização

Antes de concluir, rode o build e os testes aplicáveis, revise o diff, atualize a issue e o pull request e confirme que código, documentação e diário estão no mesmo fluxo de revisão.
