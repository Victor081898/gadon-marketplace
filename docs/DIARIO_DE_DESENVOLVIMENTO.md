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

### 2026-07-27 — Skill local exclusiva do projeto
- Responsável: IA: Codex
- Objetivo: fazer com que as regras de colaboração acompanhem o clone do GadOn sem alterar as configurações globais de quem instalar o projeto.
- Alterações: criada `.agents/skills/gadon-colaboracao/SKILL.md` e vinculada sua leitura ao `AGENTS.md`; README e processo de colaboração agora explicam o escopo exclusivamente local da skill.
- Validação: a skill usa instruções de início, alinhamento com `origin/main`, roteamento de tasks, atualização do diário e finalização da demanda.
- O que falta: cada colaborador deve clonar o repositório e usar um agente compatível com instruções locais; os nomes de usuário GitHub de Claiton e Pablo ainda precisam ser informados para atribuições automáticas.
- Próximo responsável: Victor deve confirmar a adoção da skill pela equipe; Claiton e Pablo devem revisar as partes de back-end, automação e testes.

### 2026-07-28 — Definição do agente construtor externo
- Responsável: IA: Codex
- Objetivo: registrar que `Ecossystem2/agent-mod` será o agente de apoio à construção do sistema, com especialistas para tarefas e processos técnicos.
- Alterações: criado `docs/AGENTE_CONSTRUTOR_AGENT_MOD.md` com a relação entre os repositórios, ordem de uso, mapa de agentes especializados e limites de instalação/execução; `AGENTS.md`, README e processo de colaboração foram vinculados a esse mapa.
- Fonte consultada: `https://github.com/Ecossystem2/agent-mod.git`, branch `main`, template público NestJS + DDD + React com agentes do Claude Code.
- Validação: integração documentada sem copiar agentes nem alterar configurações globais.
- O que falta: disponibilizar o `agent-mod` no ambiente compatível de cada colaborador e registrar o commit/versão consultado quando uma task utilizar um agente externo.
- Próximo responsável: Victor encaminha demandas de front-end; Claiton seleciona os agentes de back-end; Pablo e Claiton selecionam os agentes de automação e testes.

### 2026-07-28 — Tela dedicada para buscar gado
- Responsável: IA: Codex
- Objetivo: habilitar uma aba de pesquisa acessível pelo botão “Buscar gado”, permitindo pesquisar pelo nome da raça e selecionar lotes para compra.
- Alterações: criada a tela `search` com campo de busca por raça/nome, raças populares, contagem de resultados, filtros de região/peso, ordenação e catálogo completo; os cards reutilizam seleção, favoritos, “Ver lote” e a barra de solicitação de compra já existente.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Validação: `npm run build` concluído com sucesso; eventos de navegação, busca, filtros, seleção e compra revisados estaticamente. A inspeção automática no navegador ficou indisponível por falha no runtime do browser embutido.
- O que falta: testar manualmente o fluxo no navegador e conectar a busca a um catálogo/API real quando o back-end estiver disponível.
- Próximo responsável: Victor valida a experiência visual; Claiton define o contrato de consulta de raças/lotes; Pablo cria testes da busca e seleção quando a API estiver integrada.

### 2026-07-28 — Estado inicial vazio da pesquisa
- Responsável: IA: Codex
- Objetivo: deixar a nova aba de pesquisa limpa, mostrando somente a lupa e o campo para digitar o nome do produto/raça antes de carregar o catálogo.
- Alterações: o acesso a “Buscar gado” agora limpa a pesquisa e os filtros, exibe uma tela inicial centralizada e só mostra resultados após a entrada de um termo ou seleção de uma raça.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Validação: build e revisão estática dos eventos de navegação, submissão e limpeza da busca.
- O que falta: validar a experiência visual no navegador e conectar a consulta ao catálogo real.
- Próximo responsável: Victor testa a nova tela; Claiton define a consulta de produtos/raças; Pablo cobre o fluxo com testes automatizados.

