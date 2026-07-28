# Regras de trabalho do GadOn

Estas instruções valem para qualquer pessoa ou agente que altere este repositório.

## Skill local do projeto

Ao trabalhar neste repositório, carregue `.agents/skills/gadon-colaboracao/SKILL.md`. Essa skill é exclusiva do GadOn, acompanha o código pelo Git e não deve ser instalada globalmente nem aplicada a outros projetos.

## Agente construtor externo

O repositório `https://github.com/Ecossystem2/agent-mod.git` fornece agentes especializados para apoiar a construção do sistema. Consulte `docs/AGENTE_CONSTRUTOR_AGENT_MOD.md` para o mapa de responsabilidades e a ordem de uso. As regras do GadOn têm prioridade sobre as regras genéricas do agente externo.

## Responsabilidades

- **Victor — Front-end e produto:** desenha as telas, fluxos e regras de interação do front-end. Sempre que uma função depender de dados, API, autenticação ou persistência, deve abrir uma tarefa de integração.
- **Claiton — Back-end:** define a arquitetura de comunicação, contratos de API, serviços, persistência e regras necessárias para o front-end operar de forma funcional.
- **Pablo — Automações e testes:** trabalha com Claiton na automação, testes de integração, testes de API, validações e recursos relacionados à comunicação entre front-end e back-end.

Se uma tarefa envolver mais de uma camada, ela deve indicar claramente o responsável principal e os responsáveis de apoio.

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
4. Crie ou atualize uma issue/task no GitHub antes de iniciar uma demanda que atravesse camadas.

## Encaminhamento de tarefas

Toda função do front-end que exigir back-end deve conter na issue:

- objetivo e comportamento esperado;
- telas, eventos e dados de entrada/saída;
- contrato de API esperado ou dúvidas para Claiton;
- critérios de aceite;
- necessidade de automação/teste para Pablo;
- dependências, riscos e definição de pronto.

Use os marcadores `front-end`, `back-end`, `automação` e `testes` para tornar o encaminhamento visível. Não atribua uma tarefa a uma pessoa sem confirmar o nome de usuário GitHub correto.

## Durante o desenvolvimento

- Trabalhe em uma branch descritiva, como `feature/...`, `fix/...`, `backend/...` ou `test/...`.
- Mantenha as alterações pequenas e relacionadas à issue.
- Atualize a issue quando houver bloqueio, mudança de contrato ou dependência de outra camada.
- Não faça commit de credenciais, dados reais, `node_modules`, `dist` ou arquivos temporários.

## Antes de finalizar

1. Execute os testes e/ou `npm run build` aplicáveis.
2. Atualize o diário com objetivo, alteração, arquivos, validação, pendências e responsáveis pelas próximas tarefas.
3. Atualize a documentação técnica ou o contrato de API quando houver mudança de comunicação.
4. Verifique `git diff`, `git status` e se a branch contém apenas o escopo da issue.
5. Abra ou atualize o pull request referenciando a issue e preenchendo o checklist.
6. Só considere a demanda concluída quando código, testes, documentação e encaminhamentos estiverem sincronizados no GitHub.

## Regra do diário

Cada mudança humana ou feita pela IA deve atualizar `docs/DIARIO_DE_DESENVOLVIMENTO.md` no mesmo commit. O registro deve informar o que foi feito, o que falta, quem é o próximo responsável e quais tarefas precisam ser criadas.
