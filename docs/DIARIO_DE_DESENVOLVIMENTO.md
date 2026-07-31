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
- Alterações: Claiton foi registrado como `@ecossystem2` para back-end, APIs, contratos e persistência; Pablo foi registrado como `@ricardopablo1914-create` para automações e testes, trabalhando em conjunto com Claiton nas integrações. As regras, o processo e a skill local agora orientam as atribuições correspondentes em issues.
- Arquivos: `AGENTS.md`, `.agents/skills/gadon-colaboracao/SKILL.md`, `docs/PROCESSO_DE_COLABORACAO.md`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Validação: revisão estática das menções e dos fluxos de atribuição; será executado `npm run build` antes do commit.
- O que falta: abrir e atribuir as primeiras issues específicas de integração quando Victor definir as próximas demandas de produto.
- Próximo responsável: Victor abre as tasks de front-end; `@ecossystem2` registra os contratos de back-end; `@ricardopablo1914-create` estrutura os testes e automações com apoio de `@ecossystem2`.

### 2026-07-28 — Publicação obrigatória de todas as alterações
- Responsável: IA: Codex
- Objetivo: garantir que nenhuma alteração do projeto fique somente no ambiente local.
- Alterações: adicionada uma regra permanente em `AGENTS.md`, na skill local, no processo de colaboração e em `CONTRIBUTING.md`: toda mudança, inclusive documentação, deve atualizar o diário no mesmo commit, passar pelas validações aplicáveis, ser publicada no GitHub e atualizar o pull request quando existir.
- Arquivos: `AGENTS.md`, `.agents/skills/gadon-colaboracao/SKILL.md`, `docs/PROCESSO_DE_COLABORACAO.md`, `CONTRIBUTING.md`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Validação: revisão estática das regras e `npm run build` executado antes do commit.
- O que falta: aplicar esse fluxo em todas as próximas tasks e criar/atualizar issues quando uma demanda atravessar front-end, back-end, automações ou testes.
- Próximo responsável: todos os colaboradores; Victor coordena o front-end, `@ecossystem2` o back-end e `@ricardopablo1914-create` as automações e testes.

### 2026-07-28 — Sincronização da branch main
- Responsável: IA: Codex
- Objetivo: incorporar na branch principal o conjunto de funcionalidades e regras já revisado na branch `codex/nova-demanda`.
- Alterações: preparada a integração dos nove commits de colaboração, funcionalidades de marketplace, frete, documentos e regras de publicação para a `main` por fast-forward.
- Arquivos: o merge incorpora os arquivos já registrados nas entradas anteriores deste diário.
- Validação: referências remotas conferidas; `codex/nova-demanda` está 9 commits à frente da `main`; o build será executado antes do merge e o push da `main` será confirmado.
- O que falta: abrir novas tasks específicas para as próximas integrações entre front-end, back-end, automações e testes.
- Próximo responsável: Victor coordena a próxima demanda; `@ecossystem2` e `@ricardopablo1914-create` assumem os contratos e testes quando as tasks forem abertas.

### 2026-07-28 — Tabela completa de rotas contratadas
- Responsável: IA: Codex
- Objetivo: permitir a consulta detalhada de todas as rotas de frete contratadas no módulo Tabela de Distância.
- Alterações: o botão “Ver tabela completa” agora abre uma visão consolidada com origem, destino, distância, preço contratado, transportadora, status e data da contratação; foram adicionados indicadores de quantidade de rotas, quilômetros totais e valor total contratado, com layout responsivo para leitura em telas menores.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Validação: `npm run build`, `git diff --check` e teste HTTP local concluídos com sucesso; a inspeção visual automática não foi possível porque o navegador embutido apresentou falha de conexão no runtime.
- O que falta: substituir os dados demonstrativos por rotas persistidas pela API de fretes e permitir atualização dos preços após novas contratações.
- Próximo responsável: Victor valida a experiência visual; `@ecossystem2` define o contrato de rotas contratadas; `@ricardopablo1914-create` cobre a abertura, fechamento e renderização da tabela nos testes.

### 2026-07-28 — Exportação do relatório consolidado de fretes
- Responsável: IA: Codex
- Objetivo: permitir que o usuário gere um documento com as informações operacionais do módulo Relatórios.
- Alterações: o botão “Exportar” agora baixa um CSV com resumo operacional, rotas contratadas, viagens registradas e documentos de frete, incluindo origem, destino, distância, preços, status, transportadoras, datas e observações.
- Arquivos: `src/main.js`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Validação: o CSV é gerado no navegador com codificação UTF-8 e separador compatível com planilhas; serão executados `npm run build`, `git diff --check` e teste HTTP local antes da publicação.
- O que falta: disponibilizar exportação em PDF/XLSX e conectar o conteúdo a dados persistidos pela API.
- Próximo responsável: Victor valida o arquivo exportado; `@ecossystem2` define os dados oficiais do relatório; `@ricardopablo1914-create` testa o download e a integridade das seções exportadas.

### 2026-07-28 — Correção do pseudônimo GitHub do Pablo
- Responsável: IA: Codex
- Objetivo: corrigir o identificador usado para encaminhar tasks e testes ao responsável por automações.
- Alterações: substituído o pseudônimo incorreto pelo identificador oficial `@ricardopablo1914-create` em `AGENTS.md`, na skill local e no processo de colaboração; os registros históricos do diário também foram corrigidos para manter as referências atuais.
- Arquivos: `AGENTS.md`, `.agents/skills/gadon-colaboracao/SKILL.md`, `docs/PROCESSO_DE_COLABORACAO.md`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Validação: revisão das ocorrências do usuário e `git diff --check`; build será executado antes do commit e publicação na `main`.
- O que falta: usar o novo pseudônimo nas próximas issues e tasks de automação e testes.
- Próximo responsável: Victor encaminha as demandas; `@ecossystem2` apoia integrações; `@ricardopablo1914-create` recebe automações e testes.

### 2026-07-28 — Clareza no módulo de fretes de retorno
- Responsável: IA: Codex
- Objetivo: substituir a nomenclatura ambígua “Carga de retorno” por uma comunicação mais clara para o usuário.
- Alterações: o menu passou a usar “Fretes de retorno”; os cards e oportunidades agora destacam “Encontre cargas para a viagem de volta”, com a explicação de que o trajeto de retorno pode reduzir o custo do frete.
- Arquivos: `src/main.js`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Validação: serão executados `npm run build`, `git diff --check` e teste HTTP local antes da publicação.
- O que falta: conectar as oportunidades de retorno a cargas e transportadoras reais por API.
- Próximo responsável: Victor valida o texto na interface; `@ecossystem2` define os dados do frete de retorno; `@ricardopablo1914-create` cobre a navegação e o fluxo com testes.

### 2026-07-28 — Mapa de cargas para fretes de retorno
- Responsável: IA: Codex
- Objetivo: criar uma tela dedicada para visualizar cargas próximas de finalizar e oportunidades de retorno em um mapa do Brasil.
- Alterações: adicionada tela `returnFreight` com mapa SVG estilizado, filtros de região e tipo de carga, alternância de rotas/regiões, marcadores interativos, resumo da oportunidade selecionada e cards com origem, destino, capacidade, transportadora, preço e prazo.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Validação: serão executados `npm run build`, `git diff --check` e teste HTTP local; inspeção visual automática pode ficar indisponível pelo erro do navegador embutido.
- O que falta: substituir o mapa demonstrativo por geolocalização/API de cargas reais e persistir solicitações de retorno.
- Próximo responsável: Victor valida a usabilidade do mapa; `@ecossystem2` define o contrato de cargas de retorno/localização; `@ricardopablo1914-create` cobre filtros, marcadores e solicitação de retorno.

### 2026-07-28 — Correção do contorno do mapa do Brasil
- Responsável: IA: Codex
- Objetivo: corrigir o mapa de rotas e regiões para que a representação visual corresponda ao território brasileiro.
- Alterações: substituído o contorno genérico por um SVG com silhueta brasileira mais detalhada, costa recortada, divisões regionais sutis e rótulos reposicionados; os marcadores, rotas, filtros e áreas de demanda continuam interativos.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Validação: serão executados `npm run build`, `git diff --check` e teste HTTP local; a inspeção visual automática permanece limitada pela falha do navegador embutido.
- O que falta: trocar a geometria demonstrativa por uma malha geográfica oficial/persistida quando o contrato de localização for definido.
- Próximo responsável: Victor valida a aderência visual; `@ecossystem2` define a fonte oficial de geolocalização; `@ricardopablo1914-create` cobre marcadores, filtros e rotas no mapa.

### 2026-07-28 — Mapa de rotas alinhado à referência do Brasil
- Responsável: IA: Codex
- Objetivo: aproximar a tela “Mapa de rotas e regiões” do mapa de referência enviado pelo produto.
- Alterações: redesenhado o SVG com silhueta mais fiel ao território brasileiro, formato alongado ao sul, recortes da costa e divisões internas em branco inspiradas nos limites estaduais da referência; adicionada máscara para manter as áreas de demanda dentro do território.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Validação: `npm run build`, `git diff --check`, teste HTTP local com resposta 200 e verificação estrutural do SVG concluídos; inspeção visual automática não foi possível devido à falha do navegador embutido.
- O que falta: substituir a geometria de referência por dados cartográficos oficiais quando a fonte de geolocalização for definida.
- Próximo responsável: Victor valida a semelhança visual; `@ecossystem2` define a fonte cartográfica oficial; `@ricardopablo1914-create` testa filtros, rotas e marcadores sobre as divisões estaduais.