### 2026-07-28 — Filtros avançados do catálogo
- Responsável: IA: Codex
- Objetivo: permitir que a pesquisa encontre lotes com base em características do animal e da fazenda.
- Alterações: adicionados filtros de sexo, finalidade, nome da fazenda/vendedor, localização da fazenda, região/UF, peso mínimo/máximo e idade mínima/máxima em meses. Os dados de demonstração dos lotes agora carregam sexo, idade numérica e finalidade para alimentar o filtro.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Validação: será executado `npm run build` e revisada a submissão/reset do formulário de filtros.
- O que falta: substituir os dados de demonstração pelos campos do catálogo/API real e cobrir combinações de filtros com testes automatizados.
- Próximo responsável: Victor valida a usabilidade; Claiton define os campos equivalentes no contrato de busca; Pablo cria testes de filtros combinados.

### 2026-07-27 — Visão completa da gestão de documentos de frete
- Responsável: IA: Codex
- Objetivo: permitir a visualização centralizada dos documentos emitidos e pendentes relacionados às viagens de frete.
- Alterações: adicionado o botão “Ver todos” no painel de Gestão de Documentos e criado um modal de consulta com contadores de total, emitidos e pendentes; a listagem pode ser filtrada por status e exibe tipo, identificação, viagem, arquivo, data de inclusão, validade e observações. Novos arquivos anexados passam a entrar como pendentes de conferência.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Validação: `npm run build`, verificação de diff e teste HTTP local concluídos com sucesso. A inspeção automática no navegador permanece indisponível pelo erro do runtime embutido.
- O que falta: conectar a consulta a um serviço persistente de documentos, permitir download/visualização do arquivo e criar permissões por perfil.
- Próximo responsável: Victor valida a experiência de consulta; Claiton define o contrato de documentos e status; Pablo cobre filtros, contadores e anexos com testes automatizados.

### 2026-07-28 — Identificação GitHub dos responsáveis
- Responsável: IA: Codex
- Objetivo: completar o encaminhamento das tarefas de colaboração com os usuários oficiais do GitHub.
- Alterações: Claiton foi registrado como `@ecossystem2` para back-end, APIs, contratos e persistência; Pablo foi registrado como `@ricardopablo1914` para automações e testes, trabalhando em conjunto com Claiton nas integrações. As regras, o processo e a skill local agora orientam as atribuições correspondentes em issues.
- Arquivos: `AGENTS.md`, `.agents/skills/gadon-colaboracao/SKILL.md`, `docs/PROCESSO_DE_COLABORACAO.md`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Validação: revisão estática das menções e dos fluxos de atribuição; será executado `npm run build` antes do commit.
- O que falta: abrir e atribuir as primeiras issues específicas de integração quando Victor definir as próximas demandas de produto.
- Próximo responsável: Victor abre as tasks de front-end; `@ecossystem2` registra os contratos de back-end; `@ricardopablo1914` estrutura os testes e automações com apoio de `@ecossystem2`.

### 2026-07-28 — Publicação obrigatória de todas as alterações
- Responsável: IA: Codex
- Objetivo: garantir que nenhuma alteração do projeto fique somente no ambiente local.
- Alterações: adicionada uma regra permanente em `AGENTS.md`, na skill local, no processo de colaboração e em `CONTRIBUTING.md`: toda mudança, inclusive documentação, deve atualizar o diário no mesmo commit, passar pelas validações aplicáveis, ser publicada no GitHub e atualizar o pull request quando existir.
- Arquivos: `AGENTS.md`, `.agents/skills/gadon-colaboracao/SKILL.md`, `docs/PROCESSO_DE_COLABORACAO.md`, `CONTRIBUTING.md`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Validação: revisão estática das regras e `npm run build` executado antes do commit.
- O que falta: aplicar esse fluxo em todas as próximas tasks e criar/atualizar issues quando uma demanda atravessar front-end, back-end, automações ou testes.
- Próximo responsável: todos os colaboradores; Victor coordena o front-end, `@ecossystem2` o back-end e `@ricardopablo1914` as automações e testes.
