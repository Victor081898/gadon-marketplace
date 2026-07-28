import { describe, expect, it } from 'vitest';
import { all, bootApp, cardTitles, click, clickByText, goTo, setInput, text } from './helpers.js';

describe('Marketplace — página inicial', () => {
  it('renderiza a home com sidebar, destaque de lotes e stats', async () => {
    await bootApp();
    expect(text('.brand')).toContain('GAD');
    expect(all('[data-nav]').length).toBeGreaterThanOrEqual(6);
    expect(all('.lot-card').length).toBe(4); // home mostra os 4 primeiros
    expect(text('.section-block h2')).toContain('Lotes em destaque');
  });

  it('filtra os destaques pela busca rápida sem recarregar a página', async () => {
    await bootApp();
    setInput('#search', 'Angus');
    expect(cardTitles()).toEqual(['Angus premium']);
    expect(document.querySelector('.empty-state')).toBeNull();
  });

  it('mostra estado vazio quando a busca não encontra lote', async () => {
    await bootApp();
    setInput('#search', 'zebu inexistente');
    expect(text('.empty-state')).toContain('Nenhum lote encontrado');
  });

  it('filtra por categoria pelas abas', async () => {
    await bootApp();
    clickByText('[data-category]', 'Nelore');
    // categoria Nelore não inclui 'Bezerros Nelore' (categoria Bezerros)
    expect(cardTitles()).toEqual(['Nelore selecionado', 'Nelore matriz']);
  });

  it('ordena por menor preço', async () => {
    await bootApp();
    const sort = document.querySelector('#lot-sort');
    sort.value = 'price-low';
    sort.dispatchEvent(new Event('change', { bubbles: true }));
    // 6.900 < 11.000 < 19.800 < 23.500 (home mostra 4 cards)
    expect(cardTitles()).toEqual(['Lote de reposição', 'Bezerros Nelore', 'Cruza industrial', 'Angus premium']);
  });

  it('favorita um lote, mostra contador e persiste no localStorage', async () => {
    await bootApp();
    click('[data-favorite="2"]');
    expect(JSON.parse(localStorage.getItem('gadon.favorites.v1'))).toEqual([2]);
    const favButton = clickByText('[data-account-view="favorites"]', 'Favoritos');
    expect(favButton.textContent).toContain('1');
    expect(text('.section-block h2')).toContain('Meus favoritos');
    expect(cardTitles()).toEqual(['Angus premium']);
  });

  it('registra histórico de visualização ao abrir um lote', async () => {
    await bootApp();
    click('[data-lot="3"]');
    const modal = document.querySelector('[role="dialog"]');
    expect(modal).not.toBeNull();
    expect(modal.textContent).toContain('Nelore matriz');
    expect(JSON.parse(localStorage.getItem('gadon.lot-history.v1'))).toEqual([3]);
  });

  it('a view Histórico lista os lotes visualizados', async () => {
    await bootApp();
    click('[data-lot="3"]');
    click('.modal-close');
    clickByText('[data-account-view="history"]', 'Histórico');
    expect(text('.section-block h2')).toContain('Histórico de visualizações');
    expect(cardTitles()).toEqual(['Nelore matriz']);
  });

  it('desfavoritar remove o lote da view de favoritos e do localStorage', async () => {
    await bootApp();
    click('[data-favorite="2"]');
    click('[data-favorite="2"]');
    expect(JSON.parse(localStorage.getItem('gadon.favorites.v1'))).toEqual([]);
    clickByText('[data-account-view="favorites"]', 'Favoritos');
    expect(text('.empty-state')).toContain('Nenhum lote encontrado');
  });

  it('seleciona lotes e mostra a barra de solicitação de compra', async () => {
    await bootApp();
    click('[data-select-lot="1"]');
    click('[data-select-lot="4"]');
    expect(text('.selection-bar')).toContain('2 lotes selecionados');
    click('[data-action="clear-selection"]');
    expect(document.querySelector('.selection-bar')).toBeNull();
  });

  it('solicitar compra abre conversa com o vendedor na página de mensagens', async () => {
    await bootApp();
    click('[data-select-lot="1"]');
    click('[data-action="buy-selected"]');
    expect(text('.crumb')).toContain('Mensagens');
    expect(text('.chat-panel')).toContain('Fazenda Santa Rita');
  });

  it('navega para Fretes e volta para Início', async () => {
    await bootApp();
    goTo('Fretes');
    expect(text('.crumb')).toContain('Fretes');
    goTo('Início');
    expect(text('.section-block h2')).toContain('Lotes em destaque');
  });
});