### 2026-07-28 — Adaptação do mapa interativo do componente anexado
- Responsável: IA: Codex
- Objetivo: incorporar à tela de rotas e regiões os comportamentos apresentados no componente MapLibre/React enviado no prompt.
- Alterações: como o GadOn é um Vite vanilla sem React, Tailwind ou TypeScript, o comportamento foi portado para a implementação atual sem migrar o projeto; o mapa ganhou controles funcionais de localizar, ampliar e reduzir, seleção de marcadores, popup com detalhes da carga e ação de solicitar retorno.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Validação: `npm run build`, `git diff --check`, teste HTTP local com resposta 200 e verificação estrutural dos hooks de interação concluídos.
- O que falta: integrar uma fonte cartográfica oficial/MapLibre quando a dependência e os tiles forem aprovados para o ambiente; manter a geometria local como fallback offline.
- Próximo responsável: Victor valida o fluxo visual; `@ecossystem2` define fonte, licença e contrato cartográfico; `@ricardopablo1914-create` testa zoom, popup, filtros e solicitação de retorno.

### 2026-07-28 — Integração do mapa MapLibre do código anexado
- Responsável: IA: Codex
- Objetivo: substituir o mapa local da seção “Mapa de rotas e regiões” por uma implementação MapLibre compatível com o componente fornecido.
- Alterações: adicionada a dependência `maplibre-gl`; a tela agora inicializa um mapa navegável com estilo Carto claro, controles de zoom/localização, marcadores nativos, popups, pontos de demanda e rotas GeoJSON entre origem e destino das cargas filtradas.
- Arquivos: `package.json`, `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Validação: `npm run build`, `git diff --check` e teste HTTP local com resposta 200 concluídos; o build gera alerta informativo de chunk maior por causa do MapLibre.
- O que falta: configurar a fonte de tiles aprovada para produção, atribuição/licença definitiva e contrato de coordenadas vindo da API de fretes.
- Próximo responsável: Victor valida a experiência visual; `@ecossystem2` define tiles, geolocalização e contrato de rotas; `@ricardopablo1914-create` testa marcadores, popups, zoom, filtros e falhas de carregamento.

### 2026-07-28 — Correção da base branca do mapa MapLibre
- Responsável: IA: Codex
- Objetivo: corrigir a tela branca exibida quando o estilo remoto do Carto não entrega as marcações de base cartográfica.
- Alterações: substituído o estilo remoto por um estilo MapLibre local, com GeoJSON do contorno do Brasil, linhas internas de regiões, preenchimento, bordas, rotas e pontos de demanda; os marcadores e popups continuam usando MapLibre.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Validação: serão executados `npm run build`, `git diff --check`, teste HTTP local e verificação das fontes/camadas GeoJSON.
- O que falta: trocar a geometria demonstrativa por cartografia oficial e coordenadas persistidas quando o contrato da API estiver disponível.
- Próximo responsável: Victor valida a leitura visual; `@ecossystem2` define a fonte geográfica oficial; `@ricardopablo1914-create` testa o carregamento sem rede, rotas, pontos e popups.

### 2026-07-28 — Telas de Meu perfil e Favoritos
- Responsável: IA: Codex
- Objetivo: habilitar uma tela própria para gerenciamento da conta e outra para reunir os lotes favoritados como uma seleção de compra.
- Alterações: adicionadas as páginas `profile` e `favorites`; o perfil permite alterar nome, e-mail, telefone, foto, preferências e iniciar a troca de senha; favoritos exibe os lotes salvos, resumo de quantidade/valor de referência, remoção individual, detalhes do lote e negociação da seleção. Os dados de perfil e a lista de favoritos são mantidos no `localStorage` do navegador; a senha continua mascarada e apenas a data da atualização é registrada nesta demonstração.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: navegação de conta (`page: profile|favorites`), armazenamento local `gadon.profile.v1` e `gadon.favorites.v1`; não houve chamada de API.
- Validação: serão executados `npm run build`, `git diff --check`, teste HTTP local e verificações estruturais dos seletores/handlers das duas telas.
- O que falta: integrar autenticação, perfil, foto, preferências, senha com hash e favoritos a uma API; validar permissões, recuperação de senha e sincronização entre dispositivos.
- Próximo responsável: Victor valida a experiência e os textos; `@ecossystem2` define o contrato de conta/autenticação/favoritos; `@ricardopablo1914-create` automatiza os fluxos de edição, troca de senha, upload e negociação de favoritos.

### 2026-07-28 — Estado vazio do carrinho de favoritos
- Responsável: IA: Codex
- Objetivo: deixar clara a situação em que o usuário acessa Favoritos sem ter salvo nenhum lote.
- Alterações: quando não há favoritos, a tela passa a exibir uma página limpa, centralizada, com ícone de carrinho e a frase “Carrinho vazio”, sem cards ou ações adicionais.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Validação: serão executados `npm run build`, `git diff --check`, teste HTTP local e verificação do estado vazio e do ícone de carrinho.
- O que falta: definir, com o contrato de conta/favoritos, a mensagem remota e o estado vazio sincronizado entre dispositivos.
- Próximo responsável: Victor valida a apresentação; `@ecossystem2` define o estado oficial de favoritos; `@ricardopablo1914-create` testa a abertura do menu Favoritos sem itens.

### 2026-07-28 — Correção da alternância entre Favoritos e Meu perfil
- Responsável: IA: Codex
- Objetivo: garantir que os dois botões de conta continuem acessíveis e interativos em qualquer uma das telas selecionadas.
- Alterações: adicionados handlers explícitos para `data-account-page` no ciclo de binding das telas de perfil e favoritos; a delegação global foi preservada somente para os menus legados, evitando conflito ou perda de clique ao alternar entre as páginas.
- Arquivos: `src/main.js`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Validação: serão executados `npm run build`, `git diff --check`, teste HTTP local e verificação dos handlers de alternância.
- O que falta: cobrir a navegação com testes automatizados de navegador e substituir o estado local por autenticação/sessão de conta.
- Próximo responsável: Victor valida a troca entre as telas; `@ecossystem2` define a navegação de conta no contrato de sessão; `@ricardopablo1914-create` automatiza os cliques em Favoritos e Meu perfil nos dois sentidos.

### 2026-07-28 — Remoção do botão Histórico da conta
- Responsável: IA: Codex
- Objetivo: simplificar a seção “Conta” exibida na tela inicial e remover a opção “Histórico” conforme a decisão de produto.
- Alterações: removido o botão “Histórico” do menu de conta da página inicial, mantendo “Favoritos” e “Meu perfil” como opções disponíveis.
- Arquivos: `src/main.js`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Validação: serão executados `npm run build`, `git diff --check`, teste HTTP local e verificação da ausência do botão no template inicial.
- O que falta: decidir posteriormente se o histórico deve ser reintroduzido em outra área do produto ou descontinuado também no estado interno.
- Próximo responsável: Victor valida a navegação da tela inicial; `@ecossystem2` avalia o contrato de histórico; `@ricardopablo1914-create` testa o menu de conta sem o botão removido.

### 2026-07-28 — Tela Meus anúncios e estado vazio de produtos
- Responsável: IA: Codex
- Objetivo: habilitar o botão “Meus anúncios” para exibir os produtos cadastrados pelo usuário.
- Alterações: criada a página `announcements`, alimentada pelos registros `LOTE_HABILITADO` do diário de auditoria; quando não há cadastro, a interface mostra uma tela limpa com ícone de sacola e a frase “Nenhum Produto cadastrado!”. Quando existem registros, são exibidos cards com nome do lote, raça, quantidade, origem, finalidade, preço, status e protocolo do cadastro.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: navegação `data-nav="Meus anúncios"` e leitura local de `state.auditLog`; não houve chamada de API.
- Validação: serão executados `npm run build`, `git diff --check`, teste HTTP local e verificações estruturais do estado vazio, listagem e rota de navegação.
- O que falta: persistir os anúncios em API, permitir edição/pausa/publicação e sincronizar o status de verificação com o back-end.
- Próximo responsável: Victor valida a tela e os textos; `@ecossystem2` define o contrato de anúncios e status; `@ricardopablo1914-create` testa cadastro, navegação, estado vazio e listagem.

### 2026-07-28 — Login, criação de conta e logout
- Responsável: IA: Codex
- Objetivo: criar uma porta de entrada para o sistema e permitir que o usuário crie conta, entre e encerre a sessão.
- Alterações: adicionadas as telas iniciais de login e criação de conta, validação de e-mail/senha no protótipo, persistência local da sessão, atualização do perfil ao criar a conta e botão “Sair da conta” nas telas autenticadas. O fluxo de autenticação permanece separado do cadastro de gado.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: estado `authenticated`, armazenamento local `gadon.auth.v1`, rotas de tela `login` e `accountRegister`; não houve chamada de API.
- Validação: serão executados `npm run build`, `git diff --check`, teste HTTP local e verificações estruturais dos formulários e handlers de login/logout.
- O que falta: integrar autenticação real, hash de senha, recuperação de acesso, verificação de e-mail, sessão segura e autorização no back-end.
- Próximo responsável: Victor valida a experiência inicial; `@ecossystem2` define o contrato de autenticação/sessão; `@ricardopablo1914-create` automatiza criação de conta, login, logout, validações e recuperação futura.

### 2026-07-28 — Redesign da tela de criação de conta
- Responsável: IA: Codex
- Objetivo: alinhar a tela de criação de conta à referência visual enviada para o novo painel GadOn.
- Alterações: aplicado layout escuro em duas colunas, navegação “Início/Entrar”, marca GadOn, destaque “Comece agora”, título com acento laranja, campos Nome/Sobrenome/E-mail/Senha, alternância de visibilidade da senha, aceite de termos, botão “Criar com Google”, CTA “Criar conta”, aviso de segurança, curva pontilhada laranja, selo bovino e painel fotográfico com marca GadOn.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: formulário `account-registration-reference-form`; os dados continuam sendo enviados ao fluxo local de criação de conta.
- Validação: serão executados `npm run build`, `git diff --check`, teste HTTP local e verificações estruturais dos elementos da referência.
- O que falta: substituir a imagem demonstrativa por um asset/licença aprovado, integrar Google OAuth, termos reais e autenticação de produção.
- Próximo responsável: Victor valida aderência visual; `@ecossystem2` define OAuth e contrato de conta; `@ricardopablo1914-create` testa responsividade, validação e submissão do novo formulário.

### 2026-07-28 — Correção do fluxo visual de autenticação
- Responsável: IA: Codex
- Objetivo: garantir que o novo layout de referência seja exibido de forma consistente ao entrar e ao criar uma conta.
- Alterações: a tela de login também passou a usar o painel visual em duas colunas; o fluxo agora diferencia claramente “Entrar” e “Criar nova conta”, inclui alternância de senha e não utiliza mais a apresentação antiga no render inicial.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Validação: serão executados `npm run build`, `git diff --check`, teste HTTP local e verificação dos templates de login/cadastro servidos pelo endereço local.
- O que falta: integrar autenticação de produção, Google OAuth e validação visual automatizada no navegador.
- Próximo responsável: Victor confirma o fluxo exibido no navegador; `@ecossystem2` define a sessão oficial; `@ricardopablo1914-create` testa a alternância entre login e cadastro.

### 2026-07-28 — Reforço do separador visual do cadastro
- Responsável: IA: Codex
- Objetivo: tornar evidente a divisão entre o formulário de cadastro à esquerda e a imagem do animal à direita, conforme a referência enviada.
- Alterações: a curva tracejada laranja deixou de ocultar sua borda direita; a linha ganhou espessura, brilho e reposicionamento para funcionar como separador visual, e o selo bovino foi alinhado sobre a divisão.
- Arquivos: `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Validação: serão executados `npm run build`, `git diff --check`, teste HTTP local e verificação estrutural da borda direita tracejada.
- O que falta: validar a composição visual diretamente no navegador em diferentes larguras e substituir a imagem demonstrativa por asset/licença aprovado.
- Próximo responsável: Victor valida a aderência visual; `@ecossystem2` apoia a identidade visual; `@ricardopablo1914-create` cobre a validação responsiva.

