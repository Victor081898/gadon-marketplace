# Agente construtor do GadOn

O repositório [`Ecossystem2/agent-mod`](https://github.com/Ecossystem2/agent-mod) é o agente externo de apoio à construção do sistema. Ele fornece agentes especializados e processos para orientar tarefas de arquitetura, back-end, front-end, automações, testes, revisão e documentação.

## Como os dois repositórios se relacionam

- **GadOn:** código do produto, regras locais, diário, issues e decisões específicas do marketplace.
- **agent-mod:** agentes e processos reutilizáveis para executar ou revisar demandas técnicas.
- **Skill local do GadOn:** `.agents/skills/gadon-colaboracao/SKILL.md`; funciona como a camada de coordenação e é aplicada somente neste projeto.

## Ordem de uso

1. Carregar as regras do GadOn em `AGENTS.md` e a skill local.
2. Conferir o alinhamento da cópia local com `origin/main`.
3. Ler o diário e identificar a issue da demanda.
4. Selecionar no `agent-mod` o agente especializado adequado, quando o ambiente de execução estiver disponível:
   - front-end: `frontend-conductor` ou `frontend-engineer`;
   - back-end: `backend-conductor`, `api-engineer` ou `domain-architect`;
   - automações/testes: `test-engineer`;
   - revisão e segurança: `security-auditor`, `code-reviewer` ou `clean-code-reviewer`;
   - documentação: `docs-keeper`.
5. Registrar no diário o agente utilizado, o resultado, os arquivos alterados e as pendências.

## Limites

O link do GitHub não instala nem executa agentes automaticamente em qualquer computador. Para usar os agentes do `agent-mod`, o colaborador precisa ter esse repositório disponível no ambiente compatível com os comandos e agentes dele. O GadOn não deve copiar ou instalar esses agentes globalmente sem aprovação.

Se o `agent-mod` mudar seus agentes ou contratos, registre a versão/commit consultado no diário do GadOn.
