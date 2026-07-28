import { describe, expect, it } from 'vitest';
import { all, bootApp, click, goTo, text } from './helpers.js';

describe('Notificações — central em popover', () => {
  it('o sininho mostra o indicador de não lidas e abre o popover com as 4 notificações', async () => {
    await bootApp();
    expect(document.querySelector('.circle-action i')).not.toBeNull(); // bolinha de alerta
    click('[data-action="notifications"]');
    const popover = document.querySelector('.notification-popover');
    expect(popover).not.toBeNull();
    expect(popover.getAttribute('aria-label')).toBe('Notificações');
    expect(text('.notification-popover-head span')).toBe('2 não lidas');
    expect(all('.notification-item')).toHaveLength(4);
    expect(all('.notification-item.unread')).toHaveLength(2);
  });

  it('clicar de novo no sininho fecha o popover', async () => {
    await bootApp();
    click('[data-action="notifications"]');
    expect(document.querySelector('.notification-popover')).not.toBeNull();
    click('[data-action="notifications"]');
    expect(document.querySelector('.notification-popover')).toBeNull();
  });

  it('"Marcar como lidas" zera tudo, persiste e remove o indicador', async () => {
    await bootApp();
    click('[data-action="notifications"]');
    click('[data-notification-action="read-all"]');
    expect(text('.notification-popover-head span')).toBe('Tudo em dia');
    expect(document.querySelector('[data-notification-action="read-all"]')).toBeNull();
    expect(all('.notification-item.unread')).toHaveLength(0);
    expect(document.querySelector('.circle-action i')).toBeNull();
    const salvas = JSON.parse(localStorage.getItem('gadon.notifications.v1'));
    expect(salvas.every((n) => n.unread === false)).toBe(true);
  });

  it('notificação de mensagem leva pra página de Mensagens e é marcada como lida', async () => {
    await bootApp();
    click('[data-action="notifications"]');
    click('[data-notification-id="1"]'); // "Nova mensagem"
    expect(text('.crumb')).toContain('Mensagens');
    expect(document.querySelector('.notification-popover')).toBeNull();
    const salvas = JSON.parse(localStorage.getItem('gadon.notifications.v1'));
    expect(salvas.find((n) => n.id === 1).unread).toBe(false);
  });

  it('notificação de frete leva pra página de Fretes', async () => {
    await bootApp();
    click('[data-action="notifications"]');
    click('[data-notification-id="2"]'); // "Cotação recebida"
    expect(text('.crumb')).toContain('Fretes');
    const salvas = JSON.parse(localStorage.getItem('gadon.notifications.v1'));
    expect(salvas.find((n) => n.id === 2).unread).toBe(false);
  });

  it('o popover funciona também dentro da página de Fretes', async () => {
    await bootApp();
    goTo('Fretes');
    click('[data-action="notifications"]');
    expect(document.querySelector('.notification-popover')).not.toBeNull();
    expect(all('.notification-item')).toHaveLength(4);
  });

  it('sem notificações, mostra o estado vazio e nenhum indicador', async () => {
    localStorage.setItem('gadon.notifications.v1', JSON.stringify([]));
    await bootApp();
    expect(document.querySelector('.circle-action i')).toBeNull();
    click('[data-action="notifications"]');
    expect(text('.notification-empty')).toBe('Nenhuma notificação por aqui.');
  });

  it('notificações persistidas são respeitadas ao abrir o app', async () => {
    localStorage.setItem('gadon.notifications.v1', JSON.stringify([
      { id: 9, type: 'truck', title: 'Notificação custom', source: 'Teste', body: 'Corpo da notificação.', time: 'agora', unread: true },
    ]));
    await bootApp();
    click('[data-action="notifications"]');
    expect(all('.notification-item')).toHaveLength(1);
    expect(text('.notification-item strong')).toBe('Notificação custom');
    expect(text('.notification-popover-head span')).toBe('1 não lidas');
  });
});