### 2026-07-28 — Substituição da imagem do painel de cadastro
- Responsável: IA: Codex
- Objetivo: trocar a imagem externa anterior do painel direito pela foto de gado Nelore enviada para a tela de autenticação.
- Alterações: adicionada a foto em `public/nelore-cadastro.png` e atualizados os templates de login e criação de conta para carregarem o asset local, mantendo a curva tracejada e a identidade visual do painel.
- Arquivos: `public/nelore-cadastro.png`, `src/main.js`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: variável visual `--reference-cattle-image`; não houve alteração em autenticação, dados ou APIs.
- Validação: serão executados `npm run build`, `git diff --check`, teste HTTP local, verificação do asset e confirmação de que os dois templates usam `/nelore-cadastro.png`.
- O que falta: Victor validar o enquadramento visual da imagem em desktop e mobile; substituir o asset somente se houver uma versão oficial/licenciada aprovada.
- Próximo responsável: Victor valida a composição; `@ecossystem2` acompanha eventual necessidade de CDN; `@ricardopablo1914-create` testa o carregamento do asset nas duas telas.

### 2026-07-28 — Linha tracejada posicionada na divisão do cadastro
- Responsável: IA: Codex
- Objetivo: fazer a linha laranja funcionar como divisória central entre a tabela de cadastro e a foto do gado.
- Alterações: reposicionado o arco para a fronteira das duas colunas, reduzido o deslocamento para dentro da foto, elevado o painel visual apenas para manter o traço sobre a junção e alinhado o selo bovino ao novo eixo da divisão.
- Arquivos: `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente a composição visual das telas de login e criação de conta; nenhuma API ou regra de autenticação foi alterada.
- Validação: serão executados `npm run build`, `git diff --check`, teste HTTP local e verificação estrutural do posicionamento da curva e do selo.
- O que falta: Victor validar visualmente a posição em desktop e confirmar o comportamento responsivo, pois o painel fotográfico é ocultado abaixo de 780px.
- Próximo responsável: Victor valida a aderência à referência; `@ecossystem2` acompanha a identidade visual; `@ricardopablo1914-create` testa as larguras responsivas.

### 2026-07-28 — Divisória em “S” sobre as duas colunas
- Responsável: IA: Codex
- Objetivo: reproduzir a divisória curva da referência, fazendo o traço laranja atravessar visualmente o painel de cadastro e a foto do gado.
- Alterações: criada uma camada SVG independente das colunas com caminho tracejado em “S”, sobreposição central e selo bovino posicionado sobre a curva; a antiga curva restrita ao painel fotográfico foi ocultada. Em telas menores, o divisor é ocultado junto com a foto para preservar o fluxo de uma coluna.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente a composição visual das telas de login e criação de conta; sem alteração em autenticação, dados ou APIs.
- Validação: serão executados `npm run build`, `git diff --check`, teste HTTP local e verificações estruturais do SVG, do z-index e do comportamento responsivo.
- O que falta: Victor validar a curva em diferentes proporções de tela e confirmar se o ponto do selo coincide com a referência final.
- Próximo responsável: Victor valida a direção de arte; `@ecossystem2` acompanha a identidade visual; `@ricardopablo1914-create` testa desktop, tablet e mobile.

### 2026-07-28 — Máscaras de fundo alinhadas à divisória em “S”
- Responsável: IA: Codex
- Objetivo: impedir que o fundo escuro e a foto do gado ultrapassem o limite visual definido pela linha laranja.
- Alterações: o fundo escuro passou a ser a base do cartão; a foto Nelore foi movida para uma camada recortada por `clip-path` com o mesmo contorno em “S” da divisória; os fundos individuais dos painéis ficaram transparentes para evitar vazamentos e a máscara é desativada no mobile junto com a foto.
- Arquivos: `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente a composição visual das telas de login e criação de conta; sem alteração em autenticação, dados ou APIs.
- Validação: serão executados `npm run build`, `git diff --check`, teste HTTP local e verificações estruturais da máscara, da camada SVG e do modo responsivo.
- O que falta: Victor validar visualmente o encaixe da máscara em diferentes larguras e confirmar se o recorte acompanha exatamente o traçado aprovado.
- Próximo responsável: Victor valida a direção de arte; `@ecossystem2` acompanha a identidade visual; `@ricardopablo1914-create` testa as larguras desktop, tablet e mobile.

### 2026-07-28 — Refinamento do contorno da máscara em “S”
- Responsável: IA: Codex
- Objetivo: eliminar os vazamentos laterais entre a foto do gado, o fundo escuro e a linha tracejada laranja.
- Alterações: substituída a aproximação com poucos segmentos por uma sequência densa de pontos baseada na mesma curva Bézier do SVG da divisória; o `clip-path` agora acompanha o contorno em toda a altura do cartão.
- Arquivos: `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: apenas as camadas visuais do cadastro/login; sem alteração em autenticação, dados ou APIs.
- Validação: serão executados `npm run build`, `git diff --check`, teste HTTP local e verificação estrutural da coincidência entre o `clip-path` refinado e o caminho SVG.
- O que falta: Victor confirmar visualmente o recorte final em desktop e tablet.
- Próximo responsável: Victor valida o acabamento; `@ecossystem2` acompanha a identidade visual; `@ricardopablo1914-create` testa diferentes larguras.

### 2026-07-28 — Atualização das logos da tela de autenticação
- Responsável: IA: Codex
- Objetivo: substituir as marcas textuais dos cantos superior esquerdo e inferior direito pelo logo GadOn enviado pelo usuário.
- Alterações: criada a versão transparente `public/gadon-logo-transparent.png`, mantendo o lettering, cores, slogan e silhueta bovina da referência; o mesmo asset passou a compor a marca superior e a marca inferior, sem fundo retangular sobre a foto.
- Arquivos: `public/gadon-logo-transparent.png`, `public/gadon-logo-reference.png`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente a identidade visual das telas de login e criação de conta; sem alteração em autenticação, dados ou APIs.
- Validação: serão executados `npm run build`, `git diff --check`, teste HTTP local, verificação de carregamento dos dois assets e validação de transparência nos cantos da imagem.
- O que falta: Victor validar tamanho e posição finais em desktop/tablet; substituir o asset se houver versão vetorial oficial aprovada.
- Próximo responsável: Victor valida a direção de arte; `@ecossystem2` acompanha a identidade visual; `@ricardopablo1914-create` testa o carregamento das logos em diferentes larguras.

### 2026-07-28 — Ícone bovino branco no selo da divisória
- Responsável: IA: Codex
- Objetivo: substituir visualmente o ícone laranja dentro do círculo azul por uma cabeça de gado branca.
- Alterações: reforçada a regra específica do selo da divisória para aplicar branco ao traçado do ícone bovino, mantendo o círculo azul e a borda laranja.
- Arquivos: `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: apenas o selo visual da divisória em “S”; sem alteração em autenticação, dados ou APIs.
- Validação: serão executados `npm run build`, `git diff --check`, teste HTTP local e verificação estrutural da cor branca no SVG do selo.
- O que falta: Victor confirmar o contraste final do ícone sobre o azul em desktop e tablet.
- Próximo responsável: Victor valida a direção de arte; `@ecossystem2` acompanha a identidade visual; `@ricardopablo1914-create` testa a renderização responsiva.

