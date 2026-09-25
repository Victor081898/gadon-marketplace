# Regras de trabalho do GadOn

Estas instruções valem para qualquer pessoa ou agente que altere este repositório.

## Skill local do projeto

Ao trabalhar neste repositório, carregue `.agents/skills/gadon-colaboracao/SKILL.md`. Essa skill é exclusiva do GadOn, acompanha o código pelo Git e não deve ser instalada globalmente nem aplicada a outros projetos.

## Agente construtor externo

O repositório `https://github.com/Ecossystem2/agent-mod.git` fornece agentes especializados para apoiar a construção do sistema. Consulte `docs/AGENTE_CONSTRUTOR_AGENT_MOD.md` para o mapa de responsabilidades e a ordem de uso. As regras do GadOn têm prioridade sobre as regras genéricas do agente externo.

## Responsabilidades

Desde 25/09/2026 o GadOn é desenvolvido integralmente pela equipe GadOn com a IA; não há divisão de tarefas com colaboradores externos.

- **Responsável pelo GadOn:** define prioridades e autoriza publicações em produção, custos e contas externas.
- **IA (Claude Code):** front-end, back-end (`api/`), testes, infraestrutura e documentação, com revisão do responsável.

## Antes de iniciar qualquer trabalho

1. Atualize as referências locais e confirme o estado da branch:

   ```bash
   git fetch origin
   git status -sb
   git log --oneline --decorate -5
   git diff main...origin/main
   ```

2. Se a cópia local estiver atrás de `origin/main`, alinhe-a antes de começar. Não sobrescreva alterações locais de outra pessoa sem revisar o diff.
3. Leia o diário em `docs/DIARIO_DE_DESENVOLVIMENTO.md` e procure tarefas ou pendências relacionadas.

## Contratos e dependências

- Toda mudança de comunicação entre o app e a API deve atualizar `api/README.md` e, quando mexer em dados, trazer a migração em `api/migrations/`.
- Dependências de decisões ou serviços externos ficam em `docs/INTEGRACOES_PENDENTES.md`.
- Mudanças na API devem ter cobertura em `api/test/e2e.mjs`.

## Durante o desenvolvimento

- Trabalhe em uma branch descritiva, como `feature/...`, `fix/...`, `backend/...` ou `test/...`.
- Mantenha as alterações pequenas e relacionadas à demanda.
- Não faça commit de credenciais, dados reais, `node_modules`, `dist` ou arquivos temporários.

## Antes de finalizar

1. Execute `npm run build` e, se a API mudou, `node api/test/e2e.mjs` contra a API local.
2. Atualize o diário com objetivo, alteração, arquivos, validação e pendências.
3. Atualize a documentação técnica ou o contrato de API quando houver mudança de comunicação.
4. Verifique `git diff`, `git status` e se a branch contém apenas o escopo da demanda.
5. Abra ou atualize o pull request preenchendo o checklist.
6. Só considere a demanda concluída quando código, testes e documentação estiverem sincronizados no GitHub.

## Regra de publicação contínua

Qualquer alteração feita por uma pessoa ou pela IA, inclusive alterações somente de documentação, deve atualizar o diário, ser validada, commitada e publicada no GitHub na branch de trabalho. O pull request correspondente também deve ser atualizado quando existir. Nenhuma alteração deve ficar apenas no checkout local ao encerrar uma sessão.

## Regra do diário

Cada mudança humana ou feita pela IA deve atualizar `docs/DIARIO_DE_DESENVOLVIMENTO.md` no mesmo commit. O registro deve informar o que foi feito e o que falta.
