# Diário de desenvolvimento — GadOn

Este arquivo registra continuamente as decisões, funcionalidades e correções do projeto. Ele deve ser atualizado em toda alteração feita por uma pessoa ou pela IA e enviado junto com o código no mesmo commit.

## Modelo de registro

```text
### AAAA-MM-DD — Título
- Responsável: Humano: nome | IA: Codex
- Objetivo: ...
- Alterações: ...
- Arquivos: ...
- Validação: ...
- Próximos passos: ...
```

## Histórico

### 2026-07-27 — Consolidação do protótipo do marketplace
- Responsável: IA: Codex
- Objetivo: transformar a referência visual do GadOn em um protótipo interativo de marketplace para compra, venda e transporte de gado.
- Alterações: foram implementados o marketplace inicial, identidade visual, cadastro de gado, log de verificação, mensagens entre comprador e vendedor, anexos, áudio, módulos de frete, agenda de viagens, calendário com feriados nacionais, notificações, filtros e ordenação de lotes, favoritos, histórico, seleção para compra, proposta de negociação e página detalhada do lote.
- Documentação de produto: a visualização do lote passou a apresentar descrição, qualidades, sanidade, vacinação, certificados, documentação, localização e informações adicionais, com aviso de que a validação definitiva deve ser feita antes do uso em produção.
- Gestão de documentos: adicionada inclusão de documentos de frete com tipo, título, vencimento opcional, descrição e indicação de arquivo.
- Arquivos: `src/main.js`, `src/styles.css`.
- Validação: `npm run build` concluído com sucesso.
- Próximos passos: conectar persistência e autenticação reais, armazenar arquivos em serviço seguro e revisar fluxos com especialistas jurídicos e de transporte animal.

### 2026-07-27 — Preparação para colaboração compartilhada
- Responsável: IA: Codex
- Objetivo: tornar o projeto compartilhável e manter um registro único das alterações.
- Alterações: adicionados README, regras de colaboração, diário contínuo, proteção de arquivos de ambiente no Git e validação automatizada de build no GitHub Actions.
- Arquivos: `README.md`, `CONTRIBUTING.md`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`, `.gitignore`, `.github/workflows/build.yml`, `.github/pull_request_template.md`.
- Validação: será executado `npm run build` antes do primeiro commit.
- Próximos passos: criar o repositório privado no GitHub, publicar a branch `main` e compartilhar o endereço com a equipe.

### 2026-07-27 — Publicação no GitHub
- Responsável: IA: Codex
- Objetivo: disponibilizar o código para colaboração da equipe.
- Alterações: configurado o remoto `https://github.com/Victor081898/gadon-marketplace.git`, reautenticado o GitHub CLI e publicado o commit inicial `b5f2f43` na branch `main`.
- Repositório: [Victor081898/gadon-marketplace](https://github.com/Victor081898/gadon-marketplace).
- Validação: push concluído e `README.md` confirmado no branch remoto `main`.
- Observação: o repositório foi criado como público no GitHub. A visibilidade pode ser alterada pelo proprietário caso o projeto precise ficar privado.
- Próximos passos: compartilhar o repositório com a equipe, criar branches por funcionalidade e atualizar este diário no mesmo commit de cada alteração.

### 2026-07-27 — Regra de colaboração por responsabilidades
- Responsável: IA: Codex
- Objetivo: formalizar no GitHub como Victor, Claiton e Pablo devem compartilhar demandas entre front-end, back-end, automações e testes.
- Alterações: criado `AGENTS.md` como regra operacional para agentes e colaboradores; criado `docs/PROCESSO_DE_COLABORACAO.md` com matriz de responsabilidades, ciclo de demanda, conferência de alinhamento com `origin/main` e critérios de encerramento; ampliados `CONTRIBUTING.md` e o template de pull request para exigir tasks, responsáveis, validação e atualização do diário.
- Arquivos: `AGENTS.md`, `docs/PROCESSO_DE_COLABORACAO.md`, `CONTRIBUTING.md`, `.github/pull_request_template.md`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Validação: será executado `npm run build`; o diff e o status Git serão conferidos antes do push.
- O que falta: definir os nomes de usuário GitHub de Claiton e Pablo para atribuições automáticas de issues e criar as primeiras tasks específicas de integração.
- Próximo responsável: Victor deve abrir as demandas de front-end; Claiton deve registrar os contratos de back-end; Pablo e Claiton devem registrar os cenários de automação e testes.