### 2026-07-28 — Reforço visual do ícone bovino branco
- Responsável: IA: Codex
- Objetivo: garantir que o ícone do selo seja exibido em branco mesmo quando houver cor herdada ou cache de estilos anteriores.
- Alterações: adicionados `stroke` e `fill` com prioridade máxima e filtro de conversão para branco diretamente no SVG do selo da divisória.
- Arquivos: `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente a renderização do selo da divisória; sem alteração em autenticação, dados ou APIs.
- Validação: serão executados `npm run build`, `git diff --check`, teste HTTP local e confirmação da regra reforçada no CSS servido pelo Vite.
- O que falta: Victor atualizar a tela com `Ctrl + F5` e confirmar a visualização final.
- Próximo responsável: Victor valida o resultado; `@ecossystem2` acompanha a identidade visual; `@ricardopablo1914-create` testa a renderização responsiva.

### 2026-07-28 — Ícone bovino da referência e marca oficial do Google
- Responsável: IA: Codex
- Objetivo: usar a cabeça de gado branca enviada pelo usuário dentro do círculo azul da divisória e corrigir o ícone do botão de autenticação com a marca multicolorida do Google.
- Alterações: criada uma versão com fundo transparente da cabeça bovina (`public/cattle-head-transparent.png`) a partir da imagem de referência; o asset passou a substituir o SVG anterior dentro do selo. Criado `public/google-g.svg` com o “G” multicolorido e aplicado visualmente nos botões “Entrar com Google” e “Criar com Google”, preservando o texto e os fluxos atuais.
- Arquivos: `public/cattle-head-source.png`, `public/cattle-head-transparent.png`, `public/google-g.svg`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente a identidade visual da autenticação; sem alteração em autenticação, dados, APIs ou contratos entre equipes.
- Validação: executar `npm run build`, `git diff --check`, teste HTTP dos dois assets e checagem de transparência nos cantos da cabeça bovina.
- O que falta: Victor atualizar a tela com `Ctrl + F5` e validar o tamanho/contraste do selo e do “G” em desktop e mobile.
- Próximo responsável: Victor valida a direção de arte; `@ecossystem2` acompanha a identidade visual; `@ricardopablo1914-create` testa a renderização responsiva e o carregamento dos assets.

### 2026-07-28 — Login por e-mail ou nome de usuário
- Responsável: IA: Codex
- Objetivo: permitir que o usuário entre pela opção de e-mail usando tanto o e-mail cadastrado quanto o nome de usuário.
- Alterações: o campo de identificação das telas de login passou a aceitar texto livre, com rótulo e placeholder indicando “E-mail ou nome de usuário”; a validação mantém o formato obrigatório para e-mails quando o identificador contém `@`, aceita nomes de usuário e preserva o identificador informado no perfil local da demonstração.
- Arquivos: `src/main.js`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente o fluxo de autenticação local do front-end; não houve alteração de API, persistência remota ou contrato back-end. Não é necessária task de integração nesta etapa.
- Validação: executar `npm run build`, `git diff --check`, verificação estática dos dois formulários de login e teste HTTP da aplicação.
- O que falta: Victor validar os dois formatos no navegador; `@ecossystem2` deverá definir o contrato de autenticação quando o back-end for conectado; `@ricardopablo1914-create` deverá adicionar casos de teste para e-mail, nome de usuário e identificador inválido.
- Próximo responsável: Victor valida a experiência; `@ecossystem2` define a autenticação de produção; `@ricardopablo1914-create` automatiza os cenários.

### 2026-07-28 — Atualização da logo do menu lateral
- Responsável: IA: Codex
- Objetivo: substituir somente a logo compacta exibida no menu lateral pela nova logo GadOn da imagem de referência, mantendo os demais elementos da interface.
- Alterações: a marca lateral passou a usar `public/gadon-logo-transparent.png`, com o lettering GadOn colorido e o slogan branco da nova referência; o bloco textual antigo e o recorte circular anterior foram removidos apenas dessa composição visual, sem alterar navegação, perfil ou outros logos da autenticação.
- Arquivos: `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente identidade visual do menu lateral e do cabeçalho de cadastro que reutiliza a classe de marca; sem alteração em autenticação, dados ou APIs.
- Validação: executar `npm run build`, `git diff --check`, teste HTTP do asset `/gadon-logo-transparent.png` e verificação estática de que a marca lateral referencia o asset novo.
- O que falta: Victor validar o tamanho e o enquadramento da logo em desktop e mobile; não há task de back-end nesta alteração.
- Próximo responsável: Victor valida a direção de arte; `@ecossystem2` acompanha a identidade visual; `@ricardopablo1914-create` testa a renderização responsiva.

### 2026-07-28 — Foto Nelore no painel inicial e modo escuro
- Responsável: IA: Codex
- Objetivo: substituir a ilustração do painel principal pela foto de gado enviada e disponibilizar uma opção de modo escuro no sistema.
- Alterações: adicionada `public/home-hero-nelore.png` com a foto da imagem 2 e aplicada como imagem de fundo do hero inicial, mantendo o texto, o CTA e o indicador de lotes. Criado o botão global `#theme-toggle`, com rótulo, ícone, estado acessível e preferência persistida em `localStorage`; adicionados tokens e ajustes de contraste para as principais telas, cartões, formulários, modais e áreas de operação no modo escuro.
- Arquivos: `public/home-hero-nelore.png`, `index.html`, `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente apresentação e preferência local do front-end; sem alteração em APIs, autenticação, dados de negócio ou contratos entre equipes. Não é necessária task de back-end nesta etapa.
- Validação: executar `npm run build`, `git diff --check`, teste HTTP da aplicação e do novo asset, além de verificação estática do controle, persistência e atributos acessíveis do tema.
- O que falta: Victor validar o enquadramento da foto e o contraste das telas em claro/escuro; `@ecossystem2` deverá considerar o tema no contrato de preferências quando houver persistência remota; `@ricardopablo1914-create` deverá testar a alternância, recarga e responsividade.
- Próximo responsável: Victor valida a experiência visual; `@ecossystem2` avalia persistência futura; `@ricardopablo1914-create` automatiza os cenários de tema.

### 2026-07-28 — Refinamento visual das telas internas
- Responsável: IA: Codex
- Objetivo: aproximar o restante do sistema do acabamento circular da página de login, com menos pontas retas e mais detalhes laranja interativos.
- Alterações: criada uma camada visual compartilhada para as telas autenticadas, arredondando cards, painéis, navegação, campos, botões e modais; adicionadas sombras suaves, barras de destaque laranja, estados de hover e cápsulas para status e links. A camada inclui ajustes específicos para claro e escuro e mantém o layout responsivo.
- Arquivos: `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente apresentação e interação visual do front-end; sem alteração em APIs, autenticação, dados ou contratos entre equipes. Não é necessária task de back-end nesta etapa.
- Validação: executar `npm run build`, `git diff --check`, teste HTTP da aplicação e verificação estática dos novos raios, acentos laranja e regras de modo escuro.
- O que falta: Victor revisar a direção de arte nas telas de início, busca, mensagens, fretes, perfil e favoritos; `@ricardopablo1914-create` testar hover, foco, mobile e contraste nos dois temas.
- Próximo responsável: Victor valida a identidade visual; `@ecossystem2` acompanha eventual necessidade de tokens compartilhados; `@ricardopablo1914-create` automatiza os estados interativos.

### 2026-07-28 — Adaptação responsiva para mobile
- Responsável: IA: Codex
- Objetivo: preparar a experiência do marketplace para telas de celular, mantendo navegação intuitiva, leitura confortável e harmonia entre fotos, cards e ações.
- Alterações: adicionados breakpoints de 720px e 560px para reorganizar o cabeçalho, hero com foto, estatísticas, filtros, lotes, operações e indicadores; cards passam a usar duas colunas em telas intermediárias e uma coluna em telas estreitas. Mensagens, fretes, carga de retorno, perfil, favoritos, anúncios, calendários, tabelas, documentos e modais receberam ajustes de espaçamento, empilhamento, rolagem horizontal controlada e alvos de toque maiores.
- Arquivos: `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente apresentação e responsividade do front-end; sem alteração em APIs, autenticação, dados ou contratos entre equipes. Não é necessária task de back-end nesta etapa.
- Validação: executar `npm run build`, `git diff --check`, teste HTTP da aplicação e verificação estática das regras mobile; conferir também o comportamento em viewport estreita no navegador.
- O que falta: Victor validar o enquadramento final das fotos e a navegação em um aparelho real; `@ricardopablo1914-create` testar os fluxos de toque, teclado virtual, rolagem e modais; `@ecossystem2` acompanhar eventuais necessidades de contratos para preferências mobile.
- Próximo responsável: Victor valida a experiência visual; `@ricardopablo1914-create` automatiza a regressão responsiva; `@ecossystem2` avalia impactos de integração.

### 2026-07-28 — Cards de indicadores em grade 2×2 no mobile
- Responsável: IA: Codex
- Objetivo: compactar os cards de indicadores na tela pequena sem perder a leitura das informações nem a ação de cargas de retorno.
- Alterações: a partir de 560px de largura, os quatro cards passam a ocupar uma grade 2×2; ícones, tipografia, espaçamento e chamada de retorno foram reduzidos proporcionalmente para evitar desperdício vertical e manter os alvos interativos acessíveis.
- Arquivos: `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente apresentação responsiva do front-end; sem alteração em APIs, autenticação, dados ou contratos entre equipes. Não é necessária task de back-end nesta etapa.
- Validação: executar `npm run build`, `git diff --check`, teste HTTP e verificação estática da grade 2×2 no breakpoint mobile.
- O que falta: Victor validar a densidade visual em aparelho real; `@ricardopablo1914-create` testar toque, foco e leitura dos quatro cards em telas estreitas.
- Próximo responsável: Victor valida a composição visual; `@ricardopablo1914-create` automatiza a regressão responsiva.

