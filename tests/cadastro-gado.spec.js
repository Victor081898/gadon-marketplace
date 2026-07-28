import { describe, expect, it, vi } from 'vitest';
import { all, bootApp, click, text } from './helpers.js';

function preencherFormulario(campos = {}) {
  const form = document.querySelector('#cattle-form');
  const valores = {
    lotName: 'Nelore teste automação',
    species: 'Bovino',
    purpose: 'Engorda',
    breed: 'Nelore',
    quantity: '55',
    sex: 'Machos',
    price: '31.000,00',
    farm: 'Fazenda Automação',
    city: 'Sinop',
    state: 'MT',
    healthStatus: 'Vacinações em dia',
    ...campos,
  };
  for (const [nome, valor] of Object.entries(valores)) form.elements[nome].value = valor;
  return valores;
}

describe('Cadastro de gado — habilitar lote e auditoria', () => {
  it('"Habilitar lote" abre a página de cadastro com as 6 seções do formulário', async () => {
    await bootApp();
    click('[data-action="register"]');
    expect(document.querySelector('.register-shell')).not.toBeNull();
    expect(all('.form-section')).toHaveLength(6);
    expect(text('.register-intro h1')).toBe('Cadastre os dados do seu gado.');
  });

  it('sem envios anteriores, o painel de auditoria mostra o estado vazio', async () => {
    await bootApp();
    click('[data-action="register"]');
    expect(text('.audit-empty h3')).toBe('Seu primeiro envio aparecerá aqui');
    expect(document.querySelector('.audit-card')).toBeNull();
  });

  it('"Voltar para o marketplace" retorna pra home', async () => {
    await bootApp();
    click('[data-action="register"]');
    click('.back-link');
    expect(text('.section-block h2')).toContain('Lotes em destaque');
  });

  it('enviar o cadastro gera protocolo, log de auditoria com etapas e persiste', async () => {
    vi.useFakeTimers();
    await bootApp();
    click('[data-action="register"]');
    preencherFormulario();
    document.querySelector('#cattle-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    expect(text('.toast')).toContain('Lote habilitado e enviado para análise.');
    // cartão de auditoria com protocolo e dados do lote
    expect(text('.audit-protocol strong')).toMatch(/^GDN-\d{4}-\d{6}$/);
    expect(text('.audit-lot strong')).toBe('Nelore teste automação');
    expect(text('.audit-lot span')).toContain('55 cabeças');
    expect(text('.audit-lot span')).toContain('Nelore');
    expect(text('.audit-lot span')).toContain('Sinop - MT');
    expect(text('.audit-card .status-pill')).toBe('Em verificação');
    // etapas: 2 concluídas, 1 atual, 1 pendente
    expect(all('.audit-step.completed')).toHaveLength(2);
    expect(all('.audit-step.current')).toHaveLength(1);
    expect(all('.audit-step.pending')).toHaveLength(1);
    expect(all('.audit-step').map((el) => el.textContent.trim().replace(/^[✓\d]\s*/, '').split(/\d{2}\/\d{2}/)[0])).toEqual(
      expect.arrayContaining([expect.stringContaining('Cadastro preenchido')]),
    );
    // persistência
    const registros = JSON.parse(localStorage.getItem('gadon.audit-log.v1'));
    expect(registros).toHaveLength(1);
    expect(registros[0].event).toBe('LOTE_HABILITADO');
    expect(registros[0].status).toBe('EM_VERIFICACAO');
    expect(registros[0].lot.origin).toBe('Sinop - MT');
    vi.runAllTimers();
  });

  it('novos envios entram no topo do log de auditoria', async () => {
    vi.useFakeTimers();
    await bootApp();
    click('[data-action="register"]');
    preencherFormulario({ lotName: 'Primeiro lote' });
    document.querySelector('#cattle-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    vi.runAllTimers();
    preencherFormulario({ lotName: 'Segundo lote' });
    document.querySelector('#cattle-form').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
    const registros = JSON.parse(localStorage.getItem('gadon.audit-log.v1'));
    expect(registros).toHaveLength(2);
    expect(registros[0].lot.name).toBe('Segundo lote');
    expect(registros[1].lot.name).toBe('Primeiro lote');
    // o cartão lateral mostra o envio mais recente
    expect(text('.audit-lot strong')).toBe('Segundo lote');
    vi.runAllTimers();
  });

  it('log de auditoria persistido é recarregado ao reabrir o app', async () => {
    localStorage.setItem('gadon.audit-log.v1', JSON.stringify([
      {
        id: 'GDN-2026-999999', event: 'LOTE_HABILITADO', status: 'EM_VERIFICACAO', createdAt: '2026-07-28T10:00:00.000Z', actor: 'João Pecuarista',
        lot: { name: 'Lote persistido', species: 'Bovino', purpose: 'Recria', breed: 'Angus', quantity: '20', origin: 'Dourados - MS', price: '15.000' },
        steps: [
          { label: 'Cadastro preenchido', status: 'completed', at: '2026-07-28T10:00:00.000Z' },
          { label: 'Enviado para verificação', status: 'completed', at: '2026-07-28T10:00:00.000Z' },
          { label: 'Análise de documentos', status: 'current', at: null },
          { label: 'Publicação no marketplace', status: 'pending', at: null },
        ],
      },
    ]));
    await bootApp();
    click('[data-action="register"]');
    expect(text('.audit-protocol strong')).toBe('GDN-2026-999999');
    expect(text('.audit-lot strong')).toBe('Lote persistido');
  });
});
