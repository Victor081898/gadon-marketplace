# Processo de compartilhamento de trabalho e demandas

## Objetivo

Manter o front-end, back-end, automações, testes e documentação alinhados desde o planejamento até a entrega.

## Divisão de responsabilidades

| Área | Responsável | Entregas principais |
| --- | --- | --- |
| Front-end e produto | Victor | Telas, fluxos, estados da interface, regras de interação e necessidades de dados/API. |
| Back-end | Claiton | Arquitetura de serviços, APIs, contratos, persistência, autenticação e regras de negócio. |
| Automações e testes | Pablo, em conjunto com Claiton | Testes de API e integração, automações, validações de comunicação e cobertura dos fluxos críticos. |

## Ciclo de uma demanda

1. Victor descreve a necessidade do produto e implementa ou prototipa o comportamento do front-end.
2. Quando a função depender de dados ou serviço, é criada uma issue de integração com entradas, saídas e critérios de aceite.
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