### 2026-07-28 — Menu hamburguer e CTAs mobile
- Responsável: IA: Codex
- Objetivo: centralizar a navegação e as preferências no menu hamburguer mobile e tornar as ações de compra e logística mais claras e interativas.
- Alterações: criado um drawer mobile com as seções do site, perfil com iniciais do usuário, favoritos, Meu perfil, logout e alternância de modo escuro; os itens navegam diretamente entre as telas e o avatar do cabeçalho fica concentrado no menu. Os botões `Selecionar` e `Ver lote` ganharam maior área de toque, contraste e destaque. O card `Inteligência logística` foi reorganizado e o botão `Ver oportunidades` recebeu animação de pulso e brilho sutil.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: apresentação, navegação local e preferência de tema do front-end; sem alteração em APIs, autenticação, persistência remota ou contratos entre equipes. Não é necessária task de back-end nesta etapa.
- Validação: executar `npm run build`, `git diff --check`, teste HTTP e verificação estática do drawer, navegação, modo escuro, alvos de toque e animação logística.
- O que falta: Victor validar a abertura/fechamento do drawer e a densidade dos CTAs em aparelho real; `@ricardopablo1914-create` testar navegação mobile, logout, alternância de tema, foco e acessibilidade do menu.
- Próximo responsável: Victor valida a experiência visual; `@ricardopablo1914-create` automatiza a regressão dos fluxos mobile.

### 2026-07-28 — Contraste do seletor no modo escuro mobile
- Responsável: IA: Codex
- Objetivo: corrigir a baixa legibilidade do botão de ordenação `Mais relevantes` quando o modo escuro está ativo em telas pequenas.
- Alterações: o seletor `.sort-select` passou a usar fundo azul-escuro, borda contrastante, texto claro e esquema de cores escuro também nas opções nativas do navegador, mantendo a integração visual com o botão de filtros.
- Arquivos: `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente contraste e apresentação responsiva do front-end; sem alteração em APIs, autenticação, dados ou contratos entre equipes. Não é necessária task de back-end nesta etapa.
- Validação: executar `npm run build`, `git diff --check`, teste HTTP e verificação estática das cores do seletor no tema escuro.
- O que falta: Victor validar a leitura no aparelho real e em diferentes navegadores mobile; `@ricardopablo1914-create` testar foco, abertura das opções e contraste no modo escuro.
- Próximo responsável: Victor valida a experiência visual; `@ricardopablo1914-create` automatiza a regressão de tema e filtros.

### 2026-07-28 — Menu sem barra visível e cards de frete compactos
- Responsável: IA: Codex
- Objetivo: melhorar a navegação mobile e reduzir o espaço ocupado pela área de Operação de Frete, mantendo legibilidade no modo escuro.
- Alterações: a barra visual de rolagem do menu hamburguer foi ocultada sem remover a rolagem; as seções Buscar gado, Meus anúncios, Mensagens, Fretes, Fretes de retorno, Favoritos e Meu perfil permanecem ligadas às mesmas navegações e ações da versão desktop. Os cards de estatísticas e módulos de frete foram compactados, passando os módulos para duas colunas em telas estreitas, com superfícies, bordas e textos próprios para o tema escuro.
- Arquivos: `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente navegação local, apresentação responsiva e contraste do front-end; sem alteração em APIs, autenticação, dados ou contratos entre equipes. Não é necessária task de back-end nesta etapa.
- Validação: executar `npm run build`, `git diff --check`, teste HTTP e verificação estática dos itens do menu, barra de rolagem oculta, grade mobile e cores do modo escuro.
- O que falta: Victor validar a densidade dos cards e o menu em aparelho real; `@ricardopablo1914-create` testar as sete rotas do menu, o foco do drawer e os dois temas.
- Próximo responsável: Victor valida a experiência visual; `@ricardopablo1914-create` automatiza a regressão das rotas mobile e dos cards de frete.

### 2026-07-28 — Contraste da gestão de documentos no modo escuro
- Responsável: IA: Codex
- Objetivo: tornar o painel de histórico da Gestão de Documentos legível no modo escuro mobile.
- Alterações: o modal de todos os documentos recebeu superfícies escuras, bordas contrastantes, títulos e metadados claros, contadores diferenciados, abas de filtro acessíveis e estados de documento emitido/pendente ajustados para o tema escuro.
- Arquivos: `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente apresentação e contraste do front-end; sem alteração em APIs, autenticação, documentos ou contratos entre equipes. Não é necessária task de back-end nesta etapa.
- Validação: executar `npm run build`, `git diff --check`, teste HTTP e verificação estática dos estilos do painel no tema escuro.
- O que falta: Victor validar a leitura do painel em aparelho real; `@ricardopablo1914-create` testar abas Todos, Emitidos e Pendentes, abertura do anexo e inclusão de documentos nos dois temas.
- Próximo responsável: Victor valida a experiência visual; `@ricardopablo1914-create` automatiza a regressão da Gestão de Documentos.

### 2026-07-28 — Rolagem horizontal oculta na Gestão de Documentos
- Responsável: IA: Codex
- Objetivo: remover a barra de rolagem lateral visível no painel mobile de Gestão de Documentos sem impedir a consulta vertical dos registros.
- Alterações: o modal, o backdrop, a lista e as linhas de documentos passaram a limitar a largura e ocultar overflow horizontal em telas de até 720px, mantendo apenas a rolagem vertical do histórico.
- Arquivos: `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente comportamento visual e rolagem do front-end; sem alteração em APIs, autenticação, documentos ou contratos entre equipes. Não é necessária task de back-end nesta etapa.
- Validação: executar `npm run build`, `git diff --check`, teste HTTP e verificação estática de overflow horizontal oculto.
- O que falta: Victor validar a navegação vertical do histórico em aparelho real; `@ricardopablo1914-create` testar documentos longos e diferentes larguras mobile.
- Próximo responsável: Victor valida a experiência visual; `@ricardopablo1914-create` automatiza a regressão de rolagem.

### 2026-07-28 — Barra vertical oculta na Gestão de Documentos
- Responsável: IA: Codex
- Objetivo: ocultar também o indicador visual da rolagem vertical no painel mobile, mantendo o deslocamento por toque e gesto.
- Alterações: adicionados estilos de scrollbar invisível para navegadores baseados em Chromium/WebKit, Firefox e Internet Explorer/Edge legado no modal de documentos; o histórico continua com `overflow-y: auto`.
- Arquivos: `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente apresentação e rolagem do front-end; sem alteração em APIs, autenticação, documentos ou contratos entre equipes. Não é necessária task de back-end nesta etapa.
- Validação: executar `npm run build`, `git diff --check`, teste HTTP e verificação estática da scrollbar invisível com rolagem vertical preservada.
- O que falta: Victor validar o gesto de rolagem no aparelho real; `@ricardopablo1914-create` testar o histórico longo com toque e teclado virtual.
- Próximo responsável: Victor valida a experiência visual; `@ricardopablo1914-create` automatiza a regressão de rolagem mobile.

### 2026-07-28 — Auditoria de contraste claro e escuro em todas as abas
- Responsável: IA: Codex
- Objetivo: garantir leitura consistente nas versões desktop e mobile, tanto no modo claro quanto no modo escuro.
- Alterações: criada uma camada visual centralizada para corrigir superfícies, bordas, títulos, textos auxiliares, campos, seletores, estados vazios, tabelas, modais e controles das telas de pesquisa, mensagens, fretes, fretes de retorno, perfil, favoritos, anúncios, gestão de documentos, calendário, tabela completa de rotas e autenticação. Estados de sucesso, pendência, feriado e erro foram preservados com cores próprias; os controles nativos receberam `color-scheme` adequado e todos os campos ganharam foco visível.
- Arquivos: `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente apresentação, acessibilidade visual e responsividade do front-end; sem alteração em APIs, autenticação, dados ou contratos entre equipes. Não é necessária task de back-end nesta etapa.
- Validação: `npm run build` concluído; `git diff --check` concluído; confirmar a aplicação em `http://127.0.0.1:5173/` e revisar cada rota nos dois temas em viewport desktop e mobile.
- O que falta: Victor validar a leitura final em aparelho real e monitor; `@ricardopablo1914-create` testar regressão visual das rotas, foco, campos, tabelas, modais e estados vazios nos dois temas; `@ecossystem2` acompanhar eventuais impactos de integração.
- Próximo responsável: Victor valida a experiência visual; `@ricardopablo1914-create` automatiza a regressão de tema e acessibilidade; `@ecossystem2` avalia impactos de integração.

