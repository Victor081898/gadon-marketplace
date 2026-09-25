# Processo de trabalho e demandas

> Skill local: `.agents/skills/gadon-colaboracao/SKILL.md`. Ela acompanha este repositório e só deve ser aplicada ao GadOn.

## Objetivo

Manter front-end, back-end, testes, infraestrutura e documentação alinhados desde o planejamento até a publicação.

## Equipe (a partir de 25/09/2026)

O desenvolvimento do GadOn é feito integralmente pela equipe GadOn com a IA; não há mais divisão de tarefas com colaboradores externos.

| Área | Quem faz |
| --- | --- |
| Produto, prioridades e aprovações (publicação, custos, contas externas) | Responsável pelo GadOn |
| Front-end, back-end (API), testes, infraestrutura e documentação | IA (Claude Code), com revisão do responsável |

## Ciclo de uma demanda

1. O responsável descreve a necessidade.
2. A IA planeja, implementa em uma branch `feature/...` e cobre a mudança com testes (API: `api/test/e2e.mjs`; telas: navegador em desktop, celular e modo escuro).
3. Mudanças de contrato da API são registradas em `api/README.md`; dependências externas em `docs/INTEGRACOES_PENDENTES.md`.
4. O pull request referencia o que foi feito e só é concluído após build, testes, documentação e diário atualizados.
5. Publicação em produção (API, migrações, app) só com autorização do responsável.

## Conferência obrigatória ao iniciar o projeto

```bash
git fetch origin
git status -sb
git log --oneline --decorate -5
git diff main...origin/main
```

Se houver diferença entre o local e o GitHub, revise a divergência e alinhe a branch antes de criar novas alterações.

## Registro e encerramento

O diário em `docs/DIARIO_DE_DESENVOLVIMENTO.md` deve ser atualizado em toda tarefa, incluindo:

- o que foi feito;
- arquivos e APIs afetados;
- validações executadas;
- o que ainda falta.

## Regra permanente de publicação

Toda alteração, incluindo documentação e ajustes de processo, deve:

1. atualizar `docs/DIARIO_DE_DESENVOLVIMENTO.md` no mesmo commit;
2. passar pelas validações aplicáveis;
3. ser commitada e publicada no GitHub na branch de trabalho;
4. atualizar o pull request relacionado, quando existir.

Alterações não publicadas não devem ser consideradas concluídas.
