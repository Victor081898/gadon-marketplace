---
name: gadon-colaboracao
description: Regras locais do GadOn para alinhar o checkout com o GitHub, manter front-end, API, testes e documentação no mesmo fluxo e atualizar o diário. Aplicar somente dentro deste repositório.
---

# Skill local de colaboração do GadOn

Esta skill pertence exclusivamente ao projeto GadOn. Ela deve ser lida quando um agente trabalhar neste repositório e não deve ser instalada globalmente ou aplicada a outros projetos.

## Início de uma sessão

Antes de alterar arquivos:

1. Execute `git fetch origin`.
2. Confira `git status -sb`, `git log --oneline --decorate -5` e `git diff main...origin/main`.
3. Revise `AGENTS.md`, `docs/PROCESSO_DE_COLABORACAO.md` e o diário.
4. Se houver divergência entre local e remoto, pare para revisar o diff e alinhar a branch com segurança.

## Equipe

Desde 25/09/2026 o GadOn é desenvolvido integralmente pela equipe GadOn com a IA: a IA faz front-end, back-end (`api/`), testes, infraestrutura e documentação; o responsável pelo GadOn define prioridades e autoriza publicações, custos e contas externas. Não encaminhe demandas para colaboradores externos.

Quando uma mudança atravessar camadas, registre o contrato em `api/README.md` e as dependências externas em `docs/INTEGRACOES_PENDENTES.md`.

## Registro obrigatório

Toda alteração humana ou de IA deve atualizar `docs/DIARIO_DE_DESENVOLVIMENTO.md` no mesmo commit, registrando:

- o que foi feito;
- arquivos e contratos afetados;
- validações executadas;
- o que falta.

## Publicação obrigatória

Qualquer alteração, inclusive documentação, deve atualizar o diário no mesmo commit, passar pelas validações aplicáveis e ser publicada no GitHub na branch de trabalho. Ao existir um pull request, ele também deve receber a atualização. Não finalize uma sessão deixando alterações somente no checkout local.

## Finalização

Antes de concluir, rode o build e os testes aplicáveis (`npm run build` e `node api/test/e2e.mjs` com a API local), revise o diff, atualize o pull request e confirme que código, documentação e diário estão no mesmo fluxo de revisão.
