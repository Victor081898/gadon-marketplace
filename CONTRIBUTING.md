# Como colaborar no GadOn

## Fluxo de trabalho

1. Atualize sua cópia local a partir de `main`.
2. Crie uma branch com um nome descritivo, por exemplo `feature/gestao-documentos`, `fix/modal-lote` ou `docs/diario`.
3. Faça alterações pequenas e relacionadas ao mesmo objetivo.
4. Atualize `docs/DIARIO_DE_DESENVOLVIMENTO.md` no mesmo commit da alteração.
5. Rode `npm run build` antes de abrir o pull request.
6. Abra um pull request descrevendo o que mudou, como foi validado e quais pontos ainda precisam de atenção.

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
