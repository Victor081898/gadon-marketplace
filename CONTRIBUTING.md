# Como colaborar no GadOn

## Fluxo de trabalho

1. Atualize sua cópia local a partir de `main`.
2. Confira o alinhamento local com `origin/main` usando `git fetch origin`, `git status -sb` e `git diff main...origin/main`.
3. Leia `AGENTS.md` e `docs/PROCESSO_DE_COLABORACAO.md` antes de iniciar.
4. Crie ou atualize a issue, encaminhando as partes de front-end, back-end e automação/testes aos responsáveis.
5. Crie uma branch com um nome descritivo, por exemplo `feature/gestao-documentos`, `fix/modal-lote` ou `docs/diario`.
6. Faça alterações pequenas e relacionadas ao mesmo objetivo.
7. Atualize `docs/DIARIO_DE_DESENVOLVIMENTO.md` no mesmo commit da alteração.
8. Rode `npm run build` e os testes aplicáveis antes de abrir o pull request.
9. Abra um pull request descrevendo o que mudou, como foi validado, o que falta e quais tasks dependentes foram criadas.

## Commits

Use mensagens curtas e objetivas, preferencialmente no formato:

- `feat: adiciona ...` para funcionalidade nova;
- `fix: corrige ...` para correção;
- `docs: atualiza ...` para documentação;
- `chore: ajusta ...` para manutenção técnica.

## Diário contínuo

O diário é a fonte compartilhada de contexto do projeto. Cada registro deve conter:

- data no formato `AAAA-MM-DD`;
- responsável (`Humano: nome` ou `IA: Codex`);
- objetivo e resumo da mudança;
- arquivos alterados;
- validações executadas;
- próximos passos ou pendências.

Não apague registros anteriores. Se uma decisão for revertida, acrescente uma nova entrada explicando o motivo.

## Segurança e arquivos locais

Não faça commit de credenciais, arquivos `.env`, `node_modules`, `dist`, arquivos temporários ou documentos reais de compradores/vendedores. Use dados fictícios para demonstrações e testes.
