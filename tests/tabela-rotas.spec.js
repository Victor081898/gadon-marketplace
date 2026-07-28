import { describe, expect, it } from 'vitest';
import { all, bootApp, click, goTo, text } from './helpers.js';

const routesStorageKey = 'gadon.freight.routes.v1';

// Intl pt-BR usa espaço não-quebrável ( ) entre "R$" e o número.
const norm = (value = '') => value.replace(/ /g, ' ').trim();
const brl = (value) => norm(new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value));

async function openRoutesTable() {
  await bootApp();
  goTo('Fretes');
  click('[data-freight-action="all-routes"]');
}

describe('Fretes — tabela completa de rotas contratadas', () => {
  it('mantém o modal fechado por padrão ao abrir a página de Fretes', async () => {
    await bootApp();
    goTo('Fretes');
    expect(text('.crumb')).toContain('Fretes');
    expect(document.querySelector('.route-table-modal')).toBeNull();
    expect(document.querySelector('.route-table-backdrop')).toBeNull();
    // o gatilho existe no painel "Rotas recentes"
    const trigger = document.querySelector('[data-freight-action="all-routes"]');
    expect(trigger).not.toBeNull();
    expect(trigger.textContent).toContain('Ver tabela completa');
  });

  it('abre o modal como dialog acessível ao clicar em "Ver tabela completa"', async () => {
    await openRoutesTable();
    const modal = document.querySelector('.route-table-modal');
    expect(modal).not.toBeNull();
    expect(modal.getAttribute('role')).toBe('dialog');
    expect(modal.getAttribute('aria-modal')).toBe('true');
    expect(modal.getAttribute('aria-label')).toBe('Tabela completa de rotas contratadas');
    expect(text('.route-table-modal h2')).toContain('Rotas contratadas');
    expect(text('.route-table-note')).toContain('devem ser conferidos no contrato do frete');
  });

  it('mostra o resumo com total de rotas, distância e valor contratado formatados', async () => {
    await openRoutesTable();
    const indicators = all('.route-table-summary strong').map((el) => norm(el.textContent));
    expect(indicators).toHaveLength(3);
    expect(indicators[0]).toBe('4'); // 4 rotas default
    expect(indicators[1]).toBe('2.860 km'); // 1065 + 1020 + 215 + 560
    expect(indicators[2]).toBe(brl(19110)); // 6480 + 6120 + 2150 + 4360
    expect(indicators[2]).toMatch(/^R\$ 19\.110,00$/);
    const labels = text('.route-table-summary');
    expect(labels).toContain('Rotas contratadas');
    expect(labels).toContain('Distância total');
    expect(labels).toContain('Valor contratado');
  });

  it('renderiza a tabela com cabeçalho completo e uma linha por rota', async () => {
    await openRoutesTable();
    const headers = all('.full-route-table thead th').map((el) => el.textContent.trim());
    expect(headers).toEqual(['Origem', 'Destino', 'Distância', 'Preço contratado', 'Transportadora', 'Status']);
    expect(all('.full-route-table tbody tr')).toHaveLength(4);
    expect(document.querySelector('.route-table-empty')).toBeNull();
  });

  it('exibe origem, destino, distância, preço e transportadora corretos na primeira linha', async () => {
    await openRoutesTable();
    const cells = all('.full-route-table tbody tr:first-child td');
    expect(cells).toHaveLength(6);
    expect(cells[0].textContent).toContain('Campo Verde - MT');
    expect(cells[1].textContent).toContain('Goiânia - GO');
    expect(norm(cells[2].textContent)).toBe('1.065 km');
    expect(cells[3].classList.contains('route-price')).toBe(true);
    expect(norm(cells[3].textContent)).toBe(brl(6480)); // R$ 6.480,00
    expect(cells[4].textContent).toContain('Transportadora Boiadeiro');
    expect(cells[4].querySelector('small').textContent).toBe('Contratada em 28/07/2026');
  });

  it('aplica a classe de badge correspondente a cada status', async () => {
    await openRoutesTable();
    expect(all('.route-status-badge')).toHaveLength(4);
    const underway = all('.route-status-badge.underway');
    const contracted = all('.route-status-badge.contracted');
    const scheduled = all('.route-status-badge.scheduled');
    expect(underway).toHaveLength(1);
    expect(underway[0].textContent).toBe('Em andamento');
    expect(contracted).toHaveLength(1);
    expect(contracted[0].textContent).toBe('Contratada');
    expect(scheduled).toHaveLength(2);
    expect(scheduled.every((el) => el.textContent === 'Programada')).toBe(true);
  });

  it('fecha o modal pelo botão e mantém a página de Fretes renderizada', async () => {
    await openRoutesTable();
    click('[data-freight-action="close-routes"]');
    expect(document.querySelector('.route-table-modal')).toBeNull();
    expect(document.querySelector('.route-table-backdrop')).toBeNull();
    expect(text('.crumb')).toContain('Fretes');
    expect(document.querySelector('.freight-page')).not.toBeNull();
    // abrir/fechar é somente leitura: nada é persistido na chave de rotas
    expect(localStorage.getItem(routesStorageKey)).toBeNull();
    // o vínculo é refeito no re-render e o modal pode ser reaberto
    click('[data-freight-action="all-routes"]');
    expect(document.querySelector('.route-table-modal')).not.toBeNull();
  });

  it('carrega rota customizada do localStorage e calcula os totais dela', async () => {
    localStorage.setItem(routesStorageKey, JSON.stringify([
      { id: 99, origin: 'Sorriso - MT', destination: 'Sinop - MT', distanceKm: 1234, price: 987.5, carrier: 'Frete Custom', status: 'Contratada', contractedAt: '10/08/2026' },
    ]));
    await openRoutesTable();
    const rows = all('.full-route-table tbody tr');
    expect(rows).toHaveLength(1);
    expect(rows[0].textContent).toContain('Sorriso - MT');
    expect(rows[0].textContent).toContain('Sinop - MT');
    expect(rows[0].textContent).toContain('Frete Custom');
    expect(rows[0].querySelector('td:nth-child(5) small').textContent).toBe('Contratada em 10/08/2026');
    const indicators = all('.route-table-summary strong').map((el) => norm(el.textContent));
    expect(indicators[0]).toBe('1');
    expect(indicators[1]).toBe('1.234 km');
    expect(indicators[2]).toBe(brl(987.5)); // R$ 987,50
    expect(norm(rows[0].querySelector('.route-price').textContent)).toBe(brl(987.5));
    expect(all('.route-status-badge.contracted')).toHaveLength(1);
  });

  it('volta para as 4 rotas default quando o localStorage tem um array vazio', async () => {
    // BUG? loadFreightRoutes exige Array.isArray && length, então uma lista vazia
    // persistida cai no default — a linha "Nenhuma rota contratada registrada."
    // (.route-table-empty) nunca é alcançável via localStorage, só se o estado
    // fosse esvaziado em runtime (não há ação de remover rota no app).
    localStorage.setItem(routesStorageKey, JSON.stringify([]));
    await openRoutesTable();
    expect(all('.full-route-table tbody tr')).toHaveLength(4);
    expect(document.querySelector('.route-table-empty')).toBeNull();
    expect(norm(all('.route-table-summary strong')[0].textContent)).toBe('4');
  });

  it('usa os fallbacks para rota sem transportadora, data, distância e status', async () => {
    localStorage.setItem(routesStorageKey, JSON.stringify([
      { id: 1, origin: 'Origem - MT', destination: 'Destino - GO', price: 100 },
    ]));
    await openRoutesTable();
    const row = document.querySelector('.full-route-table tbody tr');
    expect(row.textContent).toContain('Transportadora a selecionar');
    expect(row.textContent).toContain('Contratada em data não informada');
    expect(norm(row.querySelector('td:nth-child(3)').textContent)).toBe('0 km');
    expect(norm(row.querySelector('.route-price').textContent)).toBe(brl(100));
    // BUG? rota sem status ganha o rótulo fallback "Contratada", mas a classe
    // calculada é 'scheduled' (o ternário compara route.status undefined antes
    // do fallback do texto) — badge com texto de um status e cor de outro.
    const badge = row.querySelector('.route-status-badge');
    expect(badge.textContent).toBe('Contratada');
    expect(badge.classList.contains('scheduled')).toBe(true);
    expect(badge.classList.contains('contracted')).toBe(false);
  });

  it('abrir a tabela de rotas fecha o calendário se ele estiver aberto', async () => {
    await bootApp();
    goTo('Fretes');
    click('[data-freight-action="calendar"]');
    expect(document.querySelector('.calendar-dialog')).not.toBeNull();
    click('[data-freight-action="all-routes"]');
    expect(document.querySelector('.calendar-dialog')).toBeNull();
    expect(document.querySelector('.route-table-modal')).not.toBeNull();
  });

  it('abrir a tabela de rotas fecha o modal de adicionar documento se aberto', async () => {
    await bootApp();
    goTo('Fretes');
    click('[data-freight-action="documents"]');
    expect(document.querySelector('.document-modal')).not.toBeNull();
    click('[data-freight-action="all-routes"]');
    expect(document.querySelector('.document-modal')).toBeNull();
    expect(document.querySelector('.route-table-modal')).not.toBeNull();
  });
});