### 2026-07-29 — Conversas mobile e rolagem das tabelas de frete
- Responsável: IA: Codex
- Objetivo: melhorar a usabilidade da aba Conversas em telas pequenas e remover indicadores visuais de rolagem nas tabelas de distância e rotas contratadas.
- Alterações: a tela mobile de mensagens recebeu hierarquia de cabeçalho, lista de conversas com maior área de toque, avatares destacados, busca arredondada, chat separado, balões compactos e compositor circular para anexos, áudio e envio. A lista e o histórico de mensagens continuam navegáveis por toque, porém sem barra vertical visível. `Tabela de Distância` passou a ocultar a barra horizontal mantendo a navegação por gesto; `Rotas contratadas` passou a ocultar as barras horizontal e vertical no modal e na tabela, sem remover o acesso aos registros.
- Arquivos: `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente apresentação, interação por toque e rolagem do front-end; sem alteração em APIs, mensagens, fretes, dados ou contratos entre equipes. Não é necessária task de back-end nesta etapa.
- Validação: `npm run build` concluído; `git diff --check` concluído; revisar a aba de mensagens, a Tabela de Distância e Rotas contratadas em viewport mobile nos temas claro e escuro.
- O que falta: Victor validar a experiência em aparelho real e confirmar a semelhança visual desejada com mensageiros; `@ricardopablo1914-create` testar seleção de conversas, busca, anexos, áudio, gestos de rolagem e tabelas longas; `@ecossystem2` acompanhar eventuais necessidades de persistência ou contratos para mensagens.
- Próximo responsável: Victor valida a experiência visual; `@ricardopablo1914-create` automatiza a regressão mobile; `@ecossystem2` avalia impactos de integração caso a navegação evolua para dados remotos.

### 2026-07-29 — Contraste da visão consolidada e rolagem da agenda mobile
- Responsável: IA: Codex
- Objetivo: tornar a seção `Visão consolidada` legível no modo noturno e ocultar a barra vertical da `Agenda de viagens` em telas mobile.
- Alterações: o painel de todas as viagens recebeu superfícies escuras, bordas, títulos, métricas, descrições, rotas e status com contraste reforçado. O diálogo da agenda passou a manter `overflow-y: auto` para navegação por toque, ocultando a barra vertical em navegadores WebKit, Firefox e Edge legado.
- Arquivos: `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente apresentação, contraste e rolagem do front-end; sem alteração em APIs, viagens, dados ou contratos entre equipes. Não é necessária task de back-end nesta etapa.
- Validação: `npm run build` concluído; `git diff --check` concluído; verificar a agenda e a visão consolidada em viewport mobile nos temas claro e escuro.
- O que falta: Victor validar a leitura final em aparelho real; `@ricardopablo1914-create` testar calendário, lista consolidada, gesto de rolagem e alternância de tema; `@ecossystem2` acompanhar eventuais necessidades de persistência caso o painel passe a consumir dados remotos.
- Próximo responsável: Victor valida a experiência visual; `@ricardopablo1914-create` automatiza a regressão mobile; `@ecossystem2` avalia impactos de integração se necessário.

### 2026-07-29 — Painel de criação de conta mobile baseado na referência visual
- Responsável: IA: Codex
- Objetivo: aproximar a tela mobile de criação de conta do layout enviado, mantendo os elementos do fluxo de cadastro do GadOn.
- Alterações: a composição mobile passou a usar cartão escuro arredondado, logo e ação `Entrar` no topo, imagem de gado no cabeçalho, máscara curva entre imagem e formulário, linha tracejada laranja com selo circular de gado, formulário empilhado com campos de nome, sobrenome, e-mail e senha, termos, botão Google, CTA `Criar conta` e aviso de segurança. Foi adicionado um traçado SVG específico para a curva mobile sem remover a versão desktop.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente apresentação responsiva e composição visual do front-end; o formulário, validações e eventos de criação de conta continuam os mesmos, sem alteração em APIs, autenticação ou contratos entre equipes. Não é necessária task de back-end nesta etapa.
- Validação: `npm run build` concluído; `git diff --check` concluído; revisar a tela de criação de conta em viewport mobile, incluindo foco dos campos, termos, Google e envio do formulário.
- O que falta: Victor validar o enquadramento da foto e a posição da curva em aparelho real; `@ricardopablo1914-create` testar cadastro, senha, termos, Google, retorno ao login e diferentes larguras; `@ecossystem2` acompanhar eventuais necessidades futuras de integração de autenticação.
- Próximo responsável: Victor valida a experiência visual; `@ricardopablo1914-create` automatiza a regressão do cadastro mobile; `@ecossystem2` avalia impactos de integração quando o cadastro real for conectado.

### 2026-07-29 — Refinamento da divisória curva no cadastro mobile
- Responsável: IA: Codex
- Objetivo: afastar a linha tracejada laranja do título do formulário e impedir vazamentos entre a área da foto e o painel escuro.
- Alterações: a divisória mobile foi reposicionada para cima sem mover o conteúdo do cadastro. A máscara da foto foi alinhada ao novo caminho curvo e foi criada uma máscara complementar escura sobre a área inferior do cartão; ambas seguem a mesma geometria aproximada do traçado SVG. O selo de gado continua sobreposto à linha.
- Arquivos: `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente composição visual responsiva do front-end; sem alteração em autenticação, eventos, dados ou contratos entre equipes. Não é necessária task de back-end nesta etapa.
- Validação: `npm run build` concluído; `git diff --check` concluído; verificar login e criação de conta em viewport mobile, incluindo título, linha, foto e bordas do cartão.
- O que falta: Victor validar a posição final em aparelhos com diferentes alturas; `@ricardopablo1914-create` testar login, criação de conta e regressão visual em larguras estreitas; `@ecossystem2` acompanhar eventuais integrações futuras de autenticação.
- Próximo responsável: Victor valida a experiência visual; `@ricardopablo1914-create` automatiza a regressão dos dois fluxos de autenticação.

### 2026-07-29 — Máscara SVG alinhada à divisória do cadastro mobile
- Responsável: IA: Codex
- Objetivo: eliminar os vazamentos residuais entre a foto do gado, o fundo escuro e a linha tracejada laranja.
- Alterações: adicionada uma forma SVG preenchida para a máscara inferior, reutilizando exatamente o mesmo caminho Bézier da divisória mobile. O recorte aproximado foi substituído por uma camada inferior sincronizada com o traçado; a foto permanece limitada ao cartão e o preenchimento escuro cobre toda a área abaixo da curva.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente composição visual responsiva do front-end; sem alteração em autenticação, eventos, dados ou contratos entre equipes. Não é necessária task de back-end nesta etapa.
- Validação: `npm run build` concluído; `git diff --check` concluído; verificar o contorno da máscara e o selo de gado em login e criação de conta mobile.
- O que falta: Victor validar a ausência de vazamentos em aparelhos reais e diferentes alturas; `@ricardopablo1914-create` testar a regressão visual dos dois fluxos de autenticação; `@ecossystem2` acompanhar futuras integrações de autenticação.
- Próximo responsável: Victor valida a experiência visual; `@ricardopablo1914-create` automatiza a regressão mobile.

### 2026-07-29 — Legibilidade da logo e do botão Entrar no login mobile
- Responsável: IA: Codex
- Objetivo: melhorar a visualização dos elementos do cabeçalho da autenticação sobre a foto de gado em telas pequenas.
- Alterações: criada uma faixa escura translúcida com leve desfoque atrás do cabeçalho, aumentada a área útil da logo GadOn com sombra e fundo de proteção, e transformado o texto `Entrar` em uma ação azul com borda, preenchimento e sombra de alto contraste.
- Arquivos: `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente apresentação responsiva da autenticação; sem alteração em login, cadastro, dados ou contratos entre equipes. Não é necessária task de back-end nesta etapa.
- Validação: `npm run build` concluído; `git diff --check` concluído; verificar o cabeçalho de login e criação de conta em diferentes larguras mobile.
- O que falta: Victor validar a leitura em aparelho real sobre diferentes recortes da foto; `@ricardopablo1914-create` testar foco, toque no botão `Entrar` e regressão dos dois fluxos de autenticação; `@ecossystem2` acompanhar futuras integrações de autenticação.
- Próximo responsável: Victor valida a experiência visual; `@ricardopablo1914-create` automatiza a regressão de autenticação mobile.

### 2026-07-29 — CTAs laranja na operação de frete
- Responsável: IA: Codex
- Objetivo: alinhar os botões `Cotar frete` e `Ver oportunidades` ao padrão visual dos demais CTAs do sistema.
- Alterações: os dois botões passaram a reutilizar a classe `primary-button`, com fundo laranja, texto branco, cantos arredondados, sombra e estados de interação consistentes; a animação do botão `Ver oportunidades` foi preservada.
- Arquivos: `src/main.js`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente apresentação e navegação local do front-end; sem alteração em APIs, fretes, dados ou contratos entre equipes. Não é necessária task de back-end nesta etapa.
- Validação: executar `npm run build`, `git diff --check` e revisar estaticamente as classes dos dois CTAs.
- O que falta: Victor validar a hierarquia visual dos CTAs em desktop e mobile; `@ricardopablo1914-create` testar foco, toque, animação e navegação dos botões; `@ecossystem2` acompanhar futuras integrações de cotação e oportunidades.
- Próximo responsável: Victor valida a experiência visual; `@ricardopablo1914-create` automatiza a regressão dos CTAs.

