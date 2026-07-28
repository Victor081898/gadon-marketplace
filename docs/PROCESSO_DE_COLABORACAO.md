# Processo de compartilhamento de trabalho e demandas

> Skill local: `.agents/skills/gadon-colaboracao/SKILL.md`. Ela acompanha este repositório e só deve ser aplicada ao GadOn.

O apoio técnico especializado vem do agente construtor externo `Ecossystem2/agent-mod`, conforme o mapa em `docs/AGENTE_CONSTRUTOR_AGENT_MOD.md`.

## Objetivo

Manter o front-end, back-end, automações, testes e documentação alinhados desde o planejamento até a entrega.

## Divisão de responsabilidades

| Área | Responsável | GitHub | Entregas principais |
| --- | --- | --- | --- |
| Front-end e produto | Victor | A confirmar | Telas, fluxos, estados da interface, regras de interação e necessidades de dados/API. |
| Back-end | Claiton | `@ecossystem2` | Arquitetura de serviços, APIs, contratos, persistência, autenticação e regras de negócio. |
| Automações e testes | Pablo, em conjunto com Claiton | `@ricardopablo1914` e `@ecossystem2` | Testes de API e integração, automações, validações de comunicação e cobertura dos fluxos críticos. |

## Ciclo de uma demanda

1. Victor descreve a necessidade do produto e implementa ou prototipa o comportamento do front-end.
2. Quando a função depender de dados ou serviço, é criada uma issue de integração com entradas, saídas e critérios de aceite; atribua back-end a `@ecossystem2` e automações/testes a `@ricardopablo1914`, com `@ecossystem2` como apoio quando houver integração entre camadas.
3. Claiton define o contrato e a arquitetura do back-end, registrando decisões e dependências na issue.
4. Pablo e Claiton estruturam os testes e automações da comunicação entre as camadas.
5. Cada responsável trabalha em sua branch e mantém a issue atualizada com bloqueios e mudanças de contrato.
6. O pull request referencia a issue e só é finalizado após validação de código, testes, documentação e diário.

## Conferência obrigatória ao iniciar o projeto

Sempre que o trabalho for iniciado:

```bash
git fetch origin
git status -sb
git log --oneline --decorate -5
git diff main...origin/main
```

Se houver diferença entre o local e o GitHub, a equipe deve revisar a divergência e alinhar a branch antes de criar novas alterações.

## Registro e encerramento

O diário em `docs/DIARIO_DE_DESENVOLVIMENTO.md` deve ser atualizado em toda tarefa, incluindo:

- o que foi feito;
- arquivos e APIs afetados;
- validações executadas;
- o que ainda falta;
- próximo responsável;
- novas tasks/issues necessárias.

Uma tarefa só está concluída quando o GitHub contém o código, o diário e a documentação atualizados, e as tarefas dependentes foram criadas ou vinculadas.

## Regra permanente de publicação

Toda alteração humana ou feita pela IA, incluindo documentação e ajustes de processo, deve:

1. atualizar `docs/DIARIO_DE_DESENVOLVIMENTO.md` no mesmo commit;
2. passar pelas validações aplicáveis;
3. ser commitada e publicada no GitHub na branch de trabalho;
4. atualizar o pull request relacionado, quando existir.

Alterações não publicadas não devem ser consideradas concluídas.
