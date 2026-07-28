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