### 2026-07-29 — Ajuste de escala do CTA de oportunidades
- Responsável: IA: Codex
- Objetivo: reduzir discretamente o tamanho do botão `Ver oportunidades` sem perder destaque no card de inteligência logística.
- Alterações: reduzidos padding, altura mínima, raio e tamanho da fonte do CTA em desktop e mobile; a cor laranja, o contraste e as animações de pulso/brilho foram mantidos.
- Arquivos: `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente apresentação responsiva do front-end; sem alteração em APIs, fretes, dados ou contratos entre equipes. Não é necessária task de back-end nesta etapa.
- Validação: executar `npm run build`, `git diff --check` e revisar o CTA em desktop e mobile.
- O que falta: Victor validar a proporção final do botão no card; `@ricardopablo1914-create` testar foco, toque, animação e navegação; `@ecossystem2` acompanhar futuras integrações de oportunidades.
- Próximo responsável: Victor valida a experiência visual; `@ricardopablo1914-create` automatiza a regressão do CTA.

### 2026-07-29 — Simplificação do card de inteligência logística
- Responsável: IA: Codex
- Objetivo: remover a indicação visual `GO — MT` que poluía o card `Inteligência logística`.
- Alterações: retirado o elemento decorativo da rota no card, preservando o título, a descrição, o CTA laranja e a navegação para fretes de retorno.
- Arquivos: `src/main.js`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente apresentação do front-end; sem alteração em APIs, fretes, dados ou contratos entre equipes. Não é necessária task de back-end nesta etapa.
- Validação: executar `npm run build`, `git diff --check` e revisar estaticamente a ausência do texto `GO`/`MT` no card.
- O que falta: Victor validar o equilíbrio visual do card após a remoção; `@ricardopablo1914-create` testar a navegação do CTA; `@ecossystem2` acompanhar futuras integrações de rotas.
- Próximo responsável: Victor valida a experiência visual; `@ricardopablo1914-create` automatiza a regressão do card.

### 2026-07-30 — Perfil vendedor e comprovação da propriedade
- Responsável: IA: Codex
- Objetivo: permitir que o perfil comprador acesse um modo vendedor com dados comerciais, identificação da fazenda e documentação de suporte para publicar gado.
- Alterações: adicionado o acesso `Abrir perfil vendedor` dentro do perfil comprador; criada a tela de perfil vendedor com dados do produtor, CPF/CNPJ, contato comercial, fazenda, município, UF, registro da propriedade, inscrição estadual, situação de vacinação, rastreabilidade e upload de comprovantes de vacinação e documentos da propriedade. O modo vendedor também oferece `Cadastrar gado completo`, reutilizando o formulário de lote com raça, quantidade, sexo, idade, peso, preço, origem, sanidade, fotos e documentos.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: a interface armazena somente estado demonstrativo e nomes de arquivos no `localStorage`; a validação de identidade, armazenamento seguro dos documentos, análise jurídica e publicação dependem de autenticação, API e persistência de back-end.
- Validação: `npm run build` concluído; `git diff --check` concluído; verificar navegação comprador → vendedor, salvamento local, anexos, modo escuro e acesso ao cadastro completo em mobile e desktop.
- O que falta: `@ecossystem2` definir contrato de vendedor, verificação de CPF/CNPJ, propriedade e armazenamento de documentos; `@ricardopablo1914-create` testar upload, validação, retorno ao perfil comprador e regressão responsiva; Victor validar a experiência visual e os textos jurídicos com especialista antes de produção.
- Próximo responsável: Victor valida a experiência do perfil; `@ecossystem2` estrutura a integração de identidade/documentos; `@ricardopablo1914-create` automatiza os fluxos de perfil e cadastro.

### 2026-07-30 — Atalho do perfil na barra lateral desktop
- Responsável: IA: Codex
- Objetivo: permitir que o usuário abra o painel de perfil ao clicar no bloco com avatar, nome e seta na barra lateral desktop.
- Alterações: adicionada delegação de clique para os blocos `profile-mini` que ainda eram elementos visuais, com cursor e estado de hover; o clique agora navega para `Meu perfil` sem interferir no botão de perfil já existente nas telas de conta.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente navegação local e apresentação do front-end; sem alteração em autenticação, APIs, dados ou contratos entre equipes. Não é necessária task de back-end nesta etapa.
- Validação: executar `npm run build`, `git diff --check` e testar o clique no avatar, nome e seta em desktop.
- O que falta: Victor validar a navegação nas telas desktop; `@ricardopablo1914-create` testar a regressão do atalho e do menu mobile; `@ecossystem2` acompanhar futuras integrações de perfil.
- Próximo responsável: Victor valida a experiência visual; `@ricardopablo1914-create` automatiza a regressão de navegação.

### 2026-07-30 — Alternância comprador/vendedor e simulação de frete na compra
- Responsável: IA: Codex, front-end e produto.
- Objetivo: permitir que a mesma conta alterne entre comprador e vendedor, reaproveite os dados cadastrais já informados e tenha fluxos essenciais de venda e compra também no mobile.
- Alterações: criado o modo persistente comprador/vendedor no `localStorage`, com botão de alternância disponível no desktop e no menu mobile. O cadastro vendedor passa a pré-preencher nome, e-mail e telefone do perfil comprador. Criado o painel vendedor com navegação própria para painel, produtos, anúncio de gado, promoções e perfil comercial; o cadastro completo de lote continua disponível com fotos, sanidade e documentos. No fluxo comprador, `Comprar / solicitar proposta`, `Solicitar compra` e a seleção de favoritos agora abrem uma simulação de frete com origem, destino, distância estimada, valor de referência e aviso de que a cotação final depende da transportadora.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: o protótipo mantém modo, perfil vendedor e nomes de anexos no `localStorage`; o cálculo de frete é demonstrativo. Criar task para `@ecossystem2` definir autenticação/autorização de papéis, contrato de perfil vendedor, upload seguro de documentos, catálogo/promoções e endpoint de simulação/cotação com origem, destino, quantidade, distância e preço. Criar task de apoio para `@ricardopablo1914-create` com testes de alternância, persistência, regressão mobile, validação de campos e cenários de compra com cotação.
- Validação: `npm run build` concluído; `git diff --check` concluído; página local respondeu em `http://127.0.0.1:5173/`; fluxo desktop testado até a estimativa e continuidade para Mensagens; viewport mobile testado com menu, ativação do perfil vendedor e retorno ao comprador.
- O que falta: backend deve substituir o `localStorage`, validar documentos e calcular o frete com dados reais de rotas/transportadoras; promoções ainda exibem uma confirmação de protótipo; Victor deve validar os textos comerciais e requisitos jurídicos; Pablo deve automatizar os testes de API e integração quando o contrato estiver definido.
- Próximo responsável: `@ecossystem2` (`back-end`) especifica os contratos e persistência; `@ricardopablo1914-create` (`automação`, `testes`) cria a matriz de regressão; Victor revisa a experiência comprador/vendedor em dispositivos reais.

### 2026-07-30 — Organização dos controles na seção Conta
- Responsável: IA: Codex, front-end e produto.
- Objetivo: aproximar a navegação do layout de referência, deixando `Perfil vendedor` e `Modo claro/escuro` logo abaixo de `Meu perfil` dentro do grupo `CONTA`, no desktop e no menu mobile.
- Alterações: reorganizada a barra lateral das telas de conta e criado um agrupamento equivalente para as telas gerais que usam a navegação legada. O botão de tema passou a permanecer na seção Conta e continua alternando a preferência visual; o acesso ao perfil vendedor continua abrindo o modo vendedor e o menu mobile mantém também a troca rápida de perfil e o logout abaixo dos controles da conta. O botão flutuante de perfil vendedor foi removido do fluxo visual.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente navegação e apresentação local do front-end; não houve alteração de APIs, autenticação, persistência remota ou contratos entre equipes. Não é necessária task de back-end para esta mudança visual.
- Validação: `npm run build` concluído; `git diff --check` concluído; desktop validado com `CONTA → Meu perfil → Perfil vendedor → Modo claro`; menu mobile validado com a mesma ordem e troca de perfil funcional.
- O que falta: Victor validar espaçamento e legibilidade em diferentes resoluções; `@ricardopablo1914-create` testar regressão dos cliques de perfil, tema, menu mobile e logout; `@ecossystem2` apenas acompanhar possíveis mudanças futuras no contrato de permissões de perfil.
- Próximo responsável: Victor faz a validação visual final; `@ricardopablo1914-create` automatiza a regressão de navegação e tema.

### 2026-07-30 — Alternância de tema pelo grupo Conta
- Responsável: IA: Codex, front-end e produto.
- Objetivo: deixar o controle de modo claro/escuro funcional no item reposicionado dentro de `CONTA` e remover o botão flutuante do canto inferior direito.
- Alterações: centralizada a alternância persistente de tema usada pelo botão `Modo claro`/`Modo escuro` da barra lateral desktop e pelo menu mobile; removido o controle flutuante `#theme-toggle` do HTML e seus estilos, evitando dois pontos de controle concorrentes.
- Arquivos: `index.html`, `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente navegação e preferência visual local do front-end; não houve alteração de APIs, autenticação, dados ou contratos entre equipes. Não é necessária task de back-end nesta etapa.
- Validação: executar `npm run build`, `git diff --check` e validar desktop/mobile, alternância persistente e ausência do botão flutuante.
- O que falta: Victor validar a posição final do controle em diferentes resoluções; `@ricardopablo1914-create` automatizar foco, toque, persistência e regressão do menu; `@ecossystem2` apenas acompanhar futuras integrações de preferências do usuário.
- Próximo responsável: Victor faz a validação visual; `@ricardopablo1914-create` cria a regressão de navegação e tema.

### 2026-07-30 — Segregação da central de vendas por modo
- Responsável: IA: Codex, front-end e produto.
- Objetivo: manter as ferramentas exclusivas de vendedor agrupadas na `CENTRAL DE VENDAS` e impedir que uma navegação interna retorne acidentalmente ao modo comprador.
- Alterações: a navegação vendedor agora mantém `Painel vendedor`, `Meus produtos`, `Anunciar gado` e `Promoções` no desktop e no menu mobile. O item duplicado `Meu perfil` foi retirado da conta vendedora para evitar uma troca implícita de papel; o retorno fica disponível apenas pelos controles explícitos `Voltar ao perfil comprador`. Corrigido também o listener global de navegação, que sobrescrevia `Meus produtos`, `Anunciar gado`, `Painel vendedor` e `Promoções` com a tela inicial.
- Arquivos: `src/main.js`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente estado e navegação local do front-end; não houve alteração de APIs, autenticação, persistência remota ou contratos entre equipes. Não é necessária task de back-end nesta etapa.
- Validação: `npm run build`, `git diff --check`; desktop validado nas quatro ferramentas da central, incluindo entrada e saída do cadastro; mobile validado com ativação do vendedor, `Meus produtos` e retorno explícito ao comprador.
- O que falta: Victor validar a nomenclatura final dos atalhos de retorno; `@ricardopablo1914-create` automatizar a matriz de navegação por modo e regressão responsiva; `@ecossystem2` acompanhar a futura autorização de papéis no back-end.
- Próximo responsável: Victor revisa a experiência de separação dos modos; `@ricardopablo1914-create` cria os testes de regressão de navegação.

### 2026-07-31 — Visualização do registro dos produtos no modo vendedor
- Responsável: IA: Codex, front-end e produto.
- Objetivo: habilitar o botão `Ver registro` nos produtos cadastrados do modo vendedor para que o responsável consiga consultar o cadastro e acompanhar a verificação do lote.
- Alterações: substituído o aviso temporário por um painel responsivo com protocolo, data, status, características comerciais, origem e propriedade, sanidade, GTA, certificado, fotos/documentos informados e linha do tempo da auditoria. O mesmo painel foi reutilizado em `Meus anúncios`. Novos cadastros passam a registrar os campos adicionais e os nomes dos anexos selecionados, sem armazenar o conteúdo dos arquivos.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente apresentação e auditoria local do front-end; os dados continuam demonstrativos no `localStorage`. Não houve chamada de API nesta etapa. Criar task para `@ecossystem2` definir o registro oficial do lote, permissões, versionamento e consulta segura de documentos; criar task para `@ricardopablo1914-create` cobrir abertura, fechamento, responsividade, modo escuro e compatibilidade com registros antigos.
- Validação: `npm run build` concluído; `git diff --check` concluído; revisar o fluxo vendedor → Produtos cadastrados → `Ver registro` em desktop e mobile.
- O que falta: substituir o histórico local pelo registro oficial do back-end, disponibilizar URLs seguras para documentos e aplicar a situação retornada pela análise documental; Victor deve validar os campos e textos jurídicos com a equipe responsável.
- Próximo responsável: `@ecossystem2` especifica a API e persistência do registro; `@ricardopablo1914-create` automatiza a regressão do painel; Victor valida a experiência e a documentação exibida ao vendedor.

### 2026-07-31 — Fotos no cadastro de gado do vendedor
- Responsável: IA: Codex, front-end e produto.
- Objetivo: permitir que o vendedor envie fotos do lote no cadastro para que o produto seja apresentado com evidência visual no catálogo e no registro do anúncio.
- Alterações: concluído o processamento do campo de fotos já existente no formulário, com seleção de até cinco imagens JPG/PNG de até 2 MB cada, validação de tipo e tamanho, pré-visualização imediata no formulário desktop e mobile e indicação de quantidade selecionada. As imagens aprovadas são registradas junto ao lote no histórico local e exibidas em uma galeria no painel `Ver registro`, mantendo também os nomes dos arquivos para conferência.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: o protótipo mantém imagens como data URLs no `localStorage` para demonstração local. Criar task para `@ecossystem2` definir armazenamento de objetos, URLs seguras, permissões, compressão, limite de tamanho e verificação de conteúdo no back-end; criar task para `@ricardopablo1914-create` cobrir upload, pré-visualização, rejeição de arquivos inválidos, persistência e regressão mobile.
- Validação: `npm run build` concluído; `git diff --check` concluído; o fluxo de entrada do cadastro vendedor foi centralizado para limpar imagens anteriores e a galeria do registro é montada apenas quando existem fotos válidas.
- O que falta: substituir o armazenamento local por upload seguro e persistente, integrar a análise documental e validar a experiência visual em dispositivos reais.
- Próximo responsável: Victor valida a experiência e os limites comerciais; `@ecossystem2` define o contrato de mídia do lote; `@ricardopablo1914-create` automatiza a matriz de testes de upload e consulta.

### 2026-07-31 — Catálogo vendedor com visualização e edição de produtos
- Responsável: IA: Codex, front-end e produto.
- Objetivo: permitir que o vendedor consulte o produto pelo catálogo e edite os dados dos lotes cadastrados na própria conta.
- Alterações: o painel `Catálogo / Produtos cadastrados` passou a exibir as ações `Ver produto` e `Editar` para cada lote. `Ver produto` abre o registro detalhado com características, origem, sanidade, documentos, fotos e linha do tempo. `Editar` reabre o cadastro completo com os dados preenchidos, preserva as fotos já anexadas, permite atualizar as informações e envia o lote novamente para verificação; documentos existentes são preservados quando nenhum novo arquivo é escolhido.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: a edição e o catálogo continuam usando o histórico local em `localStorage`, com atualização do protocolo existente e status `EM_VERIFICACAO`; não houve alteração de API. Criar task para `@ecossystem2` definir autorização do vendedor, endpoint de consulta/edição, versionamento, concorrência e persistência oficial; criar task para `@ricardopablo1914-create` cobrir ver produto, edição, preservação de anexos, reenvio para análise e regressão mobile/tema escuro. A criação automática da issue foi tentada, mas o conector GitHub respondeu `403 Resource not accessible by integration`; a tarefa precisa ser aberta manualmente quando a permissão for restabelecida.
- Validação: `npm run build` concluído; `git diff --check` concluído; página local respondeu HTTP 200; validação estrutural confirma as ações no catálogo, hidratação dos campos e atualização do registro.
- O que falta: substituir a persistência local por API, permitir substituição/remoção segura de documentos no servidor e validar a experiência visual em dispositivos reais.
- Próximo responsável: Victor valida o fluxo de catálogo e edição; `@ecossystem2` define o contrato de edição; `@ricardopablo1914-create` automatiza os cenários de consulta, alteração e regressão.

### 2026-07-31 — Sanidade animal concentrada no registro do produto
- Responsável: IA: Codex, front-end e produto.
- Objetivo: simplificar o perfil comercial vendedor, removendo a seção `Sanidade animal` da conta e mantendo a informação vinculada ao lote.
- Alterações: o card de vacinação e rastreabilidade é removido da árvore renderizada do `Perfil vendedor`. A seção permanece disponível no cadastro do lote e no painel `Ver produto/Ver registro`, junto aos demais dados sanitários e documentos do produto.
- Arquivos: `src/main.js`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente a apresentação do front-end; não houve mudança de API nem de persistência. A task de integração já registrada continua necessária para definir o contrato oficial de sanidade por produto.
- Validação: executar `npm run build`, `git diff --check` e revisar o perfil vendedor e o registro do produto em desktop/mobile.
- O que falta: validar com o back-end a associação definitiva de vacinação/rastreabilidade ao `productId` e confirmar o texto jurídico com a equipe responsável.
- Próximo responsável: Victor valida o fluxo visual; `@ecossystem2` define o contrato sanitário do produto; `@ricardopablo1914-create` automatiza a regressão do perfil e do registro.

### 2026-07-31 — Foto dos cards compradores abre o detalhe do lote
- Responsável: IA: Codex, front-end e produto.
- Objetivo: permitir que o comprador abra o produto ao clicar diretamente na foto do card, além do botão `Ver lote`.
- Alterações: a área de imagem dos cards passou a ser interativa, com suporte a clique, teclado `Enter`/`Espaço`, foco visível e reaproveitamento do mesmo modal detalhado do botão `Ver lote`. O botão de favoritos continua independente e não abre o detalhe por engano.
- Arquivos: `src/main.js`, `src/styles.css`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente interação local do catálogo comprador; não houve alteração de API, persistência ou comunicação entre camadas. Não é necessária task de back-end para esta mudança.
- Validação: executar `npm run build`, `git diff --check` e revisar o clique/foco da foto em desktop e mobile.
- O que falta: Victor validar a affordance visual em diferentes cards; `@ricardopablo1914-create` automatizar a regressão de foto, botão `Ver lote` e favorito.
- Próximo responsável: Victor valida a experiência do catálogo; `@ricardopablo1914-create` adiciona a cobertura de interação do card.

### 2026-07-31 — Atualização da foto do produto Nelore selecionado
- Responsável: IA: Codex, front-end e produto.
- Objetivo: substituir a imagem demonstrativa do produto `Nelore selecionado` pela foto fornecida para o projeto.
- Alterações: adicionada a imagem `public/nelore-selecionado.png` e atualizado o lote de id `1` para usar esse asset local nos cards, no detalhe do produto e nas interações que reutilizam o cadastro do lote.
- Arquivos: `public/nelore-selecionado.png`, `src/main.js`, `docs/DIARIO_DE_DESENVOLVIMENTO.md`.
- Contratos afetados: somente asset e apresentação do front-end; não houve mudança de API, persistência ou regras de negócio. Não é necessária task de back-end.
- Validação: executar `npm run build`, `git diff --check` e verificar a renderização do card e do detalhe em desktop/mobile.
- O que falta: Victor validar o enquadramento visual da foto em diferentes tamanhos de card; `@ricardopablo1914-create` pode adicionar uma verificação de regressão do asset local.
- Próximo responsável: Victor valida a apresentação comercial; Pablo acompanha a regressão visual quando a suíte estiver disponível.
